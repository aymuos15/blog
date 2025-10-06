// Slicing blog specific JavaScript

function switchTab(event, tabId) {
    // Get the parent code-tabs container
    const tabsContainer = event.target.closest('.code-tabs');

    // Hide all tab contents in this container
    const tabContents = tabsContainer.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons in this container
    const tabButtons = tabsContainer.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');

    // Add active class to the clicked button
    event.target.classList.add('active');
}

function computeSlice() {
    const inputStr = document.getElementById('tensorInput').value;
    const sliceOp = document.getElementById('sliceOp').value;

    // Parse tensor-like input (e.g., [[1,2,3],[4,5,6],[7,8,9]])
    let tensor;
    try {
        // Clean up the input: remove whitespace, newlines
        const cleanInput = inputStr.replace(/\s+/g, '');
        // Use eval to parse the array (safe in this controlled context)
        tensor = eval(cleanInput);

        // Validate it's a 3x3 array
        if (!Array.isArray(tensor) || tensor.length !== 3 ||
            !tensor.every(row => Array.isArray(row) && row.length === 3) ||
            tensor.some(row => row.some(val => typeof val !== 'number'))) {
            throw new Error('Invalid tensor format');
        }
    } catch (e) {
        document.getElementById('sliceResults').innerHTML =
            '<div class="result-section"><h3>Error</h3><p>Please enter a valid 3x3 tensor like [[1,2,3],[4,5,6],[7,8,9]]</p></div>';
        return;
    }

    let result;
    let operation;

    switch(sliceOp) {
        case '0':
            result = [tensor[0]];
            operation = 'x[0] - First row';
            break;
        case '1':
            result = [[tensor[0][0]], [tensor[1][0]], [tensor[2][0]]];
            operation = 'x[:, 0] - First column';
            break;
        case '2':
            result = [tensor[1], tensor[2]];
            operation = 'x[1:] - Rows from index 1';
            break;
    }

    let html = '<div class="result-section">';
    html += `<h3>Slice Operation: ${operation}</h3>`;

    html += '<div class="tensor-display">';
    html += '<strong>Original Tensor:</strong><br>';
    html += 'tensor([<br>';
    tensor.forEach(row => {
        html += `&nbsp;&nbsp;[${row.join(', ')}],<br>`;
    });
    html += '])';
    html += '</div>';

    html += '<div class="tensor-display">';
    html += '<strong>Result (View):</strong><br>';
    html += 'tensor([<br>';
    result.forEach(row => {
        html += `&nbsp;&nbsp;[${row.join(', ')}],<br>`;
    });
    html += '])';
    html += '</div>';

    html += '</div>';

    document.getElementById('sliceResults').innerHTML = html;
}

// Slicing visualization state
const originalData = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
let slicingAnimating = false;

function createSlicingMatrix(elementId, data, isSlice = false) {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = '';

    data.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        cell.textContent = value;
        cell.id = `${elementId}-${index}`;
        container.appendChild(cell);
    });
}

function initializeSlicingVisualization() {
    // Original 3x3 matrix
    createSlicingMatrix('originalMatrix', originalData.flat());
    // Slice (first row)
    createSlicingMatrix('sliceMatrix', ['?', '?', '?']);
}

async function animateSlicing() {
    if (slicingAnimating) return;
    slicingAnimating = true;

    // Reset
    createSlicingMatrix('sliceMatrix', ['?', '?', '?']);
    createSlicingMatrix('originalMatrix', originalData.flat());

    await sleep(500);

    // Highlight the first row in original
    for (let i = 0; i < 3; i++) {
        const cell = document.getElementById(`originalMatrix-${i}`);
        cell.classList.add('highlight');
    }

    await sleep(1000);

    // Copy values to slice
    for (let i = 0; i < 3; i++) {
        await sleep(400);
        const sliceCell = document.getElementById(`sliceMatrix-${i}`);
        sliceCell.textContent = originalData[0][i];
        sliceCell.classList.add('processing');
    }

    await sleep(800);

    // Remove highlights
    for (let i = 0; i < 3; i++) {
        const originalCell = document.getElementById(`originalMatrix-${i}`);
        const sliceCell = document.getElementById(`sliceMatrix-${i}`);
        originalCell.classList.remove('highlight');
        sliceCell.classList.remove('processing');
    }

    slicingAnimating = false;
}

async function animateModification() {
    if (slicingAnimating) return;
    slicingAnimating = true;

    // Ensure slice is visible
    createSlicingMatrix('sliceMatrix', originalData[0]);

    await sleep(500);

    // Modify first element of slice
    const sliceCell = document.getElementById('sliceMatrix-0');
    const originalCell = document.getElementById('originalMatrix-0');

    sliceCell.classList.add('modified');
    sliceCell.textContent = '999';

    await sleep(800);

    // Show that original is also modified (it's a view!)
    originalCell.classList.add('modified');
    originalCell.textContent = '999';

    await sleep(1500);

    slicingAnimating = false;
}

function resetSlicing() {
    createSlicingMatrix('originalMatrix', originalData.flat());
    createSlicingMatrix('sliceMatrix', ['?', '?', '?']);
    slicingAnimating = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function() {
    initializeSlicingVisualization();
    computeSlice();
};
