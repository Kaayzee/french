import "../styles/FlashCard.css";

export default function FlashCard({ card, flipped, swipe, onFlip }) {
  return (
    <div className={`flashcard-wrapper swipe-${swipe || ""}`} onClick={onFlip}>

      <div className={`card shadow-lg border-0 card-inner ${flipped ? "flipped" : ""}`}>

        <div className="card-face card-front">
          <div className="card-header w-100 text-center">🔄️ Front</div>
          <div className="card-body">
            <h3>{card.fr}</h3>
          </div>
        </div>

        <div className="card-face card-back">
          <div className="card-header w-100 text-center">🔄️ Back</div>
          <div className="card-body">
            <h3>{card.en}</h3>
          </div>
        </div>

      </div>
    </div>
  );
}