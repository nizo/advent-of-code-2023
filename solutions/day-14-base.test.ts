import { test, expect, describe } from "bun:test";

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();

	const lines = text.split("\n");
	let resultGrid: string[] = [];
	let result = 0;

	for (let x = 0; x < lines[0].length; x++) {
		resultGrid.push("");

		for (let y = 0; y < lines.length; y++) {
			const character = lines[y][x];

			if (character === "#") {
				const repeatCount = Math.max(y - resultGrid[x].length, 0);
				resultGrid[x] = resultGrid[x] + ".".repeat(repeatCount) + "#";
				continue;
			}

			if (character === ".") continue;

			resultGrid[x] += character;
		}
	}

	for (let y = 0; y < lines[0].length; y++) {
		for (let x = 0; x < lines.length; x++) {
			if (resultGrid[y][x] === "O") result += lines.length - x;
		}
	}

	return result;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-14-base-01.txt",
		output: 136,
	},
	{
		input: "./input/day-14-base-02.txt",
		output: 110821,
	},
];

describe("advent-of-code-2023 #14", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
