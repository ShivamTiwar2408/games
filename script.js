// Enhanced landing page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeGameCards();
    initializeThemeToggle();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeFloatingElements();
    initializeAccessibility();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Game cards functionality
function initializeGameCards() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const gameType = card.getAttribute('data-game');
        const playBtn = card.querySelector('.play-btn');
        
        // Card click handler
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the play button directly
            if (e.target.closest('.play-btn')) return;
            
            handleGameCardClick(gameType, card);
        });
        
        // Play button click handler
        if (playBtn) {
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                handleGameCardClick(gameType, card);
            });
        }
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            if (gameType !== 'coming-soon') {
                this.style.transform = 'translateY(-12px) scale(1.02)';
                
                // Add glow effect
                const gameIcon = this.querySelector('.game-icon');
                if (gameIcon) {
                    gameIcon.style.transform = 'scale(1.1)';
                    gameIcon.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
                }
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            
            const gameIcon = this.querySelector('.game-icon');
            if (gameIcon) {
                gameIcon.style.transform = '';
                gameIcon.style.textShadow = '';
            }
        });
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

// Handle game card clicks
function handleGameCardClick(gameType, card) {
    if (gameType === 'coming-soon') {
        // Enhanced coming soon animation
        card.style.animation = 'shake 0.6s ease-in-out';
        
        // Show notification
        showNotification('🚀 New games coming soon! Stay tuned for more divine adventures.', 'info');
        
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
        return;
    }
    
    // Add loading state
    const playBtn = card.querySelector('.play-btn');
    const originalContent = playBtn.innerHTML;
    
    playBtn.innerHTML = '<span class="play-icon">⏳</span><span class="play-text">Loading...</span>';
    playBtn.style.pointerEvents = 'none';
    
    // Add click animation
    card.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        card.style.transform = '';
        
        // Navigate to the game
        const gameUrls = {
            'krishna': 'games/krishna/index.html',
            'yudhishtira': 'games/yudhishtira/index.html',
            'snake': 'games/snake/index.html',
            'pong': 'games/pong/index.html'
        };
        
        if (gameUrls[gameType]) {
            // Add fade out effect
            document.body.style.opacity = '0.8';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = gameUrls[gameType];
            }, 300);
        } else {
            // Reset button if navigation fails
            playBtn.innerHTML = originalContent;
            playBtn.style.pointerEvents = '';
            showNotification('Game not available yet. Please try again later.', 'error');
        }
    }, 200);
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or default to system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        const isDark = document.body.classList.contains('dark-theme');
        this.textContent = isDark ? '☀️' : '🌙';
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Add transition effect
        this.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                themeToggle.textContent = '☀️';
            } else {
                document.body.classList.remove('dark-theme');
                themeToggle.textContent = '🌙';
            }
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('game-card')) {
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .hero-content,
        .hero-visual,
        .section-header,
        .feature-card,
        .game-card,
        .about-content,
        .wisdom-card
    `);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animations
    addScrollAnimationStyles();
}

// Smooth scrolling
function initializeSmoothScrolling() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced floating elements
function initializeFloatingElements() {
    const symbols = ['🪔', '🌸', '✨', '🎊', '🌺', '🕉️', '🎭', '🎪'];
    const container = document.body;
    let elementCount = 0;
    const maxElements = 8;
    
    function createFloatingElement() {
        if (elementCount >= maxElements) return;
        
        const element = document.createElement('div');
        element.className = 'floating-particle';
        element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 200;
        const duration = 8 + Math.random() * 4;
        const delay = Math.random() * 2;
        
        element.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: 100vh;
            font-size: ${1.2 + Math.random() * 0.8}rem;
            pointer-events: none;
            z-index: 1;
            opacity: 0;
            animation: floatUp ${duration}s linear ${delay}s forwards;
        `;
        
        container.appendChild(element);
        elementCount++;
        
        // Remove element after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
                elementCount--;
            }
        }, (duration + delay) * 1000);
    }
    
    // Create floating elements periodically
    const floatingInterval = setInterval(createFloatingElement, 2000);
    
    // Pause animations when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(floatingInterval);
        } else {
            setInterval(createFloatingElement, 2000);
        }
    });
    
    // Add floating animation styles
    addFloatingAnimationStyles();
}

// Accessibility enhancements
function initializeAccessibility() {
    // Keyboard navigation for game cards
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Focus indicators
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '4px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// Utility functions
function scrollToGames() {
    const gamesSection = document.getElementById('games');
    if (gamesSection) {
        gamesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function learnMore() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add dynamic styles
function addScrollAnimationStyles() {
    if (document.getElementById('scroll-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'scroll-animations';
    style.textContent = `
        .hero-content,
        .hero-visual,
        .section-header,
        .feature-card,
        .game-card,
        .about-content,
        .wisdom-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .hero-content.animate-in,
        .hero-visual.animate-in,
        .section-header.animate-in,
        .about-content.animate-in,
        .wisdom-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card.animate-in,
        .game-card.animate-in {
            opacity: 1;
            transform: translateY(0);
            animation: slideInUp 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function addFloatingAnimationStyles() {
    if (document.getElementById('floating-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'floating-animations';
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .floating-particle {
            will-change: transform, opacity;
        }
        
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            border-left: 4px solid var(--primary-color);
            padding: 16px 20px;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 10000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-message {
            color: var(--text-primary);
            font-weight: 500;
            line-height: 1.4;
        }
        
        .notification-error {
            border-left-color: #f44336;
        }
        
        .notification-success {
            border-left-color: #4caf50;
        }
        
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
window.addEventListener('scroll', debounce(() => {
    // Any additional scroll-based functionality can go here
}, 16)); // ~60fps

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Could show user-friendly error message here
});

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        // navigator.serviceWorker.register('/sw.js');
    });
}
