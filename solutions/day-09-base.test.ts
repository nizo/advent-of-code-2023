import { test, expect, describe } from "bun:test";

const predictNexValue = (arr: number[]): number => {
	if (arr.every((item) => item === 0)) return 0;

	const newArr: number[] = [];
	for (let i = 0; i < arr.length - 1; i++) {
		newArr.push(arr[i + 1] - arr[i]);
	}

	return arr[arr.length - 1] + predictNexValue(newArr);
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	let sum = 0;

	for (const line of lines) {
		const inputNumbers = line.split(" ").map((item) => parseInt(item));

		sum += predictNexValue(inputNumbers);
	}

	return sum;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-09-base-01.txt",
		output: 114,
	},
	{
		input: "./input/day-09-base-02.txt",
		output: 1987402313,
	},
];

describe("advent-of-code-2023 #9", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
