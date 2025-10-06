// Bayes blog specific JavaScript

let bayesAnimating = false;

function drawDistribution(canvasId, mean, std, color, alpha = 1.0) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw Gaussian curve
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 107, 53, ${alpha})`;
    ctx.fillStyle = `rgba(255, 107, 53, ${alpha * 0.3})`;
    ctx.lineWidth = 2;

    const points = [];
    for (let x = 0; x < width; x++) {
        const t = (x / width) * 4 - 2; // Map to [-2, 2]
        const xVal = mean + t * std;
        const y = gaussian(xVal, mean, std);
        const yPixel = height - (y * height * 2.5);
        points.push({ x, y: yPixel });

        if (x === 0) {
            ctx.moveTo(x, yPixel);
        } else {
            ctx.lineTo(x, yPixel);
        }
    }

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function gaussian(x, mean, std) {
    const variance = std * std;
    return Math.exp(-Math.pow(x - mean, 2) / (2 * variance)) / Math.sqrt(2 * Math.PI * variance);
}

function initializeBayes() {
    // Draw initial distributions
    drawDistribution('priorCanvas', 0, 1, '#ff6b35', 0.6);
    drawDistribution('likelihoodCanvas', 0.5, 0.8, '#ff6b35', 0.6);
    drawDistribution('posteriorCanvas', 0, 1, '#ff6b35', 0.3);
}

async function animateBayes() {
    if (bayesAnimating) return;
    bayesAnimating = true;

    // Reset
    const vizPanels = document.querySelectorAll('.distribution-viz');
    vizPanels.forEach(panel => panel.classList.remove('active'));

    await sleep(500);

    // Step 1: Highlight prior
    const priorViz = document.getElementById('priorViz');
    priorViz.classList.add('active');
    drawDistribution('priorCanvas', 0, 1, '#ff6b35', 1.0);
    await sleep(1200);
    priorViz.classList.remove('active');

    await sleep(300);

    // Step 2: Highlight likelihood
    const likelihoodViz = document.getElementById('likelihoodViz');
    likelihoodViz.classList.add('active');
    drawDistribution('likelihoodCanvas', 0.5, 0.8, '#ff6b35', 1.0);
    await sleep(1200);
    likelihoodViz.classList.remove('active');

    await sleep(300);

    // Step 3: Show posterior (combination)
    const posteriorViz = document.getElementById('posteriorViz');
    posteriorViz.classList.add('active');

    // Animate the posterior forming
    for (let alpha = 0.3; alpha <= 1.0; alpha += 0.1) {
        drawDistribution('posteriorCanvas', 0.3, 0.7, '#ff6b35', alpha);
        await sleep(100);
    }

    await sleep(1500);
    posteriorViz.classList.remove('active');

    bayesAnimating = false;
}

function resetBayes() {
    initializeBayes();
    const vizPanels = document.querySelectorAll('.distribution-viz');
    vizPanels.forEach(panel => panel.classList.remove('active'));
    bayesAnimating = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function() {
    initializeBayes();
};
