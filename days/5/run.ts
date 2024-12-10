import { mainModuleDir, path } from "../../relative-path.ts";
Deno.chdir(mainModuleDir);

const t0 = performance.now();

const sample = await Deno.readTextFile(path.resolve("data", "sample.txt"));
const input = await Deno.readTextFile(path.resolve("data", "input.txt"));

/* Parsing */
const orderings: Map<number, number[]> = new Map();
const updates: number[][] = [];
input.split("\n").forEach((l) => {
  if (l.indexOf("|") !== -1) {
    const [a, b] = l.split("|").map((n) => parseInt(n));
    orderings.set(a, orderings.has(a) ? [...orderings.get(a)!, b] : [b]);
  } else if (l === "") {
    // ignore
  } else if (l.indexOf(",") !== -1) {
    updates.push(l.split(",").map((n) => parseInt(n)));
  }
});

/* Part 1 */
let invalids = [];
let sum = 0;
for (const update of updates) {
  const valid = isValid(update, orderings);
  if (valid) {
    sum += update[Math.round((update.length - 1) / 2)];
  } else {
    invalids.push(update);
  }
}
console.log(sum);

/* Part 2 */
let sum2 = 0;
for (const update of invalids) {
  const sorted = update.sort((a, b) => {
    if (!orderings.has(a)) {
      return 1; // le truc est jamais 'avant' un autre, du coup ça bouge à droite
    }
    if (orderings.get(a)!.indexOf(b) >= 0) {
      return -1;
    } else {
      return 1;
    }
  });
  sum2 += sorted[Math.round((sorted.length - 1) / 2)];
}
console.log(sum2);

const t1 = performance.now();
console.log(`Work took ${t1 - t0} milliseconds.`);

function isValid(update: number[], orderings: Map<number, number[]>): boolean {
  let valid = true;

  // reverse order
  for (let i = update.length - 1; i > 0; i--) {
    const a = update[i];
    const b = update[i - 1];
    if (orderings.has(a) && orderings.get(a)!.indexOf(b) >= 0) {
      // console.log(`Violating rule ${a}|${b}`);
      valid = false;
      break;
    }
  }

  // console.log(`Update ${update} is ${valid ? "valid" : "invalid"}`);
  return valid;
}