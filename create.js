
// Question Number 1 and Solution:

function areMarksConsecutive(N, marks) {
    // Sort the array in increasing order
    marks.sort((a, b) => a - b);

    // Check if all numbers are consecutive
    for (let i = 1; i < N; i++) {
        if (marks[i] !== marks[i - 1] + 1) {
            return 0; // Not consecutive
        }
    }

    return 1; // All consecutive
}

const results = areMarksConsecutive(6, [3, 7, 2, 5, 4, 6])

console.log(results); // Output: 1





// Question Number 2 and Solution:

function evaluatePostfix(expression) {
    const stack = [];

    for (let char of expression) {
        if (!isNaN(parseInt(char))) {
            stack.push(parseInt(char));
        } else {
            const operand2 = stack.pop();
            const operand1 = stack.pop();
            let result;
            if (char === '+') {
                result = operand1 + operand2;
            } else if (char === '-') {
                result = operand1 - operand2;
            } else if (char === '*') {
                result = operand1 * operand2;
            } else if (char === '/') {
                result = Math.floor(operand1 / operand2); // Integer division
            }
            stack.push(result);
        }
    }

    return stack.pop();
}

const result = evaluatePostfix("879-2*+");
console.log(result) // Output: 4


// Question Number 3 and Solution:


function countPairs(N, points) {
    let pairs = 0;

    for (let i = 0; i < N - 1; i++) {
        for (let j = i + 1; j < N; j++) {
            if (points[i] > points[j]) {
                pairs++;
            }
        }
    }

    return pairs;
}

const output = countPairs(10, [1, 2, 7, 5, 7, 4, 1, 1, 2, 5])

console.log(output); // Output: 20

