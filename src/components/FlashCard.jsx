import "../styles/FlashCard.css";
import ReactCountryFlag from "react-country-flag";


export default function FlashCard({ card, flipped, swipe, onFlip, direction }) {
  if (!card) return null;

  const front = direction === "fr-en" ? card.fr : card.en;
  const back = direction === "fr-en" ? card.en : card.fr;

  return (
    <div
      className={`flashcard-wrapper swipe-${swipe || ""}`}
      onClick={onFlip}
    >
      <div className={`card shadow-lg border-0 card-inner ${flipped ? "flipped" : ""}`}>

        <div className="card-face card-front">
          <div className="card-header w-100 text-center">
            
            {direction === "fr-en" ? "🇫🇷 → 🇬🇧" : "🇬🇧 → 🇫🇷"}
          </div>
          <div className="card-body">
            <h3>{front}</h3>
          </div>
        </div>

        <div className="card-face card-back">
          <div className="card-header w-100 text-center">
            Answer
          </div>
          <div className="card-body">
            <h3>{back}</h3>
          </div>
        </div>

      </div>
    </div>
  );
}