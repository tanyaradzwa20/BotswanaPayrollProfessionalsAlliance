// ========================================
// MOBILE NAVIGATION TOGGLE
// ========================================

const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(mobileToggle) mobileToggle.classList.remove('active');
        if(navMenu) navMenu.classList.remove('active');
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
// NAVBAR SCROLL EFFECT
// ========================================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (navbar) {
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    lastScroll = currentScroll;
});


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
// INFINITE MEMBERSHIP CAROUSEL
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    // If elements don't exist, stop here
    if (!track || !prevBtn || !nextBtn) return;

    // 1. Clone cards to create the illusion of infinity
    // We duplicate the entire list of cards and add them to the end
    const originalCards = Array.from(track.children);
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    const allCards = Array.from(track.children);
    let currentIndex = 0;
    const totalOriginal = originalCards.length;
    let autoSlideInterval;
    let isTransitioning = false;

    // 2. Get Gap and Width dynamically
    function getCardMetrics() {
        const card = allCards[0];
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 0;
        const cardWidth = card.getBoundingClientRect().width;
        return { cardWidth, gap };
    }

    // 3. Move Carousel Function
    function moveCarousel(index, useTransition = true) {
        const { cardWidth, gap } = getCardMetrics();
        
        if (useTransition) {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            isTransitioning = true;
        } else {
            track.style.transition = 'none';
            isTransitioning = false;
        }

        const amountToMove = (cardWidth + gap) * index;
        track.style.transform = `translateX(-${amountToMove}px)`;
        currentIndex = index;

        // Update indicators (based on modulo arithmetic for infinite loop)
        const realIndex = index % totalOriginal;
        indicators.forEach((ind, i) => {
            if (i === realIndex) ind.classList.add('active');
            else ind.classList.remove('active');
        });
    }

    // 4. Handle "Next" Click
    function handleNext() {
        if (isTransitioning) return;
        
        // Move to the next slide
        moveCarousel(currentIndex + 1);

        // INFINITE LOOP LOGIC:
        // If we have scrolled past the original set, wait for animation to end,
        // then instantly snap back to the start.
        if (currentIndex >= totalOriginal) {
            track.addEventListener('transitionend', () => {
                if (currentIndex >= totalOriginal) {
                     moveCarousel(currentIndex - totalOriginal, false);
                }
            }, { once: true });
        }
    }

    // 5. Handle "Prev" Click
    function handlePrev() {
        if (isTransitioning) return;

        if (currentIndex <= 0) {
            // If we are at the start, instantly jump to the cloned set at the end
            moveCarousel(totalOriginal, false);
            
            // Force a small delay to let the browser register the jump, then slide
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    moveCarousel(totalOriginal - 1);
                });
            });
        } else {
            moveCarousel(currentIndex - 1);
        }
    }

    // 6. Reset Transition Flag
    track.addEventListener('transitionend', () => {
        isTransitioning = false;
    });

    // 7. Auto Play Functionality
    function startAutoSlide() {
        stopAutoSlide(); 
        autoSlideInterval = setInterval(handleNext, 3000); // 3 seconds speed
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        handleNext();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        handlePrev();
        startAutoSlide();
    });

    // Indicator clicks
    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => {
            stopAutoSlide();
            moveCarousel(i);
            startAutoSlide();
        });
    });

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Handle Window Resize (Recalculate widths)
    window.addEventListener('resize', () => {
        // Reset to 0 to prevent alignment issues during resize
        moveCarousel(0, false);
    });

    // Initialize
    startAutoSlide();
});


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