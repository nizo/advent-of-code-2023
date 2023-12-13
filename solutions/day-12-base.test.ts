import { test, expect, describe } from "bun:test";

const getArrangementsCount = (line: string, groups: number[]): number => {
	if (line === "") return 0;

	let index = 0;

	while (index < line.length - 1) {
		if (line[index] === ".") index++;
	}

	if (line.substring(0, groups[0]).includes(".")) {
		return 0;
	}

	//return getArrangementsCount();
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");

	let arrangementsCount = 0;

	for (let line of lines) {
		const [input, groups] = line.split(" ");

		if (groups === undefined) {
			arrangementsCount++;
			continue;
		}

		arrangementsCount += getArrangementsCount(
			input,
			groups.split(",").map((item) => parseInt(item))
		);
	}

	return 0;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-12-base-01.txt",
		output: 374,
	},
	// {
	// 	input: "./input/day-12-base-02.txt",
	// 	output: 9795148,
	// },
];

describe("advent-of-code-2023 #12", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
