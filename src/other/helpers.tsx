export const splitByCapitalLetter = (str: string) => {
  return str.split(/(?=[A-Z])/).join(" ");
};

export const formattedPointsFunc = (number: number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

export const stripHtmlTags = (str: string): string => {
  if (str === "") return "";
  return str.replace(/<[^>]*>/g, "").trim();
};
