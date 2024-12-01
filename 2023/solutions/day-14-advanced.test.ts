import { test, expect, describe } from "bun:test";

const transpose = (s: string[]): string[] => {
	const result: string[] = [];

	// transpose back
	for (let x = 0; x < s[0].length; x++) {
		result[x] = "";
		for (let y = 0; y < s.length; y++) {
			result[x] += s[y][x];
		}
	}
	return result;
};

const tilt = (map: string[], direction: number): string[] => {
	// 0 === N
	// 1 === W
	// 2 === S
	// 3 === E

	let result: string[] = [];

	if (direction === 0 || direction === 2) {
		map = transpose(map);
	}

	for (let y = 0; y < map.length; y++) {
		if (direction === 3 || direction === 2) {
			map[y] = map[y].split("").reverse().join("");
		}

		result[y] = "";

		for (let x = 0; x < map.length; x++) {
			const character = map[y][x];

			if (character === "#") {
				const repeatCount = Math.max(x - result[y].length, 0);
				result[y] = result[y] + ".".repeat(repeatCount) + "#";
				continue;
			}

			if (character === ".") continue;

			result[y] += character;
		}

		const repeatCount = map[y].length - result[y].length;
		result[y] = result[y] + ".".repeat(repeatCount);

		if (direction === 3 || direction === 2) {
			result[y] = result[y].split("").reverse().join("");
		}
	}

	if (direction === 0 || direction === 2) {
		result = transpose(result);
	}

	return result;
};

const getValue = (s: string[]): number => {
	let result = 0;

	for (let y = 0; y < s[0].length; y++) {
		for (let x = 0; x < s.length; x++) {
			if (s[y][x] === "O") result += s.length - y;
		}
	}

	return result;
};

const findCycle = (
	s: number[]
): {
	cycleStart: number;
	cycleLength: number;
} | null => {
	let slowIndex = 0;
	let fastIndex = 0;

	while (slowIndex < s.length - 1) {
		const slow = s[slowIndex];
		const fast = s[fastIndex];

		if (slow === fast) {
			console.log(slowIndex, slow);
		}

		slowIndex++;
		fastIndex += 2;
	}

	return null;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const tiltCount = 4000;
	const values: number[] = [];

	let map = text.split("\n");
	let direction = 0;

	for (let index = 0; index < tiltCount; index++) {
		map = tilt(map, direction);
		values.push(getValue(map));

		direction = (direction + 1) % 4;
	}

	return getValue(map);
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-14-base-01.txt",
		output: 64,
	},
	{
		input: "./input/day-14-base-02.txt",
		output: 83516,
	},
];

describe("advent-of-code-2023 #14", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
