import utils from "../../utils.ts";
import { mainModuleDir, path } from "../../relative-path.ts";
Deno.chdir(mainModuleDir);

const sample = await Deno.readTextFile(path.resolve("data", "sample.txt"));
const input = await Deno.readTextFile(path.resolve("data", "input.txt"));

/* Part 1 */
const grid = utils.toGrid(input);

let count = 0;
for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
        if(grid[i][j] === "X") {
            console.log(`Found "X" at (${i}, ${j})`);
            // check every direction for an "M"
            const ms = utils.checkAround(grid, i, j, "M");
            // we found "XM", get direction, then check for the rest
            for(const m of ms) {
                const [dx, dy] = [m[0] - i, m[1] - j];
                console.log(`Direction: ${dx}, ${dy}`);
                // keep checking in the same direction for "A"
                const a = utils.checkInDirection(grid, i, j, "A", [dx, dy], 2);
                if (a && a.length > 0) {
                    console.log(`Found "A" at (${i + a[0]}, ${j + a[1]})`);
                    // keep checking in the same direction for "S"
                    const s = utils.checkInDirection(grid, i, j, "S", [dx, dy], 3);
                    if (s && s.length > 0) {
                        console.log(`Found "S" !`);
                        count++;
                    }
                }
            }
        }
    }
}

console.log(count);

/* Part 2 */

let count2 = 0;
for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
        if(grid[i][j] === "A") {
            const nw = utils.getInDirection(grid, i, j, [-1, -1], 1);
            const ne = utils.getInDirection(grid, i, j, [1, -1], 1);
            const sw = utils.getInDirection(grid, i, j, [-1, 1], 1);
            const se = utils.getInDirection(grid, i, j, [1, 1], 1);

            if (nw === "M" && ne === "M" && se === "S" && sw === "S"
                || ne === "M" && se === "M" && sw === "S" && nw === "S"
                || se === "M" && sw === "M" && nw === "S" && ne === "S"
                || sw === "M" && nw === "M" && ne === "S" && se === "S"
            ) {
                count2++;
            }
        }
    }
}

console.log(count2);