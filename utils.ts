/**
 * Converts a string input into a 2D matrix
 * @param input the puzzle input
 * @returns a grid representation of the input (2D matrix)
 */
function toGrid(input: string): string[][] {
    const grid = [];
    const lines = input.split('\n');
    for (const line of lines) {
        grid.push(line.split(''));
    }
    return grid;
}

function printGrid(grid: string[][]) {
    for (let i = 0; i < grid.length; i++) {
        console.log(grid[i].join(''));
    }
}

function checkAround(grid: string[][], i: number, j: number, char: string) {
    const results = [];
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[i].length) {
        console.log(`Out of grid bounds at (${i}, ${j})`);
        return [];
    }

    for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
            if (x === i && y === j) {
                // this is the current position
                continue;
            }

            if (x < 0 || y < 0 || x >= grid.length || y >= grid[i].length) {
                // does not exists
                continue;
            }

            if (grid[x][y] === char) {
                results.push([x, y]);
            }
        }
    }

    // console.log(`Found char ${char} around (${i},${j}) at : "${results.map(r => `(${r[0]}, ${r[1]})`).join(", ")}"`);
    return results;
}

function checkInDirection(grid: string[][], i: number, j: number, char: string, direction: number[], distance: number) {
    const [dx, dy] = direction;
    const [px, py] = [dx * distance, dy * distance];
    if (
        i < 0 ||
        j < 0 ||
        i >= grid.length ||
        j >= grid[i].length ||
        i + px < 0 ||
        j + py < 0 ||
        i + px >= grid.length ||
        j + py >= grid[i].length
    ) {
        console.log(`Out of grid bounds`);
        return [];
    }
    return grid[i + px][j + py] === char ? [px, py] : [];
}

function getInDirection(grid: string[][], i: number, j: number, direction: number[], distance: number) {
    const [dx, dy] = direction;
    const [px, py] = [dx * distance, dy * distance];
    const targetX = i + px;
    const targetY = j + py;
    if (targetX < 0 || targetY < 0 || targetY >= grid.length || targetX >= grid[0].length) {
        //console.log(`Out of grid bounds at (${targetX}, ${targetY})`);
        return '';
    }
    // console.log(`Found char ${grid[targetY][targetX]} at (${targetX}, ${targetY})`);
    return grid[targetY][targetX];
}

function isInGridBounds(i: number, j: number, grid: string[][]): boolean {
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    if (i >= 0 && i < gridHeight && j >= 0 && j < gridWidth) {
        return true;
    }
    return false;
}

export default {
    toGrid,
    printGrid,
    checkAround,
    checkInDirection,
    getInDirection,
};
