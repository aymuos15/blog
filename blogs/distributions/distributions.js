// Distributions blog specific JavaScript

let canvas, ctx;
let samples = [];
let currentDist = 'normal';
const numBins = 20;

function initCanvas() {
    canvas = document.getElementById('histogramCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    updateInfo();
}

function updateInfo() {
    const infoEl = document.getElementById('distInfo');
    let info = '';

    switch(currentDist) {
        case 'normal':
            info = '<strong>Normal Distribution</strong><br>mean = 0, std = 1<br>Samples: ' + samples.length;
            break;
        case 'uniform':
            info = '<strong>Uniform Distribution</strong><br>range = [0, 1)<br>Samples: ' + samples.length;
            break;
        case 'bernoulli':
            info = '<strong>Bernoulli Distribution</strong><br>p = 0.5 (coin flip)<br>Samples: ' + samples.length;
            break;
    }

    infoEl.innerHTML = info;
}

function drawHistogram() {
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (samples.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '16px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('No samples yet. Click "Sample" to begin!', width / 2, height / 2);
        return;
    }

    // Calculate bins
    let minVal = Math.min(...samples);
    let maxVal = Math.max(...samples);

    // For bernoulli, adjust range
    if (currentDist === 'bernoulli') {
        minVal = -0.5;
        maxVal = 1.5;
    } else {
        const range = maxVal - minVal;
        minVal -= range * 0.1;
        maxVal += range * 0.1;
    }

    const binWidth = (maxVal - minVal) / numBins;
    const bins = new Array(numBins).fill(0);

    // Fill bins
    samples.forEach(val => {
        const binIndex = Math.floor((val - minVal) / binWidth);
        const clampedIndex = Math.max(0, Math.min(numBins - 1, binIndex));
        bins[clampedIndex]++;
    });

    const maxCount = Math.max(...bins);

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw bars
    const barAreaWidth = width - 2 * padding;
    const barAreaHeight = height - 2 * padding;
    const barWidth = barAreaWidth / numBins;

    bins.forEach((count, i) => {
        const barHeight = (count / maxCount) * barAreaHeight * 0.9;
        const x = padding + i * barWidth;
        const y = height - padding - barHeight;

        ctx.fillStyle = '#3498db';
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

        ctx.strokeStyle = '#2980b9';
        ctx.strokeRect(x + 1, y, barWidth - 2, barHeight);
    });

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(minVal.toFixed(1), padding, height - padding + 20);
    ctx.fillText(maxVal.toFixed(1), width - padding, height - padding + 20);
    ctx.fillText('0', padding - 20, height - padding);
    ctx.fillText(maxCount.toString(), padding - 20, padding);
}

function generateSample() {
    switch(currentDist) {
        case 'normal':
            // Box-Muller transform for normal distribution
            const u1 = Math.random();
            const u2 = Math.random();
            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        case 'uniform':
            return Math.random();
        case 'bernoulli':
            return Math.random() < 0.5 ? 0 : 1;
    }
}

function sampleOnce() {
    samples.push(generateSample());
    updateInfo();
    drawHistogram();
}

function sampleMany() {
    for (let i = 0; i < 100; i++) {
        samples.push(generateSample());
    }
    updateInfo();
    drawHistogram();
}

function resetDistribution() {
    samples = [];
    updateInfo();
    drawHistogram();
}

function changeDistribution() {
    currentDist = document.getElementById('distType').value;
    resetDistribution();
}

window.onload = function() {
    initCanvas();
    drawHistogram();
};
