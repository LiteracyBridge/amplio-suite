const DeploymentInterval = Object.freeze({
  one_month: 1,
  one_quarter: 3,
  six_months: 6,
  one_year: 12,
});

export function toSentenceCase(str: string, clean: boolean = false) {
  if (str == null || str == "") return str;

  if (clean) {
    str = str.replace(/_|-/g, " ");
  }

  // Capitalize these special words
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toTitleCase(str: string) {
  if (str == null || str == "") return str;

  return str.replace(new RegExp('_+', 'g'), ' ')
    .split(" ")
    .map((word) => toSentenceCase(word))
    .join(" ");
}

export { DeploymentInterval };
