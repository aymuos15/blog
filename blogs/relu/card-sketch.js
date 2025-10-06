/**************************************************
 * The Poetry Clouds by Kyle Geske (stungeye.com) *
 * Card background for ReLU blog                   *
 **************************************************/

new p5(function(p) {
    // Defines the size of the text grid in pixels.
    const cloudPixelScale = 6;

    // Cloud coverage between 0.3 (plentiful) and 0.6 (sparse).
    const cloudCutOff = 0.5;

    // Speed of cloud panning. Larger values make it faster.
    const panSpeed = 8;

    // Speed of cloud transformation over time. Larger is faster.
    const cloudEvolutionSpeed = 4;

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="relu"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200; // Fixed height for the card

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('relu-card-canvas');
        canvas.class('article-canvas');
    };

    p.draw = function() {
        // A beautiful sky blue background.
        p.background(19, 142, 192);

        // Nested loop to draw a grid of letters across the canvas.
        for (let x = 0; x <= p.width; x += cloudPixelScale) {
            for (let y = 0; y <= p.height; y += cloudPixelScale) {
                let tinyTimeOffset = p.millis() / 100000;
                // Defines the scale of noise for visually appealing clouds.
                let noiseScale = 0.01;

                // 3D noise sampling: The first two dimensions are tied to
                // the canvas position, with the x and y values panning
                // slowly over time. The third dimension is solely influenced
                // by time, enabling the clouds to gradually change shape.
                let n = p.noise(
                    x * noiseScale + tinyTimeOffset * panSpeed,
                    y * noiseScale + tinyTimeOffset * 0.25 * panSpeed,
                    tinyTimeOffset * cloudEvolutionSpeed
                );

                // Skip this position/letter if noise value is under cutoff.
                if (n < cloudCutOff) { continue; }

                // Use the alpha channel to fade out the edges of the clouds.
                let alpha = p.map(n, cloudCutOff, 0.65, 10, 255);
                p.fill(255, alpha);

                // Set the text size to be 15% larger than the grid.
                p.textSize(cloudPixelScale * 1.15);
                p.text(getLetterForCoordinate(x, y), x, y);
            }
        }
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="relu"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };

    function getLetterForCoordinate(x, y) {
        // Simple hash function for x, y coordinates.
        let hash = (x + y) * p.sin(x * y);
        // Ensure a positive value and limit to 26 letters.
        let index = p.abs(p.int(hash * 1000)) % 26;
        // Convert to uppercase letter using ASCII character code.
        return String.fromCharCode(65 + index);
    }
});
