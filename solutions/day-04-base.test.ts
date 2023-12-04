import { test, expect, describe } from "bun:test";

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	const extractNumbersRegexp = /\d+/g;
	let result = 0;

	for (const line of lines) {
		const cardsData = line.substring(line.indexOf(":") + 1);
		const winningCards = cardsData.substring(0, cardsData.indexOf("|")).match(extractNumbersRegexp);
		const playerCards = cardsData.substring(cardsData.indexOf("|") + 1).match(extractNumbersRegexp);
		let currentGameWinningCards = 0;

		if (!playerCards || !winningCards) continue;

		for (const card of playerCards) {
			if (winningCards.includes(card)) currentGameWinningCards++;
		}

		if (currentGameWinningCards !== 0) {
			result += Math.pow(2, currentGameWinningCards - 1);
		}
	}

	return result;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-04-base-01.txt",
		output: 13,
	},
	{
		input: "./input/day-04-base-02.txt",
		output: 26426,
	},
];

describe("advent-of-code-2023 #3", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
