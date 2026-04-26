import { useEffect, useMemo, useState } from "react";

import {
    buildGrammarExercises,
    getGrammarDataPath,
    shuffleArray,
} from "./grammarData";

function GrammarPractice({ settings, onBackToSettings, onBack }) {
    const [grammarData, setGrammarData] = useState(null);
    const [loadError, setLoadError] = useState("");
    const [questionLimit, setQuestionLimit] = useState(10);
    const [direction, setDirection] = useState("fr-en");

    const [deck, setDeck] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState([]);
    const [isFinished, setIsFinished] = useState(false);

    const dataPath = useMemo(() => getGrammarDataPath(settings), [settings]);

    useEffect(() => {
        const loadGrammarData = async () => {
            setLoadError("");
            setGrammarData(null);

            console.log("[GrammarPractice] Settings:", settings);
            console.log("[GrammarPractice] Resolved data path:", dataPath);

            if (!dataPath) {
                console.warn(
                    "[GrammarPractice] Unsupported grammar combination:",
                    settings
                );

                setLoadError(
                    "This grammar combination is not available yet. For now, use A1, -er verbs, Présent, Multiple choice."
                );
                return;
            }

            try {
                console.log("[GrammarPractice] Loading grammar data from:", dataPath);

                const response = await fetch(dataPath);

                console.log("[GrammarPractice] Fetch response:", {
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                });

                if (!response.ok) {
                    throw new Error("Could not load grammar data.");
                }

                const data = await response.json();

                console.log("[GrammarPractice] Grammar data loaded:", data);
                console.log("[GrammarPractice] Verb count:", data?.verbs?.length || 0);

                setGrammarData(data);
            } catch (error) {
                console.error("[GrammarPractice] Failed to load grammar data:", error);

                setLoadError("Could not load the grammar practice file.");
            }
        };

        loadGrammarData();
    }, [dataPath, settings]);

    useEffect(() => {
        if (!grammarData) return;

        const exercises = buildGrammarExercises(grammarData, direction);
        const limitedDeck = shuffleArray(exercises).slice(0, questionLimit);

        setDeck(limitedDeck);
        setCurrentIndex(0);
        setSelectedAnswer("");
        setFeedback("");
        setScore(0);
        setHistory([]);
        setIsFinished(false);
    }, [grammarData, direction, questionLimit]);

    const currentExercise = deck[currentIndex];

    const progress = deck.length
        ? Math.round((history.length / deck.length) * 100)
        : 0;

    const handleAnswer = (answer) => {
        if (!currentExercise || selectedAnswer || isFinished) return;

        const isCorrect = answer === currentExercise.correctAnswer;

        const historyItem = {
            id: currentExercise.id,
            infinitive: currentExercise.infinitive,
            person: currentExercise.person,
            prompt: currentExercise.prompt,
            correctAnswer: currentExercise.correctAnswer,
            selectedAnswer: answer,
            isCorrect,
            direction,
        };

        const nextHistory = [...history, historyItem];

        setSelectedAnswer(answer);
        setFeedback(isCorrect ? "Correct" : "Wrong");
        setHistory(nextHistory);

        if (isCorrect) {
            setScore((currentScore) => currentScore + 1);
        }

        setTimeout(() => {
            if (currentIndex + 1 >= deck.length) {
                setIsFinished(true);
                return;
            }

            setCurrentIndex((index) => index + 1);
            setSelectedAnswer("");
            setFeedback("");
        }, 650);
    };

    const restartPractice = () => {
        if (!grammarData) return;

        const exercises = buildGrammarExercises(grammarData, direction);
        const limitedDeck = shuffleArray(exercises).slice(0, questionLimit);

        setDeck(limitedDeck);
        setCurrentIndex(0);
        setSelectedAnswer("");
        setFeedback("");
        setScore(0);
        setHistory([]);
        setIsFinished(false);
    };

    if (loadError) {
        return (
            <section className="grammar-practice">
                <div className="grammar-practice__topbar">
                    <button type="button" onClick={onBackToSettings}>
                        ← Settings
                    </button>

                    <button type="button" onClick={onBack}>
                        Back to landing
                    </button>
                </div>

                <div className="grammar-practice__card">
                    <h1>Practice unavailable</h1>
                    <p>{loadError}</p>
                </div>
            </section>
        );
    }

    if (!grammarData || !currentExercise) {
        return (
            <section className="grammar-practice">
                <p>Loading grammar practice...</p>
            </section>
        );
    }

    if (isFinished) {
        return (
            <section className="grammar-practice">
                <div className="grammar-practice__topbar">
                    <button type="button" onClick={onBackToSettings}>
                        ← Settings
                    </button>

                    <button type="button" onClick={onBack}>
                        Back to landing
                    </button>
                </div>

                <div className="grammar-practice__card">
                    <p className="grammar-practice__eyebrow">Session complete</p>
                    <h1>
                        Score: {score} / {deck.length}
                    </h1>

                    <div className="grammar-practice__actions">
                        <button type="button" onClick={restartPractice}>
                            Restart
                        </button>

                        <button type="button" onClick={onBackToSettings}>
                            Change settings
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="grammar-practice">
            <div className="grammar-practice__topbar">
                <button type="button" onClick={onBackToSettings}>
                    ← Settings
                </button>

                <button type="button" onClick={onBack}>
                    Back to landing
                </button>
            </div>

            <div className="grammar-practice__controls">
                <label>
                    Number of questions
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={questionLimit}
                        onChange={(event) => setQuestionLimit(Number(event.target.value))}
                    />
                </label>

                <button
                    type="button"
                    onClick={() =>
                        setDirection((current) => (current === "fr-en" ? "en-fr" : "fr-en"))
                    }
                >
                    Direction: {direction === "fr-en" ? "French → English" : "English → French"}
                </button>
            </div>

            <div className="grammar-practice__status">
                <div className="grammar-practice__status-row">
                    <span>
                        {history.length} / {deck.length}
                    </span>
                    <span>{feedback}</span>
                    <span>Score: {score}</span>
                </div>

                <div className="grammar-practice__progress">
                    <div
                        className="grammar-practice__progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <article className="grammar-practice__card">
                <p className="grammar-practice__eyebrow">
                    {currentExercise.promptLabel}
                </p>

                <h1>{currentExercise.prompt}</h1>

                <p className="grammar-practice__hint">
                    Verb: <strong>{currentExercise.infinitive}</strong> · Person:{" "}
                    <strong>{currentExercise.person}</strong>
                </p>
            </article>

            <div className="grammar-practice__options">
                {currentExercise.options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = currentExercise.correctAnswer === option;

                    return (
                        <button
                            key={option}
                            type="button"
                            className={[
                                "grammar-practice__option",
                                isSelected && isCorrect ? "grammar-practice__option--correct" : "",
                                isSelected && !isCorrect ? "grammar-practice__option--wrong" : "",
                                selectedAnswer && isCorrect ? "grammar-practice__option--reveal" : "",
                            ].join(" ")}
                            onClick={() => handleAnswer(option)}
                            disabled={Boolean(selectedAnswer)}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default GrammarPractice;