export function normalizeAccents(text: string): string {
  const accentMap: Record<string, string> = {
    à: "a'",
    á: "a'",
    â: "a",
    ã: "a",
    ä: "a",
    å: "a",
    è: "e'",
    é: "e'",
    ê: "e",
    ë: "e",
    ì: "i'",
    í: "i'",
    î: "i",
    ï: "i",
    ò: "o'",
    ó: "o'",
    ô: "o",
    õ: "o",
    ö: "o",
    ù: "u'",
    ú: "u'",
    û: "u",
    ü: "u",
    ñ: "n",
    ç: "c",
  };

  return text
    .split("")
    .map((char) => accentMap[char] || char)
    .join("");
}

export function calculateLineBreaks(words: string[], wordWidths: number[], lineMaxWidth: number, wordSpacing: number = 0.3) {
  const lines: { words: number[]; width: number }[] = [];
  let currentLine: { words: number[]; width: number } = { words: [], width: 0 };

  words.forEach((word, index) => {
    const wordWidth = wordWidths[index];

    if (currentLine.words.length === 0) {
      currentLine.words.push(index);
      currentLine.width = wordWidth;
    } else if (currentLine.words.length <= 1 && currentLine.width + wordWidth + wordSpacing <= lineMaxWidth * 1.2) {
      currentLine.words.push(index);
      currentLine.width += wordWidth + wordSpacing;
    } else if (words[index].length <= 3 && currentLine.width + wordWidth + wordSpacing <= lineMaxWidth * 1.1) {
      currentLine.words.push(index);
      currentLine.width += wordWidth + wordSpacing;
    } else if (currentLine.width + wordWidth + wordSpacing <= lineMaxWidth) {
      currentLine.words.push(index);
      currentLine.width += wordWidth + wordSpacing;
    } else if (currentLine.words.length === 1 && currentLine.width + wordWidth + wordSpacing <= lineMaxWidth * 1.3) {
      currentLine.words.push(index);
      currentLine.width += wordWidth + wordSpacing;
    } else {
      lines.push(currentLine);
      currentLine = { words: [index], width: wordWidth };
    }
  });

  if (currentLine.words.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}
