import { test, expect, describe } from "bun:test";

type Direction = "up" | "right" | "down" | "left";
type Path = {
	[yIndex: number]: {
		[xIndex: number]: number;
	};
};

let map: string[][] = [];

const computeInnerArea = (node: Path): number => {
	let nodesWithinPath = 0;
	const horizontalData: Path = {};
	const verticalData: Path = {};

	for (let y = 0; y < map.length; y++) {
		let crossedBoundaries = 0;
		for (let x = 0; x < map[y].length; x++) {
			const currentItem = map[y][x];
			if (node[y] && node[y][x]) crossedBoundaries++;

			if (currentItem == "." && crossedBoundaries % 2 != 0) {
				if (!horizontalData[y]) horizontalData[y] = {};
				horizontalData[y][x] = 1;
			}
		}
	}

	for (let x = 0; x < map[0].length; x++) {
		let crossedBoundaries = 0;
		for (let y = 0; y < map.length; y++) {
			const currentItem = map[y][x];
			if (node[y] && node[y][x]) crossedBoundaries++;

			if (currentItem == "." && crossedBoundaries % 2 != 0) {
				if (!verticalData[y]) verticalData[y] = {};
				verticalData[y][x] = 1;
			}
		}
	}

	const yKeys = Object.keys(horizontalData);

	for (let yKey of yKeys) {
		const yKeyAsNumber = parseInt(yKey);
		const xKeys = Object.keys(horizontalData[yKeyAsNumber]);
		for (let xKey of xKeys) {
			if (verticalData[yKeyAsNumber] && verticalData[yKeyAsNumber][parseInt(xKey)]) {
				nodesWithinPath++;
				console.log("match", yKeyAsNumber, xKey);
			}
		}
	}

	//console.log("intersection", nodesWithinPath);
	console.log(horizontalData);
	console.log(verticalData);
	return nodesWithinPath;
};

const getNodes = (x: number, y: number, direction: Direction, nodes: Path): Path | null => {
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
	if (map[y][x] === "S") {
		nodes[y][x] = 1;
		return nodes;
	}

	if (!nodes[y]) nodes[y] = {};
	nodes[y][x] = 1;

	if (currentSign === "|") {
		if (direction === "up") return getNodes(x, y - 1, "up", nodes);
		if (direction === "down") return getNodes(x, y + 1, "down", nodes);
	}

	if (currentSign === "-") {
		if (direction === "right") return getNodes(x + 1, y, "right", nodes);
		if (direction === "left") return getNodes(x - 1, y, "left", nodes);
	}

	if (currentSign === "L") {
		if (direction === "left") return getNodes(x, y - 1, "up", nodes);
		if (direction === "down") return getNodes(x + 1, y, "right", nodes);
	}

	if (currentSign === "J") {
		if (direction === "right") return getNodes(x, y - 1, "up", nodes);
		if (direction === "down") return getNodes(x - 1, y, "left", nodes);
	}

	if (currentSign === "7") {
		if (direction === "up") return getNodes(x - 1, y, "left", nodes);
		if (direction === "right") return getNodes(x, y + 1, "down", nodes);
	}

	if (currentSign === "F") {
		if (direction === "up") return getNodes(x + 1, y, "right", nodes);
		if (direction === "left") return getNodes(x, y + 1, "down", nodes);
	}

	return null;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");

	let position: [number, number] = [0, 1];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		map.push(line.split(""));

		const startPosition = line.indexOf("S");
		if (startPosition === -1) continue;

		position = [i, startPosition];
	}

	let result: Path | null = null;

	result = getNodes(position[1], position[0] + 1, "down", {});
	if (result !== null) return computeInnerArea(result);

	result = getNodes(position[1], position[0] - 1, "up", {});
	if (result !== null) return computeInnerArea(result);

	result = getNodes(position[1] - 1, position[0], "left", {});
	if (result !== null) return computeInnerArea(result);

	result = getNodes(position[1] + 1, position[0], "right", {});
	if (result !== null) return computeInnerArea(result);

	throw "no such cycle exists";
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	// {
	// 	input: "./input/day-10-advanced-01a.txt",
	// 	output: 4,
	// },
	// {
	// 	input: "./input/day-10-advanced-01b.txt",
	// 	output: 4,
	// },
	{
		input: "./input/day-10-advanced-02.txt",
		output: 8,
	},
	// {
	// 	input: "./input/day-10-advanced-03.txt",
	// 	output: 6690,
	// },
];

describe("advent-of-code-2023 #10", () => {
	test.each(testCases)("", async (item) => {
		map = [];
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
