interface GameCardProps {
  name: string;
  hours: number;
  genre: string;
  image: string;
}

function GameCard({
  name,
  hours,
  genre,
  image,
}: GameCardProps) {
  return (
    <div className="game-card">
      {image ? (
      <img
        className="game-image"
        src={image}
        alt=""
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.nextElementSibling?.classList.add(
            "game-image-placeholder-visible"
          );
        }}
      />
    ) : null}

<div
  className={`game-image-placeholder ${
    !image ? "game-image-placeholder-visible" : ""
  }`}
  aria-hidden="true"
/>

      <h3>{name}</h3>

      <p>{genre}</p>

      <strong>{hours} hrs</strong>
    </div>
  );
}

export default GameCard;