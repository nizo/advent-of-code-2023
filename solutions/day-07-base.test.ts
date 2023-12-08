import { test, expect, describe } from "bun:test";

type HandType = "FiveOfAKind" | "FourOfAKind" | "FullHouse" | "ThreeOfAKind" | "TwoPair" | "OnePair" | "HighCard";

type Hand = {
	cards: number[];
	bet: number;
};

const getHandType = (cards: number[]): HandType => {
	const cardsCount: {
		[key: number]: number;
	} = {};

	for (let i = 0; i < cards.length; i++) {
		if (!cardsCount[cards[i]]) {
			cardsCount[cards[i]] = 1;
		} else {
			cardsCount[cards[i]]++;
		}
	}

	const keys = Object.keys(cardsCount);
	const keysCount = keys.length;
	const maxOccurrence = Math.max(...Object.values(cardsCount));

	if (keysCount === 1) return "FiveOfAKind";
	if (keysCount === 5) return "HighCard";
	if (keysCount === 4) return "OnePair";
	if (keysCount === 2 && maxOccurrence === 4) {
		return "FourOfAKind";
	}

	if (keysCount === 2) return "FullHouse";
	if (maxOccurrence === 3) return "ThreeOfAKind";

	return "TwoPair";
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");

	const handsCollections: {
		[key in HandType]: Hand[];
	} = {
		FiveOfAKind: [],
		FourOfAKind: [],
		FullHouse: [],
		ThreeOfAKind: [],
		TwoPair: [],
		OnePair: [],
		HighCard: [],
	};

	for (const line of lines) {
		const bet = parseInt(line.split(" ")[1]);
		if (!bet) continue;

		const cards = line
			.split(" ")[0]
			.split("")
			.map((item) => {
				if (item === "T") return 10;
				if (item === "J") return 11;
				if (item === "Q") return 12;
				if (item === "K") return 13;
				if (item === "A") return 14;

				return parseInt(item);
			});

		handsCollections[getHandType(cards)].push({
			cards: cards,
			bet: bet,
		});
	}

	const handTypes = Object.keys(handsCollections);

	for (const key of handTypes) {
		handsCollections[key as HandType].sort((a, b) => {
			for (let i = 0; i < a.cards.length; i++) {
				if (a.cards[i] > b.cards[i]) return 1;
				if (a.cards[i] < b.cards[i]) return -1;
			}

			return 0;
		});
	}

	const result = [
		...handsCollections["HighCard"],
		...handsCollections["OnePair"],
		...handsCollections["TwoPair"],
		...handsCollections["ThreeOfAKind"],
		...handsCollections["FullHouse"],
		...handsCollections["FourOfAKind"],
		...handsCollections["FiveOfAKind"],
	];

	const sum = result.reduce((acc, item, i) => {
		return acc + item.bet * (i + 1);
	}, 0);

	return sum;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-07-base-01.txt",
		output: 6440,
	},
	{
		input: "./input/day-07-base-02.txt",
		output: 6592,
	},
	{
		input: "./input/day-07-base-03.txt",
		output: 250474325,
	},
];

describe("advent-of-code-2023 #7", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
