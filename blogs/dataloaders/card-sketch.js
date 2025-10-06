/**************************************************
 * DataLoader Batching Animation for Blog Card   *
 **************************************************/

new p5(function(p) {
    const items = [];
    const batchSize = 4;
    let animPhase = 0;

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="dataloaders"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200;

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('dataloaders-card-canvas');
        canvas.class('article-canvas');

        // Create data items
        const itemsPerRow = 12;
        const itemWidth = 30;
        const itemHeight = 30;
        const startX = (w - itemsPerRow * (itemWidth + 5)) / 2;
        const startY = h / 2 - 50;

        for (let i = 0; i < itemsPerRow; i++) {
            items.push({
                x: startX + i * (itemWidth + 5),
                y: startY,
                targetY: startY,
                value: i + 1,
                batch: Math.floor(i / batchSize),
                brightness: 0
            });
        }
    };

    p.draw = function() {
        // Dark background with orange tint
        p.background(42, 26, 26);

        animPhase = (animPhase + 0.005) % 2;

        // Animate batching: items group together
        const batchPhase = animPhase < 1 ? animPhase : 2 - animPhase;

        items.forEach((item, idx) => {
            const batch = item.batch;
            const batchOffset = batch * 35;
            item.targetY = p.height / 2 - 50 + p.sin(batchPhase * p.PI) * batchOffset;

            // Smooth movement
            item.y = p.lerp(item.y, item.targetY, 0.1);

            // Draw item
            const hue = (batch / 3) * 60;
            p.fill(60 + hue, 40, 40);
            p.stroke(255, 107, 53, 150);
            p.strokeWeight(2);
            p.rect(item.x, item.y, 28, 28, 2);

            // Draw value
            p.fill(255, 107, 53, 200);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(12);
            p.text(item.value, item.x + 14, item.y + 14);
        });

        // Draw batch labels
        p.fill(255, 107, 53, 150);
        p.noStroke();
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(10);
        p.text('Batching', 15, 15);
        p.text(`size=${batchSize}`, 15, 30);
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="dataloaders"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
