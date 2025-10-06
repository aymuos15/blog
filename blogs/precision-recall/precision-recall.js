// Precision-Recall blog specific JavaScript

let canvas, ctx;
let dataPoints = [];
let threshold = 0.5;

function initCanvas() {
    canvas = document.getElementById('prCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Generate synthetic data
    generateData();
    updateVisualization();

    // Setup threshold slider
    const slider = document.getElementById('thresholdSlider');
    const thresholdDisplay = document.getElementById('thresholdValue');

    if (slider) {
        slider.addEventListener('input', function() {
            threshold = parseFloat(this.value);
            thresholdDisplay.textContent = threshold.toFixed(2);
            updateVisualization();
        });
    }
}

function generateData() {
    // Generate synthetic positive and negative samples
    dataPoints = [];

    // Positive class (100 samples) - higher scores
    for (let i = 0; i < 100; i++) {
        dataPoints.push({
            trueLabel: 1,
            score: Math.random() * 0.5 + 0.4 // Scores between 0.4 and 0.9
        });
    }

    // Negative class (100 samples) - lower scores
    for (let i = 0; i < 100; i++) {
        dataPoints.push({
            trueLabel: 0,
            score: Math.random() * 0.6 + 0.1 // Scores between 0.1 and 0.7
        });
    }
}

function calculateMetrics(threshold) {
    let tp = 0, fp = 0, fn = 0, tn = 0;

    dataPoints.forEach(point => {
        const predicted = point.score >= threshold ? 1 : 0;

        if (predicted === 1 && point.trueLabel === 1) tp++;
        else if (predicted === 1 && point.trueLabel === 0) fp++;
        else if (predicted === 0 && point.trueLabel === 1) fn++;
        else if (predicted === 0 && point.trueLabel === 0) tn++;
    });

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

    return { precision, recall, f1, tp, fp, fn, tn };
}

function updateVisualization() {
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate PR curve for all thresholds
    const prCurve = [];
    for (let t = 0; t <= 1; t += 0.02) {
        const metrics = calculateMetrics(t);
        prCurve.push(metrics);
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const x = padding + (width - 2 * padding) * i / 10;
        const y = padding + (height - 2 * padding) * i / 10;

        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Draw PR curve
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    prCurve.forEach((metrics, i) => {
        const x = padding + metrics.recall * (width - 2 * padding);
        const y = height - padding - metrics.precision * (height - 2 * padding);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Highlight current threshold point
    const currentMetrics = calculateMetrics(threshold);
    const currentX = padding + currentMetrics.recall * (width - 2 * padding);
    const currentY = height - padding - currentMetrics.precision * (height - 2 * padding);

    ctx.fillStyle = '#ff1493';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('Recall', width / 2, height - 20);

    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Precision', 0, 0);
    ctx.restore();

    // Draw axis values
    ctx.font = '12px Georgia';
    for (let i = 0; i <= 10; i += 2) {
        const val = i / 10;
        const x = padding + (width - 2 * padding) * val;
        const y = height - padding + (height - 2 * padding) * val;

        ctx.textAlign = 'center';
        ctx.fillText(val.toFixed(1), x, height - padding + 20);

        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(1), padding - 10, height - y + 5);
    }

    // Update metrics display
    document.getElementById('precisionVal').textContent = currentMetrics.precision.toFixed(3);
    document.getElementById('recallVal').textContent = currentMetrics.recall.toFixed(3);
    document.getElementById('f1Val').textContent = currentMetrics.f1.toFixed(3);
}

window.onload = function() {
    initCanvas();
};
