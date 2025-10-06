/**************************************************
 * Memory Grid Animation for Strides Blog Card    *
 **************************************************/

new p5(function(p) {
    const gridCols = 16;
    const gridRows = 4;
    const cells = [];
    let writeIndex = 0;
    let frameCounter = 0;

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="strides"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200;

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('strides-card-canvas');
        canvas.class('article-canvas');

        // Initialize cells
        for (let i = 0; i < gridRows * gridCols; i++) {
            cells.push({
                value: 0,
                brightness: 0
            });
        }
    };

    p.draw = function() {
        // Dark background with orange tint
        p.background(42, 26, 26);

        const cellWidth = p.width / gridCols;
        const cellHeight = p.height / gridRows;

        // Draw memory grid
        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                const idx = row * gridCols + col;
                const cell = cells[idx];

                const x = col * cellWidth;
                const y = row * cellHeight;

                // Cell background
                p.fill(60 + cell.brightness * 0.5, 40, 40);
                p.stroke(100, 60, 60);
                p.strokeWeight(1);
                p.rect(x + 2, y + 2, cellWidth - 4, cellHeight - 4, 2);

                // Cell value
                if (cell.value > 0) {
                    p.fill(255, 107 + cell.brightness * 0.5, 53, 200);
                    p.noStroke();
                    p.textAlign(p.CENTER, p.CENTER);
                    p.textSize(cellHeight * 0.4);
                    p.text(cell.value, x + cellWidth / 2, y + cellHeight / 2);
                }

                // Fade brightness
                if (cell.brightness > 0) {
                    cell.brightness *= 0.95;
                }
            }
        }

        // Write new values sequentially (simulating stride access)
        frameCounter++;
        if (frameCounter % 20 === 0) {
            cells[writeIndex].value = p.floor(p.random(1, 10));
            cells[writeIndex].brightness = 150;

            writeIndex = (writeIndex + 1) % cells.length;
        }

        // Draw stride indicator
        const strideCol = p.floor(writeIndex % gridCols);
        const strideRow = p.floor(writeIndex / gridCols);
        const strideX = strideCol * cellWidth;
        const strideY = strideRow * cellHeight;

        p.noFill();
        p.stroke(255, 107, 53, 150);
        p.strokeWeight(3);
        p.rect(strideX + 1, strideY + 1, cellWidth - 2, cellHeight - 2, 2);
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="strides"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
