export function getGrammarDataPath(settings) {
  const { level, verbGroup, tense, mode } = settings;

  const isSupported =
    level === "A1" &&
    verbGroup === "er" &&
    tense === "present" &&
    mode === "multiple_choice";

  if (!isSupported) {
    return null;
  }

  return "french/grammar/a1/er/present.json";
}

export function buildGrammarExercises(grammarData, direction = "fr-en") {
    const baseExercises = grammarData.verbs.flatMap((verb) =>
        verb.forms.map((form) => ({
            id: `${verb.id}-${form.person}`,
            verbId: verb.id,
            infinitive: verb.infinitive,
            verbEnglish: verb.english,
            person: form.person,
            conjugation: form.conjugation,
            frSentence: form.frSentence,
            frBlank: form.frBlank,
            enSentence: form.enSentence,
        }))
    );

    return baseExercises.map((exercise) => {
        if (direction === "en-fr") {
            return {
                ...exercise,
                prompt: exercise.enSentence,
                promptLabel: "Choose the correct French sentence",
                correctAnswer: exercise.frSentence,
                options: buildOptions({
                    correctAnswer: exercise.frSentence,
                    pool: baseExercises.map((item) => item.frSentence),
                }),
            };
        }

        return {
            ...exercise,
            prompt: exercise.frBlank,
            promptLabel: "Choose the correct conjugation",
            correctAnswer: exercise.conjugation,
            options: buildOptions({
                correctAnswer: exercise.conjugation,
                pool: baseExercises.map((item) => item.conjugation),
            }),
        };
    });
}

function buildOptions({ correctAnswer, pool }) {
    const falseOptions = shuffleArray(
        [...new Set(pool)].filter((option) => option !== correctAnswer)
    ).slice(0, 3);

    return shuffleArray([correctAnswer, ...falseOptions]);
}

export function shuffleArray(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }

    return copy;
} 