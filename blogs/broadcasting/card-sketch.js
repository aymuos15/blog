/**************************************************
 * Broadcasting Expansion Animation for Card     *
 **************************************************/

new p5(function(p) {
    let animPhase = 0;
    const gridSize = 8;

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="broadcasting"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200;

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('broadcasting-card-canvas');
        canvas.class('article-canvas');
    };

    p.draw = function() {
        // Dark background with orange tint
        p.background(42, 26, 26);

        animPhase = (animPhase + 0.008) % 1;

        const cellSize = 15;
        const spacing = 3;
        const startX = p.width / 2 - (gridSize * (cellSize + spacing)) / 2;
        const startY = p.height / 2 - (gridSize * (cellSize + spacing)) / 2;

        // Draw expanding grid pattern
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const x = startX + col * (cellSize + spacing);
                const y = startY + row * (cellSize + spacing);

                // Broadcast pattern: highlight when row or col match phase
                const rowPhase = (row / gridSize);
                const colPhase = (col / gridSize);

                let brightness = 60;
                let alpha = 100;

                // Wave effect showing broadcasting
                if (p.abs(rowPhase - animPhase) < 0.15 || p.abs(colPhase - animPhase) < 0.15) {
                    brightness = 120;
                    alpha = 200;
                }

                p.fill(brightness, brightness * 0.6, brightness * 0.6);
                p.stroke(255, 107, 53, alpha);
                p.strokeWeight(1.5);
                p.rect(x, y, cellSize, cellSize, 2);
            }
        }

        // Draw broadcasting indicators
        p.noStroke();
        p.fill(255, 107, 53, 150);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(11);
        p.text('Broadcasting', 15, 15);

        // Draw dimension labels
        p.textSize(9);
        const currentRow = p.floor(animPhase * gridSize);
        const currentCol = p.floor(animPhase * gridSize);
        p.fill(255, 107, 53, 100 + animPhase * 155);
        p.text(`(${gridSize}, 1) → (${gridSize}, ${gridSize})`, 15, 30);
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="broadcasting"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
