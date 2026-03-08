/**
 * Modern Particle System for GPUMD Cover Page
 * Features: Interactive force fields, gradient connections, high-performance canvas rendering
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 200 };

    // Configuration
    const config = {
        particleCount: window.innerWidth < 768 ? 60 : 120,
        connectionDistance: 150,
        mouseRepelForce: 5,
        baseSpeed: 0.5,
        colors: ['#0ea5e9', '#8b5cf6', '#38bdf8'] // Brand colors
    };

    // Resize Handler
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    window.addEventListener('resize', () => {
        resize();
    });

    // Mouse Interaction
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.z = Math.random() * 2 + 0.5; // Depth factor (0.5 to 2.5)
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Closer particles (larger z) move faster
            this.vx = (Math.random() - 0.5) * config.baseSpeed * this.z;
            this.vy = (Math.random() - 0.5) * config.baseSpeed * this.z;
            this.size = (Math.random() * 2 + 1) * this.z;
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = ((Math.random() * 30) + 1) * this.z;
        }

        update() {
            // Mouse Interaction Physics
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Parallax effect based on mouse position
                const parallaxX = (mouse.x - width/2) * 0.02 * this.z;
                const parallaxY = (mouse.y - height/2) * 0.02 * this.z;
                
                // Combine physics repulse + parallax drift
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = forceDirectionX * force * this.density;
                    const directionY = forceDirectionY * force * this.density;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }

            // Move particle
            this.x += this.vx;
            this.y += this.vy;

            // Boundary Check with wrap-around for smooth continuous flow
            if (this.x < -50) this.x = width + 50;
            if (this.x > width + 50) this.x = -50;
            if (this.y < -50) this.y = height + 50;
            if (this.y > height + 50) this.y = -50;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.5 * this.z; // Fade out distant particles
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw Connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    ctx.beginPath();
                    let opacity = 1 - (distance / config.connectionDistance);
                    ctx.strokeStyle = `rgba(14, 165, 233, ${opacity * 0.2})`; // Blue tint
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Update and Draw Particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    animate();

    // Scroll Effect for Header
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Button Hover 3D Effect
    const btn = document.querySelector('.cta-button');
    if (btn) {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.transform = `perspective(1000px) rotateX(${(y - rect.height/2) / 10}deg) rotateY(${-(x - rect.width/2) / 10}deg) translateY(-2px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    }
});
