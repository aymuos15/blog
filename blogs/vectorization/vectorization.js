// Vectorization blog specific JavaScript

function switchTab(event, tabId) {
    const tabsContainer = event.target.closest('.code-tabs');
    const tabContents = tabsContainer.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    const tabButtons = tabsContainer.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

function computeVectorization() {
    const inputStr = document.getElementById('vectorInput').value;
    const conditionOp = document.getElementById('conditionOp').value;

    let values;
    try {
        const cleanInput = inputStr.replace(/\s+/g, '');
        values = eval(cleanInput);

        if (!Array.isArray(values) || values.some(val => typeof val !== 'number')) {
            throw new Error('Invalid input');
        }
    } catch (e) {
        document.getElementById('vectorResults').innerHTML =
            '<div class="result-section"><h3>Error</h3><p>Please enter a valid array like [-5, -2, 0, 3, 7]</p></div>';
        return;
    }

    let mask = [];
    let result = [];
    let conditionText = '';
    let loopCode = '';
    let vectorCode = '';

    switch(conditionOp) {
        case 'gt0':
            mask = values.map(v => v > 0);
            result = values.map(v => v > 0 ? v : 0);
            conditionText = 'x > 0';
            loopCode = 'if x[i] > 0:\n    result[i] = x[i]\nelse:\n    result[i] = 0';
            vectorCode = 'mask = x > 0\nresult = torch.where(mask, x, 0)';
            break;
        case 'lt0':
            mask = values.map(v => v < 0);
            result = values.map(v => v < 0 ? v : 0);
            conditionText = 'x < 0';
            loopCode = 'if x[i] < 0:\n    result[i] = x[i]\nelse:\n    result[i] = 0';
            vectorCode = 'mask = x < 0\nresult = torch.where(mask, x, 0)';
            break;
        case 'gte5':
            mask = values.map(v => v >= 5);
            result = values.map(v => v >= 5 ? v : 0);
            conditionText = 'x >= 5';
            loopCode = 'if x[i] >= 5:\n    result[i] = x[i]\nelse:\n    result[i] = 0';
            vectorCode = 'mask = x >= 5\nresult = torch.where(mask, x, 0)';
            break;
        case 'even':
            mask = values.map(v => v % 2 === 0);
            result = values.map(v => v % 2 === 0 ? v : 0);
            conditionText = 'x % 2 == 0';
            loopCode = 'if x[i] % 2 == 0:\n    result[i] = x[i]\nelse:\n    result[i] = 0';
            vectorCode = 'mask = (x % 2) == 0\nresult = torch.where(mask, x, 0)';
            break;
    }

    let html = '<div class="result-section">';
    html += `<h3>Condition: ${conditionText}</h3>`;

    html += '<div class="comparison-grid">';

    html += '<div class="approach-box">';
    html += '<h4>❌ For Loop Approach (Slow)</h4>';
    html += '<div class="code-snippet">';
    html += 'for i in range(len(x)):<br>';
    html += '&nbsp;&nbsp;' + loopCode.replace(/\n/g, '<br>&nbsp;&nbsp;');
    html += '</div>';
    html += '</div>';

    html += '<div class="approach-box">';
    html += '<h4>✅ Vectorized Approach (Fast)</h4>';
    html += '<div class="code-snippet">';
    html += vectorCode.replace(/\n/g, '<br>');
    html += '</div>';
    html += '</div>';

    html += '</div>';

    html += '<div class="tensor-display">';
    html += '<strong>Input:</strong><br>';
    html += `x = [${values.join(', ')}]<br><br>`;
    html += '<strong>Boolean Mask:</strong><br>';
    html += `[${mask.join(', ')}]<br><br>`;
    html += '<strong>Result:</strong><br>';
    html += `[${result.join(', ')}]`;
    html += '</div>';

    html += '</div>';

    document.getElementById('vectorResults').innerHTML = html;
}

// Comparison animation state
const testData = [-2, -1, 0, 1, 2];
let comparisonAnimating = false;

function createElementGrid(elementId, data) {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = '';

    data.forEach((value, index) => {
        const box = document.createElement('div');
        box.className = 'element-box';
        box.textContent = value;
        box.id = `${elementId}-${index}`;
        container.appendChild(box);
    });
}

function initializeComparison() {
    createElementGrid('forLoopGrid', testData);
    createElementGrid('vectorizedGrid', testData);
    document.getElementById('forLoopProgress').textContent = 'Ready';
    document.getElementById('vectorizedProgress').textContent = 'Ready';
}

async function animateForLoop() {
    const progressEl = document.getElementById('forLoopProgress');

    for (let i = 0; i < testData.length; i++) {
        progressEl.textContent = `Processing index ${i}...`;
        const box = document.getElementById(`forLoopGrid-${i}`);

        // Highlight as processing
        box.classList.add('processing');
        await sleep(600);

        // Apply condition (x > 0)
        const value = testData[i];
        const result = value > 0 ? value : 0;
        box.textContent = result;

        // Mark as done
        box.classList.remove('processing');
        box.classList.add('done');
        await sleep(400);
    }

    progressEl.textContent = 'Complete! (took 5 iterations)';
}

async function animateVectorized() {
    const progressEl = document.getElementById('vectorizedProgress');
    progressEl.textContent = 'Processing all elements...';

    // Highlight all at once
    for (let i = 0; i < testData.length; i++) {
        const box = document.getElementById(`vectorizedGrid-${i}`);
        box.classList.add('processing');
    }

    await sleep(800);

    // Process all at once
    for (let i = 0; i < testData.length; i++) {
        const box = document.getElementById(`vectorizedGrid-${i}`);
        const value = testData[i];
        const result = value > 0 ? value : 0;
        box.textContent = result;
        box.classList.remove('processing');
        box.classList.add('done');
    }

    await sleep(500);
    progressEl.textContent = 'Complete! (1 parallel operation)';
}

async function animateComparison() {
    if (comparisonAnimating) return;
    comparisonAnimating = true;

    // Reset
    initializeComparison();
    await sleep(500);

    // Run both animations
    await Promise.all([
        animateForLoop(),
        animateVectorized()
    ]);

    comparisonAnimating = false;
}

function resetComparison() {
    initializeComparison();
    comparisonAnimating = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function() {
    initializeComparison();
    computeVectorization();
};
