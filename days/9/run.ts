import { mainModuleDir, path } from '../../relative-path.ts';
Deno.chdir(mainModuleDir);

const t0 = performance.now();

const sample = await Deno.readTextFile(path.resolve('data', 'sample.txt'));
const input = await Deno.readTextFile(path.resolve('data', 'input.txt'));

// create sequence (with the dots as free space)
let id = 0;
let blank = false;
const sequence: any[] = []; // on met des string et des numbers dans le même tableau y'a quoi ?
input.split('').forEach((c) => {
    const v = parseInt(c);
    for (let i = 0; i < v; i++) {
        if (blank) {
            sequence.push('.');
        } else {
            sequence.push(id);
        }
    }
    if (!blank) {
        id++;
    }
    blank = !blank;
});
console.log(sequence.join(''));
// copy this for part 2
const sequence2 = [...sequence];

/* Part 1 */

// replace free spaces (dots) by poping elements
const result = [];
while(sequence.length > 0) {
    const last = sequence.pop();
    if (last === '.') {
        continue;
    }
    let stop = false;
    while(!stop) {
        const first = sequence.shift();
        if (first === '.' || first === undefined) {
            result.push(last);
            stop = true;
        } else {
            result.push(first);
        }
    }
}
console.log(result.join(''));

// compute result
let sum = 0;
for (let i = 0; i < result.length; i++) {
    sum += result[i] * i;
}
console.log('Part 1:', sum);

/* Part 2 */
let readingIndex = sequence2.length - 1;
while(readingIndex > 0) {
    const last = sequence2[readingIndex];
    
    if (last === '.') {
        readingIndex--;
        continue;
    }

    // start    : 00...111...2...333.44.5555.6666.777.888899 
    // expected : 00992111777.44.333....5555.6666.....8888..
    // actual   : 00992111777.44.333....5555.6666.....8888..

    let stop = false;
    let length = 1;
    let internalIndex = readingIndex - 1;
    while(!stop) {
        const previous = sequence2[internalIndex];
        if (previous === last) {
            length++;
            internalIndex--;
            continue;
        }

        const index = getFreeSpace(sequence2, length, internalIndex +1);
        if (index !== -1) {
            // move block to free space
            sequence2.splice(index, length, ...new Array(length).fill(last));
            // replace block by free space
            sequence2.splice(internalIndex+1, length, ...new Array(length).fill('.'));
        }
        stop = true;
        // console.log('New sequence : ', sequence2.join(''));
    }
    readingIndex = internalIndex;
}
// concat left and right block (watch out : right block needs to be reversed since we pushed at the end of it)
console.log(sequence2.join(''));

// compute result
let sum2 = 0;
for (let i = 0; i < sequence2.length; i++) {
    if (sequence2[i] !== '.') {
        sum2 += sequence2[i] * i;
    }
}
console.log('Part 2:', sum2);

const t1 = performance.now();
console.log(`Work took ${t1 - t0} milliseconds.`);

function getFreeSpace(array: any[], size: number, limit: number) {
    if (size <= 0) {
        console.error('Size must be greater than 0');
    }

    let index = -1;
    let sizeCounter = 0;

    for (let i = 0; i < limit; i++) {
        if (array[i] === '.') {
            if (sizeCounter === 0) {
                index = i;
            }
            sizeCounter++;
            if (sizeCounter === size) {
                // console.log(`Free space of size ${size} found at index ${index}`);
                return index;
            }
        } else {
            sizeCounter = 0;
        }
    }
    // console.log('No free space found');
    return -1;
}