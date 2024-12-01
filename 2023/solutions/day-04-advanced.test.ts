import { test, expect, describe } from "bun:test";

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	const extractNumbersRegexp = /\d+/g;
	let totalGamesPlayed = 0;

	let additionalRounds: {
		[key: number]: number;
	} = {};

	for (let lineIndex = 1; lineIndex <= lines.length; lineIndex++) {
		const line = lines[lineIndex - 1];
		const cardsData = line.substring(line.indexOf(":") + 1);
		const winningCards = cardsData.substring(0, cardsData.indexOf("|")).match(extractNumbersRegexp);
		const playerCards = cardsData.substring(cardsData.indexOf("|") + 1).match(extractNumbersRegexp);
		const currentCardIndex = parseInt(line.substring(line.indexOf(" "), line.indexOf(":")).trim());
		let cardIndex = currentCardIndex;

		if (!playerCards || !winningCards) continue;

		if (!additionalRounds.hasOwnProperty(currentCardIndex)) {
			additionalRounds[currentCardIndex] = 1;
		}

		for (const card of playerCards) {
			if (winningCards.includes(card)) {
				cardIndex++;
				if (!additionalRounds.hasOwnProperty(cardIndex)) {
					additionalRounds[cardIndex] = 1;
				}

				additionalRounds[cardIndex] += additionalRounds[currentCardIndex];
			}
		}
	}

	const additionalRoundsKeys = Object.keys(additionalRounds);
	for (const key of additionalRoundsKeys) {
		totalGamesPlayed += additionalRounds[parseInt(key)];
	}

	return totalGamesPlayed;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-04-base-01.txt",
		output: 30,
	},
	{
		input: "./input/day-04-base-02.txt",
		output: 6227972,
	},
];

describe("advent-of-code-2023 #4", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
