import { mainModuleDir, path } from '../../relative-path.ts';
Deno.chdir(mainModuleDir);

const t0 = performance.now();

const sample = await Deno.readTextFile(path.resolve('data', 'sample.txt'));
const input = await Deno.readTextFile(path.resolve('data', 'input-antoine.txt'));

const stones = input.split(' ');
const result = countStones(stones, 75);
console.log('Stone count:', result);

const t1 = performance.now();
console.log(`Work took ${t1 - t0} milliseconds.`);

function countStones(stones: string[], blinks: number) {
    const stonesOccurencies = new Map<string, number>();
    for (const stone of stones) {
        addToMap(stonesOccurencies, stone, 1);
    }

    for (let i = 1; i <= blinks; i++) {
        const stones = Array.from(stonesOccurencies.keys());
        const values = Array.from(stonesOccurencies.values());

        for (const [i, stone] of stones.entries()) {
            const count = values[i];
            removeFromMap(stonesOccurencies, stone, count);

            if (stone === '0') {
                addToMap(stonesOccurencies, '1', count);
            } else if (stone.length % 2 === 0) {
                const half = stone.length / 2;
                const firstHalf = stone.substring(0, half);
                let secondHalf = stone.substring(half);
                while (secondHalf.charAt(0) === '0' && secondHalf.length > 1) {
                    secondHalf = secondHalf.slice(1);
                }
                addToMap(stonesOccurencies, firstHalf, count);
                addToMap(stonesOccurencies, secondHalf, count);
            } else {
                const stuff = (parseInt(stone) * 2024).toString();
                addToMap(stonesOccurencies, stuff, count);
            }
        }
    }
    
    return Array
        .from(stonesOccurencies.values())
        .reduce((sum, value) => sum + value, 0);
}

function addToMap(map: Map<string, number>, key: string, count: number) {
    if (map.has(key)) {
        map.set(key, map.get(key)! + count);
    } else {
        map.set(key, count);
    }
}

function removeFromMap(map: Map<string, number>, key: string, count: number) {
    if (map.has(key)) {
        map.set(key, map.get(key)! - count);
        if (map.get(key)! === 0) {
            map.delete(key);
        }
    }
}
