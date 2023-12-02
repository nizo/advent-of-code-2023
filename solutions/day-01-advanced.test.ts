import { test, expect, describe } from "bun:test";

const getNumber = (input: string): string => {
  if (input === "zero") return "0";
  if (input === "one") return "1";
  if (input === "two") return "2";
  if (input === "three") return "3";
  if (input === "four") return "4";
  if (input === "five") return "5";
  if (input === "six") return "6";
  if (input === "seven") return "7";
  if (input === "eight") return "8";
  if (input === "nine") return "9";

  return input;
};

async function solution(file: string): Promise<number> {
  const inputFile = Bun.file(file);
  const text = await inputFile.text();
  const lines = text.split("\n");
  let result = 0;

  for (const line of lines) {
    const match = Array.from(
      line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g),
      (match) => match[1]
    );

    if (!match) continue;
    if (match.length == 0) continue;

    result += parseInt(
      getNumber(match[0]) + getNumber(match[match.length - 1])
    );
  }

  return result;
}

const testCases: Array<{
  input: string;
  output: number;
}> = [
  {
    input: "./input/day-01-advanced-01.txt",
    output: 281,
  },
  {
    input: "./input/day-01-advanced-02.txt",
    output: 54249,
  },
];

describe("advent-of-code-2023 #1", () => {
  test.each(testCases)("", async (item) => {
    const result = await solution(item.input);
    expect(result).toEqual(item.output);
  });
});
