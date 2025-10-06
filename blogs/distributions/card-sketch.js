/**************************************************
 * Dynamic Animated Histogram for Distributions   *
 **************************************************/

new p5(function(p) {
    const numBins = 30;
    const bins = new Array(numBins).fill(0);
    const targetBins = new Array(numBins).fill(0);
    let sampleCounter = 0;
    let currentDistribution = 'normal';
    let transitionCounter = 0;
    const distributions = ['normal', 'uniform', 'bimodal', 'exponential'];
    let distIndex = 0;
    
    // Different sample counts for different distributions
    const sampleCounts = {
        'normal': 1000,
        'uniform': 500,
        'bimodal': 1500,
        'exponential': 800
    };

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="distributions"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200;

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('distributions-card-canvas');
        canvas.class('article-canvas');

        // Initialize with samples
        for (let i = 0; i < 800; i++) {
            addSample();
        }
    };

    function addSample() {
        let sample;
        sampleCounter++;

        switch(currentDistribution) {
            case 'normal':
                // Normal distribution (Box-Muller)
                let u1 = p.random();
                let u2 = p.random();
                sample = p.sqrt(-2 * p.log(u1)) * p.cos(2 * p.PI * u2);
                break;

            case 'uniform':
                // Uniform distribution
                sample = p.random(-3, 3);
                break;

            case 'bimodal':
                // Bimodal (two peaks)
                if (p.random() < 0.5) {
                    let u1 = p.random();
                    let u2 = p.random();
                    sample = p.sqrt(-2 * p.log(u1)) * p.cos(2 * p.PI * u2) * 0.6 - 1.5;
                } else {
                    let u1 = p.random();
                    let u2 = p.random();
                    sample = p.sqrt(-2 * p.log(u1)) * p.cos(2 * p.PI * u2) * 0.6 + 1.5;
                }
                break;

            case 'exponential':
                // Exponential distribution
                sample = -p.log(p.random()) * 0.8 - 3;
                break;
        }

        let binIndex = p.floor(p.map(sample, -3, 3, 0, numBins));
        binIndex = p.constrain(binIndex, 0, numBins - 1);

        targetBins[binIndex]++;
    }

    function switchDistribution() {
        // Switch to next distribution
        distIndex = (distIndex + 1) % distributions.length;
        currentDistribution = distributions[distIndex];

        // Completely clear and rebuild
        for (let i = 0; i < numBins; i++) {
            targetBins[i] = 0;
            bins[i] = 0;
        }

        sampleCounter = 0;

        // Generate new samples for this distribution (different counts)
        const numSamples = sampleCounts[currentDistribution];
        for (let i = 0; i < numSamples; i++) {
            addSample();
        }
    }

    p.draw = function() {
        // Dark, professional background with subtle gradient
        for (let i = 0; i < p.height; i++) {
            let inter = p.map(i, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(28, 28, 32), p.color(18, 18, 22), inter);
            p.stroke(c);
            p.line(0, i, p.width, i);
        }

        // Switch distributions every 3 seconds (slower, more professional)
        transitionCounter++;
        if (transitionCounter > 180) { // 3 seconds at 60fps
            switchDistribution();
            transitionCounter = 0;
        }

        // Animate bins towards target (smooth transitions only)
        for (let i = 0; i < numBins; i++) {
            bins[i] = p.lerp(bins[i], targetBins[i], 0.15);
        }

        let maxBin = p.max(bins);
        if (maxBin === 0) maxBin = 1;

        const barWidth = p.width / numBins;
        const maxBarHeight = p.height * 0.7;
        const padding = p.height * 0.15;

        // Draw histogram bars with clean, professional style
        for (let i = 0; i < numBins; i++) {
            const barHeight = p.map(bins[i], 0, maxBin, 0, maxBarHeight);
            const x = i * barWidth;
            const y = padding + (maxBarHeight - barHeight);

            // Pastel yellow accent color (similar to data viz standards)
            // Slightly lighter bars for higher values (subtle depth)
            let intensity = p.map(bins[i], 0, maxBin, 0.6, 1.0);
            let barColor = p.color(255, 235, 130, 200 * intensity); // Pastel yellow

            // Draw clean bar with minimal styling
            p.fill(barColor);
            p.noStroke();
            p.rect(x + 1, y, barWidth - 2, barHeight, 2, 2, 0, 0);

            // Subtle highlight on taller bars only
            if (bins[i] > maxBin * 0.3) {
                p.fill(255, 255, 255, 15);
                p.rect(x + 1, y, barWidth - 2, p.max(barHeight * 0.15, 3), 2, 2, 0, 0);
            }
        }

        // Draw theoretical distribution curve (clean line)
        p.noFill();
        p.stroke(255, 245, 180, 180); // Lighter pastel yellow for curve
        p.strokeWeight(2);
        p.beginShape();

        for (let i = 0; i < numBins; i++) {
            let x = (i + 0.5) * barWidth;
            let y;

            switch(currentDistribution) {
                case 'normal':
                    // Bell curve
                    let mu = numBins / 2;
                    let sigma = numBins / 6;
                    let gaussian = p.exp(-p.pow(i - mu, 2) / (2 * sigma * sigma));
                    y = padding + maxBarHeight - gaussian * maxBarHeight * 0.95;
                    break;

                case 'uniform':
                    // Flat line
                    y = padding + maxBarHeight * 0.5;
                    break;

                case 'bimodal':
                    // Two peaks
                    let mu1 = numBins * 0.25;
                    let mu2 = numBins * 0.75;
                    let sigma_bi = numBins / 12;
                    let peak1 = p.exp(-p.pow(i - mu1, 2) / (2 * sigma_bi * sigma_bi));
                    let peak2 = p.exp(-p.pow(i - mu2, 2) / (2 * sigma_bi * sigma_bi));
                    y = padding + maxBarHeight - (peak1 + peak2) * 0.5 * maxBarHeight * 0.95;
                    break;

                case 'exponential':
                    // Exponential decay
                    let decay = p.exp(-i * 0.15);
                    y = padding + maxBarHeight - decay * maxBarHeight * 0.95;
                    break;
            }

            p.vertex(x, y);
        }
        p.endShape();

        // Draw subtle grid lines for context
        p.stroke(255, 255, 255, 10);
        p.strokeWeight(1);
        for (let i = 0; i <= 4; i++) {
            let yPos = padding + (maxBarHeight * i / 4);
            p.line(0, yPos, p.width, yPos);
        }

        // Display distribution name (clean, minimal)
        p.fill(200, 200, 200, 230);
        p.noStroke();
        p.textSize(14);
        p.textAlign(p.LEFT, p.TOP);
        let distName = currentDistribution.charAt(0).toUpperCase() + currentDistribution.slice(1);
        p.text(distName, 12, 12);

        // Sample count
        p.textSize(12);
        p.textAlign(p.RIGHT, p.TOP);
        p.fill(150, 150, 150, 200);
        p.text(`n = ${sampleCounter}`, p.width - 12, 12);
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="distributions"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
