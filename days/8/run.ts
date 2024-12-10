import { mainModuleDir, path } from '../../relative-path.ts';
import utils from '../../utils.ts';
Deno.chdir(mainModuleDir);

const t0 = performance.now();

const sample = await Deno.readTextFile(path.resolve('data', 'sample.txt'));
const input = await Deno.readTextFile(path.resolve('data', 'input.txt'));

const grid = utils.toGrid(input);
utils.printGrid(grid);

// create mapping "char -> every positions of the char"
const mapping: Map<string, Array<number[]>> = new Map();
for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
        const current = grid[i][j];
        if (current === '.') {
            continue;
        }
        if (mapping.has(current)) {
            const v = mapping.get(current)!;
            v.push([i, j]);
            mapping.set(current, v);
        } else {
            mapping.set(current, [[i, j]]);
        }
    }
}
console.log('Mapping: ', mapping);

// create pairs of positions for each char
const pairs: Map<string, Array<number[][]>> = new Map();
mapping.forEach((positions, char) => {
    const p = [];
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            p.push([positions[i], positions[j]]);
        }
    }
    pairs.set(char, p);
});
console.log('Pairs: ', pairs);

// for each pair, compute antinode positions
const antinodes: Array<number[]> = [];
pairs.forEach((pairList, char) => {
    console.log(`Computing antinodes for char ${char} (${pairList.length} pairs)`);
    for (const pair of pairList) {
        const results = getAntinodes(pair, grid, 2);
        antinodes.push(...results);
    }
});
console.log('Antinodes: ', antinodes);

// filter antinodes (out of bounds and duplicates)
const filteredAntinodes = antinodes.filter((antinode) => {
    return antinode[0] >= 0 && antinode[0] < grid.length && antinode[1] >= 0 && antinode[1] < grid[0].length;
});
console.log('Filtered antinodes: ', filteredAntinodes);
// @ts-expect-error pas content mais je m'en fous
const uniqueAntinodes = Array.from(new Set(filteredAntinodes.map(JSON.stringify))).map(JSON.parse);
console.log('Unique antinodes: ', uniqueAntinodes);

console.log('Result: ', uniqueAntinodes.length);

const t1 = performance.now();
console.log(`Work took ${t1 - t0} milliseconds.`);

function getAntinodes(pair: number[][], grid: string[][], part: number): Array<number[]> {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    const antinodes = new Array<number[]>();
    const [a, b] = pair;
    console.log(`Computing antinodes for pair (${a[0]}, ${a[1]}) and (${b[0]}, ${b[1]})`);

    // compute distance between a and b
    const di = Math.abs(a[0] - b[0]);
    const dj = Math.abs(a[1] - b[1]);

    if (part === 1) {
        const n1 = [0, 0];
        const n2 = [0, 0];
        if (a[0] < b[0]) {
            // a plus haut que b
            n1[0] = a[0] - di;
            n2[0] = b[0] + di;
        } else {
            // a plus bas que b
            n1[0] = a[0] + di;
            n2[0] = b[0] - di;
        }
        if (a[1] < b[1]) {
            // a plus à gauche que b
            n1[1] = a[1] - dj;
            n2[1] = b[1] + dj;
        } else {
            // a plus à droite que b
            n1[1] = a[1] + dj;
            n2[1] = b[1] - dj;
        }
        console.log(`Antinodes: (${n1[0]}, ${n1[1]}) and (${n2[0]}, ${n2[1]})`);
        antinodes.push(...[n1, n2]);
    } else {
        // part 2
        const positions = [];
        const diSign = a[0] < b[0] ? 1 : -1;
        const djSign = a[1] < b[1] ? 1 : -1;

        let aDone = false;
        let bDone = false;
        let count = 0;
        while (!aDone || !bDone) {
            count++;
            if (!aDone) {
                const na = [a[0] + di * diSign * count, a[1] + dj * djSign * count];
                if (na[0] >= 0 && na[0] < gridHeight && na[1] >= 0 && na[1] < gridWidth) {
                    positions.push(na);
                } else {
                    aDone = true;
                }
            }
            
            if (!bDone) {
                const nb = [b[0] + di * -diSign * count, b[1] + dj * -djSign * count];
                if (nb[0] >= 0 && nb[0] < gridHeight && nb[1] >= 0 && nb[1] < gridWidth) {
                    positions.push(nb);
                } else {
                    bDone = true;
                }
            }
        }
        antinodes.push(...positions);
    }

    return antinodes;
}