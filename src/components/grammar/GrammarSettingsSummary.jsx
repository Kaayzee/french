import {
  getGrammarOptionLabel,
  modeOptions,
  tenseOptions,
  verbGroupOptions,
} from "./grammarOptions";

function GrammarSettingsSummary({
    settings,
    isSettingsComplete,
    onReset,
    onStartPractice,
}) {
    return (
        <div className="grammar-setup__summary">
            <div>
                <h2>Current settings</h2>

                <p>
                    {isSettingsComplete
                        ? "Ready to start a grammar practice session."
                        : "Complete all four selections before starting."}
                </p>

                <dl className="grammar-setup__summary-list">
                    <div>
                        <dt>Level</dt>
                        <dd>{settings.level || "Not selected"}</dd>
                    </div>

                    <div>
                        <dt>Verb group</dt>
                        <dd>{getGrammarOptionLabel(verbGroupOptions, settings.verbGroup)}</dd>
                    </div>

                    <div>
                        <dt>Tense</dt>
                        <dd>{getGrammarOptionLabel(tenseOptions, settings.tense)}</dd>
                    </div>

                    <div>
                        <dt>Mode</dt>
                        <dd>{getGrammarOptionLabel(modeOptions, settings.mode)}</dd>
                    </div>
                </dl>
            </div>

            <div className="grammar-setup__actions">
                <button
                    type="button"
                    className="grammar-setup__secondary-button"
                    onClick={onReset}
                >
                    Reset
                </button>

                <button
                    type="button"
                    className="grammar-setup__primary-button"
                    disabled={!isSettingsComplete}
                    onClick={onStartPractice}
                >
                    Start Practice
                </button>
            </div>
        </div>
    );
}

export default GrammarSettingsSummary;