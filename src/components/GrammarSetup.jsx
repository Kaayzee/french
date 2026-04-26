import "../styles/GrammarSetup.css";

function GrammarSetup({ onBack }) {
    return (
        <section className="grammar-setup">
            <div className="grammar-setup__header">
                <button
                    type="button"
                    className="grammar-setup__back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>
                <p className="grammar-setup__eyebrow">French Grammar</p>
                <h1>Conjugation Trainer</h1>
                <p>
                    Choose your French level, verb group, tense, and practice mode before
                    starting a conjugation session.
                </p>
            </div>

            <div className="grammar-setup__placeholder">
                <p>Grammar setup options will go here.</p>
            </div>
        </section>
    );
}

export default GrammarSetup;