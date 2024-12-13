import { mainModuleDir, path } from '../../relative-path.ts';
Deno.chdir(mainModuleDir);

const t0 = performance.now();

const sample = await Deno.readTextFile(path.resolve('data', 'sample.txt'));
const input = await Deno.readTextFile(path.resolve('data', 'input.txt'));

// parse input
type Data = {
    a: { x: number; y: number };
    b: { x: number; y: number };
    prize: { x: number; y: number };
};
const data: Data[] = [];
const inputArr = input.split('\n');
for (let i = 0; i < inputArr.length; i += 4) {
    const a = inputArr[i]
        .substring(10)
        .split(', ')
        .map((v) => parseInt(v.split('+')[1]));
    const b = inputArr[i + 1]
        .substring(10)
        .split(', ')
        .map((v) => parseInt(v.split('+')[1]));
    const p = inputArr[i + 2]
        .substring(7)
        .split(', ')
        .map((v) => parseInt(v.split('=')[1]));

    data.push({
        a: { x: a[0], y: a[1] },
        b: { x: b[0], y: b[1] },
        prize: { x: p[0], y: p[1] },
    });
}

/* Part 1 */
compute(data);

/* Part 2 */
const data2 = data.map((d) => {
    d.prize.x = d.prize.x + 10000000000000;
    d.prize.y = d.prize.y + 10000000000000;
    return d;
});
compute2(data2);

const t1 = performance.now();
console.log(`Work took ${t1 - t0} milliseconds.`);

function compute(data: Data[]) {
    let sum = 0;

    for (let d = 0; d < data.length; d++) {
        const current = data[d];
        console.log('Case: ', current);

        /**
         * ça brute force
         */
        const ax = current.a.x;
        const bx = current.b.x;
        const ay = current.a.y;
        const by = current.b.y;

        let found = false;
        let pressCountA = 0;
        let pressCountB = 0;

        const maxA = Math.floor(current.prize.x / ax) * ax;
        for (let i = maxA; i >= 0; i -= ax) {
            const rest = current.prize.x - i;
            if (rest % current.b.x === 0) {
                pressCountA = i / ax;
                pressCountB = rest / bx;
                const foundA = i + rest;
                const foundB = pressCountA * ay + pressCountB * by;
                // console.log(
                //     `We have a match for X : (${pressCountA} * ${ax}) + (${pressCountB} * ${bx}) = ${x} + ${y} = ${current.prize.x}`
                // );
                // console.log(
                //     `For Y it is (${pressCountA} * ${ay}) + (${pressCountB} * ${by}) = ${pressCountA * ay} + ${
                //         pressCountB * by
                //     } = ${current.prize.y}`
                // );
                if (foundA === current.prize.x && foundB === current.prize.y) {
                    found = true;
                    break;
                }
            }
        }
        if (found) {
            console.log(`✅ Match found, A: ${pressCountA}, B: ${pressCountB}`);
            sum += pressCountA * 3 + pressCountB;
        } else {
            console.log('❌ No match found');
        }
    }

    console.log('Part 1: ', sum);
}

function compute2(data: Data[]) {
    let sum = 0;
    for (let d = 0; d < data.length; d++) {
        const current = data[d];
        console.log('Case: ', current);

        const result = cramerRule(current.a.x, current.a.y, current.b.x, current.b.y, current.prize.x, current.prize.y);
        if (result[0] % 1 === 0 && result[1] % 1 === 0) {
            console.log(`✅ Match found, A: ${result[0]}, B: ${result[1]}`);
            sum += result[0] * 3 + result[1];
        } else {
            console.log('❌ No match found');
        }
    }
    console.log('Part 2: ', sum);
}

/**
 * Règle de Cramer https://fr.wikipedia.org/wiki/R%C3%A8gle_de_Cramer
 * (exemple système d'ordre 2, comme on a 2 equations linéaires à 2 inconnues A et B)
 * Exemple (première ligne du sample) :
 * - 94A + 22B = 8400
 * - 34A + 67B = 5400
 * A = (8400 * 67 - 5400 * 22) / (94 * 67 - 34 * 22)
 * B = (94 * 5400 - 8400 * 34) / (94 * 67 - 34 * 22)
 * Ici le déterminant est (94 * 67 - 34 * 22) soit (ax * by - bx * ay);
 */
function cramerRule(ax: number, ay: number, bx: number, by: number, priceX: number, priceY: number) {
    const determinant = ax * by - bx * ay;
    const detX = priceX * by - bx * priceY;
    const detY = ax * priceY - priceX * ay;
    return [detX / determinant, detY / determinant];
}
