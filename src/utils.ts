export const capitalizeAndLowerCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(^|\s)[a-z]/g, (char) => char.toUpperCase());
};
