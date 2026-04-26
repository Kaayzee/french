import { useEffect, useMemo, useState } from "react";

import GrammarSettingsPanel from "./GrammarSettingsPanel";
import GrammarSettingsSummary from "./GrammarSettingsSummary";
import GrammarPractice from "./GrammarPractice";

import {
    defaultGrammarSettings,
    GRAMMAR_STORAGE_KEY,
} from "./grammarOptions";

import "../../styles/grammar/GrammarSetup.css";

function GrammarSetup({ onBack }) {
    const [settings, setSettings] = useState(defaultGrammarSettings);
    const [isSettingsOpen, setIsSettingsOpen] = useState(true);
    const [grammarView, setGrammarView] = useState("setup");

    useEffect(() => {
        const savedSettings = localStorage.getItem(GRAMMAR_STORAGE_KEY);

        if (!savedSettings) return;

        try {
            const parsedSettings = JSON.parse(savedSettings);

            setSettings({
                level: parsedSettings.level || "",
                verbGroup: parsedSettings.verbGroup || "",
                tense: parsedSettings.tense || "",
                mode: parsedSettings.mode || "",
            });
        } catch {
            localStorage.removeItem(GRAMMAR_STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(GRAMMAR_STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const isSettingsComplete = useMemo(() => {
        return Boolean(
            settings.level &&
            settings.verbGroup &&
            settings.tense &&
            settings.mode
        );
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings((currentSettings) => ({
            ...currentSettings,
            [key]: value,
        }));
    };

    const resetSettings = () => {
        setSettings(defaultGrammarSettings);
        localStorage.removeItem(GRAMMAR_STORAGE_KEY);
    };

    const startPractice = () => {
        if (!isSettingsComplete) return;

        setIsSettingsOpen(false);
        setGrammarView("practice");
    };

    if (grammarView === "practice") {
        return (
            <GrammarPractice
                settings={settings}
                onBackToSettings={() => setGrammarView("setup")}
                onBack={onBack}
            />
        );
    }

    return (
        <section
            className={[
                "grammar-setup",
                isSettingsOpen ? "grammar-setup--settings-open" : "",
            ].join(" ")}
        >
            <main className="grammar-setup__main">
                <div className="grammar-setup__topbar">
                    <button
                        type="button"
                        className="grammar-setup__back-button"
                        onClick={onBack}
                    >
                        ← Back
                    </button>

                    <button
                        type="button"
                        className="grammar-setup__settings-toggle"
                        onClick={() => setIsSettingsOpen((current) => !current)}
                    >
                        {isSettingsOpen ? "Hide settings" : "Show settings"}
                    </button>
                </div>

                <div className="grammar-setup__header">
                    <p className="grammar-setup__eyebrow">French Grammar</p>
                    <h1>Conjugation Trainer</h1>
                    <p>
                        Choose your French level, verb group, tense, and practice mode. Your
                        selections are saved automatically.
                    </p>
                </div>

                <GrammarSettingsSummary
                    settings={settings}
                    isSettingsComplete={isSettingsComplete}
                    onReset={resetSettings}
                    onStartPractice={startPractice}
                />
            </main>


            <aside
                className={[
                    "grammar-setup__settings-sidebar",
                    isSettingsOpen ? "grammar-setup__settings-sidebar--open" : "",
                ].join(" ")}
                aria-label="Grammar settings"
            >
                <div className="grammar-setup__settings-sidebar-header">
                    <div>
                        <p className="grammar-setup__sidebar-eyebrow">Settings</p>
                        <h2>Practice setup</h2>
                    </div>

                    <button
                        type="button"
                        className="grammar-setup__sidebar-close"
                        onClick={() => setIsSettingsOpen(false)}
                        aria-label="Close grammar settings"
                    >
                        ×
                    </button>
                </div>

                <GrammarSettingsPanel
                    settings={settings}
                    onUpdateSetting={updateSetting}
                />
            </aside>
        </section>
    );
}

export default GrammarSetup;