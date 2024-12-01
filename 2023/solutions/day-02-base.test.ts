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

async function solution(
	file: string,
	configuration: CubeConfiguration
): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	let result = 0;

	for (let line of lines) {
		const gameId = line
			.substring(0, line.indexOf(":"))
			.split(" ")[1]
			.replaceAll(" ", "");
		const data = line.substring(line.indexOf(":") + 2);
		const gameRecords = data.split("; ");

		let gamePossible = true;
		loop1: for (const game of gameRecords) {
			const cubeCountData = game.split(", ");
			loop2: for (const data of cubeCountData) {
				const parsedInfo = parseData(data);
				if (configuration[parsedInfo.type] < parsedInfo.count) {
					gamePossible = false;
					break loop1;
				}
			}
		}

		if (gamePossible) {
			result += parseInt(gameId);
		}
	}

	return result;
}

const testCases: Array<{
	input: [string, CubeConfiguration];
	output: number;
}> = [
	{
		input: ["./input/day-02-base-01.txt", { red: 12, green: 13, blue: 14 }],
		output: 8,
	},
	{
		input: ["./input/day-02-base-02.txt", { red: 12, green: 13, blue: 14 }],
		output: 2348,
	},
];

describe("advent-of-code-2023 #1", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input[0], item.input[1]);
		expect(result).toEqual(item.output);
	});
});
