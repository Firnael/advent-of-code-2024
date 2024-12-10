import { mainModuleDir, path } from "../../relative-path.ts";
Deno.chdir(mainModuleDir);

const sample = await Deno.readTextFile(path.resolve("data", "sample.txt"));
const sample2 = await Deno.readTextFile(path.resolve("data", "sample2.txt"));
const input = await Deno.readTextFile(path.resolve("data", "input.txt"));

/* Part 1 */
const matches = sample.match(/mul\(\d+,\d+\)/g);

let total = 0;
matches?.forEach((match) => {
  console.log(match);
  const [a, b] = match.match(/\d+/g)!.map(Number);
  total += a * b;
});

console.log(total);

/* Part 2 */
const matches2 = sample2.match(/mul\(\d+,\d+\)|do\(\)|don't\(\)/g);

let total2 = 0;
let enabled = true;
matches2?.forEach((match) => {
  console.log(match);
  if (match === "do()") {
    enabled = true;
    return;
  } else if (match === "don't()") {
    enabled = false;
    return;
  }
  if (enabled) {
    const [a, b] = match.match(/\d+/g)!.map(Number);
    total2 += a * b;
  }
});

console.log(total2);
