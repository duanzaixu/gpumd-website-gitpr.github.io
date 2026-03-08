// Common JavaScript for GPUMD Website
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            // Remove 'hidden' class to ensure display property is set (Tailwind uses display:none for hidden)
            // But for our transition to work, we need display:block (or similar) but visibility:hidden
            // So we toggle 'hidden' class carefully or just rely on our CSS override.
            
            // Our CSS for @media (max-width: 1024px) sets #mobile-menu to potentially be visible if .open is present.
            // However, the HTML has "hidden lg:hidden". Tailwind's 'hidden' is !important display:none.
            // We must toggle the 'hidden' class to allow the element to be rendered, then add 'open' for transition.
            
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
                // Force reflow
                void menu.offsetWidth; 
                menu.classList.add('open');
            } else {
                menu.classList.remove('open');
                // Wait for transition to finish before adding hidden
                setTimeout(() => {
                    menu.classList.add('hidden');
                }, 300); // Match CSS transition duration
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !menu.contains(e.target) && !menu.classList.contains('hidden')) {
                menu.classList.remove('open');
                setTimeout(() => {
                    menu.classList.add('hidden');
                }, 300);
            }
        });
    }

    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Scroll Header Effect
    const navbar = document.querySelector('.glass-nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-lg', 'py-2');
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                navbar.classList.remove('shadow-lg', 'py-2');
                navbar.style.background = 'rgba(255, 255, 255, 0.85)';
            }
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Version Highlights Collapsible
    const collapseBtns = document.querySelectorAll('.collapse-trigger');
    collapseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const target = document.getElementById(targetId);
            const icon = btn.querySelector('.collapse-icon');
            
            if (target) {
                const isCollapsed = target.classList.contains('hidden');
                if (isCollapsed) {
                    target.classList.remove('hidden');
                    btn.querySelector('.collapse-text').innerText = '收起详情';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                } else {
                    target.classList.add('hidden');
                    btn.querySelector('.collapse-text').innerText = '查看亮点';
                    if (icon) icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    // Dynamic Card Shine Effect (Enhanced)
    const cards = document.querySelectorAll('.card-hover-3d');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Smoother and more subtle rotation
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            card.style.transform = `perspective(1000px) translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Add a dynamic shine gradient
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, transparent 80%)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) translateY(0) rotateX(0) rotateY(0)';
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.background = 'transparent';
            }
        });
    });
});
