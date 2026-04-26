import "../styles/LandingPage.css";

function LandingPage({ onChooseVocabulary, onChooseGrammar }) {
  return (
    <main className="landing-page">
      <section className="landing-page__hero">
        <p className="landing-page__eyebrow">French Learning</p>

        <h1>What would you like to practice?</h1>

        <p className="landing-page__intro">
          Choose vocabulary to review flashcards, or grammar to practice verb
          groups, tenses, and conjugations.
        </p>
      </section>

      <section className="landing-page__cards">
        <button
          type="button"
          className="landing-choice-card"
          onClick={onChooseVocabulary}
        >
          <span className="landing-choice-card__icon">📚</span>
          <span className="landing-choice-card__title">Vocabulary</span>
          <span className="landing-choice-card__description">
            Practice French words from Escalade book chapters using flashcards.
          </span>
        </button>

        <button
          type="button"
          className="landing-choice-card"
          onClick={onChooseGrammar}
        >
          <span className="landing-choice-card__icon">🧠</span>
          <span className="landing-choice-card__title">Grammar</span>
          <span className="landing-choice-card__description">
            Practice conjugations by level, verb group, tense, and mode.
          </span>
        </button>
      </section>
    </main>
  );
}

export default LandingPage;