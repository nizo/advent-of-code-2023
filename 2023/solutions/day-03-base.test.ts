import { test, expect, describe } from "bun:test";

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const containsSymbol = (a: string) => {
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== "." && !numbers.includes(a[i])) return true;
	}

	return false;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	let sum = 0;

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		let parsingNumber = "";
		const line = lines[lineIndex];

		for (let i = 0; i < line.length; i++) {
			const newCharacter = line[i];

			// new character add it to the buffer
			if (numbers.includes(newCharacter)) {
				parsingNumber += newCharacter;

				// continue to new character
				if (i < line.length - 1) continue;
			}

			if (parsingNumber === "") continue;

			let stringToTest = "";

			const start = Math.max(0, i - parsingNumber.length - 1);
			const end = Math.min(lines[lineIndex].length, i + 1);

			// current line
			stringToTest += lines[lineIndex].substring(start, end);

			// line above
			if (lineIndex > 0) {
				stringToTest += lines[lineIndex - 1].substring(start, end);
			}

			// line below
			if (lineIndex < lines.length - 1) {
				stringToTest += lines[lineIndex + 1].substring(start, end);
			}

			if (containsSymbol(stringToTest)) {
				sum += parseInt(parsingNumber);
			}

			// not a valid symbol
			parsingNumber = "";
		}
	}

	return sum;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-03-base-01.txt",
		output: 4361,
	},
	{
		input: "./input/day-03-base-02.txt",
		output: 526404,
	},
];

describe("advent-of-code-2023 #3", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
