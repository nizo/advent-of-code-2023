import { test, expect, describe } from "bun:test";

type Direction = "left" | "right" | "top" | "bottom";
type Cell = {
	top: boolean;
	bottom: boolean;
	right: boolean;
	left: boolean;
};

type Beam = {
	x: number;
	y: number;
	direction: Direction;
	terminated: boolean;
};

const resetEnergizedMap = (map: Cell[][]): Cell[][] => {
	for (let i = 0; i < map[0].length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			map[i][j].top = false;
			map[i][j].bottom = false;
			map[i][j].right = false;
			map[i][j].left = false;
		}
	}
	return map;
};

const getEnergizedBeamsCount = (energizedMap: Cell[][], beams: Beam[], map: string[]): number => {
	while (true) {
		beams = beams.filter((item) => !item.terminated);
		const newBeams: Beam[] = [];
		if (beams.length === 0) break;

		for (const beam of beams) {
			if (beam.x < 0 || beam.x >= map[0].length || beam.y < 0 || beam.y >= map.length) {
				beam.terminated = true;
				continue;
			}

			if (beam.direction === "top") {
				if (energizedMap[beam.y][beam.x].top) {
					beam.terminated = true;
					continue;
				}

				energizedMap[beam.y][beam.x].top = true;
			}

			if (beam.direction === "bottom") {
				if (energizedMap[beam.y][beam.x].bottom) {
					beam.terminated = true;
					continue;
				}

				energizedMap[beam.y][beam.x].bottom = true;
			}

			if (beam.direction === "right") {
				if (energizedMap[beam.y][beam.x].right) {
					beam.terminated = true;
					continue;
				}

				energizedMap[beam.y][beam.x].right = true;
			}

			if (beam.direction === "left") {
				if (energizedMap[beam.y][beam.x].left) {
					beam.terminated = true;
					continue;
				}

				energizedMap[beam.y][beam.x].left = true;
			}

			if (map[beam.y][beam.x] === "/") {
				let direction: Direction = "left";

				if (beam.direction === "left") direction = "bottom";
				if (beam.direction === "right") direction = "top";
				if (beam.direction === "top") direction = "right";
				if (beam.direction === "bottom") direction = "left";

				beam.direction = direction;
			}

			if (map[beam.y][beam.x] === "\\") {
				let direction: Direction = "left";

				if (beam.direction === "left") direction = "top";
				if (beam.direction === "right") direction = "bottom";
				if (beam.direction === "top") direction = "left";
				if (beam.direction === "bottom") direction = "right";

				beam.direction = direction;
			}

			if (map[beam.y][beam.x] === "-" && beam.direction !== "right" && beam.direction !== "left") {
				beam.terminated = true;

				newBeams.push({
					x: beam.x - 1,
					y: beam.y,
					direction: "left",
					terminated: false,
				});

				newBeams.push({
					x: beam.x + 1,
					y: beam.y,
					direction: "right",
					terminated: false,
				});
			}

			if (map[beam.y][beam.x] === "|" && beam.direction !== "top" && beam.direction !== "bottom") {
				beam.terminated = true;

				newBeams.push({
					x: beam.x,
					y: beam.y - 1,
					direction: "top",
					terminated: false,
				});

				newBeams.push({
					x: beam.x,
					y: beam.y + 1,
					direction: "bottom",
					terminated: false,
				});
			}

			if (beam.direction === "left") beam.x--;
			if (beam.direction === "right") beam.x++;
			if (beam.direction === "top") beam.y--;
			if (beam.direction === "bottom") beam.y++;
		}

		beams.push(...newBeams);
	}

	let sum = 0;

	for (let i = 0; i < energizedMap.length; i++) {
		let newline = "";
		for (let j = 0; j < energizedMap[i].length; j++) {
			if (energizedMap[i][j].top || energizedMap[i][j].bottom || energizedMap[i][j].right || energizedMap[i][j].left) {
				sum++;
			}
		}
	}
	return sum;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const map: string[] = [];

	let energizedMap: Cell[][] = [];
	let beams: Beam[] = [];
	let maxBeamsCount = 0;

	for (const line of text.split("\n")) {
		map.push(line);

		const energizedLine: Cell[] = new Array(line.length).fill("").map((item) => ({
			top: false,
			bottom: false,
			right: false,
			left: false,
		}));

		energizedMap.push(energizedLine);
	}

	const initialBeams: Beam[] = [];
	for (let i = 0; i < map.length; i++) {
		initialBeams.push({
			direction: "right",
			x: 0,
			y: i,
			terminated: false,
		});

		initialBeams.push({
			direction: "left",
			x: map[0].length - 1,
			y: i,
			terminated: false,
		});
	}

	for (let i = 0; i < map[0].length; i++) {
		initialBeams.push({
			direction: "bottom",
			x: i,
			y: 0,
			terminated: false,
		});

		initialBeams.push({
			direction: "top",
			x: i,
			y: map.length - 1,
			terminated: false,
		});
	}

	for (const scenario of initialBeams) {
		energizedMap = resetEnergizedMap(energizedMap);

		const beamsCount = getEnergizedBeamsCount(energizedMap, [scenario], map);
		maxBeamsCount = Math.max(beamsCount, maxBeamsCount);
	}

	return maxBeamsCount;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-16-base-01.txt",
		output: 51,
	},
	{
		input: "./input/day-16-base-02.txt",
		output: 8239,
	},
];

describe("advent-of-code-2023 #16", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
