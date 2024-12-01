import { test, expect, describe } from "bun:test";

const getHash = (s: string): number => {
	let runningValue = 0;

	for (let i = 0; i < s.length; i++) {
		runningValue += s[i].charCodeAt(0);
		runningValue = (runningValue * 17) % 256;
	}

	return runningValue;
};

type Lens = {
	label: string;
	focalLength: number;
};

type System = {
	[key in number]: Lens[];
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const system: System = {};

	const instructions = text.split(",");

	for (let instruction of instructions) {
		const add = instruction.includes("=");
		const separator = add ? "=" : "-";

		const [label, rest] = instruction.split(separator);
		const boxNumber = getHash(label);

		if (!system[boxNumber]) system[boxNumber] = [];

		if (add) {
			const focalLength = parseInt(rest);

			const lensIndex = system[boxNumber].findIndex((item) => item.label === label);
			if (lensIndex === -1) {
				system[boxNumber].push({
					label: label,
					focalLength: focalLength,
				});
			} else {
				system[boxNumber][lensIndex] = {
					label: label,
					focalLength: focalLength,
				};
			}
		} else {
			system[boxNumber] = system[boxNumber].filter((item) => item.label !== label);
		}
	}

	return Object.keys(system).reduce((acc, item) => {
		const boxIndex = parseInt(item);
		const box = system[boxIndex];
		let value = 0;

		for (let i = 0; i < box.length; i++) {
			value += (boxIndex + 1) * (i + 1) * box[i].focalLength;
		}

		return acc + value;
	}, 0);
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-15-base-01.txt",
		output: 145,
	},
	{
		input: "./input/day-15-base-02.txt",
		output: 279470,
	},
];

describe("advent-of-code-2023 #15", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
