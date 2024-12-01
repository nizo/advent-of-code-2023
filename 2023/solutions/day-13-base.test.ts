import { test, expect, describe } from "bun:test";

const findIndex = (data: string[], reverse = false): number => {
	if (reverse) data.reverse();

	for (let index = 0; index < data.length - 1; index++) {
		let leftIndex = index;
		let rightIndex = data.length - 1;

		while (true) {
			if (leftIndex === rightIndex) {
				// error
				break;
			}
			if (data[leftIndex] !== data[rightIndex]) break;
			if (leftIndex + 1 === rightIndex) {
				if (reverse) {
					return data.length - rightIndex;
				}
				return rightIndex;
			}

			leftIndex++;
			rightIndex--;
		}
	}

	return 0;
};

const getPatternValue = (data: string[]): number => {
	const transposedData: string[] = [];

	for (let i = 0; i < data[0].length; i++) {
		const line = data.map((item) => {
			return item[i];
		});

		transposedData.push(line.join(""));
	}

	const horizontalReflectionIndex1 = findIndex(data);
	const horizontalReflectionIndex2 = findIndex(data, true);

	const verticalReflectionIndex1 = findIndex(transposedData);
	const verticalReflectionIndex2 = findIndex(transposedData, true);

	const horizontalReflectionIndex = Math.max(horizontalReflectionIndex1, horizontalReflectionIndex2);
	const verticalReflectionIndex = Math.max(verticalReflectionIndex1, verticalReflectionIndex2);

	if (verticalReflectionIndex === 0) return horizontalReflectionIndex * 100;

	return verticalReflectionIndex;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const patterns = text.split("\n\n");
	let sum = 0;

	for (let pattern of patterns) {
		const value = getPatternValue(pattern.split("\n"));
		console.log(value);
		console.log();
		console.log();
		sum += value;
	}

	return sum;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-13-base-01.txt",
		output: 405,
	},
	{
		input: "./input/day-13-base-02.txt",
		output: 7718,
	},
];

describe("advent-of-code-2023 #13", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
