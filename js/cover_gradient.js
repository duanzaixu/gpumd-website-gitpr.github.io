/**
 * Fluid Gradient Animation
 * Uses canvas to draw moving gradient blobs for a soft, modern aesthetic
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gradient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let blobs = [];

    let mouse = { x: null, y: null };
    
    // Configuration
    const config = {
        blobCount: 8,
        colors: [
            '#4f46e5', // Indigo
            '#0ea5e9', // Sky
            '#8b5cf6', // Violet
            '#ec4899', // Pink
            '#14b8a6', // Teal
            '#f59e0b'  // Amber (Accent)
        ],
        speed: 1.0
    };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initBlobs();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Blob {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.speed;
            this.vy = (Math.random() - 0.5) * config.speed;
            this.radius = Math.min(width, height) * (0.4 + Math.random() * 0.4); // Larger blobs
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            this.angle = Math.random() * Math.PI * 2;
            this.parallaxFactor = Math.random() * 0.05 + 0.02; // Random depth
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Mouse Parallax
            if (mouse.x != null) {
                const dx = (mouse.x - width/2) * this.parallaxFactor;
                const dy = (mouse.y - height/2) * this.parallaxFactor;
                this.x += (dx - (this.targetX || 0)) * 0.05;
                this.y += (dy - (this.targetY || 0)) * 0.05;
                this.targetX = dx;
                this.targetY = dy;
            }

            // Bounce off walls with damping
            if (this.x < -this.radius) this.vx = Math.abs(this.vx);
            if (this.x > width + this.radius) this.vx = -Math.abs(this.vx);
            if (this.y < -this.radius) this.vy = Math.abs(this.vy);
            if (this.y > height + this.radius) this.vy = -Math.abs(this.vy);
        }

        draw() {
            ctx.beginPath();
            // Use off-center gradient for 3D-ish effect
            const gradient = ctx.createRadialGradient(
                this.x + this.radius * 0.2, 
                this.y - this.radius * 0.2, 
                0, 
                this.x, 
                this.y, 
                this.radius
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            // Use 'screen' or 'lighter' for vibrant mixing, 'overlay' for subtle
            ctx.globalCompositeOperation = 'screen'; 
            ctx.globalAlpha = 0.5;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initBlobs() {
        blobs = [];
        for (let i = 0; i < config.blobCount; i++) {
            blobs.push(new Blob());
        }
    }

    function animate() {
        // Fade out trail
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#0f172a'; // Background color
        ctx.globalAlpha = 0.1; // Trail effect
        ctx.fillRect(0, 0, width, height);

        blobs.forEach(blob => {
            blob.update();
            blob.draw();
        });

        requestAnimationFrame(animate);
    }

    resize();
    animate();
});
