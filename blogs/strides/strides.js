// Strides blog specific JavaScript

const tensorData = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

let stridesAnimating = false;

function createTensorGrid() {
    const container = document.getElementById('tensor2D');
    if (!container) return;
    container.innerHTML = '';

    tensorData.forEach((row, i) => {
        row.forEach((val, j) => {
            const cell = document.createElement('div');
            cell.className = 'tensor-cell';
            cell.textContent = val;
            cell.id = `tensor-${i}-${j}`;

            const label = document.createElement('span');
            label.className = 'index-label';
            label.textContent = `${i},${j}`;
            cell.appendChild(label);

            container.appendChild(cell);
        });
    });
}

function createMemoryBlocks() {
    const container = document.getElementById('memoryBlocks');
    if (!container) return;
    container.innerHTML = '';

    const flatData = tensorData.flat();
    flatData.forEach((val, idx) => {
        const block = document.createElement('div');
        block.className = 'memory-block';
        block.textContent = val;
        block.id = `mem-${idx}`;

        const addr = document.createElement('span');
        addr.className = 'addr-label';
        addr.textContent = `[${idx}]`;
        block.appendChild(addr);

        container.appendChild(block);
    });
}

function initializeStrides() {
    createTensorGrid();
    createMemoryBlocks();
    document.getElementById('strideValues').textContent = '(3, 1)';
}

async function animateMemoryLayout() {
    if (stridesAnimating) return;
    stridesAnimating = true;

    // Reset
    createTensorGrid();
    createMemoryBlocks();

    await sleep(500);

    // Highlight each tensor cell and corresponding memory position
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const tensorCell = document.getElementById(`tensor-${i}-${j}`);
            const memIdx = i * 3 + j;
            const memBlock = document.getElementById(`mem-${memIdx}`);

            tensorCell.classList.add('highlight');
            memBlock.classList.add('highlight');

            await sleep(400);

            tensorCell.classList.remove('highlight');
            memBlock.classList.remove('highlight');

            await sleep(200);
        }
    }

    stridesAnimating = false;
}

async function animateStrideAccess() {
    if (stridesAnimating) return;
    stridesAnimating = true;

    createTensorGrid();
    createMemoryBlocks();

    await sleep(500);

    // Example: Access element [1, 2] using strides
    // Formula: index = row * stride[0] + col * stride[1]
    //                = 1 * 3 + 2 * 1 = 5

    document.getElementById('strideInfo').innerHTML = `
        <strong>Accessing element [1, 2]:</strong><br>
        Memory index = row × stride[0] + col × stride[1]<br>
        = 1 × 3 + 2 × 1 = <strong>5</strong>
    `;

    await sleep(1000);

    // Highlight the tensor position
    const tensorCell = document.getElementById('tensor-1-2');
    tensorCell.classList.add('highlight');

    await sleep(800);

    // Highlight the memory position
    const memBlock = document.getElementById('mem-5');
    memBlock.classList.add('highlight');

    await sleep(2000);

    // Reset info
    document.getElementById('strideInfo').innerHTML = `
        <strong>Strides:</strong> <span id="strideValues">(3, 1)</span><br>
        <small>Bytes to skip to move to next [row, column]</small>
    `;

    stridesAnimating = false;
}

function resetStrides() {
    initializeStrides();
    stridesAnimating = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function() {
    initializeStrides();
};
