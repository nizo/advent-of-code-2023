import { test, expect, describe } from "bun:test";

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");

	const processedInput: string[] = [];

	// rows expansion
	for (let yIndex = 0; yIndex < lines.length; yIndex++) {
		if (!lines[yIndex].includes("#")) {
			processedInput.push(lines[yIndex]);
		}

		processedInput.push(lines[yIndex]);
	}

	let shiftShift = 0;
	for (let xIndex = 0; xIndex < lines[0].length; xIndex++) {
		let expanded = true;
		for (let yIndex = 0; yIndex < lines[0].length; yIndex++) {
			if (lines[yIndex][xIndex] === "#") {
				expanded = false;
				break;
			}
		}

		if (expanded) {
			shiftShift++;
			for (let i = 0; i < processedInput.length; i++) {
				processedInput[i] =
					processedInput[i].substring(0, xIndex + shiftShift) +
					processedInput[i].substring(xIndex + shiftShift - 1, xIndex + shiftShift) +
					processedInput[i].substring(xIndex + shiftShift);
			}
		}
	}

	const galaxiesCoordinates: [number, number][] = [];
	for (let yIndex = 0; yIndex < processedInput.length; yIndex++) {
		for (let xIndex = 0; xIndex < processedInput[yIndex].length; xIndex++) {
			if (processedInput[yIndex][xIndex] === "#") galaxiesCoordinates.push([xIndex, yIndex]);
		}
	}

	let distances: number[] = [];
	let count = 0;
	for (let i = 0; i < galaxiesCoordinates.length - 1; i++) {
		for (let j = i; j < galaxiesCoordinates.length; j++) {
			const galaxyA = galaxiesCoordinates[i];
			const galaxyB = galaxiesCoordinates[j];

			const distance = Math.abs(galaxyA[0] - galaxyB[0]) + Math.abs(galaxyA[1] - galaxyB[1]);

			count++;
			distances.push(distance);
		}
	}
	return distances.reduce((acc, item) => acc + item, 0);
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-11-base-01.txt",
		output: 374,
	},
	{
		input: "./input/day-11-base-02.txt",
		output: 9795148,
	},
];

describe("advent-of-code-2023 #11", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
