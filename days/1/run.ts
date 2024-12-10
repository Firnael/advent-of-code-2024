import { mainModuleDir, path } from "../../relative-path.ts";
Deno.chdir(mainModuleDir);

const sample = await Deno.readTextFile(path.resolve("data", "sample.txt"));
const input = await Deno.readTextFile(path.resolve("data", "input.txt"));

/* Part 1 */

const left = new Array<number>();
const right = new Array<number>();

sample.split("\n").forEach((line) => {
  const [l, r] = line.split("   ");
  left.push(parseInt(l));
  right.push(parseInt(r));
});

left.sort();
right.sort();

let sum = 0;
for (let i = 0; i < left.length; i++) {
  sum += Math.abs(right[i] - left[i]);
}

console.log(sum);

/* Part 2 */

const leftArray = new Array<number>();
const rightMap = new Map<number, number>();
input.split("\n").forEach((line) => {
  const [l, r] = line.split("   ");
  leftArray.push(parseInt(l));
  const rInt = parseInt(r);
  const current = rightMap.get(rInt);
  current === undefined
    ? rightMap.set(rInt, 1)
    : rightMap.set(rInt, current + 1);
});

let sum2 = 0;
leftArray.forEach((v) => {
    const times = rightMap.get(v);
    sum2 += v * (times || 0);
});

console.log(sum2);
