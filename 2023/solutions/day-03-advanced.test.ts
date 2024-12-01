import { test, expect, describe, afterAll } from "bun:test";

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
type SymbolData = {
	value: number;
	xIndex: string;
	yIndex: string;
};

const getGearsForNumber = (a: string[], value: number, xStartIndex: number, yStartIndex: number): SymbolData[] => {
	const result: SymbolData[] = [];
	for (let yIndex = 0; yIndex < a.length; yIndex++) {
		const line = a[yIndex];
		for (let xIndex = 0; xIndex < line.length; xIndex++) {
			const character = line[xIndex];
			if (character == "*") {
				result.push({
					value: value,
					xIndex: (xStartIndex + xIndex).toString(),
					yIndex: (yStartIndex + yIndex).toString(),
				});
			}
		}
	}
	return result;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");

	const gearsData: SymbolData[] = [];
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

			let stringsToTest: string[] = [];

			const start = Math.max(0, i - parsingNumber.length - 1);
			const end = Math.min(lines[lineIndex].length, i + 1);

			let verticalStartOffset = 0;

			// line above
			if (lineIndex > 0) {
				stringsToTest.push(lines[lineIndex - 1].substring(start, end));
				verticalStartOffset = 1;
			}

			// current line
			stringsToTest.push(lines[lineIndex].substring(start, end));

			// line below
			if (lineIndex < lines.length - 1) {
				stringsToTest.push(lines[lineIndex + 1].substring(start, end));
			}

			const horizontalStartOffset = Math.max(0, i - parsingNumber.length - 1);

			gearsData.push(...getGearsForNumber(stringsToTest, parseInt(parsingNumber), horizontalStartOffset, lineIndex - verticalStartOffset));

			// not a valid symbol
			parsingNumber = "";
		}
	}

	const keyedGearsData: {
		[x: string]: {
			[y: string]: number[];
		};
	} = {};

	for (let i = 0; i < gearsData.length; i++) {
		const gear = gearsData[i];
		if (!keyedGearsData[gear.xIndex]) {
			keyedGearsData[gear.xIndex] = {};
		}

		if (!keyedGearsData[gear.xIndex][gear.yIndex]) {
			keyedGearsData[gear.xIndex][gear.yIndex] = [];
		}
		keyedGearsData[gear.xIndex][gear.yIndex].push(gear.value);
	}

	const xKeys = Object.keys(keyedGearsData);

	for (const xKey of xKeys) {
		const yKeys = Object.keys(keyedGearsData[xKey]);

		for (const yKey of yKeys) {
			if (keyedGearsData[xKey][yKey].length == 2) {
				sum += keyedGearsData[xKey][yKey][0] * keyedGearsData[xKey][yKey][1];
			}
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
		output: 467835,
	},
	{
		input: "./input/day-03-base-02.txt",
		output: 84399773,
	},
];

describe("advent-of-code-2023 #3", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
