
import { useEffect, useState } from "react";

interface Game {
  appid: number;
  name: string;
  hours: number;
  lastPlayed: number;
  image: string;
}

interface SteamResponse {
  totalGames: number;
  games: Game[];
}

interface AchievementSummary {
  totalAchievements: number;
  unlockedAchievements: number;
  gamesChecked: number;
}

function Gaming() {
  const [games, setGames] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState(0);
  const [totalAchievements, setTotalAchievements] =
    useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load Steam games.
    fetch("/api/steam/games")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Steam games");
        }

        return response.json() as Promise<SteamResponse>;
      })
      .then((data) => {
        const recentlyPlayed = data.games
          .filter((game) => game.lastPlayed > 0)
          .sort((a, b) => b.lastPlayed - a.lastPlayed)
          .slice(0, 6);

        setGames(recentlyPlayed);
        setTotalGames(data.totalGames);
      })
      .catch((err) => {
        console.error("Steam games error:", err);
        setError("Unable to load Steam games.");
      })
      .finally(() => {
        setLoading(false);
      });

    // Load cached achievement summary.
    fetch("api/steam/achievement-summary")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load achievement summary");
        }

        return response.json() as Promise<AchievementSummary>;
      })
      .then((data) => {
        setTotalAchievements(data.totalAchievements);
      })
      .catch((err) => {
        console.error("Achievement summary error:", err);
      });
  }, []);

  const totalHours = games.reduce(
    (total, game) => total + game.hours,
    0
  );

  return (
    <section id="gaming" className="section gaming-section">
      <div className="section-kicker">02 / GAMING</div>

      <h2>My Steam Life</h2>

      <div className="gaming-stats">
        <div>
          <strong>{totalGames.toLocaleString()}</strong>
          <span>Games</span>
        </div>

        <div>
          <strong>{Math.round(totalHours).toLocaleString()}</strong>
          <span>Hours Played</span>
        </div>

        <div>
          <strong>
            {totalAchievements === null
              ? "..."
              : totalAchievements.toLocaleString()}
          </strong>
          <span>Achievements</span>
        </div>
      </div>

      <h3 className="sub-title">Recently Played</h3>

      {loading && <p>Loading Steam games...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && games.length === 0 && (
        <p>No games found.</p>
      )}

      {!loading && !error && games.length > 0 && (
        <div className="game-grid">
          {games.map((game) => (
            <article className="game-card" key={game.appid}>
              <div className="game-image-container">
                {game.image && (
                  <img
                    className="game-image"
                    src={game.image}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.add(
                        "game-image-placeholder-visible"
                      );
                    }}
                  />
                )}

                <div
                  className={`game-image-placeholder ${
                    game.image
                      ? ""
                      : "game-image-placeholder-visible"
                  }`}
                  aria-hidden="true"
                />
              </div>

              <div className="game-info">
                <h3>{game.name}</h3>
                <span>{game.hours} hrs</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Gaming;
