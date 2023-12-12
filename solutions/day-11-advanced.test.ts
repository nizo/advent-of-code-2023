import { test, expect, describe } from "bun:test";

const getShortestDistance = (horizontalMultipliers: number[], verticalMultipliers: number[], start: [number, number], end: [number, number]): number => {
	let distance = 0;

	let normalizedHorizontalStart = start[0];
	let normalizedHorizontalEnd = end[0];

	let normalizedVerticalStart = start[1];
	let normalizedVerticalEnd = end[1];

	if (start[0] > end[0]) {
		normalizedHorizontalStart = end[0];
		normalizedHorizontalEnd = start[0];
	}

	if (start[1] > end[1]) {
		normalizedVerticalStart = end[1];
		normalizedVerticalEnd = start[1];
	}

	for (let x = normalizedHorizontalStart; x < normalizedHorizontalEnd; x++) {
		distance += horizontalMultipliers[x];
	}

	for (let y = normalizedVerticalStart; y < normalizedVerticalEnd; y++) {
		distance += verticalMultipliers[y];
	}

	return distance;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	const multiplier = 1000000;
	const horizontalMultipliers: number[] = [];
	const verticalMultipliers: number[] = [];
	const galaxiesCoordinates: [number, number][] = [];

	let distances: number[] = [];

	for (let yIndex = 0; yIndex < lines.length; yIndex++) {
		let expanded = true;

		for (let xIndex = 0; xIndex < lines[yIndex].length; xIndex++) {
			if (lines[yIndex][xIndex] === "#") {
				galaxiesCoordinates.push([xIndex, yIndex]);
				expanded = false;
			}
		}
		verticalMultipliers[yIndex] = expanded ? multiplier : 1;
	}

	for (let xIndex = 0; xIndex < lines[0].length; xIndex++) {
		let expanded = true;

		for (let yIndex = 0; yIndex < lines.length; yIndex++) {
			if (lines[yIndex][xIndex] === "#") {
				expanded = false;
				break;
			}
		}

		horizontalMultipliers[xIndex] = expanded ? multiplier : 1;
	}

	for (let i = 0; i < galaxiesCoordinates.length - 1; i++) {
		for (let j = i + 1; j < galaxiesCoordinates.length; j++) {
			const galaxyA = galaxiesCoordinates[i];
			const galaxyB = galaxiesCoordinates[j];

			const distance = getShortestDistance(horizontalMultipliers, verticalMultipliers, galaxyA, galaxyB);
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
		input: "./input/day-11-base-02.txt",
		output: 650672493820,
	},
];

describe("advent-of-code-2023 #11", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
