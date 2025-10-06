// DataLoaders blog specific JavaScript

const originalData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let shuffledData = [];
let dataloaderAnimating = false;

function createDataset(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    data.forEach((val) => {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.textContent = val;
        container.appendChild(item);
    });
}

function createBatches(data, batchSize) {
    const container = document.getElementById('batchesContainer');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < data.length; i += batchSize) {
        const batch = document.createElement('div');
        batch.className = 'batch';

        const batchData = data.slice(i, i + batchSize);
        batchData.forEach(val => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.textContent = val;
            batch.appendChild(item);
        });

        container.appendChild(batch);
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initializeDataLoader() {
    createDataset('originalDataset', originalData);
    createDataset('shuffledDataset', originalData);
    createBatches(originalData, 4);
}

async function animateDataLoader() {
    if (dataloaderAnimating) return;
    dataloaderAnimating = true;

    // Reset
    createDataset('originalDataset', originalData);
    createDataset('shuffledDataset', originalData);
    createBatches(originalData, 4);

    await sleep(500);

    // Step 1: Highlight original dataset
    const originalItems = document.querySelectorAll('#originalDataset .data-item');
    for (let item of originalItems) {
        item.classList.add('highlight');
        await sleep(100);
    }

    await sleep(500);

    for (let item of originalItems) {
        item.classList.remove('highlight');
    }

    await sleep(300);

    // Step 2: Shuffle
    shuffledData = shuffleArray(originalData);
    createDataset('shuffledDataset', shuffledData);

    const shuffledItems = document.querySelectorAll('#shuffledDataset .data-item');
    for (let item of shuffledItems) {
        item.classList.add('highlight');
        await sleep(100);
    }

    await sleep(500);

    for (let item of shuffledItems) {
        item.classList.remove('highlight');
    }

    await sleep(300);

    // Step 3: Create batches
    createBatches(shuffledData, 4);

    const batches = document.querySelectorAll('.batch');
    for (let batch of batches) {
        const items = batch.querySelectorAll('.data-item');
        for (let item of items) {
            item.classList.add('highlight');
        }
        await sleep(600);
        for (let item of items) {
            item.classList.remove('highlight');
        }
        await sleep(200);
    }

    dataloaderAnimating = false;
}

function resetDataLoader() {
    initializeDataLoader();
    dataloaderAnimating = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function() {
    initializeDataLoader();
};
