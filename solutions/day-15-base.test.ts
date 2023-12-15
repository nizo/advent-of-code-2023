import { test, expect, describe } from "bun:test";

const getHashValue = (s: string): number => {
	let runningValue = 0;

	for (let i = 0; i < s.length; i++) {
		runningValue += s[i].charCodeAt(0);
		runningValue = (runningValue * 17) % 256;
	}

	return runningValue;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();

	return text.split(",").reduce((acc, item) => acc + getHashValue(item), 0);
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-15-base-01.txt",
		output: 1320,
	},
	{
		input: "./input/day-15-base-02.txt",
		output: 514639,
	},
];

describe("advent-of-code-2023 #15", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
