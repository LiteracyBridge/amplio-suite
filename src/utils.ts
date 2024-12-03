export const DeploymentInterval = Object.freeze({
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

	return str
		.replace(new RegExp("_+", "g"), " ")
		.split(" ")
		.map((word) => toSentenceCase(word))
		.join(" ");
}

export function pad(num: number, len: number): string {
  let zeros = new Array(5).join('0');

	const str = String(num);
	const diff = len - str.length;
	if (diff <= 0) {
		return str;
	}
	if (diff > zeros.length) {
		zeros = new Array(diff + 1).join("0");
	}
	return zeros.slice(0, diff) + str;
}
