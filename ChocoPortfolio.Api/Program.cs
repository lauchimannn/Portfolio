using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
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

app.Run();