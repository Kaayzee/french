import { useEffect, useState } from "react";
import FlashCard from "./components/FlashCard";
import InputBox from "./components/InputBox";
import ScoreBoard from "./components/ScoreBoard";
import useFlashcards from "./hooks/useFlashcards";
import "./styles/App.css";

export default function App() {
  const files = [
    { name: "Escalade 1", file: "data/escalade1.csv" },
    { name: "Escalade 2", file: "data/escalade2.csv" }
  ];

  const [selectedFile, setSelectedFile] = useState("data/escalade1.csv");
  const { cards } = useFlashcards(selectedFile);

  const [wordLimit, setWordLimit] = useState(25);
  const [page, setPage] = useState("game");

  const [deck, setDeck] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [swipe, setSwipe] = useState(null);

  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);
  const [finished, setFinished] = useState(false);

  // 🎤 TTS
  const speak = (text, lang = "fr-FR") => {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    const v = window.speechSynthesis.getVoices().find(v => v.lang === lang);
    if (v) u.voice = v;
    u.lang = lang;
    window.speechSynthesis.speak(u);
  };

  // shuffle
  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // load deck
  useEffect(() => {
    if (!cards.length) return;

    const limited = wordLimit ? cards.slice(0, wordLimit) : cards;

    setDeck(shuffleArray(limited));
    setCurrent(0);
    setScore(0);
    setHistory([]);
    setFinished(false);
    setFeedback("");
    setInput("");
    setFlipped(false);
  }, [cards, wordLimit]);

  const progress = deck.length
    ? Math.round((history.length / deck.length) * 100)
    : 0;

  if (!deck.length) return <div>Loading...</div>;

  const nextCard = () => {
    setFlipped(false);

    if (current + 1 >= deck.length) {
      setFinished(true);
      setPage("score");
      return;
    }

    setCurrent(prev => prev + 1);
    setInput("");
  };

  const handleSubmit = () => {
    if (finished) return;

    const correct = deck[current].en.toLowerCase().trim();
    const answer = input.toLowerCase().trim();
    const isCorrect = answer === correct;

    setSwipe(isCorrect ? "right" : "left");

    setHistory(prev => [
      ...prev,
      {
        ...deck[current],
        userAnswer: input,
        isCorrect,
        skipped: false
      }
    ]);

    setFeedback(isCorrect ? "✅ Correct!" : "❌ Wrong!");
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setSwipe(null);
      nextCard();
    }, 300);
  };

  const handleKnowThis = () => {
    if (finished) return;

    setSwipe("right");

    setHistory(prev => [
      ...prev,
      {
        ...deck[current],
        userAnswer: "—",
        isCorrect: true,
        skipped: true
      }
    ]);

    setFeedback("🎉 Known!");

    setTimeout(() => {
      setSwipe(null);
      nextCard();
    }, 300);
  };

  const endGame = () => {
    setFinished(true);
    setPage("score");
  };

  return (
    <div className="container-fluid">

      {/* FILES */}
      <div className="text-center my-3">
        {files.map(f => (
          <button
            key={f.file}
            onClick={() => setSelectedFile(f.file)}
            className={`btn btn-sm mx-1 ${
              selectedFile === f.file ? "btn-success" : "btn-outline-secondary"
            }`}
          >
            {f.name}
          </button>
        ))}

        <button className="btn btn-primary btn-sm mx-1" onClick={() => setPage("game")}>
          Game
        </button>

        <button className="btn btn-secondary btn-sm mx-1" onClick={() => setPage("score")}>
          Score
        </button>
      </div>

      {page === "game" && (
        <div className="row min-vh-100">

          <div className="col-12 col-md-3" />

          <div className="col-12 col-md-6 text-center">

            <div className="mb-2">
              <label>Words:</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max="100"
                value={wordLimit}
                onChange={(e) => setWordLimit(Number(e.target.value))}
              />
            </div>

            {/* PROGRESS */}
            <div className="mb-3">
              <div className="d-flex justify-content-between small">
                <span>{history.length} / {deck.length}</span>
                <span>{feedback}</span>
              </div>

              <div className="progress" style={{ height: "10px" }}>
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                >
                  {progress}%
                </div>
              </div>
            </div>

            {/* CARD */}
            <FlashCard
              card={deck[current]}
              flipped={flipped}
              swipe={swipe}
              onFlip={() => setFlipped(v => !v)}
            />

            {/* INPUT */}
            <InputBox
              input={input}
              setInput={setInput}
              onSubmit={handleSubmit}
              disabled={finished}
            />

            {/* BUTTONS */}
            <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
              <button className="btn btn-primary" onClick={handleSubmit}>
                🎯 Submit
              </button>

              <button className="btn btn-success" onClick={handleKnowThis}>
                👍 Know
              </button>

              <button className="btn btn-danger" onClick={endGame}>
                ✔️ End
              </button>

              <button className="btn btn-info" onClick={() => speak(deck[current].fr)}>
                🔊 Play
              </button>
            </div>

          </div>

          <div className="col-12 col-md-3" />

        </div>
      )}

      {page === "score" && (
        <ScoreBoard score={score} history={history} />
      )}

    </div>
  );
}