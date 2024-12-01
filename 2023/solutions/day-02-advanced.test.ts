import { test, expect, describe } from "bun:test";
import { parse } from "url";

type CubeConfiguration = {
	red: number;
	green: number;
	blue: number;
};

const parseData = (
	s: string
): { type: "red" | "green" | "blue"; count: number } => {
	const values = s.split(" ");

	return {
		type: values[1] as any,
		count: parseInt(values[0]),
	};
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	let result = 0;

	for (let line of lines) {
		const data = line.substring(line.indexOf(":") + 2);
		const gameRecords = data.split("; ");
		const minimalCubeConfigurationData: CubeConfiguration = {
			red: Number.MIN_SAFE_INTEGER,
			green: Number.MIN_SAFE_INTEGER,
			blue: Number.MIN_SAFE_INTEGER,
		};

		for (const game of gameRecords) {
			const cubeCountData = game.split(", ");
			for (const data of cubeCountData) {
				const parsedInfo = parseData(data);

				if (
					minimalCubeConfigurationData[parsedInfo.type] <
					parsedInfo.count
				) {
					minimalCubeConfigurationData[parsedInfo.type] =
						parsedInfo.count;
				}
			}
		}

		result +=
			minimalCubeConfigurationData.red *
			minimalCubeConfigurationData.green *
			minimalCubeConfigurationData.blue;
	}

	return result;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-02-base-01.txt",
		output: 2286,
	},
	{
		input: "./input/day-02-base-02.txt",
		output: 76008,
	},
];

describe("advent-of-code-2023 #2", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
