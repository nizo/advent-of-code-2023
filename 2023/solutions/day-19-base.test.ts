import { test, expect, describe } from "bun:test";

type Rule = {
	value?: number;
	property?: string;
	operation?: string;
	target: "A" | "R" | string;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	let result = 0;
	const workflows: {
		[key in string]: Rule[];
	} = {};

	const [rawRules, inputData] = text.split("\n\n");

	for (const rawRule of rawRules.split("\n")) {
		let [name, data] = rawRule.split("{");
		data = data.substring(0, data.length - 1);
		let rulesSet: Rule[] = [];

		const rulesSpecs = data.split(",");
		for (const ruleSpec of rulesSpecs) {
			if (!ruleSpec.includes(":")) {
				rulesSet.push({
					target: ruleSpec,
				});
			} else {
				const [specification, target] = ruleSpec.split(":");
				const property = specification.substring(0, 1);
				const operation = specification.substring(1, 2);

				const tmp = specification.substring(2);
				const value = parseInt(tmp);

				rulesSet.push({
					target: target,
					operation: operation,
					value: value,
					property: property,
				});
			}
		}
		workflows[name] = rulesSet;
	}

	for (const input of inputData.split("\n")) {
		const preparedInput = input.replaceAll("{", '{"').replaceAll(",", ',"').replaceAll("=", '"=').replaceAll("=", ":");
		const data = JSON.parse(preparedInput);

		let ruleName = "in";

		while (true) {
			const workflow = workflows[ruleName];
			if (ruleName === "R") break;
			if (ruleName === "A") {
				// @ts-ignore
				result += Object.entries(data).reduce((acc, item) => acc + item[1], 0);
				break;
			}

			for (let i = 0; i < workflow.length; i++) {
				const rule = workflow[i];
				if (rule.operation === "<" && data[rule.property!] < rule.value!) {
					ruleName = rule.target;
					break;
				}

				if (rule.operation === ">" && data[rule.property!] > rule.value!) {
					ruleName = rule.target;
					break;
				}

				if (i === workflow.length - 1) {
					ruleName = rule.target;
				}
			}
		}
	}

	return result;
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-19-base-01.txt",
		output: 19114,
	},
	{
		input: "./input/day-19-base-02.txt",
		output: 353046,
	},
];

describe("advent-of-code-2023 #19", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
