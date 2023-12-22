import { test, expect, describe } from "bun:test";

type vertex = [number, number];

const getInnerArea = (vertices: vertex[]): number => {
	let area = 0;

	const length = vertices.length;
	let sum1 = 0;
	let sum2 = 0;

	for (let i = 0; i < length - 1; i++) {
		sum1 = sum1 + vertices[i][0] * vertices[i + 1][1];
		sum2 = sum2 + vertices[i][1] * vertices[i + 1][0];
	}

	sum1 = sum1 + vertices[length - 1][0] * vertices[0][1];
	sum2 = sum2 + vertices[0][0] * vertices[length - 1][1];

	area = Math.abs(sum1 - sum2) / 2;

	return area + 1 - vertices.length / 2;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();

	let currentX: number = 0;
	let currentY: number = 0;
	const lineDefinition: Array<vertex> = [];

	for (const line of text.split("\n")) {
		const [direction, steps, color] = line.split(" ");
		const stepsParsed = parseInt(steps);

		for (let i = 0; i < stepsParsed; i++) {
			lineDefinition.push([currentX, currentY]);
			if (direction === "R") currentX++;
			if (direction === "L") currentX--;
			if (direction === "U") currentY--;
			if (direction === "D") currentY++;
		}
	}

	const area = getInnerArea(lineDefinition);

	return area + lineDefinition.length;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-18-base-01.txt",
		output: 62,
	},
	{
		input: "./input/day-18-base-02.txt",
		output: 70253,
	},
];

describe("advent-of-code-2023 #18", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
