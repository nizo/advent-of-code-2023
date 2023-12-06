import { test, expect, describe } from "bun:test";

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	const extractNumbersRegexp = /\d+/g;

	const times = Array.from(lines[0].replaceAll(" ", "").match(extractNumbersRegexp)!);
	const distances = Array.from(lines[1].replaceAll(" ", "").match(extractNumbersRegexp)!);

	const racesInfo = times.map((item, i) => ({
		time: parseInt(item),
		distance: parseInt(distances[i]),
	}));

	const waysToBeat: number[] = [];

	for (const raceInfo of racesInfo) {
		let acceleratingPeriod = 0;
		let winningRangeStart = 0;
		let winningRangeEnd = 0;

		while (true) {
			const currentTime = acceleratingPeriod + raceInfo.distance / acceleratingPeriod;
			if (currentTime < raceInfo.time) {
				winningRangeStart = acceleratingPeriod;
				break;
			}

			acceleratingPeriod++;
		}

		acceleratingPeriod = raceInfo.time;

		while (true) {
			if (acceleratingPeriod < 0) break;

			const currentTime = acceleratingPeriod + raceInfo.distance / acceleratingPeriod;
			if (currentTime < raceInfo.time) {
				winningRangeEnd = acceleratingPeriod;
				break;
			}

			acceleratingPeriod--;
		}

		waysToBeat.push(winningRangeEnd - winningRangeStart + 1);
	}

	return waysToBeat.reduce((acc, item) => acc * item, 1);
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-06-base-01.txt",
		output: 71503,
	},
	{
		input: "./input/day-06-base-02.txt",
		output: 24655068,
	},
];

describe("advent-of-code-2023 #6", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
