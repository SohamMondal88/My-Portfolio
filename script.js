
        // ===== INITIALIZATION =====
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
        });

        function initializeApp() {
            // Remove loading screen
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                loadingScreen.classList.add('hidden');
            }, 1500);

            // Initialize all components
            initializeCursor();
            initializeNavigation();
            initializeScrollAnimations();
            initializeCard3D();
            initializeParallax();
            initializeSmoothScrolling();
        }

        // ===== CUSTOM CURSOR =====
        function initializeCursor() {
            const cursor = document.getElementById('cursor');
            const cursorFollower = document.getElementById('cursorFollower');
            
            if (!cursor || !cursorFollower) return;

            let mouseX = 0, mouseY = 0;
            let followerX = 0, followerY = 0;

            // Update mouse position
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                cursor.style.left = mouseX + 'px';
                cursor.style.top = mouseY + 'px';
            });

            // Smooth follower animation
            function animateFollower() {
                const speed = 0.2;
                followerX += (mouseX - followerX) * speed;
                followerY += (mouseY - followerY) * speed;
                
                cursorFollower.style.left = followerX + 'px';
                cursorFollower.style.top = followerY + 'px';
                
                requestAnimationFrame(animateFollower);
            }
            animateFollower();

            // Cursor interactions
            const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .contact-link');
            
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursor.style.background = 'rgba(0, 212, 255, 0.2)';
                    cursor.style.borderColor = 'var(--primary)';
                    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.8)';
                });
                
                el.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursor.style.background = 'transparent';
                    cursor.style.borderColor = 'var(--primary)';
                    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
                });
            });
        }

        // ===== NAVIGATION =====
        function initializeNavigation() {
            const navbar = document.getElementById('navbar');
            const navToggle = document.getElementById('navToggle');
            const mobileMenu = document.getElementById('mobileMenu');
            const navLinks = document.querySelectorAll('.nav-link');

            // Scroll effect
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // Mobile menu toggle
            navToggle?.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    updateActiveNavLink(link.getAttribute('href'));
                });
            });

            // Update active nav link on scroll
            window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));
        }

        function updateActiveNavLink(href) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === href) {
                    link.classList.add('active');
                }
            });
        }

        function updateActiveNavOnScroll() {
            const sections = document.querySelectorAll('section[id]');
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 200;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    updateActiveNavLink(`#${sectionId}`);
                }
            });
        }

        // ===== SCROLL ANIMATIONS =====
        function initializeScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Add staggered animation for grid items
                        if (entry.target.classList.contains('skill-card') || 
                            entry.target.classList.contains('project-card')) {
                            const siblings = Array.from(entry.target.parentNode.children);
                            const index = siblings.indexOf(entry.target);
                            entry.target.style.transitionDelay = `${index * 0.1}s`;
                        }
                    }
                });
            }, observerOptions);

            // Observe all animatable elements
            document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
                observer.observe(el);
            });
        }

        // ===== 3D CARD ANIMATION =====
        function initializeCard3D() {
            const card3d = document.getElementById('heroCard');
            if (!card3d) return;

            card3d.addEventListener('mousemove', (e) => {
                const rect = card3d.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                card3d.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });

            card3d.addEventListener('mouseleave', () => {
                card3d.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        }

        // ===== PARALLAX EFFECTS =====
        function initializeParallax() {
            const parallaxElements = document.querySelectorAll('.gradient-orb');
            
            window.addEventListener('scroll', throttle(() => {
                const scrollY = window.pageYOffset;
                
                parallaxElements.forEach((element, index) => {
                    const speed = 0.5 + (index * 0.2);
                    const yPos = -(scrollY * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
            }, 16));
        }

        // ===== SMOOTH SCROLLING =====
        function initializeSmoothScrolling() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    
                    if (target) {
                        const offsetTop = target.offsetTop - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        // ===== UTILITY FUNCTIONS =====
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }

        function debounce(func, wait, immediate) {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }

        // ===== PERFORMANCE OPTIMIZATIONS =====
        // Lazy load images when they come into view
        function initializeLazyLoading() {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }

        // ===== EASTER EGGS & INTERACTIONS =====
        // Konami Code Easter Egg
        function initializeEasterEggs() {
            const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
            let userInput = [];

            document.addEventListener('keydown', (e) => {
                userInput.push(e.keyCode);
                
                if (userInput.length > konamiCode.length) {
                    userInput.shift();
                }
                
                if (userInput.join(',') === konamiCode.join(',')) {
                    triggerEasterEgg();
                }
            });
        }

        function triggerEasterEgg() {
            // Create floating hearts
            for (let i = 0; i < 20; i++) {
                createFloatingHeart();
            }
            
            // Temporary rainbow effect
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }

        function createFloatingHeart() {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.cssText = `
                position: fixed;
                font-size: 2rem;
                pointer-events: none;
                z-index: 10000;
                left: ${Math.random() * 100}vw;
                top: 100vh;
                animation: floatUp 3s ease-out forwards;
            `;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }

        // Add rainbow keyframe
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            
            @keyframes floatUp {
                to {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rainbowStyle);

        // ===== ADVANCED FEATURES =====
        
        // Dynamic theme switching
        function initializeThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Get saved theme or use system preference
            let currentTheme = localStorage.getItem('theme') || 
                              (prefersDarkScheme.matches ? 'dark' : 'light');
            
            document.documentElement.setAttribute('data-theme', currentTheme);
            
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', currentTheme);
                    localStorage.setItem('theme', currentTheme);
                });
            }
        }

        // Typing animation for hero text
        function initializeTypingAnimation() {
            const typingElement = document.querySelector('.typing-text');
            if (!typingElement) return;

            const texts = [
                'Full Stack Engineer',
                'System Architect', 
                'Cloud Enthusiast',
                'Problem Solver'
            ];
            
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            function typeText() {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    typingElement.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typingElement.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }

                let timeout = isDeleting ? 100 : 150;

                if (!isDeleting && charIndex === currentText.length) {
                    timeout = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    timeout = 500;
                }

                setTimeout(typeText, timeout);
            }

            typeText();
        }

        // Skills progress animation
        function initializeSkillsProgress() {
            const skillBars = document.querySelectorAll('.skill-progress');
            
            const skillObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target.querySelector('.progress-fill');
                        const percentage = entry.target.getAttribute('data-skill');
                        
                        if (progressBar) {
                            progressBar.style.width = percentage + '%';
                        }
                        
                        skillObserver.unobserve(entry.target);
                    }
                });
            });
            
            skillBars.forEach(skill => skillObserver.observe(skill));
        }

        // Particle system for background
        function initializeParticleSystem() {
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                opacity: 0.3;
            `;
            
            document.body.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            const particles = [];
            
            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            
            function createParticle() {
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2
                };
            }
            
            function initParticles() {
                particles.length = 0;
                for (let i = 0; i < 50; i++) {
                    particles.push(createParticle());
                }
            }
            
            function updateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach((particle, index) => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                    
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
                    ctx.fill();
                    
                    // Connect nearby particles
                    for (let j = index + 1; j < particles.length; j++) {
                        const other = particles[j];
                        const dx = particle.x - other.x;
                        const dy = particle.y - other.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(other.x, other.y);
                            ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                });
                
                requestAnimationFrame(updateParticles);
            }
            
            window.addEventListener('resize', debounce(resizeCanvas, 250));
            resizeCanvas();
            initParticles();
            updateParticles();
        }

        // Sound effects for interactions
        function initializeSoundEffects() {
            const audioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioContext) return;
            
            const ctx = new audioContext();
            
            function createTone(frequency, duration, type = 'sine') {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(0, ctx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + duration);
            }
            
            // Add sound to interactions
            document.querySelectorAll('.btn, .nav-link, .contact-link').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    createTone(800, 0.1);
                });
                
                el.addEventListener('click', () => {
                    createTone(1200, 0.15);
                });
            });
        }

        // Performance monitoring
        function initializePerformanceMonitoring() {
            if ('PerformanceObserver' in window) {
                // Monitor layout shifts
                const layoutShiftObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.value > 0.1) {
                            console.warn('Layout shift detected:', entry.value);
                        }
                    }
                });
                
                layoutShiftObserver.observe({entryTypes: ['layout-shift']});
                
                // Monitor long tasks
                const longTaskObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        console.warn('Long task detected:', entry.duration);
                    }
                });
                
                longTaskObserver.observe({entryTypes: ['longtask']});
            }
        }

        // ===== ACCESSIBILITY ENHANCEMENTS =====
        
        // Keyboard navigation
        function initializeKeyboardNavigation() {
            let focusableElements = [];
            let currentFocusIndex = -1;
            
            function updateFocusableElements() {
                focusableElements = Array.from(document.querySelectorAll(
                    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
                )).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
            }
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    updateFocusableElements();
                    
                    if (e.shiftKey) {
                        currentFocusIndex = currentFocusIndex <= 0 ? 
                            focusableElements.length - 1 : currentFocusIndex - 1;
                    } else {
                        currentFocusIndex = currentFocusIndex >= focusableElements.length - 1 ? 
                            0 : currentFocusIndex + 1;
                    }
                }
                
                // Skip to main content
                if (e.key === 'Enter' && e.ctrlKey) {
                    const mainContent = document.querySelector('main, #main, .main-content');
                    if (mainContent) {
                        mainContent.focus();
                        mainContent.scrollIntoView();
                    }
                }
            });
        }

        // Reduced motion support
        function initializeReducedMotion() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            function handleReducedMotion() {
                if (prefersReducedMotion.matches) {
                    document.body.classList.add('reduce-motion');
                    
                    // Disable autoplay animations
                    document.querySelectorAll('[data-autoplay]').forEach(el => {
                        el.style.animationPlayState = 'paused';
                    });
                } else {
                    document.body.classList.remove('reduce-motion');
                }
            }
            
            prefersReducedMotion.addEventListener('change', handleReducedMotion);
            handleReducedMotion();
        }

        // High contrast mode support
        function initializeHighContrast() {
            const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
            
            function handleHighContrast() {
                if (prefersHighContrast.matches) {
                    document.body.classList.add('high-contrast');
                } else {
                    document.body.classList.remove('high-contrast');
                }
            }
            
            prefersHighContrast.addEventListener('change', handleHighContrast);
            handleHighContrast();
        }

        // ===== ERROR HANDLING & FALLBACKS =====
        
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            
            // Graceful degradation
            if (e.error.message.includes('IntersectionObserver')) {
                // Fallback for browsers without IntersectionObserver
                document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
                    el.classList.add('visible');
                });
            }
        });

        // Service worker registration for offline support
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        // ===== FINAL INITIALIZATION =====
        
        // Initialize all advanced features
        document.addEventListener('DOMContentLoaded', () => {
            // Core features
            initializeApp();
            
            // Advanced features
            initializeEasterEggs();
            initializeThemeToggle();
            initializeTypingAnimation();
            initializeSkillsProgress();
            initializeLazyLoading();
            initializeKeyboardNavigation();
            initializeReducedMotion();
            initializeHighContrast();
            initializePerformanceMonitoring();
            
            // Optional features (with feature detection)
            if (window.AudioContext || window.webkitAudioContext) {
                initializeSoundEffects();
            }
            
            if (window.requestAnimationFrame) {
                initializeParticleSystem();
            }
            
            console.log('🚀 Portfolio loaded successfully!');
        });

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            // Cancel any ongoing animations
            document.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
        });
    
        // Function to handle the scroll-to-top action
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Get the button element
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Add a scroll event listener to show/hide the button
window.addEventListener('scroll', () => {
    // Show the button when the user has scrolled down a certain amount
    if (window.scrollY > 200) { // You can adjust this value
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Add a click event listener to the button
scrollToTopBtn.addEventListener('click', scrollToTop);
    






document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('mobileMenu');
    const navLinks = navMenu.querySelectorAll('a');

    // Function to toggle the mobile menu and the button's active state
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }

    // Event listener for the hamburger icon click
    navToggle.addEventListener('click', toggleMobileMenu);

    // Close the mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
});