// ReLU blog specific JavaScript

// Data for visualizations
const inputData = [-2, 0, 3];
const forwardOutputData = [0, 0, 3];
const gradInData = [1, 1, 1];
const maskData = [0, 0, 1];
const gradOutData = [0, 0, 1];

let forwardAnimating = false;
let backwardAnimating = false;

function createMatrix(elementId, data) {
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

function initializeVisualizations() {
    // Forward pass
    createMatrix('forwardInput', inputData);
    createMatrix('forwardOperation', ['?', '?', '?']);
    createMatrix('forwardOutput', ['?', '?', '?']);

    // Backward pass
    createMatrix('backwardGradIn', gradInData);
    createMatrix('backwardMask', maskData);
    createMatrix('backwardGradOut', ['?', '?', '?']);
}

async function animateForward() {
    if (forwardAnimating) return;
    forwardAnimating = true;

    // Reset
    createMatrix('forwardOperation', ['?', '?', '?']);
    createMatrix('forwardOutput', ['?', '?', '?']);

    for (let i = 0; i < inputData.length; i++) {
        // Highlight input
        const inputCell = document.getElementById(`forwardInput-${i}`);
        inputCell.classList.add('highlight');

        await sleep(500);

        // Show operation (max(0, x))
        const opCell = document.getElementById(`forwardOperation-${i}`);
        opCell.textContent = `max(0,${inputData[i]})`;
        opCell.classList.add('processing');

        await sleep(700);

        // Show output
        const outputCell = document.getElementById(`forwardOutput-${i}`);
        outputCell.textContent = forwardOutputData[i];
        outputCell.classList.add('highlight');

        await sleep(500);

        // Remove highlights
        inputCell.classList.remove('highlight');
        opCell.classList.remove('processing');
        outputCell.classList.remove('highlight');

        await sleep(300);
    }

    forwardAnimating = false;
}

function resetForward() {
    createMatrix('forwardInput', inputData);
    createMatrix('forwardOperation', ['?', '?', '?']);
    createMatrix('forwardOutput', ['?', '?', '?']);
    forwardAnimating = false;
}

async function animateBackward() {
    if (backwardAnimating) return;
    backwardAnimating = true;

    // Reset
    createMatrix('backwardGradOut', ['?', '?', '?']);

    for (let i = 0; i < gradInData.length; i++) {
        // Highlight gradient in
        const gradInCell = document.getElementById(`backwardGradIn-${i}`);
        gradInCell.classList.add('highlight');

        await sleep(500);

        // Highlight mask
        const maskCell = document.getElementById(`backwardMask-${i}`);
        maskCell.classList.add('processing');

        await sleep(700);

        // Show result (grad_in * mask)
        const gradOutCell = document.getElementById(`backwardGradOut-${i}`);
        gradOutCell.textContent = `${gradInData[i]}×${maskData[i]}=${gradOutData[i]}`;
        gradOutCell.classList.add('highlight');

        await sleep(800);

        // Simplify to final value
        gradOutCell.textContent = gradOutData[i];

        await sleep(500);

        // Remove highlights
        gradInCell.classList.remove('highlight');
        maskCell.classList.remove('processing');
        gradOutCell.classList.remove('highlight');

        await sleep(300);
    }

    backwardAnimating = false;
}

function resetBackward() {
    createMatrix('backwardGradIn', gradInData);
    createMatrix('backwardMask', maskData);
    createMatrix('backwardGradOut', ['?', '?', '?']);
    backwardAnimating = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

function drawDynamicReluGraph(xInput) {
    const canvas = document.getElementById('reluGraphDynamic');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    // Set up coordinate system with y-axis limit
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40;
    const maxY = 5; // Limit y-axis to prevent overflow

    // Draw axes
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1.5;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#666';
    ctx.font = '14px Georgia';
    ctx.fillText('x', width - 20, centerY - 10);
    ctx.fillText('y', centerX + 10, 20);
    ctx.fillText('0', centerX + 5, centerY - 5);

    // Draw tick marks and labels
    ctx.font = '12px Georgia';
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;

        // X-axis ticks
        const x = centerX + i * scale;
        ctx.beginPath();
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.stroke();
        ctx.fillStyle = '#666';
        ctx.fillText(i.toString(), x - 5, centerY + 20);

        // Y-axis ticks
        const y = centerY - i * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, y);
        ctx.lineTo(centerX + 5, y);
        ctx.stroke();
        ctx.fillStyle = '#666';
        ctx.fillText(i.toString(), centerX - 25, y + 5);
    }

    // Draw ReLU function in black
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Left part (y = 0 for x < 0)
    ctx.moveTo(0, centerY);
    ctx.lineTo(centerX, centerY);

    // Right part (y = x for x > 0) - limit to maxY
    const maxX = Math.min((width - centerX) / scale, maxY);
    ctx.lineTo(centerX + maxX * scale, centerY - maxX * scale);

    ctx.stroke();

    // Calculate output
    const yOutput = Math.max(0, xInput);

    // Convert to canvas coordinates
    const xPos = centerX + xInput * scale;
    const yPos = centerY - yOutput * scale;

    // Draw vertical line from x-axis to point
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(xPos, centerY);
    ctx.lineTo(xPos, yPos);
    ctx.stroke();

    // Draw horizontal line from y-axis to point
    ctx.beginPath();
    ctx.moveTo(centerX, yPos);
    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw the point
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(xPos, yPos, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw point on x-axis
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(xPos, centerY, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Draw point on y-axis
    ctx.beginPath();
    ctx.arc(centerX, yPos, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Add labels for the point
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Georgia';
    ctx.fillText(`(${xInput.toFixed(1)}, ${yOutput.toFixed(1)})`, xPos + 15, yPos - 10);
}

function updateDynamicGraph() {
    const slider = document.getElementById('xSlider');
    const xValue = parseFloat(slider.value);
    const yValue = Math.max(0, xValue);

    document.getElementById('xValue').textContent = xValue.toFixed(1);
    document.getElementById('yValue').textContent = yValue.toFixed(1);

    drawDynamicReluGraph(xValue);
}

function initializeDynamicGraph() {
    const slider = document.getElementById('xSlider');
    if (slider) {
        slider.addEventListener('input', updateDynamicGraph);
        updateDynamicGraph();
    }
}

function compute() {
    const inputStr = document.getElementById('inputValues').value;
    const gradStr = document.getElementById('gradValues').value;

    const inputs = inputStr.split(',').map(s => parseFloat(s.trim()));
    const grads = gradStr.split(',').map(s => parseFloat(s.trim()));

    if (inputs.some(isNaN) || grads.some(isNaN)) {
        document.getElementById('results').innerHTML =
            '<div class="result-section"><h3>Error</h3><p>Please enter valid numbers</p></div>';
        return;
    }

    if (inputs.length !== grads.length) {
        document.getElementById('results').innerHTML =
            '<div class="result-section"><h3>Error</h3><p>Input and gradient arrays must have the same length</p></div>';
        return;
    }

    const forward = inputs.map(x => Math.max(0, x));
    const backward = grads.map((g, i) => inputs[i] > 0 ? g : 0);

    let html = '<div class="result-section">';

    // Forward Pass Section
    html += '<h3>Forward Pass: y = ReLU(x) = max(0, x)</h3>';

    // Overall equation
    html += '<div class="math-equation">';
    html += `y = [${forward.join(', ')}]`;
    html += '</div>';

    // Show computation for each element
    for (let i = 0; i < inputs.length; i++) {
        html += '<div class="element-computation">';
        html += `<div class="step-label">Element ${i + 1}:</div>`;
        html += '<div class="computation-row">';
        html += `<div class="computation-box input">x[${i}] = ${inputs[i]}</div>`;
        html += '<div class="operator">→</div>';
        html += `<div class="computation-box">max(0, ${inputs[i]})</div>`;
        html += '<div class="operator">=</div>';
        html += `<div class="computation-box output">y[${i}] = ${forward[i]}</div>`;
        html += '</div>';
        html += '</div>';
    }

    html += '</div>';

    // Backward Pass Section
    html += '<div class="result-section" style="margin-top: 20px;">';
    html += '<h3>Backward Pass: ∂L/∂x = ∂L/∂y · (x > 0)</h3>';

    // Overall equation
    html += '<div class="math-equation">';
    html += `∂L/∂x = [${backward.join(', ')}]`;
    html += '</div>';

    // Show computation for each element
    for (let i = 0; i < inputs.length; i++) {
        const derivative = inputs[i] > 0 ? 1 : 0;
        html += '<div class="element-computation backward">';
        html += `<div class="step-label">Element ${i + 1}:</div>`;

        html += '<div class="computation-row">';
        html += `<div class="computation-box gradient">∂L/∂y[${i}] = ${grads[i]}</div>`;
        html += '<div class="operator">×</div>';
        html += `<div class="computation-box">(${inputs[i]} > 0) = ${derivative}</div>`;
        html += '<div class="operator">=</div>';
        html += `<div class="computation-box gradient">∂L/∂x[${i}] = ${backward[i]}</div>`;
        html += '</div>';

        html += '<div class="step" style="margin-top: 10px; color: #666;">';
        if (inputs[i] > 0) {
            html += `Since x[${i}] = ${inputs[i]} > 0, gradient flows through: ${grads[i]} × 1 = ${backward[i]}`;
        } else {
            html += `Since x[${i}] = ${inputs[i]} ≤ 0, gradient is blocked: ${grads[i]} × 0 = ${backward[i]}`;
        }
        html += '</div>';

        html += '</div>';
    }

    html += '</div>';

    document.getElementById('results').innerHTML = html;
}

window.onload = function() {
    initializeVisualizations();
    initializeDynamicGraph();
    compute();
};
