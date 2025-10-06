/**************************************************
 * Parallel Streams for Vectorization Blog Card   *
 **************************************************/

new p5(function(p) {
    const particles = [];
    const numStreams = 8;

    p.setup = function() {
        let articleItem = document.querySelector('.article-item[data-blog="vectorization"]');
        if (!articleItem) return;

        let w = articleItem.offsetWidth;
        let h = 200;

        let canvas = p.createCanvas(w, h);
        canvas.parent(articleItem);
        canvas.id('vectorization-card-canvas');
        canvas.class('article-canvas');

        // Create particle streams
        for (let i = 0; i < numStreams; i++) {
            particles.push({
                y: (i + 1) * (p.height / (numStreams + 1)),
                x: p.random(-100, 0),
                speed: p.random(2, 4),
                size: p.random(3, 6),
                hue: p.random(100, 140)
            });
        }
    };

    p.draw = function() {
        // Dark green gradient background
        for (let i = 0; i < p.height; i++) {
            let inter = p.map(i, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(20, 40, 20), p.color(10, 25, 10), inter);
            p.stroke(c);
            p.line(0, i, p.width, i);
        }

        // Draw and update particles (parallel streams)
        particles.forEach((particle, i) => {
            // Draw trail
            p.stroke(particle.hue, 200, 150, 100);
            p.strokeWeight(2);
            p.line(particle.x - 50, particle.y, particle.x, particle.y);

            // Draw particle
            p.fill(particle.hue, 255, 200);
            p.noStroke();
            p.circle(particle.x, particle.y, particle.size);

            // Update position
            particle.x += particle.speed;

            // Reset when off screen
            if (particle.x > p.width + 50) {
                particle.x = -50;
            }

            // Add connecting lines to show parallel processing
            if (i < particles.length - 1) {
                p.stroke(76, 175, 80, 50);
                p.strokeWeight(1);
                p.line(particle.x, particle.y, particles[i + 1].x, particles[i + 1].y);
            }
        });
    };

    p.windowResized = function() {
        let articleItem = document.querySelector('.article-item[data-blog="vectorization"]');
        if (articleItem) {
            p.resizeCanvas(articleItem.offsetWidth, 200);
        }
    };
});
