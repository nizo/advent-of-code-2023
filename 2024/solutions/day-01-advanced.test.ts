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

	const occurrences = arr2.reduce(
		(acc, item) => {
			if (acc[item]) {
				acc[item]++;
			} else {
				acc[item] = 1;
			}

			return acc;
		},
		{} as {
			[key in number]: number;
		}
	);

	for (let i = 0; i < arr1.length; i++) {
		if (!occurrences[arr1[i]]) continue;

		result += arr1[i] * occurrences[arr1[i]];
	}

	return result;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "2024/input/day-01-base-01.txt",
		output: 31,
	},
	{
		input: "2024/input/day-01-base-02.txt",
		output: 18934359,
	},
];

describe("advent-of-code-2024 #2", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
