import { useEffect, useState } from "react";

interface SteamGame {
  appid: number;
  name: string;
  hours: number;
  image: string;
}

interface Achievement {
  name: string;
  description: string | null;
  achieved: boolean;
  unlockedAt: "0001-01-01 00:00:00";
  icon: string | null;
  iconGray: string | null;
  unlockTime: number;
}

interface AchievementResponse {
  appid: number;
  total: number;
  unlocked: number;
  achievements: Achievement[];
}

function Achievements() {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [data, setData] = useState<AchievementResponse | null>(null);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/steam/games")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Steam games.");
        return res.json();
      })
      .then((result) => {
        const list: SteamGame[] = result.games ?? [];
        setGames(list);

        if (list.length > 0) {
          setSelectedAppId(String(list[0].appid));
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoadingGames(false));
  }, []);

  useEffect(() => {
    if (!selectedAppId) return;

    const controller = new AbortController();

    async function loadAchievements() {
      setLoadingAchievements(true);
      setError("");
      setData(null);

      try {
        const res = await fetch(
          `/api/steam/achievements?appid=${selectedAppId}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(
            "Unable to load achievements. Check the game's Steam stats."
          );
        }

        const result: AchievementResponse = await res.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingAchievements(false);
        }
      }
    }

    loadAchievements();

    return () => controller.abort();
  }, [selectedAppId]);

  return (
    <section className="section achievements-section" id="achievements">
      <div className="section-kicker">03 / STEAM ACHIEVEMENTS</div>

      <h2>
        GAME <span>ACHIEVEMENTS</span>
      </h2>

      {loadingGames ? (
        <p>Loading games...</p>
      ) : games.length === 0 ? (
        <p>No Steam games found.</p>
      ) : (
        <>
          <div className="achievement-game-picker">
            <label htmlFor="achievement-game">SELECT GAME</label>

            <select
              id="achievement-game"
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
            >
              {games.map((game) => (
                <option key={game.appid} value={game.appid}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          {loadingAchievements && (
            <p className="achievement-message">
              Loading achievements...
            </p>
          )}

          {error && (
            <p className="achievement-error">{error}</p>
          )}

          {data && !loadingAchievements && (
            <>
              <div className="achievement-summary">
                <strong>{data.unlocked.toLocaleString()}</strong>
                {" / "}
                {data.total.toLocaleString()} UNLOCKED

                {data.total > 0 && (
                  <span>
                    {" · "}
                    {Math.round(
                      (data.unlocked / data.total) * 100
                    )}
                    % complete
                  </span>
                )}
              </div>

              {data.achievements.length === 0 ? (
                <p className="achievement-message">
                  No achievements available for this game.
                </p>
              ) : (
                <div className="achievement-grid">
                  {[...data.achievements]
                    .sort((a, b) => Number(b.achieved) - Number(a.achieved))
                    .map((achievement, index) => {
                    const iconUrl = achievement.achieved
                      ? achievement.icon || achievement.iconGray
                      : achievement.iconGray || achievement.icon;

                    return (
                      <article
                        className={`achievement-card ${
                          achievement.achieved ? "unlocked" : "locked"
                        }`}
                        key={`${data.appid}-${achievement.name}-${index}`}
                      >
                        <div className="achievement-icon-wrap">
                          {iconUrl ? (
                            <img
                              className="achievement-icon"
                              src={iconUrl}
                              alt=""
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="achievement-icon-fallback"
                              aria-hidden="true"
                            >
                              ◆
                            </div>
                          )}
                        </div>

                        <div className="achievement-info">
                          <h3>{achievement.name}</h3>
                          <p>
                            {achievement.description ||
                              ""}
                          </p>
                        </div>

                        <div
                          className="achievement-status"
                          aria-label={achievement.achieved ? "Unlocked" : "Locked"}
                          title={achievement.achieved ? "Unlocked" : "Locked"}
                        >
                          {achievement.achieved && (
                            <div className="achievement-unlocked">
                              <span>UNLOCKED</span>
                              {achievement.unlockTime > 0 && (
                                <span className="unlock-time">
                                  {new Date(
                                    achievement.unlockTime * 1000
                                  ).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                  })}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

export default Achievements;