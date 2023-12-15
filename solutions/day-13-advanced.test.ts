import { test, expect, describe } from "bun:test";

const compareLines = (a: string, b: string): boolean | number => {
	if (a.length != b.length) return false;
	let errorIndex = -1;

	for (let index = 0; index < a.length; index++) {
		if (a[index] !== b[index]) {
			if (errorIndex === -1) {
				errorIndex = index;
			} else {
				// two errors, return false
				return false;
			}
		}
	}

	return errorIndex === -1 ? true : errorIndex;
};

const findIndex = (data: string[], reverse = false): number => {
	if (reverse) data.reverse();
	const possibleSolutions: number[] = [];
	const errors: number[] = [];

	for (let index = 0; index < data.length - 1; index++) {
		let leftIndex = index;
		let rightIndex = data.length - 1;
		let allowedErrorIndex = -1;

		while (true) {
			if (leftIndex === rightIndex) {
				break;
			}

			const linesStatus = compareLines(data[leftIndex], data[rightIndex]);
			if (linesStatus === false) break;

			if (linesStatus !== true) {
				if (allowedErrorIndex !== -1 && linesStatus !== allowedErrorIndex) break;

				allowedErrorIndex = linesStatus;
			}

			if (leftIndex + 1 === rightIndex) {
				if (allowedErrorIndex === -1) break;
				if (reverse) {
					possibleSolutions.push(data.length - rightIndex);
				} else {
					possibleSolutions.push(rightIndex);
				}
				break;
			}

			leftIndex++;
			rightIndex--;
		}
	}

	if (possibleSolutions.length > 0) {
		return possibleSolutions[0];
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
		sum += value;
	}

	return sum;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-13-advanced-01.txt",
		output: 400,
	},
	{
		input: "./input/day-13-advanced-02.txt",
		output: 31108,
	},
];

describe("advent-of-code-2023 #13", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
