// Broadcasting blog specific JavaScript

const tensorAData = [[1], [2], [3]];  // (3, 1)
const tensorBData = [[10, 20, 30, 40]];  // (1, 4)

let broadcastAnimating = false;

function createTensor(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    data.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'tensor-row';

        row.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'tensor-cell';
            cell.textContent = val;
            rowDiv.appendChild(cell);
        });

        container.appendChild(rowDiv);
    });
}

function createExpandedTensors() {
    // A expanded to (3, 4)
    const aExpanded = [
        [1, 1, 1, 1],
        [2, 2, 2, 2],
        [3, 3, 3, 3]
    ];

    // B expanded to (3, 4)
    const bExpanded = [
        [10, 20, 30, 40],
        [10, 20, 30, 40],
        [10, 20, 30, 40]
    ];

    createTensor('tensorAExpanded', aExpanded);
    createTensor('tensorBExpanded', bExpanded);
}

function createResult() {
    // Result of A + B
    const result = [
        [11, 21, 31, 41],
        [12, 22, 32, 42],
        [13, 23, 33, 43]
    ];

    createTensor('tensorResult', result);
}

function initializeBroadcast() {
    createTensor('tensorA', tensorAData);
    createTensor('tensorB', tensorBData);
    createExpandedTensors();
    createResult();
}

async function animateBroadcast() {
    if (broadcastAnimating) return;
    broadcastAnimating = true;

    // Reset
    initializeBroadcast();
    document.querySelectorAll('.tensor-display').forEach(el => {
        el.classList.remove('highlight');
    });

    await sleep(500);

    // Step 1: Highlight original tensors
    const tensorA = document.getElementById('tensorA');
    const tensorB = document.getElementById('tensorB');

    tensorA.classList.add('highlight');
    await sleep(800);
    tensorA.classList.remove('highlight');

    await sleep(300);

    tensorB.classList.add('highlight');
    await sleep(800);
    tensorB.classList.remove('highlight');

    await sleep(500);

    // Step 2: Show expansion
    const tensorAExp = document.getElementById('tensorAExpanded');
    const tensorBExp = document.getElementById('tensorBExpanded');

    tensorAExp.classList.add('highlight');

    // Highlight cells being broadcast in A
    const aCells = tensorAExp.querySelectorAll('.tensor-cell');
    for (let i = 0; i < aCells.length; i++) {
        aCells[i].classList.add('highlight');
        if ((i + 1) % 4 === 0) await sleep(300);
    }

    await sleep(800);

    aCells.forEach(cell => cell.classList.remove('highlight'));
    tensorAExp.classList.remove('highlight');

    await sleep(300);

    tensorBExp.classList.add('highlight');

    // Highlight cells being broadcast in B
    const bCells = tensorBExp.querySelectorAll('.tensor-cell');
    for (let i = 0; i < bCells.length; i++) {
        bCells[i].classList.add('highlight');
        if ((i + 1) % 4 === 0) await sleep(300);
    }

    await sleep(800);

    bCells.forEach(cell => cell.classList.remove('highlight'));
    tensorBExp.classList.remove('highlight');

    await sleep(500);

    // Step 3: Show result
    const result = document.getElementById('tensorResult');
    result.classList.add('highlight');

    const resultCells = result.querySelectorAll('.tensor-cell');
    for (let i = 0; i < resultCells.length; i++) {
        resultCells[i].classList.add('highlight');
        if ((i + 1) % 4 === 0) await sleep(300);
    }

    await sleep(1000);

    resultCells.forEach(cell => cell.classList.remove('highlight'));
    result.classList.remove('highlight');

    broadcastAnimating = false;
}

function resetBroadcast() {
    initializeBroadcast();
    document.querySelectorAll('.tensor-display').forEach(el => {
        el.classList.remove('highlight');
    });
    document.querySelectorAll('.tensor-cell').forEach(el => {
        el.classList.remove('highlight');
    });
    broadcastAnimating = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function() {
    initializeBroadcast();
};
