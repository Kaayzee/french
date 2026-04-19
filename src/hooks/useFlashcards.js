import { useEffect, useState } from "react";
import { parseCSV } from "../utils/parseCSV";

export default function useFlashcards(file) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!file) return;

    fetch(`/${file}`)
      .then(res => res.text())
      .then(text => setCards(parseCSV(text)))
      .catch(err => console.error(err));
  }, [file]);

  return { cards };
}