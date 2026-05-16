/**
 * DIYA PORTFOLIO - INTERACTIVE SCRIPT
 * Features: Particle System, Mouse Interactions, Scroll Animations, Magnetic Buttons
 */

// ========================================
// PARTICLE SYSTEM
// ========================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    getRandomColor() {
        const colors = ['#00d4ff', '#b347d9', '#ff6b9d', '#00fff5'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 0.02;
                    particle.vy -= Math.sin(angle) * force * 0.02;
                }
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.globalAlpha = (1 - distance / 100) * 0.2;
                    this.ctx.stroke();
                }
            });
        });
        
        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// CURSOR GLOW EFFECT
// ========================================
class CursorGlow {
    constructor() {
        this.cursor = document.querySelector('.cursor-glow');
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        
        this.init();
    }
    
    init() {
        // Check if touch device
        if (window.matchMedia('(pointer: coarse)').matches) {
            this.cursor.style.display = 'none';
            return;
        }
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.animate();
    }
    
    animate() {
        // Smooth follow
        this.cursorX += (this.mouseX - this.cursorX) * 0.1;
        this.cursorY += (this.mouseY - this.cursorY) * 0.1;
        
        this.cursor.style.left = this.cursorX + 'px';
        this.cursor.style.top = this.cursorY + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// MAGNETIC BUTTONS
// ========================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic-btn');
        this.init();
    }
    
    init() {
        // Skip on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMouseMove(e, btn));
            btn.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, btn));
        });
    }
    
    handleMouseMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }
    
    handleMouseLeave(e, btn) {
        btn.style.transform = 'translate(0, 0)';
    }
}

// ========================================
// CARD TILT EFFECT
// ========================================
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .skill-category, .stat-card, .hackathon-card');
        this.init();
    }
    
    init() {
        // Skip on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }
    
    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }
    
    handleMouseLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.navbar = document.querySelector('.navbar');
        this.scrollProgress = document.querySelector('.scroll-progress');
        
        this.init();
    }
    
    init() {
        // Intersection Observer for sections
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.updateActiveNav(entry.target.id);
                }
            });
        }, { threshold: 0.2 });
        
        this.sections.forEach(section => {
            section.classList.add('reveal');
            sectionObserver.observe(section);
        });
        
        // Timeline observer
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.5 });
        
        this.timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
        
        // Stats counter observer
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
        
        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Update scroll progress
        this.scrollProgress.style.width = scrollPercent + '%';
        
        // Navbar background
        if (scrollTop > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    updateActiveNav(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            }
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * (target - start) + start);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

// ========================================
// TYPEWRITER EFFECT
// ========================================
class Typewriter {
    constructor() {
        this.element = document.querySelector('.typewriter');
        this.words = [
            'AI systems',
            'full-stack apps',
            'futuristic experiences',
            'real-world solutions'
        ];
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        this.type();
    }
    
    type() {
        const currentWord = this.words[this.wordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
            this.typingSpeed = 50;
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
            this.typingSpeed = 100;
        }
        
        if (!this.isDeleting && this.charIndex === currentWord.length) {
            this.isDeleting = true;
            this.typingSpeed = 2000; // Pause at end
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            this.typingSpeed = 500; // Pause before new word
        }
        
        setTimeout(() => this.type(), this.typingSpeed);
    }
}

// ========================================
// PROJECT FILTERS
// ========================================
class ProjectFilters {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        
        this.init();
    }
    
    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn));
        });
    }
    
    handleFilter(btn) {
        const filter = btn.dataset.filter;
        
        // Update active button
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter projects
        this.projectCards.forEach(card => {
            const categories = card.dataset.category || '';
            
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ========================================
// POPUP MODAL
// ========================================
class PopupModal {
    constructor() {
        this.modal = document.getElementById('popupModal');
        this.closeBtn = document.querySelector('.popup-close');
        
        // ONLY buttons trigger popup (NOT links)
        this.viewProjectBtns = document.querySelectorAll('.view-project');

        this.init();
    }
    
    init() {
        this.viewProjectBtns.forEach(btn => {
            // 🚀 Only trigger popup if it's NOT a link
            if (btn.tagName !== 'A') {
                btn.addEventListener('click', () => this.openModal());
            }
        });
        
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// MOBILE NAVIGATION
// ========================================
class MobileNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        
        this.init();
    }
    
    init() {
        if (!this.hamburger) return;
        
        this.hamburger.addEventListener('click', () => this.toggleNav());
        
        // Close nav on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeNav());
        });
    }
    
    toggleNav() {
        this.hamburger.classList.toggle('active');
        this.navLinks.classList.toggle('active');
    }
    
    closeNav() {
        this.hamburger.classList.remove('active');
        this.navLinks.classList.remove('active');
    }
}

// ========================================
// SKILL TAG ANIMATIONS
// ========================================
class SkillTags {
    constructor() {
        this.skillTags = document.querySelectorAll('.skill-tag:not(.explore)');
        this.init();
    }
    
    init() {
        this.skillTags.forEach(tag => {
            const level = tag.dataset.level;
            if (level) {
                tag.addEventListener('mouseenter', () => {
                    tag.style.background = `linear-gradient(90deg, rgba(0, 212, 255, 0.3) ${level}%, rgba(0, 212, 255, 0.1) ${level}%)`;
                });
                
                tag.addEventListener('mouseleave', () => {
                    tag.style.background = 'rgba(0, 212, 255, 0.1)';
                });
            }
        });
    }
}

// ========================================
// RIPPLE EFFECT
// ========================================
class RippleEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .project-btn, .submit-btn');
        this.init();
    }
    
    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.createRipple(e, btn));
        });
    }
    
    createRipple(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// ========================================
// PARALLAX EFFECT
// ========================================
class ParallaxEffect {
    constructor() {
        this.heroImage = document.querySelector('.hero-image-wrapper');
        this.init();
    }
    
    init() {
        // Skip on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (this.heroImage && scrollY < window.innerHeight) {
                this.heroImage.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        });
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========================================
// FORM HANDLING
// ========================================
class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            // Formspree handles the submission
            // Add loading state
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }
}

// ========================================
// TEXT SCRAMBLE EFFECT
// ========================================
class TextScramble {
    constructor() {
        this.elements = document.querySelectorAll('.section-title, .project-title');
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.init();
    }
    
    init() {
        // Skip on touch devices for performance
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.scramble(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.elements.forEach(el => observer.observe(el));
    }
    
    scramble(element) {
        const originalText = element.textContent;
        const length = originalText.length;
        let iteration = 0;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    if (char === ' ') return ' ';
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');
            
            iteration += 1 / 2;
            
            if (iteration >= length) {
                clearInterval(interval);
                element.textContent = originalText;
            }
        }, 30);
    }
}

// ========================================
// GLITCH EFFECT
// ========================================
class GlitchEffect {
    constructor() {
        this.logo = document.querySelector('.nav-logo .logo-text');
        this.init();
    }
    
    init() {
        if (!this.logo) return;
        
        this.logo.addEventListener('mouseenter', () => {
            this.logo.style.animation = 'glitch 0.3s ease';
        });
        
        this.logo.addEventListener('animationend', () => {
            this.logo.style.animation = '';
        });
    }
}

// ========================================
// INITIALIZE ALL
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ParticleSystem();
    new CursorGlow();
    new MagneticButtons();
    new CardTilt();
    new ScrollAnimations();
    new Typewriter();
    new ProjectFilters();
    new PopupModal();
    new MobileNav();
    new SkillTags();
    new RippleEffect();
    new ParallaxEffect();
    new SmoothScroll();
    new FormHandler();
    new TextScramble();
    new GlitchEffect();
    
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        
        .reveal {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        
        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Mobile nav styles */
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            background: rgba(10, 10, 15, 0.98);
            padding: 2rem;
            gap: 1.5rem;
            border-bottom: 1px solid var(--glass-border);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
    document.head.appendChild(style);
    
    // Console easter egg
    console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; font-weight: bold; color: #00d4ff;');
    console.log('%cWelcome to Diya\'s portfolio! 🚀', 'font-size: 16px; color: #b347d9;');
    console.log('%cFeel free to explore the code. Let\'s build something amazing together!', 'font-size: 14px; color: #ff6b9d;');
});

// Performance optimization: Pause animations when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});
