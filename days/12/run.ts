import { mainModuleDir, path } from '../../relative-path.ts';
import utils from '../../utils.ts';
Deno.chdir(mainModuleDir);

const t0 = performance.now();

const sample = await Deno.readTextFile(path.resolve('data', 'sample.txt'));
const input = await Deno.readTextFile(path.resolve('data', 'input.txt'));

const grid = utils.toGrid(input);
const checked = new Set<string>();
const regions: number[][][] = []; // une region : un tableau contenant N positions (x,y)

// finds regions
while (checked.size < grid.length * grid[0].length) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const coords = [i, j];
            if (checked.has(coords.toString())) {
                continue;
            }

            checked.add(coords.toString());

            // build a region
            const region = [];
            const char = grid[i][j];
            const toCheck = [coords];
            while (toCheck.length > 0) {
                const checking = toCheck.shift();
                region.push(checking!);

                const neighbors = utils
                    .checkAroundOrtho(grid, checking![0], checking![1], char)
                    .filter(([x, y]) => !checked.has([x, y].toString()));

                for (const neighbor of neighbors) {
                    checked.add(neighbor.toString());
                    toCheck.push(neighbor);
                }
            }
            regions.push(region);
        }
    }
}

// console.log('Regions count: ', regions.length);
// console.log('Regions: ', regions);

/* Part 1 */
let price = 0;
for (const region of regions) {
    let perimeter = 0;
    for (const position of region) {
        const neighbors = region.filter(
            ([x, y]) =>
                (x === position[0] && Math.abs(y - position[1]) === 1) ||
                (y === position[1] && Math.abs(x - position[0]) === 1)
        );
        perimeter += 4 - neighbors.length;
    }
    // console.log('Perimeter (fences count) for region: ', perimeter);
    const regionPrice = perimeter * region.length;
    // console.log('Price for region: ', regionPrice);
    price += regionPrice;
}

console.log('Part 1 result: ', price);

/* Part 2 */
const prices = regions.map(countCorners);
console.log(
    'Corners count: ',
    prices.reduce((sum, value) => sum + value, 0)
);

const t1 = performance.now();
console.log(`Work took ${t1 - t0} milliseconds.`);

function countCorners(region: number[][]): number {
    const regionName = grid[region[0][0]][region[0][1]];
    let corners = 0;

    if (region.length === 1) {
        corners = 4;
    } else {
        const regionSet = new Set(region.map(([i, j]) => `${i},${j}`));

        for (const [i, j] of region) {
            const neighbors = [
                [i - 1, j], // up
                [i + 1, j], // down
                [i, j - 1], // left
                [i, j + 1], // right
            ];

            // Count neighbors inside the region
            const neighborsInside = neighbors.filter(([ni, nj]) => regionSet.has(`${ni},${nj}`));

            /**
             * 1 neighbor inside the region
             *
             * +--  --+  +-+  |A|
             * |AA  AA|  |A|  |A|
             * +--  --+  |A|  +-+
             *
             */
            if (neighborsInside.length === 1) {
                corners += 2;
            } else if (neighborsInside.length >= 2) {
                const cornerSet = new Set();

                if (neighborsInside.length === 2) {
                    /**
                     * Outside corners :
                     * 2 neighbors inside the region in a L shape
                     *
                     * +--  --+  |A.  .A|
                     * |AA  AA|  |AA  AA|
                     * |A.  .A|  +--  --+
                     *
                     */
                    const [n1, n2] = neighborsInside;
                    if (
                        (n1[0] > i && n2[1] > j) || // top left
                        (n1[0] > i && n2[1] < j) || // top right
                        (n1[0] < i && n2[1] > j) || // bottom left
                        (n1[0] < i && n2[1] < j) // bottom right
                    ) {
                        console.log(`Outside corner: ${i},${j}`);
                        corners++;                    }
                }

                const combinations = utils.getCombinations(neighborsInside, 2);
                for (const [n1, n2] of combinations) {
                    /**
                     * Inside corners :
                     * 2 neighbors inside the region in a L shape AND not in diagonal
                     *
                     * +---  ---+  |A|    |A|
                     * |AAA  AAA|  |A+-  -+A|
                     * |A+-  -+A|  |AAA  AAA|
                     * |A|    |A|  +---  ---+
                     */
                    if (
                        (n1[0] > i && n2[1] > j && !regionSet.has(`${i + 1},${j + 1}`)) || // inside top left
                        (n1[0] > i && n2[1] < j && !regionSet.has(`${i + 1},${j - 1}`)) || // inside top right
                        (n1[0] < i && n2[1] > j && !regionSet.has(`${i - 1},${j + 1}`)) || // inside bottom left
                        (n1[0] < i && n2[1] < j && !regionSet.has(`${i - 1},${j - 1}`)) // inside bottom right
                    ) {
                        console.log(`Inside corner: ${i},${j}`);
                        cornerSet.add(`${n1},${n2}`);
                    }
                }
                corners += cornerSet.size;
            } else {
                // no corner
            }
        }
    }

    console.log(`Corners for region ${regionName}: ${corners}`);
    const price = corners * region.length;
    console.log('Price for region: ', price);
    return price;
}
