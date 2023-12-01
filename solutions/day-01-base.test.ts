import { test, expect, describe } from "bun:test";

async function solution(file: string): Promise<number> {
  const inputFile = Bun.file(file);
  const text = await inputFile.text();
  const lines = text.split("\n");
  let result = 0;

  for (const line of lines) {
    const match = line.match(/(\d)/g);
    if (!match) continue;
    if (match.length == 0) continue;

    result += parseInt(match[0] + match[match.length - 1]);
  }

  return result;
}

const testCases: Array<{
  input: string;
  output: number;
}> = [
  {
    input: "./input/day-01-base-01.txt",
    output: 281,
  },
  {
    input: "./input/day-01-base-02.txt",
    output: 142,
  },
];

describe("advent-of-code-2023 #1", () => {
  test.each(testCases)("", async (item) => {
    const result = await solution(item.input);
    expect(result).toEqual(item.output);
  });
});
