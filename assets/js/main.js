// ========================================
// MOBILE NAVIGATION TOGGLE
// ========================================

const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========================================
// HERO SLIDER FUNCTIONALITY
// ========================================

const heroSlides = document.querySelectorAll('.hero-slide');
const heroPrevBtn = document.getElementById('heroPrev');
const heroNextBtn = document.getElementById('heroNext');
const heroIndicators = document.querySelectorAll('.hero-indicator');

if (heroSlides.length > 0 && heroPrevBtn && heroNextBtn) {
    let currentHeroSlide = 0;
    let heroAutoSlideInterval;

    function updateHeroSlide(index) {
        // Remove active class from all slides
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroIndicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide
        heroSlides[index].classList.add('active');
        if (heroIndicators[index]) {
            heroIndicators[index].classList.add('active');
        }

        currentHeroSlide = index;
    }

    function nextHeroSlide() {
        let nextSlide = (currentHeroSlide + 1) % heroSlides.length;
        updateHeroSlide(nextSlide);
    }

    function prevHeroSlide() {
        let prevSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
        updateHeroSlide(prevSlide);
    }

    function startHeroAutoSlide() {
        heroAutoSlideInterval = setInterval(nextHeroSlide, 6000); // Change slide every 6 seconds
    }

    function stopHeroAutoSlide() {
        clearInterval(heroAutoSlideInterval);
    }

    // Button event listeners
    heroNextBtn.addEventListener('click', () => {
        stopHeroAutoSlide();
        nextHeroSlide();
        startHeroAutoSlide();
    });

    heroPrevBtn.addEventListener('click', () => {
        stopHeroAutoSlide();
        prevHeroSlide();
        startHeroAutoSlide();
    });

    // Indicator event listeners
    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopHeroAutoSlide();
            updateHeroSlide(index);
            startHeroAutoSlide();
        });
    });

    // Touch/Swipe support for mobile
    let heroTouchStartX = 0;
    let heroTouchEndX = 0;

    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('touchstart', (e) => {
            heroTouchStartX = e.changedTouches[0].screenX;
            stopHeroAutoSlide();
        }, { passive: true });

        heroSlider.addEventListener('touchend', (e) => {
            heroTouchEndX = e.changedTouches[0].screenX;
            handleHeroSwipe();
            startHeroAutoSlide();
        }, { passive: true });
    }

    function handleHeroSwipe() {
        const swipeThreshold = 50;
        const diff = heroTouchStartX - heroTouchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextHeroSlide(); // Swipe left
            } else {
                prevHeroSlide(); // Swipe right
            }
        }
    }

    // Pause auto-slide when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopHeroAutoSlide();
        } else {
            startHeroAutoSlide();
        }
    });

    // Start auto-slide
    startHeroAutoSlide();
}


// ========================================
// HERO INFO CARD TABS
// ========================================

const tabButtons = document.querySelectorAll('.tab-btn:not(.tab-icon)');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// ========================================
// DROPDOWN MENU FUNCTIONALITY
// ========================================

const navDropdowns = document.querySelectorAll('.nav-dropdown');

navDropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    
    // Mobile dropdown toggle
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Reset dropdown state on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================

const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// SCROLL REVEAL ANIMATION
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger counter animation if this is a stat card
            if (entry.target.classList.contains('stat-card')) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('counted')) {
                    animateCounter(statNumber, parseInt(statNumber.dataset.target), 2000);
                    statNumber.classList.add('counted');
                }
            }
        }
    });
}, observerOptions);

// Observe all elements that should fade in
const fadeElements = document.querySelectorAll(`
    .value-card,
    .objective-item,
    .membership-card,
    .pricing-card,
    .vm-card,
    .contact-method,
    .stat-card,
    .testimonial-card
`);

fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ========================================
// FORM SUBMISSION HANDLER
// ========================================

const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Display success message (in production, you would send this to a server)
    showNotification('Thank you! Your message has been received. We will contact you soon.', 'success');
    
    // Reset form
    contactForm.reset();
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p>${message}</p>
        </div>
    `;
    
    // Add notification styles if they don't exist
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 20px 24px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification svg {
                width: 24px;
                height: 24px;
                flex-shrink: 0;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-success svg {
                color: #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-error svg {
                color: #ef4444;
            }
            
            .notification p {
                margin: 0;
                color: #1e293b;
                font-size: 15px;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ========================================
// COUNTER ANIMATION (for future stats)
// ========================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// ========================================
// PREVENT FLASH OF UNSTYLED CONTENT
// ========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ========================================
// PARALLAX EFFECT FOR HERO
// ========================================

const heroBackground = document.querySelector('.hero-background');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// ========================================
// ADD HOVER EFFECT TO CARDS
// ========================================

const cards = document.querySelectorAll(`
    .value-card,
    .vm-card,
    .membership-card,
    .pricing-card,
    .objective-item
`);

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ========================================
// LAZY LOAD IMAGES (if you add images later)
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// TYPING EFFECT FOR HERO (OPTIONAL)
// ========================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========================================
// ACCESSIBILITY: KEYBOARD NAVIGATION
// ========================================

// Trap focus in mobile menu when open
const focusableElements = 'a[href], button, textarea, input, select';

mobileToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        const firstFocusable = navMenu.querySelector(focusableElements);
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    }
});

// Close mobile menu with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileToggle.focus();
    }
});

// ========================================
// PERFORMANCE: DEBOUNCE SCROLL EVENTS
// ========================================

function debounce(func, wait = 10) {
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

// Apply debounce to scroll handlers for better performance
const debouncedScroll = debounce(() => {
    highlightNavOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ========================================
// RESOURCE FILTERING
// ========================================

const filterButtons = document.querySelectorAll('.filter-btn');
const resourceCards = document.querySelectorAll('.resource-card');

if (filterButtons.length > 0 && resourceCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get category
            const category = button.dataset.category;
            
            // Filter cards with animation
            resourceCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'flex';
                    card.classList.remove('hidden');
                    // Trigger animation
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ========================================
// GALLERY FILTERING
// ========================================

const galleryFilterButtons = document.querySelectorAll('.gallery-filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (galleryFilterButtons.length > 0 && galleryItems.length > 0) {
    galleryFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            galleryFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter
            const filter = button.dataset.filter;
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.transition = 'all 0.4s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImageIndex = 0;
let visibleGalleryItems = [];

// Function to update visible gallery items
function updateVisibleGalleryItems() {
    visibleGalleryItems = Array.from(galleryItems).filter(item => 
        item.style.display !== 'none' && !item.classList.contains('hidden')
    );
}

// Open lightbox
if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateVisibleGalleryItems();
            currentImageIndex = visibleGalleryItems.indexOf(item);
            showLightbox(item);
        });
    });
}

function showLightbox(item) {
    const placeholder = item.querySelector('.gallery-placeholder');
    const overlay = item.querySelector('.gallery-overlay');
    const title = overlay.querySelector('h3').textContent;
    const description = overlay.querySelector('p').textContent;
    
    // Clone placeholder
    const clonedPlaceholder = placeholder.cloneNode(true);
    lightboxImage.innerHTML = '';
    lightboxImage.appendChild(clonedPlaceholder);
    
    // Set caption
    lightboxCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close lightbox
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Navigate lightbox
if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
        showLightbox(visibleGalleryItems[currentImageIndex]);
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % visibleGalleryItems.length;
        showLightbox(visibleGalleryItems[currentImageIndex]);
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        lightboxPrev.click();
    } else if (e.key === 'ArrowRight') {
        lightboxNext.click();
    }
});

// ========================================
// FAQ ACCORDION
// ========================================

const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle current item
            const isActive = item.classList.contains('active');
            
            // Close all other items in the same category (optional: remove these lines for multiple open items)
            const category = item.closest('.faq-category');
            const categoryItems = category.querySelectorAll('.faq-item');
            categoryItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// ========================================
// PAGE TRANSITION ANIMATIONS
// ========================================

// Handle smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Get all internal links
    const internalLinks = document.querySelectorAll('a[href^="index.html"], a[href^="about.html"], a[href^="vision-mission.html"], a[href^="membership.html"], a[href^="events.html"], a[href^="resources.html"], a[href^="gallery.html"], a[href^="faq.html"], a[href^="contact.html"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's not an anchor link or external
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                e.preventDefault();
                
                // Add transition class
                document.body.classList.add('page-transitioning');
                
                // Navigate after animation
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
    
    // Remove transition class on page load
    document.body.classList.remove('page-transitioning');
});

// ========================================
// CONSOLE WELCOME MESSAGE
// ========================================

console.log(
    '%c🎉 Welcome to BPPA Website! %c\n\n' +
    'Botswana Payroll Professionals Alliance\n' +
    'Fostering Excellence in Payroll Management\n\n' +
    'Developed with ❤️',
    'color: #2563eb; font-size: 20px; font-weight: bold;',
    'color: #64748b; font-size: 12px;'
);

// ========================================
// INITIALIZE ALL ON DOM LOADED
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer if needed
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => el.textContent = currentYear);
    
    // Initialize any additional features
    console.log('BPPA Website initialized successfully!');
});

// ========================================
// SCROLL PROGRESS INDICATORS
// ========================================

const scrollDots = document.querySelectorAll('.scroll-dot');
const scrollSections = [];

// Collect sections based on scroll dot data-target attributes
scrollDots.forEach(dot => {
    const target = dot.getAttribute('data-target');
    const section = document.getElementById(target) || document.querySelector(`.${target}`);
    if (section) {
        scrollSections.push({ dot, section });
    }
});

// Update active dot on scroll
function updateScrollIndicators() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    scrollSections.forEach(({ dot, section }, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            scrollDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        }
    });
}

// Click to scroll to section
scrollDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const target = dot.getAttribute('data-target');
        const section = document.getElementById(target) || document.querySelector(`.${target}`);
        
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Listen for scroll events
window.addEventListener('scroll', updateScrollIndicators);
updateScrollIndicators(); // Initial call

// ========================================
// MEMBERSHIP CAROUSEL FUNCTIONALITY
// ========================================

// Check if carousel elements exist (only on homepage)
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');

if (carouselTrack && prevBtn && nextBtn) {
    let currentSlide = 0;
    let autoSlideInterval;
    const totalSlides = document.querySelectorAll('.membership-card').length;
    
    // Calculate slides per view based on screen width
    function getSlidesPerView() {
        if (window.innerWidth >= 1200) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    // Calculate maximum slide index
    function getMaxSlide() {
        const slidesPerView = getSlidesPerView();
        return Math.max(0, totalSlides - slidesPerView);
    }
    
    // Update carousel position
    function updateCarousel(slide) {
        const slidesPerView = getSlidesPerView();
        const slideWidth = 100 / slidesPerView;
        const maxSlide = getMaxSlide();
        
        // Ensure slide is within bounds
        currentSlide = Math.max(0, Math.min(slide, maxSlide));
        
        // Move the carousel
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Next slide function
    function nextSlide() {
        const maxSlide = getMaxSlide();
        if (currentSlide >= maxSlide) {
            currentSlide = 0; // Loop back to start
        } else {
            currentSlide++;
        }
        updateCarousel(currentSlide);
    }
    
    // Previous slide function
    function prevSlide() {
        const maxSlide = getMaxSlide();
        if (currentSlide <= 0) {
            currentSlide = maxSlide; // Loop to end
        } else {
            currentSlide--;
        }
        updateCarousel(currentSlide);
    }
    
    // Auto slide functionality
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Button event listeners
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide(); // Restart auto-slide after manual interaction
    });
    
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide(); // Restart auto-slide after manual interaction
    });
    
    // Indicator event listeners
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            updateCarousel(index);
            startAutoSlide(); // Restart auto-slide after manual interaction
        });
    });
    
    // Pause auto-slide on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel(currentSlide);
        }, 250);
    });
    
    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }
    
    // Initialize carousel
    updateCarousel(0);
    startAutoSlide();
    
    // Pause auto-slide when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

window.addEventListener('load', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        function toggleScrollButton() {
            if (window.pageYOffset > 50 || document.documentElement.scrollTop > 50) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        // Call on scroll
        window.addEventListener('scroll', toggleScrollButton);
        
        // Call on page load in case already scrolled
        toggleScrollButton();
    }
});
