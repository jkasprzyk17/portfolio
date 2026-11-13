// First sentence, keeping its own full stop. Descriptions in the data files
// are sometimes one sentence and sometimes several.
export function firstSentence(text: string) {
  return text.match(/^.*?\.(?=\s|$)/)?.[0] ?? text;
}

// "Radon IDE: Radon IDE is an innovative…" reads badly next to the name, so
// drop the subject when the description repeats it.
export function summarise(name: string, description: string) {
  const sentence = firstSentence(description);
  const prefix = `${name} is `;
  return sentence.startsWith(prefix) ? sentence.slice(prefix.length) : sentence;
}
