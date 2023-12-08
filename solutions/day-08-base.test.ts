import { test, expect, describe } from "bun:test";

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	let steps = 0;
	let currentNode = "";
	let instructionIndex = 0;

	const instructions = lines[0].split("");

	const navigationData: {
		[key: string]: {
			L: string;
			R: string;
		};
	} = {};

	for (let i = 2; i < lines.length; i++) {
		const line = lines[i];

		const baseData = line.split(" = ");
		const location = baseData[0];
		const directionsData = baseData[1].substring(1, baseData[1].length - 1);
		const directions = directionsData.split(", ");

		navigationData[location] = {
			L: directions[0],
			R: directions[1],
		};
	}

	currentNode = "AAA";

	while (currentNode !== "ZZZ") {
		const turn = instructions[instructionIndex];

		// @ts-ignore
		currentNode = navigationData[currentNode][turn];
		instructionIndex = (instructionIndex + 1) % instructions.length;
		steps++;
	}

	return steps;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-08-base-01.txt",
		output: 2,
	},
	{
		input: "./input/day-08-base-02.txt",
		output: 6,
	},
	{
		input: "./input/day-08-base-03.txt",
		output: 20659,
	},
];

describe("advent-of-code-2023 #8", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
