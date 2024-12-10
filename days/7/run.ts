import { mainModuleDir, path } from '../../relative-path.ts';
Deno.chdir(mainModuleDir);

const t0 = performance.now();

const sample = await Deno.readTextFile(path.resolve('data', 'sample.txt'));
const input = await Deno.readTextFile(path.resolve('data', 'input.txt'));

// The mapping looks like :
// [
//   [ 190, [ 10, 19 ] ],
//   [ 3267, [ 81, 40, 27 ] ],
//   ...
// ]
const mapping = input
    .split('\n')
    .map((line) => line.split(': '))
    .map((a) => [parseInt(a[0]), a[1].split(' ').map((x) => parseInt(x))]);

let sum = 0;
mapping.forEach((a) => {
    const target = a[0] as number;
    const numbers = a[1] as number[]; // let's hope he didn't put single numbers to troll us
    for (const combo of generateOperatorsCombinations(['+', '*', '||'], numbers.length - 1)) {
        const result = computeResultFromNumbersAndCombo(numbers, combo);
        if (result === target) {
            sum += result;
            break; // stop at the first valid result for this target
        }
    }
});
console.log('Result: ', sum);

const t1 = performance.now();
console.log(`Work took ${t1 - t0} milliseconds.`);

function generateOperatorsCombinations(operators: string[], length: number) {
    const combinations: string[][] = [];

    // https://www.geeksforgeeks.org/print-all-permutations-with-repetition-of-characters/
    function recursive(buffer: string[], index: number) {
        for (let i = 0; i < operators.length; i++) {
            buffer[index] = operators[i % operators.length];
            if (index === length - 1) { // on a "length" opérateurs dans le buffer, c'est une combinaison
                combinations.push([...buffer]);
            } else {
                recursive(buffer, index + 1);
            }
        }
    }
    recursive([], 0);
    return combinations;
}

function computeResultFromNumbersAndCombo(numbers: number[], combo: string[]) {
    return numbers.reduce((acc, val, index) => {
        if (index === 0) {
            return val;
        }
        if (combo[index - 1] === '+') {
            return acc + val;
        } else if (combo[index - 1] === '*') {
            return acc * val;
        } else { // '||
            return acc = parseInt(acc.toString() + val.toString());
        }
    });
}
