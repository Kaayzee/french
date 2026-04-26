import { useEffect, useState } from "react";

import NavBar from "./NavBar";
import FlashCard from "./FlashCard";
import InputBox from "./InputBox";
import ScoreBoard from "./ScoreBoard";

import "../styles/VocabularyGame.css";

// 📚 Books from /public
const books = {
    "Escalade 1": "/french/escalade1.json",
    "Escalade 2": "/french/escalade2.json",
};

function VocabularyGame({ onBack }) {
    const [selectedBook, setSelectedBook] = useState("Escalade 1");
    const [selectedChapter, setSelectedChapter] = useState("");
    const [bookData, setBookData] = useState({});

    const [wordLimit, setWordLimit] = useState(25);
    const [vocabularyPage, setVocabularyPage] = useState("game");

    const [direction, setDirection] = useState("fr-en");

    const [deck, setDeck] = useState([]);
    const [current, setCurrent] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [swipe, setSwipe] = useState(null);

    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [history, setHistory] = useState([]);
    const [finished, setFinished] = useState(false);

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

    const shuffleArray = (arr) => {
        const a = [...arr];

        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }

        return a;
    };

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
        setVocabularyPage("game");
    }, [bookData, cards, selectedChapter, wordLimit]);

    const currentCard = deck[current];

    const progress = deck.length
        ? Math.round((history.length / deck.length) * 100)
        : 0;

    const goToNextCard = () => {
        setFlipped(false);
        setCurrent((prev) => prev + 1);
        setInput("");
    };

    const finishGame = () => {
        setFinished(true);
        setVocabularyPage("score");
    };

    const handleSubmit = () => {
        if (finished || !currentCard) return;

        const correct = (
            direction === "fr-en" ? currentCard.en : currentCard.fr
        )
            .toLowerCase()
            .trim();

        const answer = input.toLowerCase().trim();
        const isCorrect = answer === correct;

        const historyItem = {
            ...currentCard,
            direction,
            userAnswer: input,
            isCorrect,
            skipped: false,
        };

        const nextScore = isCorrect ? score + 1 : score;
        const nextHistory = [...history, historyItem];

        setSwipe(isCorrect ? "right" : "left");
        setHistory(nextHistory);
        setFeedback(isCorrect ? "Correct" : "Wrong");
        setScore(nextScore);

        setTimeout(() => {
            setSwipe(null);

            if (current + 1 >= deck.length) {
                setFinished(true);
                setVocabularyPage("score");
                return;
            }

            goToNextCard();
        }, 300);
    };

    const handleKnowThis = () => {
        if (finished || !currentCard) return;

        const historyItem = {
            ...currentCard,
            direction,
            userAnswer: "—",
            isCorrect: true,
            skipped: "know",
        };

        const nextScore = score + 1;
        const nextHistory = [...history, historyItem];

        setSwipe("right");
        setHistory(nextHistory);
        setFeedback("Known");
        setScore(nextScore);

        setTimeout(() => {
            setSwipe(null);

            if (current + 1 >= deck.length) {
                setFinished(true);
                setVocabularyPage("score");
                return;
            }

            goToNextCard();
        }, 300);
    };

    const handleDontKnow = () => {
        if (finished || !currentCard) return;

        const historyItem = {
            ...currentCard,
            direction,
            userAnswer: "—",
            isCorrect: false,
            skipped: "dontKnow",
        };

        const nextHistory = [...history, historyItem];

        setSwipe("left");
        setHistory(nextHistory);
        setFeedback("Don't know");

        setTimeout(() => {
            setSwipe(null);

            if (current + 1 >= deck.length) {
                setFinished(true);
                setVocabularyPage("score");
                return;
            }

            goToNextCard();
        }, 300);
    };

    const endGame = () => {
        finishGame();
    };

    const restartGame = () => {
        const limited = wordLimit ? cards.slice(0, wordLimit) : cards;

        setDeck(shuffleArray(limited));
        setCurrent(0);
        setScore(0);
        setHistory([]);
        setFinished(false);
        setFeedback("");
        setInput("");
        setFlipped(false);
        setSwipe(null);
        setVocabularyPage("game");
    };

    if (!bookData || Object.keys(bookData).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <NavBar
                books={books}
                selectedBook={selectedBook}
                setSelectedBook={setSelectedBook}
                bookData={bookData}
                selectedChapter={selectedChapter}
                setSelectedChapter={setSelectedChapter}
                direction={direction}
                setDirection={setDirection}
                page={vocabularyPage}
                setPage={setVocabularyPage}
            />

            <div className="vocabulary-game__topbar">
                <button
                    type="button"
                    className="vocabulary-game__back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>
            </div>

            {vocabularyPage === "game" && (
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

                        <div className="mb-3">
                            <div className="d-flex justify-content-between small">
                                <span>
                                    {history.length} / {deck.length}
                                </span>
                                <span>{feedback}</span>
                            </div>

                            <div className="progress" style={{ height: "10px" }}>
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {currentCard && (
                            <FlashCard
                                card={currentCard}
                                flipped={flipped}
                                swipe={swipe}
                                direction={direction}
                                onFlip={() => setFlipped((value) => !value)}
                            />
                        )}

                        <InputBox
                            input={input}
                            setInput={setInput}
                            onSubmit={handleSubmit}
                            disabled={finished}
                        />

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

            {vocabularyPage === "score" && (
                <div className="mt-3">
                    <ScoreBoard score={score} history={history} />

                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <button className="btn btn-primary" onClick={restartGame}>
                            Restart
                        </button>

                        <button className="btn btn-outline-secondary" onClick={onBack}>
                            Back to landing page
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default VocabularyGame;