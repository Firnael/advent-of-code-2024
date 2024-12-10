import { mainModuleDir, path } from '../../relative-path.ts';
import utils from '../../utils.ts';
Deno.chdir(mainModuleDir);

const t0 = performance.now();

const sample = await Deno.readTextFile(path.resolve('data', 'sample.txt'));
const input = await Deno.readTextFile(path.resolve('data', 'input.txt'));

const grid = utils.toGrid(input);
const zeros = utils.findInGrid(grid, '0');

const trailsBuffer = zeros.map((zero) => [zero]); // eeach zero is the start of a trail
const trails = [];
const trailSet = new Set();
const distinctTrails = [];

while (trailsBuffer.length > 0) {
    const trail = trailsBuffer.shift();
    if (trail === undefined) {
        break;
    }
    const higherTrails = followTrail(trail, grid);
    for (const higherTrail of higherTrails) {
        if (higherTrail.length === 10) {
            // keep all for P2
            distinctTrails.push(higherTrail);
            // avoid duplicates for P1
            const hash = higherTrail[0].toString() + higherTrail[higherTrail.length - 1].toString();
            if (trailSet.has(hash)) {
                continue;
            } else {
                trails.push(higherTrail);
                trailSet.add(hash);
            }
        } else {
            trailsBuffer.push(higherTrail);
        }
    }
}

console.log('Part 1:', trails.length);
console.log('Part 2:', distinctTrails.length);

const t1 = performance.now();
console.log(`Work took ${t1 - t0} milliseconds.`);

function followTrail(trail: number[][], grid: string[][]): number[][][] {
    const trails = [];
    const height = trail.length - 1;
    const last = trail[height];
    const around = utils.checkAroundOrtho(grid, last[0], last[1], (height + 1).toString());
    for (const a of around) {
        const newTrail = [...trail];
        newTrail.push(a);
        trails.push(newTrail);
    }
    return trails;
}

function printTrail(trail: number[][]) {
    const tmp = utils.toGrid(sample);
    for (const t of trail) {
        tmp[t[0]][t[1]] = 'X';
    }
    utils.printGrid(tmp);
}