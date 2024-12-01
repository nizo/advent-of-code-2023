import { test, expect, describe } from "bun:test";
import { setConstantValue } from "typescript";

type TransformMap = {
	destinationStart: number;
	sourceStart: number;
	range: number;
};

const extractNumbersRegexp = /\d+/g;

const extractTransformMap = (lines: string[], sectionId: string): TransformMap[] => {
	let maps: TransformMap[] = [];
	let reading = false;

	for (const line of lines) {
		if (line === sectionId) {
			reading = true;
			continue;
		}

		if (line === "") {
			reading = false;
		}

		if (reading) {
			const transformNumbers = line.match(extractNumbersRegexp);

			maps.push({
				destinationStart: parseInt(transformNumbers![0]),
				sourceStart: parseInt(transformNumbers![1]),
				range: parseInt(transformNumbers![2]),
			});
		}
	}

	return maps;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	let seedsData = Array.from(lines[0].match(extractNumbersRegexp)!);
	let seedIdsRanges: [number, number][] = [];

	let blocks: TransformMap[][] = [
		extractTransformMap(lines, "seed-to-soil map:"),
		extractTransformMap(lines, "soil-to-fertilizer map:"),
		extractTransformMap(lines, "fertilizer-to-water map:"),
		extractTransformMap(lines, "water-to-light map:"),
		extractTransformMap(lines, "light-to-temperature map:"),
		extractTransformMap(lines, "temperature-to-humidity map:"),
		extractTransformMap(lines, "humidity-to-location map:"),
	];

	for (let i = 0; i < seedsData?.length - 1; i += 2) {
		seedIdsRanges.push([parseInt(seedsData[i]), parseInt(seedsData[i]) + parseInt(seedsData[i + 1])]);
	}

	for (let block of blocks) {
		let newSeedsRanges: [number, number][] = [];

		while (seedIdsRanges.length > 0) {
			const [rangeStart, rangeEnd] = seedIdsRanges.pop()!;

			let rangeDivided = false;

			for (let i = 0; i < block.length; i++) {
				const sourceStart = block[i].sourceStart;
				const destinationStart = block[i].destinationStart;
				const range = block[i].range;

				const overlapStart = Math.max(sourceStart, rangeStart);

				const overlapEnd = Math.min(sourceStart + range, rangeEnd);

				if (overlapStart < overlapEnd) {
					newSeedsRanges.push([overlapStart - sourceStart + destinationStart, overlapEnd - sourceStart + destinationStart]);
					rangeDivided = true;

					if (overlapStart > rangeStart) {
						seedIdsRanges.push([rangeStart, overlapStart]);
					}
					if (rangeEnd > overlapEnd) {
						seedIdsRanges.push([overlapEnd, rangeEnd]);
					}

					break;
				}
			}

			if (!rangeDivided) {
				newSeedsRanges.push([rangeStart, rangeEnd]);
			}
		}

		seedIdsRanges = newSeedsRanges;
	}

	return Math.min(...seedIdsRanges.map((item) => item[0]));
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-05-base-01.txt",
		output: 46,
	},
	{
		input: "./input/day-05-base-02.txt",
		output: 11554135,
	},
];

describe("advent-of-code-2023 #5", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
