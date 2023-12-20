import { test, expect, describe } from "bun:test";

const cache = new Map<string, number>();

const getVariations = (line: string, groups: number[]): number => {
	const key = line + groups.join("-");
	if (cache.has(key)) return cache.get(key)!;

	if (line === "") {
		return groups.length !== 0 ? 0 : 1;
	}

	if (groups.length === 0) {
		return line.includes("#") ? 0 : 1;
	}

	if (groups[0] > line.length) return 0;

	let result = 0;

	const character = line[0];

	if ([".", "?"].includes(character)) {
		result += getVariations(line.substring(1), groups);
	}

	if (["#", "?"].includes(character)) {
		const substring = line.substring(0, groups[0]);

		if (!substring.includes(".") && (groups[0] === line.length || line.substring(groups[0], groups[0] + 1) != "#")) {
			result += getVariations(line.substring(groups[0] + 1), groups.slice(1));
		}
	}

	cache.set(key, result);
	return result;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");

	let sum = 0;

	for (let line of lines) {
		let [inputBase, groupsBase] = line.split(" ");
		let input = "";
		let groups = "";

		if (groupsBase === undefined) {
			continue;
		}

		for (let i = 0; i <= 4; i++) {
			const inputSeparator = i === 4 ? "" : "?";
			const groupsSeparator = i === 4 ? "" : ",";
			input += inputBase + inputSeparator;
			groups += groupsBase + groupsSeparator;
		}

		sum += getVariations(
			input,
			groups.split(",").map((item) => parseInt(item))
		);
	}

	return sum;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-12-base-01.txt",
		output: 525152,
	},
	{
		input: "./input/day-12-base-02.txt",
		output: 128741994134728,
	},
];

describe("advent-of-code-2023 #12", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
