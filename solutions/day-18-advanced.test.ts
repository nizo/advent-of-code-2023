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
	return area;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();

	let currentX: number = 0;
	let currentY: number = 0;
	let lineLength = 0;
	const lineDefinition: Array<vertex> = [];

	for (const line of text.split("\n")) {
		const [, , hexInput] = line.split(" ");
		const hexParsed = hexInput.substring(1, hexInput.length - 1);
		const directionIndicator = hexParsed.substring(hexParsed.length - 1);
		const distance = parseInt(hexParsed.substring(1, 6), 16);

		lineDefinition.push([currentX, currentY]);

		if (["1", "0"].includes(directionIndicator)) lineLength += distance;

		if (directionIndicator === "0") currentX = currentX + distance;
		if (directionIndicator === "2") currentX = currentX - distance;
		if (directionIndicator === "3") currentY = currentY - distance;
		if (directionIndicator === "1") currentY = currentY + distance;
	}

	const area = getInnerArea(lineDefinition);
	return area + lineLength + 1;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-18-base-01.txt",
		output: 952408144115,
	},
	{
		input: "./input/day-18-base-02.txt",
		output: 131265059885080,
	},
];

describe("advent-of-code-2023 #18", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
