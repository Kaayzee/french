export function parseCSV(text) {
  if (!text) return [];

  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && line.includes(","))
    .map(line => {
      const [fr, en] = line.split(",");

      return {
        fr: fr?.trim(),
        en: en?.trim()
      };
    })
    .filter(item => item.fr && item.en);
}