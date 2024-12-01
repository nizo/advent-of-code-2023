import { test, expect, describe } from "bun:test";

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	let result = 0;

	const arr1: number[] = [];
	const arr2: number[] = [];

	for (const line of lines) {
		const match = line.match(/\d+/g);
		if (!match) continue;

		arr1.push(parseInt(match[0]));
		arr2.push(parseInt(match[1]));
	}

	const sortedArr1 = arr1.sort((a, b) => a - b);
	const sortedArr2 = arr2.sort((a, b) => a - b);

	for (let i = 0; i < sortedArr1.length; i++) {
		result += Math.abs(sortedArr1[i] - sortedArr2[i]);
	}

	return result;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "2024/input/day-01-base-01.txt",
		output: 11,
	},
	{
		input: "2024/input/day-01-base-02.txt",
		output: 2378066,
	},
	{
		input: "2024/input/day-01-advanced-01.txt",
		output: 53194,
	},
];

describe("advent-of-code-2024 #1", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
