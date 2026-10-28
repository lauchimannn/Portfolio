using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMemoryCache();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://158.180.76.114"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors("Frontend");

const string steamId = "76561198115663410";

app.MapGet("/api/steam/games", async (IConfiguration config) =>
{
    var apiKey = config["Steam:ApiKey"];

    if (string.IsNullOrEmpty(apiKey))
    {
        return Results.Problem("Steam API key is not configured.");
    }

    var url =
        "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/" +
        $"?key={apiKey}" +
        $"&steamid={steamId}" +
        "&include_appinfo=true" +
        "&include_played_free_games=true" +
        "&format=json";

    using var httpClient = new HttpClient();

    var response = await httpClient.GetAsync(url);

    if (!response.IsSuccessStatusCode)
    {
        return Results.Problem(
            $"Steam API returned {(int)response.StatusCode}"
        );
    }

    var json = await response.Content.ReadAsStringAsync();

    using var document = JsonDocument.Parse(json);

    var games = document
        .RootElement
        .GetProperty("response")
        .GetProperty("games")
        .EnumerateArray()
        .Select(game => new
        {
            appid = game.GetProperty("appid").GetInt32(),

            name = game.GetProperty("name").GetString(),

            hours = Math.Round(
                game.GetProperty("playtime_forever").GetInt32() / 60.0,
                1
            ),

            lastPlayed = game.GetProperty("rtime_last_played").GetInt64(),

            image =
                $"https://cdn.cloudflare.steamstatic.com/steam/apps/" +
                $"{game.GetProperty("appid").GetInt32()}/header.jpg"
        })
        .OrderByDescending(game => game.lastPlayed)
        .ToList();

    return Results.Ok(new
    {
        totalGames = games.Count,
        games
    });
});

app.MapGet("/api/steam/achievements", async (int appid, IConfiguration config) =>
{
    var apiKey = config["Steam:ApiKey"];

    if (string.IsNullOrWhiteSpace(apiKey))
    {
        return Results.Problem("Steam API key is not configured.");
    }

    if (appid <= 0)
    {
        return Results.BadRequest("A valid appid is required.");
    }

    using var httpClient = new HttpClient();

    // Get the player's achievement progress
    var playerUrl =
        "https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/" +
        $"?key={Uri.EscapeDataString(apiKey)}" +
        $"&steamid={steamId}" +
        $"&appid={appid}" +
        "&l=en";

    var playerResponse = await httpClient.GetAsync(playerUrl);

    if (!playerResponse.IsSuccessStatusCode)
    {
        return Results.Problem(
            $"Steam player achievements API returned " +
            $"{(int)playerResponse.StatusCode}."
        );
    }

    using var playerDocument = JsonDocument.Parse(
        await playerResponse.Content.ReadAsStringAsync()
    );

    var playerRoot = playerDocument.RootElement;

    if (!playerRoot.TryGetProperty("playerstats", out var playerStats))
    {
        return Results.Problem("Steam returned no player statistics.");
    }

    if (playerStats.TryGetProperty("error", out var error))
    {
        return Results.Problem(
            error.GetString() ?? "Unable to load player achievements."
        );
    }

    if (!playerStats.TryGetProperty("achievements", out var playerAchievements))
    {
        return Results.Ok(new
        {
            appid,
            total = 0,
            unlocked = 0,
            achievements = Array.Empty<object>()
        });
    }

    // Get the game's achievement names, descriptions and icons
    var schemaUrl =
        "https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/" +
        $"?key={Uri.EscapeDataString(apiKey)}" +
        $"&appid={appid}" +
        "&l=en";

    var schemaResponse = await httpClient.GetAsync(schemaUrl);

    var schemaLookup = new Dictionary<string, JsonElement>(
        StringComparer.OrdinalIgnoreCase
    );

    if (schemaResponse.IsSuccessStatusCode)
    {
        using var schemaDocument = JsonDocument.Parse(
            await schemaResponse.Content.ReadAsStringAsync()
        );

        var schemaRoot = schemaDocument.RootElement;

        if (schemaRoot.TryGetProperty("game", out var game) &&
            game.TryGetProperty("availableGameStats", out var stats) &&
            stats.TryGetProperty("achievements", out var schemaAchievements))
        {
            foreach (var achievement in schemaAchievements.EnumerateArray())
            {
                if (achievement.TryGetProperty("name", out var apiName))
                {
                    var key = apiName.GetString();

                    if (!string.IsNullOrWhiteSpace(key))
                    {
                        schemaLookup[key] = achievement.Clone();
                    }
                }
            }
        }
    }

    // Merge player progress with the game's achievement schema
    var items = playerAchievements.EnumerateArray()
        .Select(a =>
        {
            var apiName = a.TryGetProperty("apiname", out var apiNameElement)
                ? apiNameElement.GetString()
                : null;

            // Some responses may use "name" instead of "apiname".
            if (string.IsNullOrWhiteSpace(apiName) &&
                a.TryGetProperty("name", out var nameElement))
            {
                apiName = nameElement.GetString();
            }

            schemaLookup.TryGetValue(apiName ?? "", out var schema);

            string? GetSchemaString(string property)
            {
                return schema.ValueKind == JsonValueKind.Object &&
                       schema.TryGetProperty(property, out var value)
                    ? value.GetString()
                    : null;
            }

            var achieved =
                a.TryGetProperty("achieved", out var achievedElement) &&
                achievedElement.ValueKind == JsonValueKind.Number &&
                achievedElement.GetInt32() == 1;

            var displayName = GetSchemaString("displayName");
            var description = GetSchemaString("description");
            var icon = GetSchemaString("icon");
            var iconGray = GetSchemaString("icongray");

            var unlockTime =
                a.TryGetProperty("unlocktime", out var unlockElement) &&
                unlockElement.ValueKind == JsonValueKind.Number
                    ? unlockElement.GetInt64()
                    : 0L;

            if (description?.Trim() == "No description available.")
            {
                description = "";
            }

            return new
            {
                name = string.IsNullOrWhiteSpace(displayName)
                    ? (string.IsNullOrWhiteSpace(apiName)
                        ? "Unknown Achievement"
                        : apiName)
                    : displayName,

                description = description ?? "",

                achieved,

                icon = achieved
                    ? (icon ?? iconGray)
                    : (iconGray ?? icon),

                iconGray,

                unlockTime
            };
        })
        .ToList();

    return Results.Ok(new
    {
        appid,
        total = items.Count,
        unlocked = items.Count(a => a.achieved),
        achievements = items
    });
});

app.MapGet("/api/steam/achievement-summary", async (
    IConfiguration config,
    IMemoryCache cache) =>
{
    const string cacheKey = "steam-achievement-summary";

    if (cache.TryGetValue<object>(cacheKey, out var cached))
    {
        return Results.Ok(cached);
    }

    var apiKey = config["Steam:ApiKey"];

    if (string.IsNullOrWhiteSpace(apiKey))
    {
        return Results.Problem("Steam API key is not configured.");
    }

    using var httpClient = new HttpClient();

    // Get all owned games.
    var gamesUrl =
        "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/" +
        $"?key={Uri.EscapeDataString(apiKey)}" +
        $"&steamid={steamId}" +
        "&include_appinfo=true" +
        "&include_played_free_games=true";

    var gamesResponse = await httpClient.GetAsync(gamesUrl);

    if (!gamesResponse.IsSuccessStatusCode)
    {
        return Results.Problem("Unable to load owned Steam games.");
    }

    using var gamesDocument = JsonDocument.Parse(
        await gamesResponse.Content.ReadAsStringAsync()
    );

    var root = gamesDocument.RootElement;

    if (!root.TryGetProperty("response", out var gameResponse) ||
        !gameResponse.TryGetProperty("games", out var games))
    {
        return Results.Problem("Steam returned no owned games list.");
    }

    var appIds = games.EnumerateArray()
        .Select(g => g.GetProperty("appid").GetInt32())
        .Distinct()
        .ToList();

    var totalAchievements = 0;
    var unlockedAchievements = 0;
    var gamesChecked = 0;

    // Limit concurrent Steam requests to 3.
    using var semaphore = new SemaphoreSlim(3);

    var tasks = appIds.Select(async appid =>
    {
        await semaphore.WaitAsync();

        try
        {
            var url =
                "https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/" +
                $"?key={Uri.EscapeDataString(apiKey)}" +
                $"&steamid={steamId}" +
                $"&appid={appid}";

            using var response = await httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return (Total: 0, Unlocked: 0, Checked: false);

            using var document = JsonDocument.Parse(
                await response.Content.ReadAsStringAsync()
            );

            var statsRoot = document.RootElement;

            if (!statsRoot.TryGetProperty("playerstats", out var stats) ||
                stats.TryGetProperty("error", out _) ||
                !stats.TryGetProperty("achievements", out var achievements))
            {
                return (Total: 0, Unlocked: 0, Checked: false);
            }

            var total = achievements.GetArrayLength();

            var unlocked = achievements.EnumerateArray()
                .Count(a =>
                    a.TryGetProperty("achieved", out var achieved) &&
                    achieved.ValueKind == JsonValueKind.Number &&
                    achieved.GetInt32() == 1);

            return (Total: total, Unlocked: unlocked, Checked: true);
        }
        catch
        {
            return (Total: 0, Unlocked: 0, Checked: false);
        }
        finally
        {
            semaphore.Release();
        }
    });

    var results = await Task.WhenAll(tasks);

    totalAchievements = results.Sum(r => r.Total);
    unlockedAchievements = results.Sum(r => r.Unlocked);
    gamesChecked = results.Count(r => r.Checked);

    var summary = new
    {
        totalGames = appIds.Count,
        gamesChecked,
        totalAchievements,
        unlockedAchievements
    };

    // Cache only complete results for 6 hours.
    if (gamesChecked == appIds.Count)
    {
        cache.Set(cacheKey, summary, TimeSpan.FromHours(6));
    }

    return Results.Ok(summary);
});

app.Run();