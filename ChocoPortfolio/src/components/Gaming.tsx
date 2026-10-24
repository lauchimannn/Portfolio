import { useEffect, useState } from "react";
import GameCard from "./GameCard";

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

function Gaming() {
  const [games, setGames] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5256/api/steam/games")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Steam games");
        }

        return response.json();
      })
      .then((data: SteamResponse) => {
        const recentlyPlayed = data.games
          .filter((game) => game.lastPlayed > 0)
          .sort((a, b) => b.lastPlayed - a.lastPlayed)
          .slice(0, 6);

        setGames(recentlyPlayed);
        setTotalGames(data.totalGames);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load Steam games.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalHours = games.reduce(
    (total, game) => total + game.hours,
    0
  );

  return (
    <section id="gaming" className="section gaming-section">
      <p className="section-label">01 — GAMING</p>

      <h2>My Steam Life</h2>

      <div className="gaming-stats">
        <div>
          <strong>{totalGames}</strong>
          <span>Games</span>
        </div>

        <div>
          <strong>{Math.round(totalHours).toLocaleString()}</strong>
          <span>Hours Played</span>
        </div>

        <div>
          <strong>—</strong>
          <span>Achievements</span>
        </div>
      </div>

      <h3 className="sub-title">Recently Played</h3>

      {loading && (
        <p>Loading Steam games...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading && !error && games.length === 0 && (
        <p>No games found.</p>
      )}

      {!loading && !error && games.length > 0 && (
        <div className="game-grid">
          {games.map((game) => (
            <GameCard
              key={game.appid}
              name={game.name}
              hours={game.hours}
              genre="Steam Game"
              image={game.image}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Gaming;