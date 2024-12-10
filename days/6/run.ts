import { mainModuleDir, path } from '../../relative-path.ts';
import utils from '../../utils.ts';
Deno.chdir(mainModuleDir);

const t0 = performance.now();

const sample = await Deno.readTextFile(path.resolve('data', 'sample.txt'));
const input = await Deno.readTextFile(path.resolve('data', 'input.txt'));
const originalGrid = utils.toGrid(sample);
const directions = [
    [0, -1], // up
    [1, 0], // right
    [0, 1], // down
    [-1, 0], // left
];

let originalGuard = [0, 0];
for (let i = 0; i < originalGrid.length; i++) {
    for (let j = 0; j < originalGrid[i].length; j++) {
        const pos = originalGrid[j][i];
        if (pos === '^' || pos === 'v' || pos === '<' || pos === '>') {
            originalGuard = [i, j];
            break;
        }
    }
}
// console.log(originalGrid.map((row) => row.join('')).join('\n'));
// console.log('Original guard position: ', originalGuard);

/* Part 1 */
const result1 = runGuardPatrol(originalGrid);
console.log('Part 1: ', result1);

/* Part 2 */
// nique sa mère ça bruteforce
let result2 = 0;
for (let i = 0; i < originalGrid.length; i++) {
    for (let j = 0; j < originalGrid[i].length; j++) {
        const grid2 = utils.toGrid(sample);
        grid2[j][i] = '#';
        const limit = 1000;
        const result = runGuardPatrol(grid2, limit);
        if (result === 0) {
            //console.log('We created a loop with a wall at ', j, i);
            result2++;
        }
    }
}

console.log('Result 2: ', result2);

const t1 = performance.now();
console.log(`Work took ${t1 - t0} milliseconds.`);

function runGuardPatrol(grid: string[][], limit = 100) {
    let guard = [...originalGuard]
    let out = false;
    let directionIndex = 0;
    let counter = 0;
    let limitCounter = 0;
    while (!out) {
        const direction = directions[directionIndex];
        const next = utils.getInDirection(grid, guard[0], guard[1], direction, 1);
        if (next === '#') {
            directionIndex = (directionIndex + 1) % 4;
        } else {
            if (grid[guard[1]][guard[0]] !== 'X') {
                limitCounter = 0;
                counter++;
                grid[guard[1]][guard[0]] = 'X';
            } else {
                limitCounter++;
            }
            guard = [guard[0] + direction[0], guard[1] + direction[1]];
            if (next === '' || limitCounter >= limit) {
                out = true;
            }
        }
    }
    return limitCounter >= limit ? 0 : counter;
}
