import { test, expect, describe } from "bun:test";

type Category = "x" | "m" | "a" | "s";

type Rule = {
	value?: number;
	category?: Category;
	operation?: string;
	target: "A" | "R" | string;
};

type Workflows = Record<string, Rule[]>;

type Variation = {
	[key in Category]: [number, number];
};

const getVariations = (workflows: Workflows, workflowName: string, range: Variation): Variation[] => {
	if (workflowName === "R") return [];
	if (workflowName === "A") return [{ ...range }];

	const rules = workflows[workflowName];

	const ranges: Variation[] = [];
	for (const rule of rules) {
		if (rule.operation === "<") {
			const newRange = {
				...range,
			};

			newRange[rule.category!] = [range[rule.category!][0], rule.value! - 1];
			ranges.push(...getVariations(workflows, rule.target, newRange));

			range[rule.category!] = [rule.value!, range[rule.category!][1]];
		} else if (rule.operation === ">") {
			const newRange = {
				...range,
			};

			newRange[rule.category!] = [rule.value! + 1, range[rule.category!][1]];
			ranges.push(...getVariations(workflows, rule.target, newRange));

			range[rule.category!] = [range[rule.category!][0], rule.value!];
		} else {
			ranges.push(...getVariations(workflows, rule.target, { ...range }));
		}
	}

	return ranges;
};

async function solution(file: string): Promise<number> {
	const inputFile = Bun.file(file);
	const text = await inputFile.text();
	const workflows: Workflows = {};

	const [rawWorkflows] = text.split("\n\n");

	for (const rawWorkflow of rawWorkflows.split("\n")) {
		let [name, data] = rawWorkflow.split("{");
		data = data.substring(0, data.length - 1);
		let workflow: Rule[] = [];

		const workflowSpecs = data.split(",");
		for (const ruleSpec of workflowSpecs) {
			if (!ruleSpec.includes(":")) {
				workflow.push({
					target: ruleSpec,
				});
			} else {
				const [specification, target] = ruleSpec.split(":");
				const property = specification.substring(0, 1);
				const operation = specification.substring(1, 2);

				const tmp = specification.substring(2);
				const value = parseInt(tmp);

				workflow.push({
					target: target,
					operation: operation,
					value: value,
					category: property as Category,
				});
			}
		}
		workflows[name] = workflow;
	}

	const ranges = getVariations(workflows, "in", {
		a: [1, 4000],
		m: [1, 4000],
		s: [1, 4000],
		x: [1, 4000],
	});

	return ranges.reduce(
		(acc, item) => acc + (item.a[1] - item.a[0] + 1) * (item.m[1] - item.m[0] + 1) * (item.s[1] - item.s[0] + 1) * (item.x[1] - item.x[0] + 1),
		0
	);
}

const testCases: Array<{
	input: string;
	output: number;
}> = [
	{
		input: "./input/day-19-base-01.txt",
		output: 167409079868000,
	},
	{
		input: "./input/day-19-base-02.txt",
		output: 125355665599537,
	},
];

describe("advent-of-code-2023 #19", () => {
	test.each(testCases)("", async (item) => {
		const result = await solution(item.input);
		expect(result).toEqual(item.output);
	});
});
