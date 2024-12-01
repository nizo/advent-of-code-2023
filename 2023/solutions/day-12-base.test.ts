import { test, expect, describe } from "bun:test";

const getVariations = (line: string): string => {
	if (line === "") return "";

	const index = line.indexOf("?");
	if (index == -1) return line;

	const variationA = line.substring(0, index) + "." + line.substring(index + 1);
	const variationB = line.substring(0, index) + "#" + line.substring(index + 1);
	return getVariations(variationA) + "," + getVariations(variationB);
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");

	let variations = "";
	let validVariationsCount = 0;

	for (let line of lines) {
		const [input, groups] = line.split(" ");

		if (groups === undefined) {
			continue;
		}

		variations = getVariations(input);

		let variationsArray = variations.split(",");
		const groupsArray = groups.split(",").map((item) => parseInt(item));

		for (let variation of variationsArray) {
			const data = variation.split(".").filter((item) => item !== "");
			if (data.length !== groupsArray.length) continue;

			let valid = true;
			for (let i = 0; i < groupsArray.length; i++) {
				if (groupsArray[i] !== data[i].length) {
					valid = false;
					break;
				}
			}
			if (valid) validVariationsCount++;
		}
	}

	return validVariationsCount;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-12-base-01.txt",
		output: 10,
	},
	{
		input: "./input/day-12-base-02.txt",
		output: 7718,
	},
];

describe("advent-of-code-2023 #12", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
