// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeMobileMenu();
    initializeHeroPlayer();
    initializeMusicPlayer();
    initializeVideoModal();
    initializeEventsSlider();
    initializeNewsletterForm();
    initializeScrollEffects();
    updateCopyrightYear();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    
    if (mobileToggle && headerNav) {
        mobileToggle.addEventListener('click', function() {
            headerNav.classList.toggle('mobile-active');
            this.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                headerNav.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

// Hero section play button
function initializeHeroPlayer() {
    const heroPlayBtn = document.getElementById('playBtn');
    
    if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', function() {
            // Scroll to track section
            const trackSection = document.querySelector('.track');
            if (trackSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = trackSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Auto-play the track after scrolling
                setTimeout(() => {
                    const trackPlayBtn = document.getElementById('trackPlayBtn');
                    if (trackPlayBtn) {
                        trackPlayBtn.click();
                    }
                }, 1000);
            }
        });
    }
}

// Music player functionality
function initializeMusicPlayer() {
    const playPauseBtn = document.getElementById('trackPlayBtn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeSpan = document.querySelector('.current-time');
    const durationSpan = document.querySelector('.duration');
    const volumeBar = document.querySelector('.volume-bar');
    const volumeFill = document.querySelector('.volume-fill');
    const volumeBtn = document.querySelector('.volume-btn');

    let isPlaying = false;
    let currentTime = 0;
    let duration = 225; // 3:45 in seconds
    let volume = 0.8;
    let playInterval;

    // Play/Pause functionality
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                this.innerHTML = '<i class="fas fa-pause"></i>';
                this.classList.add('playing');
                startPlayback();
            } else {
                this.innerHTML = '<i class="fas fa-play"></i>';
                this.classList.remove('playing');
                stopPlayback();
            }
        });
    }

    // Progress bar functionality
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            currentTime = percentage * duration;
            updateProgress();
        });
    }

    // Volume control
    if (volumeBar) {
        volumeBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            volume = clickX / rect.width;
            updateVolume();
        });
    }

    if (volumeBtn) {
        volumeBtn.addEventListener('click', function() {
            volume = volume > 0 ? 0 : 0.8;
            updateVolume();
        });
    }

    function startPlayback() {
        playInterval = setInterval(() => {
            currentTime += 1;
            if (currentTime >= duration) {
                currentTime = duration;
                stopPlayback();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('playing');
                isPlaying = false;
            }
            updateProgress();
        }, 1000);
    }

    function stopPlayback() {
        if (playInterval) {
            clearInterval(playInterval);
        }
    }

    function updateProgress() {
        const percentage = (currentTime / duration) * 100;
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (currentTimeSpan) {
            currentTimeSpan.textContent = formatTime(currentTime);
        }
        
        if (durationSpan) {
            durationSpan.textContent = formatTime(duration);
        }
    }

    function updateVolume() {
        if (volumeFill) {
            volumeFill.style.width = (volume * 100) + '%';
        }
        
        if (volumeBtn) {
            const icon = volume > 0 ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            volumeBtn.innerHTML = `<i class="${icon}"></i>`;
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Initialize display
    updateProgress();
    updateVolume();
}

// Video modal functionality
function initializeVideoModal() {
    const videoPlayBtns = document.querySelectorAll('.video-play-btn');
    const modal = document.getElementById('videoModal');
    const modalClose = document.querySelector('.modal-close');
    const videoFrame = document.getElementById('videoFrame');

    videoPlayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video');
            if (videoUrl && modal && videoFrame) {
                // Convert YouTube URL to embed URL
                const embedUrl = convertToEmbedUrl(videoUrl);
                videoFrame.src = embedUrl;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalClose && modal) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });

    function closeModal() {
        if (modal && videoFrame) {
            modal.style.display = 'none';
            videoFrame.src = '';
            document.body.style.overflow = 'auto';
        }
    }

    function convertToEmbedUrl(url) {
        // Extract video ID from YouTube URL
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId[1]}?autoplay=1`;
        }
        return url;
    }
}

// Events slider functionality
function initializeEventsSlider() {
    const slider = document.querySelector('.events-slider');
    const eventItems = document.querySelectorAll('.event-item');
    
    if (slider && eventItems.length > 0) {
        let currentIndex = 0;
        const itemWidth = 330; // 300px width + 30px gap
        const visibleItems = Math.floor(slider.offsetWidth / itemWidth);
        const maxIndex = Math.max(0, eventItems.length - visibleItems);

        // Auto-slide functionality
        function autoSlide() {
            currentIndex = (currentIndex + 1) % (maxIndex + 1);
            updateSliderPosition();
        }

        function updateSliderPosition() {
            const translateX = -currentIndex * itemWidth;
            slider.style.transform = `translateX(${translateX}px)`;
        }

        // Start auto-sliding
        let slideInterval = setInterval(autoSlide, 4000);

        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(autoSlide, 4000);
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            clearInterval(slideInterval);
        });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0 && currentIndex < maxIndex) {
                    currentIndex++;
                } else if (diffX < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateSliderPosition();
                isDragging = false;
            }
        });

        slider.addEventListener('touchend', () => {
            isDragging = false;
            slideInterval = setInterval(autoSlide, 4000);
        });
    }
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Simulate form submission
                showNotification('Thank you for subscribing!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const elementsToObserve = document.querySelectorAll('.event-item, .about-content, .video-item');
    elementsToObserve.forEach(el => observer.observe(el));

    // Header background on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: '#fff',
        backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function updateCopyrightYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Smooth scrolling polyfill for older browsers
function smoothScrollTo(target, duration = 1000) {
    const targetPosition = target.offsetTop - document.querySelector('.header').offsetHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Handle scroll events here if needed
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'images/hero-bg.jpg',
        'images/mabiva-photo.jpg',
        'images/lyrics-video-cover.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        formatTime: (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    };
}