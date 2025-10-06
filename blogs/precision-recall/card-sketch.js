/**************************************************
 * Precision-Recall Curve Animation               *
 **************************************************/

new p5(function(p) {
    let curvePoints = [];
    let currentPoint = 0;
    let animationProgress = 0;
    let currentCurve = 0;
    const curves = ['excellent', 'good', 'poor'];
    let transitionCounter = 0;
    let particleTrail = [];

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="precision-recall"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200;

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('pr-card-canvas');
        canvas.class('article-canvas');

        generateCurve();
    };

    function generateCurve() {
        curvePoints = [];
        let curveType = curves[currentCurve];

        // Generate precision-recall curve points
        for (let i = 0; i <= 50; i++) {
            let recall = i / 50;
            let precision;

            switch(curveType) {
                case 'excellent':
                    // High precision maintained across recall values
                    precision = 0.95 - recall * 0.15 + p.noise(i * 0.1) * 0.05;
                    break;
                case 'good':
                    // Moderate performance
                    precision = 0.85 - recall * 0.4 + p.noise(i * 0.15) * 0.08;
                    break;
                case 'poor':
                    // Steep drop in precision
                    precision = 0.7 - recall * 0.6 + p.noise(i * 0.2) * 0.1;
                    break;
            }

            precision = p.constrain(precision, 0.1, 1.0);
            curvePoints.push({recall, precision});
        }
    }

    p.draw = function() {
        // Dark background with subtle gradient
        for (let i = 0; i < p.height; i++) {
            let inter = p.map(i, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(30, 25, 28), p.color(20, 15, 18), inter);
            p.stroke(c);
            p.line(0, i, p.width, i);
        }

        const padding = 40;
        const graphWidth = p.width - 2 * padding;
        const graphHeight = p.height - 2 * padding;

        // Draw axes
        p.stroke(80, 80, 80);
        p.strokeWeight(2);
        p.line(padding, p.height - padding, p.width - padding, p.height - padding); // X-axis
        p.line(padding, padding, padding, p.height - padding); // Y-axis

        // Draw grid lines
        p.stroke(255, 255, 255, 8);
        p.strokeWeight(1);
        for (let i = 0; i <= 4; i++) {
            let x = padding + (graphWidth * i / 4);
            let y = padding + (graphHeight * i / 4);
            p.line(x, padding, x, p.height - padding);
            p.line(padding, y, p.width - padding, y);
        }

        // Animate curve drawing
        animationProgress += 0.015;
        if (animationProgress > 1) {
            animationProgress = 1;
        }

        let pointsToDraw = p.floor(curvePoints.length * animationProgress);

        // Draw the precision-recall curve
        p.noFill();
        p.stroke(255, 105, 180, 200); // Pink
        p.strokeWeight(3);
        p.beginShape();

        for (let i = 0; i < pointsToDraw; i++) {
            let pt = curvePoints[i];
            let x = padding + pt.recall * graphWidth;
            let y = p.height - padding - pt.precision * graphHeight;
            p.vertex(x, y);
        }
        p.endShape();

        // Draw current point indicator
        if (pointsToDraw > 0) {
            let currentPt = curvePoints[pointsToDraw - 1];
            let x = padding + currentPt.recall * graphWidth;
            let y = p.height - padding - currentPt.precision * graphHeight;

            // Pulsing point
            let pulseSize = 6 + p.sin(p.frameCount * 0.1) * 2;
            p.fill(255, 140, 200, 180);
            p.noStroke();
            p.circle(x, y, pulseSize);

            // Outer glow
            p.fill(255, 105, 180, 60);
            p.circle(x, y, pulseSize * 2);

            // Add particle trail
            if (p.frameCount % 3 === 0) {
                particleTrail.push({x, y, life: 1.0, size: 4});
            }
        }

        // Draw and update particle trail
        for (let i = particleTrail.length - 1; i >= 0; i--) {
            let particle = particleTrail[i];
            p.fill(255, 105, 180, particle.life * 150);
            p.noStroke();
            p.circle(particle.x, particle.y, particle.size * particle.life);

            particle.life -= 0.02;
            if (particle.life <= 0) {
                particleTrail.splice(i, 1);
            }
        }

        // Draw baseline (random classifier)
        let lastPt = curvePoints[Math.min(pointsToDraw - 1, curvePoints.length - 1)];
        if (lastPt) {
            p.stroke(100, 100, 100, 100);
            p.strokeWeight(1);
            p.drawingContext.setLineDash([5, 5]);
            p.line(padding, p.height - padding,
                   padding + lastPt.recall * graphWidth,
                   p.height - padding - lastPt.recall * graphHeight);
            p.drawingContext.setLineDash([]);
        }

        // Transition between curves
        transitionCounter++;
        if (transitionCounter > 300 && animationProgress >= 1) { // 5 seconds
            currentCurve = (currentCurve + 1) % curves.length;
            generateCurve();
            animationProgress = 0;
            transitionCounter = 0;
            particleTrail = [];
        }

        // Display model quality (top-left corner like distributions)
        p.fill(200, 200, 200, 230);
        p.noStroke();
        p.textSize(14);
        p.textAlign(p.LEFT, p.TOP);
        let curveName = curves[currentCurve].charAt(0).toUpperCase() + curves[currentCurve].slice(1);
        p.text(curveName + ' Model', 12, 12);

        // Display current metrics (top-right corner like distributions)
        if (pointsToDraw > 0) {
            let pt = curvePoints[pointsToDraw - 1];
            p.textSize(12);
            p.textAlign(p.RIGHT, p.TOP);
            p.fill(150, 150, 150, 200);
            p.text(`P: ${pt.precision.toFixed(2)} R: ${pt.recall.toFixed(2)}`, p.width - 12, 12);
        }
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="precision-recall"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
