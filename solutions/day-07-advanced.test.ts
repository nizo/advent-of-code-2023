import { test, expect, describe } from "bun:test";
import fs from "fs";

enum HandTypeEnum {
	"FiveOfAKind",
	"FourOfAKind",
	"FullHouse",
	"ThreeOfAKind",
	"TwoPair",
	"OnePair",
	"HighCard",
}

type Hand = {
	cards: number[];
	bet: number;
};

const jokerValue = 0;

const getHandType = (cards: number[]): HandTypeEnum => {
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

	const jokerCount = cardsCount[jokerValue] ?? 0;
	const keys = Object.keys(cardsCount);
	const keysCount = keys.length;
	const maxOccurrence = Math.max(...Object.values(cardsCount));

	if (jokerCount > 0) {
		let bestHand: HandTypeEnum = jokerCount === 5 ? HandTypeEnum.FiveOfAKind : HandTypeEnum.HighCard;

		for (let i = 0; i < cards.length; i++) {
			if (cards[i] === jokerValue) continue;

			const currentHand = getHandType(cards.map((item) => (item == jokerValue ? cards[i] : item)));
			if (currentHand < bestHand) {
				bestHand = currentHand;
			}
		}
		return bestHand;
	}

	if (keysCount === 1) return HandTypeEnum.FiveOfAKind;
	if (keysCount === 5) return HandTypeEnum.HighCard;
	if (keysCount === 4) return HandTypeEnum.OnePair;
	if (keysCount === 2 && maxOccurrence === 4) {
		return HandTypeEnum.FourOfAKind;
	}

	if (keysCount === 2) return HandTypeEnum.FullHouse;
	if (maxOccurrence === 3) return HandTypeEnum.ThreeOfAKind;

	return HandTypeEnum.TwoPair;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");

	const handsCollections: {
		[key in HandTypeEnum]: Hand[];
	} = {
		[HandTypeEnum.FiveOfAKind]: [],
		[HandTypeEnum.FourOfAKind]: [],
		[HandTypeEnum.FullHouse]: [],
		[HandTypeEnum.ThreeOfAKind]: [],
		[HandTypeEnum.TwoPair]: [],
		[HandTypeEnum.OnePair]: [],
		[HandTypeEnum.HighCard]: [],
	};

	for (const line of lines) {
		const bet = parseInt(line.split(" ")[1]);
		if (!bet) continue;

		const cards = line
			.split(" ")[0]
			.split("")
			.map((item) => {
				if (item === "T") return 10;
				if (item === "Q") return 12;
				if (item === "K") return 13;
				if (item === "A") return 14;
				if (item === "J") return jokerValue;

				return parseInt(item);
			});

		const handType = getHandType(cards);
		handsCollections[handType].push({
			cards: cards,
			bet: bet,
		});
	}

	const handTypes = Object.keys(handsCollections);

	for (const key of handTypes) {
		//@ts-ignore
		handsCollections[key].sort((a, b) => {
			for (let i = 0; i < a.cards.length; i++) {
				if (a.cards[i] > b.cards[i]) return 1;
				if (a.cards[i] < b.cards[i]) return -1;
			}

			console.log("ERROR");
			return 0;
		});
	}

	const result = [
		...handsCollections[HandTypeEnum.HighCard],
		...handsCollections[HandTypeEnum.OnePair],
		...handsCollections[HandTypeEnum.TwoPair],
		...handsCollections[HandTypeEnum.ThreeOfAKind],
		...handsCollections[HandTypeEnum.FullHouse],
		...handsCollections[HandTypeEnum.FourOfAKind],
		...handsCollections[HandTypeEnum.FiveOfAKind],
	];

	const sum = result.reduce((acc, item, i) => {
		return acc + item.bet * (i + 1);
	}, 0);

	fs.writeFile("out.json", JSON.stringify(result), (err) => {
		if (err) {
			console.error(err);
		}
	});

	return sum;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-07-base-01.txt",
		output: 5905,
	},
	{
		input: "./input/day-07-base-02.txt",
		output: 6839,
	},
	{
		input: "./input/day-07-base-03.txt",
		output: 250164088,
	},
];

describe("advent-of-code-2023 #7", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
