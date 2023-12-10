import { test, expect, describe } from "bun:test";

type Direction = "up" | "right" | "down" | "left";
type Path = {
	[yIndex: number]: {
		[xIndex: number]: number;
	};
};

let map: string[][] = [];

const getNodes = (x: number, y: number, direction: Direction, nodes: Path, pathLength: number): number | null => {
	// error cases
	if (x < 0) return null;
	if (y < 0) return null;
	if (x >= map[y].length) return null;
	if (y >= map.length) return null;

	const currentSign = map[y][x];
	if (currentSign === ".") return null;

	// if already visited this path

	if (nodes[y] && nodes[y][x]) {
		console.log("loop, early exit");
		return null;
	}

	// winning node
	if (map[y][x] === "S") return (pathLength + 1) / 2;

	if (!nodes[y]) nodes[y] = {};
	nodes[y][x] = pathLength;

	if (currentSign === "|") {
		if (direction === "up") return getNodes(x, y - 1, "up", nodes, pathLength + 1);
		if (direction === "down") return getNodes(x, y + 1, "down", nodes, pathLength + 1);
	}

	if (currentSign === "-") {
		if (direction === "right") return getNodes(x + 1, y, "right", nodes, pathLength + 1);
		if (direction === "left") return getNodes(x - 1, y, "left", nodes, pathLength + 1);
	}

	if (currentSign === "L") {
		if (direction === "left") return getNodes(x, y - 1, "up", nodes, pathLength + 1);
		if (direction === "down") return getNodes(x + 1, y, "right", nodes, pathLength + 1);
	}

	if (currentSign === "J") {
		if (direction === "right") return getNodes(x, y - 1, "up", nodes, pathLength + 1);
		if (direction === "down") return getNodes(x - 1, y, "left", nodes, pathLength + 1);
	}

	if (currentSign === "7") {
		if (direction === "up") return getNodes(x - 1, y, "left", nodes, pathLength + 1);
		if (direction === "right") return getNodes(x, y + 1, "down", nodes, pathLength + 1);
	}

	if (currentSign === "F") {
		if (direction === "up") return getNodes(x + 1, y, "right", nodes, pathLength + 1);
		if (direction === "left") return getNodes(x, y + 1, "down", nodes, pathLength + 1);
	}

	//throw "this should not happen";

	return null;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");

	let position: [number, number] = [0, 0];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		map.push(line.split(""));

		const startPosition = line.indexOf("S");
		if (startPosition === -1) continue;

		position = [i, startPosition];
	}

	let result: number | null = null;

	result = getNodes(position[1], position[0] + 1, "down", {}, 0);
	if (result !== null) return result;

	result = getNodes(position[1], position[0] - 1, "up", {}, 0);
	if (result !== null) return result;

	result = getNodes(position[1] - 1, position[0], "left", {}, 0);
	if (result !== null) return result;

	result = getNodes(position[1] + 1, position[0], "right", {}, 0);
	if (result !== null) return result;

	throw "no such cycle exists";
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-10-base-01.txt",
		output: 4,
	},
	{
		input: "./input/day-10-base-02.txt",
		output: 8,
	},
	{
		input: "./input/day-10-base-03.txt",
		output: 6690,
	},
];

describe("advent-of-code-2023 #10", () => {
	test.each(testCases)("", async (item) => {
		map = [];
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
