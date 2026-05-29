let numbers = [3, 7, 2, 9, 5];
let max = numbers[0];

for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
        max = numbers[i];
    }
}

console.log("最大值:", max);