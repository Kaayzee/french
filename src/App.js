import { useEffect, useState } from "react";
import FlashCard from "./components/FlashCard";
import InputBox from "./components/InputBox";
import ScoreBoard from "./components/ScoreBoard";
import NavBar from "./components/NavBar";
import ReactCountryFlag from "react-country-flag";
import "./styles/App.css";

// 📚 Books (from /public)
const books = {
  "Escalade 1": "/french/escalade1.json",
  "Escalade 2": "/french/escalade2.json"
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

  const [direction, setDirection] = useState("fr-en"); // or "en-fr"
  const isFrToEn = direction === "fr-en";

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

  // 📥 load book
  useEffect(() => {
    const load = async () => {
      const res = await fetch(books[selectedBook]);
      const data = await res.json();

      setBookData(data);

      const firstChapter = Object.keys(data)[0] || "";
      setSelectedChapter(firstChapter);
    };

    load();
  }, [selectedBook]);

  const cards = bookData?.[selectedChapter] || [];

  // 🎯 build deck
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
  }, [bookData, selectedChapter, wordLimit]);

  const currentCard = deck[current];

  const progress = deck.length
    ? Math.round((history.length / deck.length) * 100)
    : 0;

  if (!bookData || Object.keys(bookData).length === 0) {
    return <div>Loading...</div>;
  }

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
    if (finished || !currentCard) return;

    const correct = (
      direction === "fr-en" ? currentCard.en : currentCard.fr
    ).toLowerCase().trim();

    const answer = input.toLowerCase().trim();
    const isCorrect = answer === correct;

    setSwipe(isCorrect ? "right" : "left");

    setHistory(prev => [
      ...prev,
      {
        ...currentCard,
        direction, // 👈 add this
        userAnswer: input,
        isCorrect,
        skipped: false
      }
    ]);

    setFeedback(isCorrect ? "Correct" : "Wrong");
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
        direction, // 👈 add this
        userAnswer: "—",
        isCorrect: true,
        skipped: "know"
      }
    ]);

    setFeedback("Known");

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
        direction, // 👈 add this
        userAnswer: "—",
        isCorrect: false,
        skipped: "dontKnow"
      }
    ]);

    setFeedback("Don't know");

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

      <NavBar
        books={books}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        bookData={bookData}
        selectedChapter={selectedChapter}
        setSelectedChapter={setSelectedChapter}
        direction={direction}
        setDirection={setDirection}
        page={page}
        setPage={setPage}
      />

      {/* 🎮 GAME */}
      {page === "game" && (
        <div className="row min-vh-100 mt-3">

          <div className="col-12 col-md-3" />

          <div className="col-12 col-md-6 text-center">

            <div className="mb-2">
              <input
                type="number"
                className="form-control"
                value={wordLimit}
                min="1"
                max="200"
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
                />
              </div>
            </div>

            {/* CARD */}
            {currentCard && (
              <FlashCard
                card={currentCard}
                flipped={flipped}
                swipe={swipe}
                direction={direction}
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
                👍Know
              </button>

              <button className="btn btn-warning" onClick={handleDontKnow}>
                👎Don’t know
              </button>

              <button className="btn btn-danger" onClick={endGame}>
                ❌End
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