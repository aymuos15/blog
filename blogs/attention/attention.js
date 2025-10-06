// Attention blog specific JavaScript

let attentionAnimating = false;

function createSoftmaxBars() {
    const container = document.getElementById('softmaxBars');
    if (!container) return;
    container.innerHTML = '';

    const weights = [0.1, 0.25, 0.5, 0.15];
    weights.forEach((weight, idx) => {
        const bar = document.createElement('div');
        bar.className = 'softmax-bar';
        bar.id = `bar-${idx}`;
        bar.style.setProperty('--width', '0%');
        container.appendChild(bar);
    });
}

async function animateAttention() {
    if (attentionAnimating) return;
    attentionAnimating = true;

    // Reset
    createSoftmaxBars();
    document.querySelectorAll('.attention-viz').forEach(viz => {
        viz.classList.remove('active');
    });

    await sleep(500);

    // Step 1: Highlight QK computation
    const scoreViz = document.getElementById('scoreViz');
    scoreViz.classList.add('active');
    await sleep(1000);
    scoreViz.classList.remove('active');

    await sleep(300);

    // Step 2: Animate softmax
    const softmaxViz = document.getElementById('softmaxViz');
    softmaxViz.classList.add('active');

    const weights = [0.1, 0.25, 0.5, 0.15];
    for (let i = 0; i < weights.length; i++) {
        const bar = document.getElementById(`bar-${i}`);
        bar.classList.add('active');
        bar.style.setProperty('--width', `${weights[i] * 100}%`);
        await sleep(400);
    }

    await sleep(800);
    softmaxViz.classList.remove('active');

    await sleep(300);

    // Step 3: Highlight final output
    const valueViz = document.getElementById('valueViz');
    valueViz.classList.add('active');
    await sleep(1500);
    valueViz.classList.remove('active');

    attentionAnimating = false;
}

function resetAttention() {
    createSoftmaxBars();
    document.querySelectorAll('.attention-viz').forEach(viz => {
        viz.classList.remove('active');
    });
    attentionAnimating = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function() {
    createSoftmaxBars();
};
