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
            'AI systems that adapt',
            'products people can use',
            'full-stack systems',
            'games that feel alive'
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
        this.projectCards = document.querySelectorAll('#projects .project-card');
        
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
        if (!this.modal || !this.closeBtn) return;
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



// ======================================================
// PREMIUM UI ENHANCEMENTS
// ======================================================
const PROJECT_DETAILS = {
  'INTERVUE': {
    tagline: 'Adaptive AI mock interviews that decide the next question from your performance.',
    problem: 'Most mock interviews follow a fixed sequence. INTERVUE uses resume context, job requirements, previous answers, evaluation signals and voice to adapt the interview flow.',
    tech: ['React + TypeScript','FastAPI','LangGraph','LangChain','OpenRouter','Sarvam STT/TTS','Supabase','PostgreSQL'],
    architecture: 'Resume → Structured Candidate Profile → Stateful Interview Graph → Technical / Behavioral / Situational Question → Text or Voice Answer → Evaluation → Deterministic Decision Layer → Next Question',
    live: 'https://intervue-frontend-tgi7.onrender.com/',
    github: 'https://github.com/diyavinod1'
  },
  'PlotTwist AI': {
    tagline: 'You give the words. AI finds the story.',
    problem: 'A creative story-building workflow that turns random or custom words into characters, worlds, conflict, twists and a complete story while validating the required words.',
    tech: ['React','Next.js','TypeScript','Tailwind CSS','OpenRouter','Supabase','PostgreSQL','Zod'],
    architecture: 'Words → Story Planner → Characters + World → Conflict → Story → Word Validator → Revision → Final Story',
    live: 'https://plottwist-ai.onrender.com/',
    github: 'https://github.com/diyavinod1/PlotTwist-AI'
  },
  'VaidyaAI': { tagline:'Voice-first multilingual AI triage assistant.', problem:'Helps users describe symptoms through text or voice, reason about severity and find nearby care options while generating concise summaries.', tech:['React','FastAPI','Python','LLM APIs','Speech APIs','OpenStreetMap'], architecture:'Voice / Text → Symptom Extraction → AI Triage → Severity + Guidance → Care Options → Summary', live:'https://vaidyaai-frontend.onrender.com', github:'https://github.com/diyavinod1/VaidyaAI.git' },
  'JobFit AI': { tagline:'Resume-to-job matching directly where you search.', problem:'Compares resumes with job descriptions, surfaces skill gaps, creates ATS-style matching insights and recruiter-ready pitch content.', tech:['JavaScript','LLM APIs','NLP','Chrome Extensions'], architecture:'Job Description + Resume → Matching → Missing Skills → Match Insights → Recruiter Pitch', live:'https://chromewebstore.google.com/detail/jobfit-ai-%E2%80%94-ai-job-match/dkodefdamagkhfpdgacgiajbiomncjfl?utm_source=item-share-cb', github:'' },
  'AgroBuddy': { tagline:'Multimodal AI assistance for practical farming workflows.', problem:'Combines image, voice and text interactions to help farmers understand crop issues and access practical guidance across Indian languages.', tech:['Python','FastAPI','OpenRouter','Supabase','OpenCV','Telegram Bot API'], architecture:'Image / Voice / Text → Multimodal Reasoning → Farming Guidance → User Response', live:'', github:'https://github.com/diyavinod1/AgroBuddy' },
  'ReLaunchAI': { tagline:'AI-powered career restart guidance.', problem:'Helps professionals returning after career breaks identify skill gaps, rebuild resumes, prepare for interviews and follow a personalized roadmap.', tech:['Python','FastAPI','Streamlit','NLP','LLM APIs'], architecture:'Career Profile → Skill Gap → Resume + Interview Support → 30-Day Roadmap', live:'https://relaunchai.streamlit.app/', github:'https://github.com/diyavinod1/RelaunchAI' },
  'NutriTrack': { tagline:'Meal planning and nutrition tracking in one product.', problem:'A full-stack nutrition platform for food logging, personalized meal planning and analytics backed by MongoDB.', tech:['React','Node.js','Express','MongoDB'], architecture:'User Data → Meal Planning → Food Logging → Nutrition Analytics', live:'', github:'https://github.com/diyavinod1/Online-Meal-Planner-and-Nutrition-Tracker' },
  'LookIn': { tagline:'Don\'t log in. Just LookIn.', problem:'Passwordless face authentication using browser face embeddings, secure sessions and a Node/MongoDB backend.', tech:['React','Vite','Tailwind','Node.js','Express','MongoDB','face-api.js','JWT'], architecture:'Webcam → Face Detection → 128D Embedding → Matching → Secure Session', live:'', github:'https://github.com/diyavinod1/LookIn-Passwordless-Face-Auth' }
};

function openUIModal(id){ const m=document.getElementById(id); if(!m)return; m.classList.add('open'); m.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); }
function closeUIModal(id){ const m=document.getElementById(id); if(!m)return; m.classList.remove('open'); m.setAttribute('aria-hidden','true'); if(!document.querySelector('.ui-modal.open')) document.body.classList.remove('modal-open'); }

function initPremiumUI(){

  // Recruiter modal
  document.querySelectorAll('.recruiter-trigger').forEach(btn=>btn.addEventListener('click',()=>openUIModal('recruiterModal')));

  // Project categories + card-wide deep dive.
  const categoryMap={
    'INTERVUE':['ai','fullstack','featured'],'PlotTwist AI':['ai','fullstack','web'],'LookIn':['ai','fullstack','web'],
    'VaidyaAI':['ai','fullstack','featured'],'AgroBuddy':['ai','fullstack','featured'],'ReLaunchAI':['ai','web'],
    'NutriTrack':['web','fullstack'],'JobFit AI':['ai','extension','featured']
  };

  function showProjectDetails(title){
    const d=PROJECT_DETAILS[title]; if(!d)return;
    document.getElementById('projectModalTitle').textContent=title;
    document.getElementById('projectModalTagline').textContent=d.tagline;
    document.getElementById('projectModalProblem').textContent=d.problem;
    document.getElementById('projectModalArchitecture').textContent=d.architecture;
    document.getElementById('projectModalTech').innerHTML=d.tech.map(t=>`<span>${t}</span>`).join('');
    const live=document.getElementById('projectModalLive'); const gh=document.getElementById('projectModalGithub');
    live.href=d.live||'#'; live.style.display=d.live?'inline-flex':'none';
    gh.href=d.github||'#'; gh.style.display=d.github?'inline-flex':'none';
    openUIModal('projectModal');
  }

  document.querySelectorAll('#projects .project-card').forEach(card=>{
    const title=card.querySelector('.project-title')?.textContent.trim();
    if(categoryMap[title]) card.dataset.category=[...new Set((card.dataset.category||'').split(/\s+/).concat(categoryMap[title]).filter(Boolean))].join(' ');
    if(title && PROJECT_DETAILS[title]){
      card.dataset.detailProject=title;
      card.setAttribute('tabindex','0');
      card.setAttribute('role','button');
      card.addEventListener('click',e=>{
        if(e.target.closest('a,button')) return;
        showProjectDetails(title);
      });
      card.addEventListener('keydown',e=>{
        if((e.key==='Enter'||e.key===' ') && !e.target.closest('a,button')){ e.preventDefault(); showProjectDetails(title); }
      });
    }
  });

  // Certificate viewer
  document.querySelectorAll('.certificate-trigger').forEach(card=>card.addEventListener('click',(e)=>{
    e.preventDefault();
    const path=card.getAttribute('href'); const title=card.querySelector('h4')?.textContent||'Certificate'; const issuer=card.querySelector('span')?.textContent||'';
    document.getElementById('certificateTitle').textContent=title; document.getElementById('certificateIssuer').textContent=issuer;
    document.getElementById('certificateOpen').href=path;
    const frame=document.getElementById('certificateFrame'); frame.innerHTML='';
    const lower=path.toLowerCase();
    const missingCertificate = lower.includes('algorithmic-graph-theory-placeholder') || lower.includes('database-management-system-placeholder');
    if(missingCertificate){
      frame.innerHTML='<div style="padding:2.5rem;text-align:center;color:var(--text-muted)"><strong style="display:block;color:var(--text-primary);font-size:1.1rem;margin-bottom:.5rem">Certificate file not included in the uploaded portfolio yet.</strong><span>The certification is listed here and ready for its PDF to be added.</span></div>';
      document.getElementById('certificateOpen').style.display='none';
    } else if(lower.endsWith('.pdf')){ const iframe=document.createElement('iframe'); iframe.src=path; iframe.title=title; frame.appendChild(iframe); document.getElementById('certificateOpen').style.display=''; }
    else { document.getElementById('certificateOpen').style.display=''; const img=document.createElement('img'); img.src=path; img.alt=title; img.onerror=()=>{frame.innerHTML='<p style="color:var(--text-muted);padding:2rem;text-align:center">Certificate preview unavailable. Use “Open Fullscreen”.</p>';}; frame.appendChild(img); }
    openUIModal('certificateModal');
  }));

  // Modal close + escape
  document.querySelectorAll('[data-close-modal]').forEach(btn=>btn.addEventListener('click',()=>closeUIModal(btn.dataset.closeModal)));
  document.querySelectorAll('.ui-modal-backdrop').forEach(bg=>bg.addEventListener('click',()=>closeUIModal(bg.parentElement.id)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.ui-modal.open').forEach(m=>closeUIModal(m.id));});

  // Broken-image fallback: preserve layout when optional assets are not present.
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error',()=>{
      if(img.dataset.fallbackApplied)return; img.dataset.fallbackApplied='1';
      const title=(img.alt||'Diya Portfolio').replace(/\s+preview.*$/i,'');
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#10131b"/><stop offset=".55" stop-color="#182b3a"/><stop offset="1" stop-color="#281631"/></linearGradient></defs><rect width="900" height="500" fill="url(#g)"/><circle cx="740" cy="90" r="170" fill="#00d4ff" opacity=".08"/><circle cx="170" cy="420" r="180" fill="#b347d9" opacity=".08"/><text x="450" y="235" fill="#fff" font-family="Arial, sans-serif" font-size="38" font-weight="700" text-anchor="middle">${title.replace(/[&<>]/g,'')}</text><text x="450" y="280" fill="#7f8a9c" font-family="Arial, sans-serif" font-size="18" text-anchor="middle">Diya Vinod · Portfolio</text></svg>`;
      img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
    },{once:true});
  });

  // GitHub public profile + repositories
  const repoList=document.getElementById('repo-list');
  if(repoList){
    Promise.all([fetch('https://api.github.com/users/diyavinod1').then(r=>r.json()), fetch('https://api.github.com/users/diyavinod1/repos?sort=updated&per_page=6').then(r=>r.json())])
      .then(([profile,repos])=>{
        if(profile && !profile.message){
          document.getElementById('github-bio').textContent=profile.bio||'Building AI systems, full-stack products and developer experiments.';
          document.getElementById('github-repos').textContent=profile.public_repos ?? '—';
          document.getElementById('github-followers').textContent=profile.followers ?? '—';
        }
        if(Array.isArray(repos)){
          const usable=repos.filter(r=>!r.fork).slice(0,6);
          const latest=usable[0]?.pushed_at ? new Date(usable[0].pushed_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : '—';
          document.getElementById('github-updated').textContent=latest;
          repoList.innerHTML=usable.map(r=>`<a class="repo-card" href="${r.html_url}" target="_blank" rel="noopener noreferrer"><h4>${r.name}</h4><p>${r.description||'No description yet.'}</p><div class="repo-meta"><span>★ ${r.stargazers_count}</span><span>${r.language||'Code'}</span></div></a>`).join('') || '<div class="repo-loading">No public repositories found.</div>';
        }
      }).catch(()=>{ repoList.innerHTML='<div class="repo-loading">GitHub snapshot is temporarily unavailable. <a href="https://github.com/diyavinod1" target="_blank" rel="noopener noreferrer">Open GitHub ↗</a></div>'; });
  }
}

// Start enhancements after the existing portfolio bootstrapping.
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initPremiumUI); else initPremiumUI();

// Performance optimization: Pause animations when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});

// ======================================================
// 2026 UX UPGRADE PACK
// ======================================================
(function(){
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Fast loading experience — never holds the page for long.
  function finishLoader(){
    const loader = $('#siteLoader');
    if(!loader) return;
    loader.classList.add('is-done');
    setTimeout(()=>loader.remove(), 650);
  }
  if(document.readyState === 'loading') window.addEventListener('load', ()=>setTimeout(finishLoader, 450), {once:true});
  else setTimeout(finishLoader, 450);

  // Resume preview.
  $$('.resume-preview-trigger').forEach(btn=>btn.addEventListener('click',()=>openUIModal('resumeModal')));

  // Share + copy portfolio.
  function toast(message){
    let t=$('#portfolioToast');
    if(!t){
      t=document.createElement('div'); t.id='portfolioToast'; t.className='portfolio-toast'; document.body.appendChild(t);
    }
    t.textContent=message; t.classList.add('show');
    clearTimeout(t._timer); t._timer=setTimeout(()=>t.classList.remove('show'),1800);
  }
  async function copyPortfolio(){
    const url=window.location.href.split('#')[0];
    try{ await navigator.clipboard.writeText(url); toast('Portfolio link copied ✓'); }
    catch(e){
      const ta=document.createElement('textarea'); ta.value=url; document.body.appendChild(ta); ta.select();
      try{document.execCommand('copy');toast('Portfolio link copied ✓');}catch(_){toast('Copy unavailable — use the address bar.');}
      ta.remove();
    }
  }
  async function sharePortfolio(){
    const data={title:'Diya Vinod · AI / ML Engineer & Full-Stack Builder',text:'Explore Diya Vinod’s AI, full-stack and creative builds.',url:window.location.href.split('#')[0]};
    if(navigator.share){try{await navigator.share(data);return;}catch(e){if(e.name==='AbortError')return;}}
    await copyPortfolio();
  }
  $$('.copy-trigger').forEach(b=>b.addEventListener('click',copyPortfolio));
  $$('.share-trigger').forEach(b=>b.addEventListener('click',sharePortfolio));

  // Command palette.
  const palette=$('#commandPalette'), search=$('#commandSearch'), list=$('#commandList');
  const commands=[
    ['⌂','Home','Go to the top','section','#home'],
    ['◉','About','Meet the builder','section','#about'],
    ['⚙','Skills','Tech stack & strengths','section','#skills'],
    ['▦','Projects','AI + full-stack work','section','#projects'],
    ['✦','Games','Play the browser builds','section','#games'],
    ['◈','Achievements','Hackathons, internships & certs','section','#achievements'],
    ['↗','Contact','Start a conversation','section','#contact'],
    ['⌁','Preview Resume','Open recruiter-ready resume preview','action','resume'],
    ['◎','Recruiter View','Open the quick recruiter snapshot','action','recruiter'],
    ['⧉','Copy Portfolio Link','Copy the current portfolio URL','action','copy'],
    ['↗','Share Portfolio','Use the device share sheet','action','share'],
    ['GH','GitHub','Open github.com/diyavinod1','external','https://github.com/diyavinod1'],
    ['in','LinkedIn','Open Diya’s LinkedIn','external','https://www.linkedin.com/in/diyavinod1/'],
    ['✦','Developer Mode','Open the hidden terminal easter egg','action','dev']
  ];
  let selected=0;
  function closePalette(){if(!palette)return;palette.classList.remove('open');palette.setAttribute('aria-hidden','true');}
  function openPalette(){if(!palette)return;palette.classList.add('open');palette.setAttribute('aria-hidden','false');renderCommands();setTimeout(()=>{search?.focus();search?.select();},30);}
  function renderCommands(){
    if(!list)return;
    const q=(search?.value||'').trim().toLowerCase();
    const filtered=commands.filter(c=>(c[1]+' '+c[2]).toLowerCase().includes(q));
    if(selected>=filtered.length) selected=0;
    list.innerHTML=filtered.length?filtered.map((c,i)=>`<button class="command-item ${i===selected?'selected':''}" data-command-index="${i}"><span class="command-item-main"><span class="command-item-icon">${c[0]}</span><span><span class="command-item-label">${c[1]}</span><span class="command-item-meta">${c[2]}</span></span></span><span class="command-item-meta">${c[3]==='external'?'↗':c[3]==='section'?'#':''}</span></button>`).join(''):`<div class="command-item-meta" style="padding:1rem">No command found.</div>`;
    $$('.command-item',list).forEach(btn=>btn.addEventListener('click',()=>runCommand(filtered[Number(btn.dataset.commandIndex)])));
  }
  function runCommand(c){
    if(!c)return; closePalette();
    if(c[3]==='section'){document.querySelector(c[4])?.scrollIntoView({behavior:'smooth',block:'start'});}
    else if(c[4]==='resume')openUIModal('resumeModal');
    else if(c[4]==='recruiter')openUIModal('recruiterModal');
    else if(c[4]==='copy')copyPortfolio();
    else if(c[4]==='share')sharePortfolio();
    else if(c[4]==='dev')openDevConsole();
    else if(c[3]==='external')window.open(c[4],'_blank','noopener,noreferrer');
  }
  $$('.command-trigger').forEach(b=>b.addEventListener('click',openPalette));
  search?.addEventListener('input',()=>{selected=0;renderCommands();});
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();palette?.classList.contains('open')?closePalette():openPalette();return;}
    if(!palette?.classList.contains('open'))return;
    if(e.key==='Escape'){closePalette();return;}
    const items=$$('.command-item',list); if(e.key==='ArrowDown'){e.preventDefault();selected=(selected+1)%Math.max(items.length,1);renderCommands();} if(e.key==='ArrowUp'){e.preventDefault();selected=(selected-1+Math.max(items.length,1))%Math.max(items.length,1);renderCommands();} if(e.key==='Enter'&&items[selected]){e.preventDefault();items[selected].click();}
  });
  $('.command-backdrop')?.addEventListener('click',closePalette);

  // Mobile bottom nav active state.
  const mobileItems=$$('.mobile-nav-item');
  const targets=mobileItems.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver' in window && targets.length){
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){mobileItems.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-35% 0px -55% 0px',threshold:0});
    targets.forEach(t=>obs.observe(t));
  }

  // Developer easter eggs: type "sudo diya" or use ↑ ↑ ↓ ↓ ← → ← → B A.
  const dev=$('#devConsole'), body=$('#devConsoleBody');
  function openDevConsole(){
    if(!dev||!body)return; dev.classList.add('open');dev.setAttribute('aria-hidden','false');
    const lines=[
      '<span class="accent">$ whoami</span>','diya@portfolio',
      '<span class="accent">$ cat status.txt</span>','building → debugging → shipping → repeating',
      '<span class="accent">$ stack --now</span>','React · TypeScript · Python · FastAPI · LangGraph · Supabase · LLMs',
      '<span class="accent">$ git status</span>','On branch <span class="accent">main</span> · 9+ projects · 1760+ problems solved',
      '<span class="accent">$ echo "keep building"</span>','keep building. 🚀',
      '<span class="muted">// You found the developer room.</span>'
    ];
    body.innerHTML=lines.join('\n');
  }
  function closeDevConsole(){dev?.classList.remove('open');dev?.setAttribute('aria-hidden','true');}
  $('#devConsoleClose')?.addEventListener('click',closeDevConsole); dev?.addEventListener('click',e=>{if(e.target===dev)closeDevConsole();});
  let typed=''; const konami=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let keys=[];
  document.addEventListener('keydown',e=>{
    if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;
    typed=(typed+e.key.toLowerCase()).slice(-9); if(typed.includes('sudo diya'))openDevConsole();
    keys.push(e.key); keys=keys.slice(-konami.length); if(keys.every((k,i)=>k.toLowerCase()===konami[i].toLowerCase()))openDevConsole();
    if(e.key==='Escape'&&dev?.classList.contains('open'))closeDevConsole();
  });

  // Better image fallback: local, deterministic SVG — no third-party placeholder service.
  function applyFallback(img){
    if(img.dataset.fallbackApplied)return; img.dataset.fallbackApplied='1';
    const raw=(img.alt||'Diya Portfolio').replace(/\s+(project|browser game|hackathon|logo|preview).*$/i,'').trim()||'Diya Portfolio';
    const safe=raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').slice(0,36);
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b1019"/><stop offset=".58" stop-color="#142333"/><stop offset="1" stop-color="#24152d"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/><circle cx="1010" cy="100" r="240" fill="#00d4ff" opacity=".07"/><circle cx="150" cy="590" r="260" fill="#b347d9" opacity=".07"/><path d="M0 560L340 370l180 100 240-180 440 250V675H0Z" fill="#fff" opacity=".025"/><rect x="65" y="65" width="1070" height="545" rx="28" fill="none" stroke="#00d4ff" stroke-opacity=".16"/><text x="600" y="318" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="52" font-weight="800" text-anchor="middle">${safe}</text><text x="600" y="365" fill="#7f8a9c" font-family="Arial,Helvetica,sans-serif" font-size="20" text-anchor="middle">Diya Vinod · Portfolio</text></svg>`;
    img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }
  $$('img').forEach(img=>{if(img.complete&&img.naturalWidth===0)applyFallback(img);img.addEventListener('error',()=>applyFallback(img),{once:true});});

  // Recruiter-friendly toast styling, injected once to avoid touching the core design system.
  const toastStyle=document.createElement('style');
  toastStyle.textContent='.portfolio-toast{position:fixed;left:50%;bottom:28px;z-index:100010;transform:translate(-50%,20px);opacity:0;pointer-events:none;padding:.72rem 1rem;border:1px solid rgba(0,212,255,.18);border-radius:999px;background:rgba(7,10,16,.9);backdrop-filter:blur(16px);color:#e9f5ff;font:700 .68rem/1 "Space Grotesk",sans-serif;box-shadow:0 15px 45px rgba(0,0,0,.35);transition:.25s ease}.portfolio-toast.show{opacity:1;transform:translate(-50%,0)}';
  document.head.appendChild(toastStyle);
})();


/* Achievement card deep-dive modal */
(function(){
  const data = {
    'hackathon:sprintathon-2026': {
      type:'HACKATHON · SPRINTATHON 2026', title:'HireWise AI', meta:'Sprintathon 2026 · Team Leader · Finalist',
      description:'Fairer Hiring. Smarter Careers. An explainable, bias-aware AI hiring and career intelligence platform built to connect candidates, recruiters, and actionable career guidance.',
      role:'Team Leader', team:'Team build · Diya Vinod, Janani, Rakshitha, Sanjusri',
      highlights:['Resume-to-Role Fit Scorer with explainability','Independent fairness auditing using demographic parity','Candidate skill gaps, adaptive interview preparation, resume optimization, and career roadmaps','Recruiter workflows with explainable ranking and candidate status management'],
      image:'assets/achievement-previews/sprintathon-2026.jpg', pdf:'assets/pdfs/hackathons/sprintathon-2026.pdf'
    },
    'hackathon:buildathon-2026': {
      type:'HACKATHON · BUILDATHON 2026', title:'Buildathon 2026', meta:'Buildathon 2026 · Team Leader · 2 Rounds',
      description:'One buildathon journey across two rounds — EduPortal in Round 1 and TalentSync AI in Round 2.',
      role:'Team Leader', team:'Team build · Diya Vinod + Rakshitha V.',
      highlights:['Round 1 — EduPortal: AI-powered education management platform for students, teachers, and admins','Round 2 — TalentSync AI: internal talent discovery connecting people, skills, experience, requirements, and opportunities','Built across React/TypeScript, Node/Express, MongoDB, FastAPI, LLM/NLP semantic matching, and Render'],
      image:'assets/achievement-previews/buildathon.jpg', pdf:'assets/pdfs/hackathons/buildathon.pdf', live:'https://eduportal-xti9.onrender.com/', secondLive:'https://talentsync-ai-ajyl.onrender.com/'
    },
    'hackathon:tnwise-2026': {
      type:'HACKATHON · TNWISE 2026', title:'TNWISE 2026', meta:'TNWISE 2026 · Team Leader',
      description:'Led a small team through a hackathon build from problem statement to working prototype.', role:'Team Leader', team:'Team build · Diya Vinod, Vinitha, Alshifha',
      highlights:['Team leadership and rapid prototyping','Translated the problem statement into a working technology solution under a hackathon deadline'], image:'assets/achievement-previews/tnwise-2026.jpg', pdf:'assets/pdfs/hackathons/tnwise-2026.pdf'
    },
    'hackathon:devspark-25': {
      type:'HACKATHON · DEVSPARK\'25', title:"DevSpark'25", meta:"DevSpark'25 · KPR Institute of Engineering and Technology · Team Leader",
      description:'Built a Smart Hospital Queue Management System as a hackathon project focused on improving the patient queue experience.', role:'Team Leader', team:'Team build · Diya Vinod, Aishwarya, Haripriya, Dharanipriya',
      highlights:['Project: Smart Hospital Queue Management System','Organizer: KPR Institute of Engineering and Technology','Role: Team Leader','Team members: Aishwarya, Haripriya, Dharanipriya'], image:'assets/achievement-previews/devspark-25.jpg', pdf:'assets/pdfs/hackathons/devspark-25.pdf'
    },
    'hackathon:east-india-blockchain': {
      type:'HACKATHON · EAST INDIA BLOCKCHAIN SUMMIT 2.0', title:'Emergency & Disaster Relief Stablecoin System', meta:'East India BLOCKCHAIN Summit 2.0 · IIT Kharagpur · Team Leader · Finalist',
      description:'A finalist hackathon build focused on using blockchain-based mechanisms for emergency and disaster relief.', role:'Team Leader · Finalist', team:'Team build · Diya Vinod, Haripriya, Dharanipriya, Maheswari',
      highlights:['Organizer: IIT Kharagpur','Project: Emergency & Disaster Relief Stablecoin System','Recognition: Finalist','Role: Team Leader','Team members: Haripriya, Dharanipriya, Maheswari'], image:'assets/achievement-previews/east-india-blockchain.jpg', pdf:'assets/pdfs/hackathons/east-india-blockchain.pdf'
    },
    'hackathon:tnimpact': {
      type:'HACKATHON · TNIMPACT 2026', title:'Multilingual Voice-first Health Assistant', meta:'TNIMPACT 2026 · TANCAM · Solo Builder',
      description:'Built a multilingual voice-first health assistant designed around accessible health conversations and local-language interaction.', role:'Solo Builder', team:'Individual build · Diya Vinod',
      highlights:['Organizer: TANCAM','Project: Multilingual Voice-first Health Assistant','Voice-first, multilingual interaction for accessible health guidance'], image:'assets/achievement-previews/tnimpact.jpg', pdf:'assets/pdfs/hackathons/tnimpact.pdf'
    },
    'internship:decodelabs': {
      type:'INTERNSHIP · DECODELABS', title:'Generative AI Intern', meta:'DecodeLabs · May 20 – Jun 20, 2026 · Remote',
      description:'Worked on practical Generative AI workflows across prompt engineering, image generation, document analysis, multimodal experimentation, and safety evaluation.', role:'Generative AI Intern', team:'Individual internship',
      highlights:['Prompt engineering and applied GenAI workflows','Image generation and multimodal experimentation','RAG-based document analysis','AI safety testing and evaluation'], image:'assets/internships/certificates/decodelabs.jpg'
    },
    'internship:qskill': {
      type:'INTERNSHIP · QSKILL', title:'AI/ML Intern', meta:'QSkill · Jun 1 – Jul 1, 2026',
      description:'Worked across practical machine learning workflows, data analysis, predictive modelling, and applied AI experiments.', role:'AI/ML Intern', team:'Individual internship',
      highlights:['Machine learning solutions','Data analysis and preprocessing','Predictive modelling','Practical AI applications'], image:'assets/internships/certificates/qskill.jpg'
    },
    'internship:servicenow': {
      type:'INTERNSHIP · SERVICENOW', title:'Virtual Internship Program', meta:'ServiceNow · Jul 2026',
      description:'Explored Agentic AI concepts alongside ServiceNow administration, workflow automation, testing, reporting, and CSA preparation.', role:'Virtual Intern', team:'Individual internship',
      highlights:['Agentic AI concepts','ServiceNow administration','Workflow automation','Testing and reporting','CSA preparation'], image:'assets/internships/certificates/servicenow.jpg'
    }
  };
  function openAchievement(key){
    const d=data[key]; if(!d) return;
    const m=document.getElementById('achievementModal'); if(!m) return;
    document.getElementById('achievementModalType').textContent=d.type;
    document.getElementById('achievementModalTitle').textContent=d.title;
    document.getElementById('achievementModalMeta').textContent=d.meta;
    document.getElementById('achievementModalDescription').textContent=d.description;
    document.getElementById('achievementModalRole').textContent=d.role;
    document.getElementById('achievementModalTeam').textContent=d.team;
    const img=document.getElementById('achievementModalImage'); img.src=d.image; img.alt=d.title;
    document.getElementById('achievementModalHighlights').innerHTML=d.highlights.map(x=>'<li>'+x+'</li>').join('');
    const live=document.getElementById('achievementModalLive');
    const live2=document.getElementById('achievementModalSecondLive');
    if(d.live){live.href=d.live;live.style.display='inline-flex'}else{live.style.display='none'}
    if(live2){ if(d.secondLive){live2.href=d.secondLive; live2.style.display='inline-flex'} else {live2.style.display='none'} }
    const pdf=document.getElementById('achievementModalPdf');
    if(d.pdf){pdf.href=d.pdf;pdf.style.display='inline-flex'}else{pdf.style.display='none'}
    if(typeof openUIModal==='function') openUIModal('achievementModal'); else {m.classList.add('open');m.setAttribute('aria-hidden','false')}
  }
  document.querySelectorAll('[data-achievement]').forEach(card=>{
    card.addEventListener('click',e=>{ if(e.button!==0) return; e.preventDefault(); openAchievement(card.dataset.achievement); });
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openAchievement(card.dataset.achievement)}});
    card.setAttribute('role','button'); card.setAttribute('tabindex','0');
  });
})();
