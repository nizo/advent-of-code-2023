import { test, expect, describe } from "bun:test";

type TransformMap = {
	destinationStart: number;
	sourceStart: number;
	range: number;
};

const extractTransformMap = (lines: string[], sectionId: string): TransformMap[] => {
	let maps: TransformMap[] = [];
	let reading = false;
	const extractNumbersRegexp = /\d+/g;

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

	maps.sort((a, b) => a.sourceStart - b.sourceStart);

	return maps;
};

const transformId = (id: number, transformMaps: TransformMap[]): number => {
	for (const map of transformMaps) {
		if (id >= map.sourceStart && id < map.sourceStart + map.range) {
			return map.destinationStart - map.sourceStart + id;
		}
	}
	return id;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const lines = text.split("\n");
	let minimum = Number.MAX_SAFE_INTEGER;
	const extractNumbersRegexp = /\d+/g;

	const seedToSoilMap = extractTransformMap(lines, "seed-to-soil map:");
	const soilToFertilizerMap = extractTransformMap(lines, "soil-to-fertilizer map:");
	const fertilizerToWaterMap = extractTransformMap(lines, "fertilizer-to-water map:");
	const waterToLightMap = extractTransformMap(lines, "water-to-light map:");
	const lightToTemperatureMap = extractTransformMap(lines, "light-to-temperature map:");
	const temperatureToHumidityMap = extractTransformMap(lines, "temperature-to-humidity map:");
	const humidityToLocationMap = extractTransformMap(lines, "humidity-to-location map:");

	const seedsIds: number[] = lines[0].match(extractNumbersRegexp)!.map((item) => parseInt(item));

	for (const seedId of seedsIds) {
		const soilId = transformId(seedId, seedToSoilMap);
		const fertilizerId = transformId(soilId, soilToFertilizerMap);
		const waterId = transformId(fertilizerId, fertilizerToWaterMap);
		const lightId = transformId(waterId, waterToLightMap);
		const temperatureId = transformId(lightId, lightToTemperatureMap);
		const humidityId = transformId(temperatureId, temperatureToHumidityMap);
		const locationId = transformId(humidityId, humidityToLocationMap);

		minimum = Math.min(locationId, minimum);
	}

	return minimum;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-05-base-01.txt",
		output: 35,
	},
	{
		input: "./input/day-05-base-02.txt",
		output: 282277027,
	},
];

describe("advent-of-code-2023 #5", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
