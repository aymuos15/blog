/**************************************************
 * Attention Flow Animation for Blog Card         *
 **************************************************/

new p5(function(p) {
    const nodes = [];
    const connections = [];
    let animPhase = 0;

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="attention"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200;

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('attention-card-canvas');
        canvas.class('article-canvas');

        // Create nodes (Q, K, V positions)
        const centerY = h / 2;
        const spacing = w / 5;

        // Query nodes (left)
        for (let i = 0; i < 3; i++) {
            nodes.push({
                x: spacing,
                y: centerY - 40 + i * 40,
                type: 'query',
                activation: 0
            });
        }

        // Key nodes (center-left)
        for (let i = 0; i < 3; i++) {
            nodes.push({
                x: spacing * 2,
                y: centerY - 40 + i * 40,
                type: 'key',
                activation: 0
            });
        }

        // Value nodes (center-right)
        for (let i = 0; i < 3; i++) {
            nodes.push({
                x: spacing * 3,
                y: centerY - 40 + i * 40,
                type: 'value',
                activation: 0
            });
        }

        // Output node (right)
        nodes.push({
            x: spacing * 4,
            y: centerY,
            type: 'output',
            activation: 0
        });
    };

    p.draw = function() {
        // Dark background with orange tint
        p.background(42, 26, 26);

        // Update animation phase
        animPhase = (animPhase + 0.01) % 1;

        // Draw connections with flowing effect
        p.stroke(255, 107, 53, 50);
        p.strokeWeight(1);

        // Query to Key connections
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const from = nodes[i];
                const to = nodes[3 + j];
                const weight = p.sin(animPhase * p.TWO_PI + i + j) * 0.5 + 0.5;
                p.stroke(255, 107, 53, weight * 100);
                p.line(from.x, from.y, to.x, to.y);
            }
        }

        // Value to Output connections
        for (let i = 0; i < 3; i++) {
            const from = nodes[6 + i];
            const to = nodes[9];
            const weight = p.sin(animPhase * p.TWO_PI + i + 1) * 0.5 + 0.5;
            p.stroke(255, 107, 53, weight * 120);
            p.strokeWeight(2);
            p.line(from.x, from.y, to.x, to.y);
        }

        // Draw nodes
        nodes.forEach((node, idx) => {
            const pulse = p.sin(animPhase * p.TWO_PI + idx * 0.3) * 0.3 + 0.7;

            // Node circle
            if (node.type === 'output') {
                p.fill(255, 107, 53, 200);
                p.noStroke();
                p.circle(node.x, node.y, 16 * pulse);
            } else {
                p.fill(60, 40, 40);
                p.stroke(255, 107, 53, pulse * 150);
                p.strokeWeight(2);
                p.circle(node.x, node.y, 12);
            }
        });

        // Draw labels
        p.noStroke();
        p.fill(255, 107, 53, 150);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(11);
        p.text('Q', nodes[1].x, 25);
        p.text('K', nodes[4].x, 25);
        p.text('V', nodes[7].x, 25);
        p.text('Out', nodes[9].x, 25);
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="attention"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
