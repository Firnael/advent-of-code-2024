import { mainModuleDir, path } from "../../relative-path.ts";
Deno.chdir(mainModuleDir);

const sample = await Deno.readTextFile(path.resolve("data", "sample.txt"));
const input = await Deno.readTextFile(path.resolve("data", "input.txt"));

function isSafe(values: Array<number>) {
  const asc = values[0] < values[1];

  for (let i = 0; i < values.length; i++) {
    if (asc) {
      const diff = values[i + 1] - values[i];
      if (diff <= 0 || diff > 3) {
        console.log(
          "⚠️ For values " +
            values +
            " in ASC, this is not good : " +
            values[i] +
            " " +
            values[i + 1]
        );
        return false;
      }
    } else {
      // desc
      const diff = values[i] - values[i + 1];
      if (diff <= 0 || diff > 3) {
        console.log(
          "⚠️ For values " +
            values +
            " in DESC, this is not good : " +
            values[i] +
            " " +
            values[i + 1]
        );
        return false;
      }
    }
  }

  console.log(
    "Report " + values + " is " + (asc ? "ASC" : "DESC") + " and SAFE"
  );

  return true;
}

/* Part 1 */

let counter = 0;
const unsafe = new Array<Array<number>>();
input.split("\n").forEach((line) => {
  const values = line.split(" ").map((v) => parseInt(v));
  const safe = isSafe(values);
  counter += safe ? 1 : 0;
  if (!safe) {
    unsafe.push(values);
  }
});

console.log('Part 1 : ' + counter);

/* Part 2 */
unsafe.forEach((values) => {
  let safe = false;
  for (let i = 0; i < values.length; i++) {
    const copy = values.slice(); // copy = 1 2 3 4 5
    copy.splice(i, 1); // copy = 1 2 4 5
    safe = isSafe(copy);
    if (safe) {
      // console.log(values + " is safe by removing " + values[i]);
      break;
    }
  }
  if (safe) {
    counter++;
  }
});

console.log('Part 2 : ' + counter);
