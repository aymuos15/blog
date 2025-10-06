/**************************************************
 * Dynamic Animated Histogram for Distributions   *
 **************************************************/

new p5(function(p) {
    const numBins = 30;
    const bins = new Array(numBins).fill(0);
    const targetBins = new Array(numBins).fill(0);
    let sampleCounter = 0;
    let waveOffset = 0;
    let breathePhase = 0;
    const particles = [];
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
        // Bright cyan gradient background (static)
        for (let i = 0; i < p.height; i++) {
            let inter = p.map(i, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(0, 200, 255), p.color(0, 150, 200), inter);
            p.stroke(c);
            p.line(0, i, p.width, i);
        }

        // Switch distributions every 0.5 seconds
        transitionCounter++;
        if (transitionCounter > 30) { // 0.5 seconds at 60fps
            switchDistribution();
            transitionCounter = 0;
        }

        // Update animation phases
        waveOffset += 0.05;
        breathePhase += 0.02;

        // Animate bins towards target
        for (let i = 0; i < numBins; i++) {
            bins[i] = p.lerp(bins[i], targetBins[i], 0.2);
        }

        let maxBin = p.max(bins);
        if (maxBin === 0) maxBin = 1;

        const barWidth = p.width / numBins;
        const maxBarHeight = p.height * 0.75;

        // Draw histogram bars with wave and breathe effect
        for (let i = 0; i < numBins; i++) {
            // Wave motion
            let wave = p.sin(waveOffset + i * 0.3) * 0.1 + 1;
            // Breathing effect
            let breathe = p.sin(breathePhase + i * 0.1) * 0.05 + 1;

            const barHeight = p.map(bins[i], 0, maxBin, 0, maxBarHeight) * wave * breathe;
            const x = i * barWidth;
            const y = p.height - barHeight;

            // Original gradient: pink -> yellow -> green
            let progress = i / numBins;
            let barColor;

            if (progress < 0.5) {
                barColor = p.lerpColor(
                    p.color(255, 50, 150),  // Bright pink
                    p.color(255, 200, 0),   // Bright yellow
                    progress * 2
                );
            } else {
                barColor = p.lerpColor(
                    p.color(255, 200, 0),   // Bright yellow
                    p.color(50, 255, 150),  // Bright green
                    (progress - 0.5) * 2
                );
            }

            // Draw bar with glow
            p.fill(barColor);
            p.noStroke();
            p.rect(x + 1, y, barWidth - 2, barHeight, 4, 4, 0, 0);

            // Inner glow
            p.fill(255, 255, 255, 80);
            p.rect(x + 1, y, barWidth - 2, barHeight * 0.2, 4, 4, 0, 0);

            // Outer glow for tall bars
            if (bins[i] > maxBin * 0.6) {
                p.fill(barColor);
                p.drawingContext.shadowBlur = 20;
                p.drawingContext.shadowColor = p.color(barColor).toString();
                p.rect(x + 1, y, barWidth - 2, 5);
                p.drawingContext.shadowBlur = 0;
            }
        }

        // Draw curve based on distribution type
        p.noFill();
        p.stroke(255, 255, 255, 180);
        p.strokeWeight(2 + p.sin(breathePhase) * 0.5);
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
                    y = p.height - gaussian * maxBarHeight * 0.95;
                    break;
                    
                case 'uniform':
                    // Flat line
                    y = p.height - maxBarHeight * 0.5;
                    break;
                    
                case 'bimodal':
                    // Two peaks
                    let mu1 = numBins * 0.25;
                    let mu2 = numBins * 0.75;
                    let sigma_bi = numBins / 12;
                    let peak1 = p.exp(-p.pow(i - mu1, 2) / (2 * sigma_bi * sigma_bi));
                    let peak2 = p.exp(-p.pow(i - mu2, 2) / (2 * sigma_bi * sigma_bi));
                    y = p.height - (peak1 + peak2) * 0.5 * maxBarHeight * 0.95;
                    break;
                    
                case 'exponential':
                    // Exponential decay
                    let decay = p.exp(-i * 0.15);
                    y = p.height - decay * maxBarHeight * 0.95;
                    break;
            }
            
            p.vertex(x, y);
        }
        p.endShape();

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            let particle = particles[i];

            p.fill(255, 255, 255, particle.life * 200);
            p.noStroke();
            p.circle(particle.x, particle.y, particle.size * particle.life);

            particle.life -= 0.02;
            particle.y -= 0.5;

            if (particle.life <= 0) {
                particles.splice(i, 1);
            }
        }

        // Display distribution name
        p.fill(255, 255, 255, 230);
        p.noStroke();
        p.textSize(16);
        p.textAlign(p.LEFT, p.TOP);
        let distName = currentDistribution.charAt(0).toUpperCase() + currentDistribution.slice(1);
        p.text(distName, 10, 10);

        // Static sample count (no animation)
        p.textSize(14);
        p.textAlign(p.RIGHT, p.TOP);
        p.text(`n = ${sampleCounter}`, p.width - 10, 10);
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="distributions"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
