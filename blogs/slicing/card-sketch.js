/**************************************************
 * Tensor Grid Animation for Slicing Blog Card    *
 **************************************************/

new p5(function(p) {
    // Grid parameters
    const gridSize = 20;
    const animSpeed = 0.02;

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="slicing"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200;

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('slicing-card-canvas');
        canvas.class('article-canvas');
    };

    p.draw = function() {
        // Dark gradient background
        for (let i = 0; i < p.height; i++) {
            let inter = p.map(i, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(30, 30, 50), p.color(15, 15, 30), inter);
            p.stroke(c);
            p.line(0, i, p.width, i);
        }

        // Draw grid
        p.stroke(80, 120, 200, 150);
        p.strokeWeight(1);

        for (let x = 0; x < p.width; x += gridSize) {
            for (let y = 0; y < p.height; y += gridSize) {
                // Animated highlight effect
                let offset = p.sin((x + y) * 0.02 + p.frameCount * animSpeed);
                let brightness = p.map(offset, -1, 1, 100, 255);

                // Color based on position
                let hue = p.map(x, 0, p.width, 180, 240);
                p.fill(hue, 150, brightness, 100);

                p.rect(x, y, gridSize - 2, gridSize - 2, 2);
            }
        }

        // Draw slicing lines
        p.stroke(255, 200, 0, 200);
        p.strokeWeight(2);

        // Horizontal slice line (animated)
        let yPos = p.map(p.sin(p.frameCount * animSpeed * 0.5), -1, 1, gridSize * 2, p.height - gridSize * 2);
        p.line(0, yPos, p.width, yPos);

        // Vertical slice line (animated)
        let xPos = p.map(p.cos(p.frameCount * animSpeed * 0.5), -1, 1, gridSize * 3, p.width - gridSize * 3);
        p.line(xPos, 0, xPos, p.height);
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="slicing"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
