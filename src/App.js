import { useEffect, useState } from "react";
import FlashCard from "./components/FlashCard";
import InputBox from "./components/InputBox";
import ScoreBoard from "./components/ScoreBoard";
import "./styles/App.css";

// 📚 Books (from /public/data)
const books = {
  "Escalade 1": "french/escalade1.json",
  "Escalade 2": "french/escalade2.json"
};

export default function App() {



  const [selectedBook, setSelectedBook] = useState("Escalade 1");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [bookData, setBookData] = useState({});

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

  // 🔄 shuffle
  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };


  // 📥 load book JSON
  useEffect(() => {
    const loadBook = async () => {
      const res = await fetch(books[selectedBook]);
      const data = await res.json();

      setBookData(data);

      const firstChapter = Object.keys(data)[0] || "";
      setSelectedChapter(firstChapter);
    };

    loadBook();
  }, [selectedBook]);

  const isLoading =
    Object.keys(bookData).length === 0 || !selectedChapter;

  // 🎯 build deck
  useEffect(() => {
    const cards = bookData?.[selectedChapter] || [];

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
  }, [bookData, selectedChapter, wordLimit]);

  const progress = deck.length
    ? Math.round((history.length / deck.length) * 100)
    : 0;

  const currentCard = deck?.[current];

  // 🚨 loading guard
  if (isLoading) return <div>Loading...</div>;

  // ▶️ next card
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

  // ✅ submit answer
  const handleSubmit = () => {
    if (finished || !currentCard) return;

    const correct = currentCard.en.toLowerCase().trim();
    const answer = input.toLowerCase().trim();
    const isCorrect = answer === correct;

    setSwipe(isCorrect ? "right" : "left");

    setHistory(prev => [
      ...prev,
      {
        ...currentCard,
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
    if (finished || !currentCard) return;

    setSwipe("right");

    setHistory(prev => [
      ...prev,
      {
        ...currentCard,
        userAnswer: "—",
        isCorrect: true,
        skipped: "know"
      }
    ]);

    setFeedback("🎉 Known!");

    setTimeout(() => {
      setSwipe(null);
      nextCard();
    }, 300);
  };

  const handleDontKnow = () => {
    if (finished || !currentCard) return;

    setSwipe("left");

    setHistory(prev => [
      ...prev,
      {
        ...currentCard,
        userAnswer: "—",
        isCorrect: false,
        skipped: "dontKnow"
      }
    ]);

    setFeedback("🤷 Don't know");

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
    <div className="container-fluid p-0">

      {/* 📚 SELECTORS */}
      <div className="text-center my-3 d-flex justify-content-center gap-2 flex-wrap">

        <select
          className="form-select w-auto"
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
        >
          {Object.keys(books).map(book => (
            <option key={book}>{book}</option>
          ))}
        </select>

        <select
          className="form-select w-auto"
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
        >
          {Object.keys(bookData).map(ch => (
            <option key={ch}>{ch}</option>
          ))}
        </select>

        <button className="btn btn-primary btn-sm" onClick={() => setPage("game")}>
          Game
        </button>

        <button className="btn btn-secondary btn-sm" onClick={() => setPage("score")}>
          Score
        </button>

      </div>

      {/* 🎮 GAME */}
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
            {currentCard && (
              <FlashCard
                card={currentCard}
                flipped={flipped}
                swipe={swipe}
                onFlip={() => setFlipped(v => !v)}
              />
            )}

            {/* INPUT */}
            <InputBox
              input={input}
              setInput={setInput}
              onSubmit={handleSubmit}
              disabled={finished}
            />

            {/* ACTIONS */}
            <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">

              <button className="btn btn-success" onClick={handleKnowThis}>
                Know
              </button>

              <button className="btn btn-warning" onClick={handleDontKnow}>
                Don’t know
              </button>

              <button className="btn btn-danger" onClick={endGame}>
                End
              </button>

            </div>

          </div>

          <div className="col-12 col-md-3" />

        </div>
      )}

      {/* 🏁 SCORE */}
      {page === "score" && (
        <ScoreBoard score={score} history={history} />
      )}

    </div>
  );
}