import { test, expect, describe } from "bun:test";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

type Direction = "up" | "right" | "down" | "left";
type Path = {
	[yIndex: number]: {
		[xIndex: number]: number;
	};
};

type vertex = [number, number];
let map: string[][] = [];

const getInnerArea = (vertices: vertex[]): number => {
	let area = 0;

	// https://en.wikipedia.org/wiki/Shoelace_formula
	const length = vertices.length;
	let sum1 = 0;
	let sum2 = 0;

	for (let i = 0; i < length - 1; i++) {
		sum1 = sum1 + vertices[i][0] * vertices[i + 1][1];
		sum2 = sum2 + vertices[i][1] * vertices[i + 1][0];
	}

	sum1 = sum1 + vertices[length - 1][0] * vertices[0][1];
	sum2 = sum2 + vertices[0][0] * vertices[length - 1][1];

	area = Math.abs(sum1 - sum2) / 2;

	// https://en.wikipedia.org/wiki/Pick%27s_theorem
	return area + 1 - vertices.length / 2;
};

const getNodes = (x: number, y: number, direction: Direction, nodes: Path, vertices: vertex[]): vertex[] | null => {
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
		vertices.push([x, y]);
		return vertices;
	}

	if (!nodes[y]) nodes[y] = {};
	{
		nodes[y][x] = 1;
		vertices.push([x, y]);
	}

	if (currentSign === "|") {
		if (direction === "up") return getNodes(x, y - 1, "up", nodes, vertices);
		if (direction === "down") return getNodes(x, y + 1, "down", nodes, vertices);
	}

	if (currentSign === "-") {
		if (direction === "right") return getNodes(x + 1, y, "right", nodes, vertices);
		if (direction === "left") return getNodes(x - 1, y, "left", nodes, vertices);
	}

	if (currentSign === "L") {
		if (direction === "left") return getNodes(x, y - 1, "up", nodes, vertices);
		if (direction === "down") return getNodes(x + 1, y, "right", nodes, vertices);
	}

	if (currentSign === "J") {
		if (direction === "right") return getNodes(x, y - 1, "up", nodes, vertices);
		if (direction === "down") return getNodes(x - 1, y, "left", nodes, vertices);
	}

	if (currentSign === "7") {
		if (direction === "up") return getNodes(x - 1, y, "left", nodes, vertices);
		if (direction === "right") return getNodes(x, y + 1, "down", nodes, vertices);
	}

	if (currentSign === "F") {
		if (direction === "up") return getNodes(x + 1, y, "right", nodes, vertices);
		if (direction === "left") return getNodes(x, y + 1, "down", nodes, vertices);
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

	let result: vertex[] | null = null;

	result = getNodes(position[1], position[0] + 1, "down", {}, []);
	if (result !== null) {
		return getInnerArea(result);
	}

	result = getNodes(position[1], position[0] - 1, "up", {}, []);
	if (result !== null) {
		return getInnerArea(result);
	}

	result = getNodes(position[1] - 1, position[0], "left", {}, []);
	if (result !== null) {
		return getInnerArea(result);
	}

	result = getNodes(position[1] + 1, position[0], "right", {}, []);
	if (result !== null) {
		return getInnerArea(result);
	}

	throw "no such cycle exists";
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-10-advanced-01a.txt",
		output: 4,
	},
	{
		input: "./input/day-10-advanced-01b.txt",
		output: 4,
	},
	{
		input: "./input/day-10-advanced-02.txt",
		output: 8,
	},
	{
		input: "./input/day-10-advanced-03.txt",
		output: 10,
	},
	{
		input: "./input/day-10-advanced-04.txt",
		output: 525,
	},
];

describe("advent-of-code-2023 #10", () => {
	test.each(testCases)("", async (item) => {
		map = [];
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
