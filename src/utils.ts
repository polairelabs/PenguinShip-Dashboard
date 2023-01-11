export const lowerCaseAllWordsExceptFirstLetters = (word: string) =>
  word.replaceAll(/\S*/g, (w) => `${w.slice(0, 1)}${w.slice(1).toLowerCase()}`);

export const capitalizeFirstLettersOnly = (word: string) => {
  const words = word.split(" ");
  return words
    .map(lowerCaseAllWordsExceptFirstLetters)
    .map(
      (w) =>
        w?.charAt(0).toUpperCase() +
        w?.slice(1) +
        (words.indexOf(w) === words.length - 1 ? "," : " ")
    );
};
