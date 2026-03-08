// Cover Page Canvas Animation (High Density Molecular Dynamics Style)
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let atoms = [];
    let bgAtoms = [];
    let latticeStructures = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // High-density background "dust" to fill the space
    class BackgroundAtom {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 0.9 + 0.3;
            this.alpha = Math.random() * 0.12 + 0.02;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#94a3b8';
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }

    class Atom {
        constructor(isForeground = true) {
            this.isForeground = isForeground;
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * (this.isForeground ? 0.7 : 0.4);
            this.vy = (Math.random() - 0.5) * (this.isForeground ? 0.7 : 0.4);
            this.radius = this.isForeground ? (Math.random() * 1.8 + 1.5) : (Math.random() * 1.2 + 0.6);
            this.jitter = this.isForeground ? 0.5 : 0.2;
            this.energy = 0;
        }
        update() {
            this.x += this.vx + (Math.random() - 0.5) * this.jitter;
            this.y += this.vy + (Math.random() - 0.5) * this.jitter;
            
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.energy = speed * 15;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            const hue = 200 - this.energy * 8;
            ctx.fillStyle = `hsla(${hue}, 85%, 70%, ${this.isForeground ? 0.5 : 0.25})`;
            ctx.fill();
        }
    }

    class Lattice {
        constructor(type) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // Smarter center avoidance (don't cluster too much)
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const distToCenter = Math.hypot(this.x - centerX, this.y - centerY);
            if (distToCenter < 180) {
                const angle = Math.atan2(this.y - centerY, this.x - centerX);
                this.x = centerX + Math.cos(angle) * 300;
                this.y = centerY + Math.sin(angle) * 250;
            }

            this.z = Math.random() * 300 - 150;
            this.angleX = Math.random() * Math.PI;
            this.angleY = Math.random() * Math.PI;
            this.rotSpeedX = (Math.random() - 0.5) * 0.005;
            this.rotSpeedY = (Math.random() - 0.5) * 0.005;
            this.size = Math.random() * 20 + 40; // Variable size
            this.type = type || 'SC'; 
            this.points = [];
            this.generatePoints();
        }

        generatePoints() {
            for(let x = -1; x <= 1; x++) {
                for(let y = -1; y <= 1; y++) {
                    for(let z = -1; z <= 1; z++) {
                        this.points.push({x, y, z});
                    }
                }
            }
            if (this.type === 'BCC') {
                for(let x = -0.5; x <= 0.5; x += 1) {
                    for(let y = -0.5; y <= 0.5; y += 1) {
                        for(let z = -0.5; z <= 0.5; z += 1) {
                            this.points.push({x, y, z, isCenter: true});
                        }
                    }
                }
            } else if (this.type === 'FCC') {
                const faces = [
                    {x: 0, y: 0.5, z: 0.5}, {x: 0, y: -0.5, z: 0.5},
                    {x: 0.5, y: 0, z: 0.5}, {x: -0.5, y: 0, z: 0.5},
                    {x: 0.5, y: 0.5, z: 0}, {x: -0.5, y: 0.5, z: 0}
                ];
                faces.forEach(f => this.points.push({...f, isFace: true}));
            }
        }

        project(p) {
            const cosX = Math.cos(this.angleX);
            const sinX = Math.sin(this.angleX);
            const cosY = Math.cos(this.angleY);
            const sinY = Math.sin(this.angleY);
            let y = p.y * cosX - p.z * sinX;
            let z = p.y * sinX + p.z * cosX;
            let x = p.x * cosY + z * sinY;
            z = -p.x * sinY + z * cosY;
            const scale = 600 / (600 + z + this.z);
            return {
                x: x * this.size * scale + this.x,
                y: y * this.size * scale + this.y,
                scale: scale,
                isCenter: p.isCenter,
                isFace: p.isFace
            };
        }

        draw() {
            this.angleX += this.rotSpeedX;
            this.angleY += this.rotSpeedY;
            const projected = this.points.map(p => this.project(p));
            ctx.globalAlpha = 0.15; // More visible
            ctx.strokeStyle = '#0ea5e9';
            ctx.lineWidth = 1;

            for(let i = 0; i < projected.length; i++) {
                for(let j = i + 1; j < projected.length; j++) {
                    const p1 = this.points[i];
                    const p2 = this.points[j];
                    const d = Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2)+Math.pow(p1.z-p2.z,2));
                    let shouldConnect = (this.type === 'SC' && d === 1) || (this.type === 'BCC' && d < 0.9) || (this.type === 'FCC' && d < 0.8);
                    if(shouldConnect) {
                        ctx.beginPath();
                        ctx.moveTo(projected[i].x, projected[i].y);
                        ctx.lineTo(projected[j].x, projected[j].y);
                        ctx.stroke();
                    }
                }
            }
            projected.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, (p.isCenter || p.isFace ? 3 : 2) * p.scale, 0, Math.PI * 2);
                ctx.fillStyle = p.isCenter ? '#f43f5e' : (p.isFace ? '#a855f7' : '#38bdf8');
                ctx.globalAlpha = 0.35 * p.scale;
                ctx.fill();
            });
        }
    }

    // Initialize with extreme density
    const isMobile = window.innerWidth < 768;
    
    const bgAtomCount = isMobile ? 150 : 500;
    const atomCount = isMobile ? 60 : 200;
    const foregroundAtomCount = isMobile ? 20 : 80;
    const latticeCount = isMobile ? 2 : 10;

    for (let i = 0; i < bgAtomCount; i++) bgAtoms.push(new BackgroundAtom());
    for (let i = 0; i < atomCount; i++) atoms.push(new Atom(i < foregroundAtomCount)); 
    
    const types = ['SC', 'BCC', 'FCC'];
    for(let i = 0; i < latticeCount; i++) {
        latticeStructures.push(new Lattice(types[i % 3]));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        bgAtoms.forEach(a => a.draw());
        latticeStructures.forEach(l => l.draw());

        atoms.forEach((atom, i) => {
            atom.update();
            atom.draw();

            const maxDist = isMobile ? 70 : (atom.isForeground ? 150 : 100); 
            for (let j = i + 1; j < atoms.length; j++) {
                const other = atoms[j];
                const dist = Math.hypot(atom.x - other.x, atom.y - other.y);
                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * (isMobile ? 0.1 : (atom.isForeground ? 0.25 : 0.1));
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = '#0ea5e9';
                    ctx.lineWidth = isMobile ? 0.4 : 0.6;
                    ctx.beginPath();
                    ctx.moveTo(atom.x, atom.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }
    animate();

    let isTransitioning = false;
    const startTransition = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.classList.add('active');
        setTimeout(() => { window.location.href = 'home.html'; }, 800);
    };

    window.addEventListener('wheel', (e) => { if (e.deltaY > 50) startTransition(); }, { passive: true });
    window.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' || e.key === ' ') startTransition(); });
    
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) exploreBtn.addEventListener('click', startTransition);
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) scrollIndicator.addEventListener('click', startTransition);

    if (window.lucide) window.lucide.createIcons();
});
