/**************************************************
 * Bayesian Update Animation for Blog Card       *
 **************************************************/

new p5(function(p) {
    let priorMean = 0;
    let priorStd = 1;
    let posteriorMean = 0;
    let animPhase = 0;

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="bayes"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200;

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('bayes-card-canvas');
        canvas.class('article-canvas');
    };

    p.draw = function() {
        // Dark background with orange tint
        p.background(42, 26, 26);

        // Animate the shift from prior to posterior
        animPhase = (animPhase + 0.005) % 2;
        const shift = animPhase < 1 ? animPhase : 2 - animPhase;

        priorMean = 0;
        posteriorMean = p.lerp(0, p.width * 0.15, shift);

        // Draw prior distribution (faded)
        drawGaussian(p.width / 2 + priorMean, 80, p.color(100, 60, 60), 0.5);

        // Draw posterior distribution (bright)
        drawGaussian(p.width / 2 + posteriorMean, 60, p.color(255, 107, 53), shift);

        // Draw labels
        p.fill(255, 107, 53, 150);
        p.noStroke();
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(11);
        p.text('Prior', 15, 15);
        p.fill(255, 107, 53, 100 + shift * 155);
        p.text('Posterior', 15, 30);

        // Draw arrow showing update
        if (shift > 0.3) {
            p.stroke(255, 107, 53, shift * 200);
            p.strokeWeight(2);
            p.noFill();
            const arrowX = p.width / 2 + priorMean + 40;
            const arrowY = p.height / 2;
            const arrowLen = posteriorMean * 0.6;
            p.line(arrowX, arrowY, arrowX + arrowLen, arrowY);
            // Arrow head
            p.line(arrowX + arrowLen, arrowY, arrowX + arrowLen - 8, arrowY - 5);
            p.line(arrowX + arrowLen, arrowY, arrowX + arrowLen - 8, arrowY + 5);
        }
    };

    function drawGaussian(centerX, std, color, alpha) {
        p.noStroke();
        p.fill(p.red(color), p.green(color), p.blue(color), alpha * 100);

        p.beginShape();
        for (let x = -p.width / 2; x <= p.width / 2; x += 5) {
            const gaussian = p.exp(-(x * x) / (2 * std * std));
            const y = p.height / 2 - gaussian * 80;
            p.vertex(centerX + x, y);
        }
        for (let x = p.width / 2; x >= -p.width / 2; x -= 5) {
            p.vertex(centerX + x, p.height);
        }
        p.endShape(p.CLOSE);

        // Draw curve outline
        p.stroke(p.red(color), p.green(color), p.blue(color), alpha * 200);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        for (let x = -p.width / 2; x <= p.width / 2; x += 3) {
            const gaussian = p.exp(-(x * x) / (2 * std * std));
            const y = p.height / 2 - gaussian * 80;
            p.vertex(centerX + x, y);
        }
        p.endShape();
    }

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="bayes"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
