export const GRAMMAR_STORAGE_KEY = "frenchGrammarSettings";

export const defaultGrammarSettings = {
    level: "",
    verbGroup: "",
    tense: "",
    mode: "",
};

export const levelOptions = [
    {
        value: "A1",
        label: "A1",
        description: "Beginner conjugation patterns",
    },
    {
        value: "A2",
        label: "A2",
        description: "Past, future, and more complex forms",
    },
];

export const verbGroupOptions = [
    {
        value: "er",
        label: "-er verbs",
        description: "parler, aimer, regarder",
    },
    {
        value: "ir",
        label: "-ir verbs",
        description: "finir, choisir, réussir",
    },
    {
        value: "re",
        label: "-re verbs",
        description: "vendre, attendre, répondre",
    },
    {
        value: "irregular",
        label: "Irregular verbs",
        description: "être, avoir, aller, faire",
    },
];

export const tenseOptions = [
    {
        value: "present",
        label: "Présent",
        description: "je parle, tu finis, il vend",
    },
    {
        value: "passe_compose",
        label: "Passé composé",
        description: "j’ai parlé, elle est allée",
    },
    {
        value: "futur_proche",
        label: "Futur proche",
        description: "je vais parler",
    },
    {
        value: "imparfait",
        label: "Imparfait",
        description: "je parlais",
    },
];

export const modeOptions = [
    {
        value: "multiple_choice",
        label: "Multiple choice",
        description: "Choose the correct answer",
    },
    {
        value: "typing",
        label: "Type the answer",
        description: "Write the conjugation yourself",
    },
    {
        value: "fill_blank",
        label: "Fill in the blank",
        description: "Complete a French sentence",
    },
    {
        value: "timed",
        label: "Timed challenge",
        description: "Practice under time pressure",
    },
];

export function getGrammarOptionLabel(options, value) {
    if (!value) return "Not selected";

    const option = options.find((item) => item.value === value);

    return option?.label || "Not selected";
} 