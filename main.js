// Pastel Portfolio Animations and Interactions
class PastelPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupSparkles();
        this.setupFormValidation();
        this.setupProjectFilters();
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Hover effects for cards and buttons
    setupHoverEffects() {
        // Card hover effects
        document.querySelectorAll('.hover-lift').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn-hover').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });
    }

    // Sparkle animation for hero section
    setupSparkles() {
        const sparkleContainer = document.querySelector('.sparkle-container');
        if (!sparkleContainer) return;

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createSparkle(sparkleContainer);
            }, i * 200);
        }

        // Continue creating sparkles
        setInterval(() => {
            this.createSparkle(sparkleContainer);
        }, 3000);
    }

    createSparkle(container) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.fontSize = Math.random() * 10 + 15 + 'px';
        sparkle.style.opacity = '0';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.transition = 'all 2s ease-out';

        container.appendChild(sparkle);

        // Animate sparkle
        setTimeout(() => {
            sparkle.style.opacity = '1';
            sparkle.style.transform = 'translateY(-20px) scale(1.2)';
        }, 100);

        setTimeout(() => {
            sparkle.style.opacity = '0';
            sparkle.style.transform = 'translateY(-40px) scale(0.8)';
        }, 1000);

        setTimeout(() => {
            sparkle.remove();
        }, 3000);
    }

    // Form validation
    setupFormValidation() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = form.querySelector('#name').value.trim();
            const email = form.querySelector('#email').value.trim();
            const message = form.querySelector('#message').value.trim();

            if (!name || !email || !message) {
                this.showNotification('Please fill in all fields! 💕', 'error');
                return;
            }

            if (!this.isValidEmail(email)) {
                this.showNotification('Please enter a valid email address! 📧', 'error');
                return;
            }

            this.showNotification('Message sent successfully! Thank you! 🌸', 'success');
            form.reset();
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '25px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'all 0.3s ease';

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #a8e6cf, #88d8a3)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #ff8a80, #ff6b6b)';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Project filtering
    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PastelPortfolio();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add floating animation to elements
function addFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.float-animation');
    floatingElements.forEach((el, index) => {
        el.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });
}

// CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
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
    
    .fade-in-up {
        animation: fadeInUp 0.8s ease-out;
    }
`;
document.head.appendChild(style);

// Initialize floating animations
document.addEventListener('DOMContentLoaded', addFloatingAnimation);
