import { useEffect, useState } from "react";
import { parseCSV } from "../utils/parseCSV";

export default function useFlashcards(file) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!file) return;

    fetch(`/${file}`)
      .then((res) => {
        if (!res.ok) throw new Error("CSV not found");
        return res.text();
      })
      .then((text) => {
        setCards(parseCSV(text));
      })
      .catch((err) => {
        console.error("CSV load error:", err);
        setCards([]);
      });
  }, [file]);

  return { cards };
}