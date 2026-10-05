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
      <img
        className="game-image"
        src={image}
        alt={name}
      />

      <h3>{name}</h3>

      <p>{genre}</p>

      <strong>{hours} hrs</strong>
    </div>
  );
}

export default GameCard;