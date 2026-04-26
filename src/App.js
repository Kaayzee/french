import { useState } from "react";

import VocabularyGame from "./components/VocabularyGame";
import LandingPage from "./components/LandingPage";
import GrammarSetup from "./components/grammar/GrammarSetup";

import "./styles/App.css";

export default function App() {
    const [page, setPage] = useState("landing");

    return (
        <div className="app-shell">
            {page === "landing" && (
                <LandingPage
                    onChooseVocabulary={() => setPage("vocabulary")}
                    onChooseGrammar={() => setPage("grammar")}
                />
            )}

            {page === "vocabulary" && (
                <VocabularyGame onBack={() => setPage("landing")} />
            )}

            {page === "grammar" && (
                <div className="App">
                    <GrammarSetup onBack={() => setPage("landing")} />
                </div>
            )}
        </div>
    );
} 