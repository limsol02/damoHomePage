// ================================
// Navigation Functionality (네비가 partial 로드 후 초기화)
// ================================
function initNav() {
    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    function closeNav() {
        if (navToggle) navToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        document.querySelectorAll('.nav-item.open').forEach(function(el) { el.classList.remove('open'); });
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var navItem = this.closest('.nav-item--dropdown');
            if (navItem && window.innerWidth <= 768) {
                e.preventDefault();
                navItem.classList.toggle('open');
                return;
            }
            closeNav();
        });
    });
    document.querySelectorAll('.nav-sublink').forEach(function(link) {
        link.addEventListener('click', closeNav);
    });

    var sections = document.querySelectorAll('section[id]');
    function setActiveNavLink() {
        var scrollY = window.pageYOffset;
        sections.forEach(function(section) {
            var sectionHeight = section.offsetHeight;
            var sectionTop = section.offsetTop - 100;
            var sectionId = section.getAttribute('id');
            var navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(function(l) { l.classList.remove('active'); });
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', setActiveNavLink);
}

document.addEventListener('nav-loaded', initNav);
if (document.getElementById('nav-placeholder') && !document.getElementById('navbar')) {
    /* 네비가 placeholder면 nav.js가 로드 후 initNav 호출 */
} else if (document.getElementById('navbar')) {
    initNav();
}

// ================================
// Slideshow Functionality (2 Slides)
// ================================
let slideIndex = 1;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');

function changeSlide(n) {
    showSlide(slideIndex += n);
}

function currentSlide(n) {
    showSlide(slideIndex = n);
}

function showSlide(n) {
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[slideIndex - 1].classList.add('active');
    indicators[slideIndex - 1].classList.add('active');
}

// Auto-advance slideshow
setInterval(() => {
    changeSlide(1);
}, 5000); // Change slide every 5 seconds

// ================================
// Smooth Scrolling
// ================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ================================
// Counter Animation
// ================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.getAttribute('data-target') === '98' ? '%' : '+');
            }
        };
        
        // Check if element is in viewport before starting animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && counter.textContent === '0') {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

animateCounters();

// ================================
// Scroll Animations
// ================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .process-step, .portfolio-item, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

initScrollAnimations();

// ================================
// Chat & Detail Button Functionality
// ================================
const chatButton = document.getElementById('chatButton');
const detailBtn = document.getElementById('detailBtn');   // slide2 (slide2-bg) → 스마트 물류
const detailBtn1 = document.getElementById('detailBtn1'); // 그 외 슬라이드 → 회사소개

// chatButton.addEventListener('click', () => {
//     // Simulate opening a chat window
//     alert("Thanks for your interest! In a production environment, this would open a live chat widget.\n\nFor now, please call us at 123-456-7890 or use the contact form below.");
    
//     // Optionally scroll to contact section
//     document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
// });

// 자세히 알아보기: slide2-bg → 스마트 물류, 나머지 슬라이드 → 회사소개
if (detailBtn) {
    detailBtn.addEventListener('click', () => {
        window.location.href = 'business/smart-logistics.html';
    });
}
if (detailBtn1) {
    detailBtn1.addEventListener('click', () => {
        window.location.href = 'about/about-altri.html';
    });
}

// ================================
// Contact Form Handling
// ================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    // Simulate form submission
    console.log('Form Data:', formData);
    
    // Show success message
    alert(`Thank you, ${formData.name}! Your message has been received.\n\nWe'll get back to you within 24 hours at ${formData.email}.`);
    
    // Reset form
    contactForm.reset();
    
    // In production, you would send this data to a backend service:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     alert('Message sent successfully!');
    //     contactForm.reset();
    // })
    // .catch(error => {
    //     alert('Error sending message. Please try again.');
    // });
});

// ================================
// Parallax Effect for Hero Section
// ================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const activeSlide = document.querySelector('.slide.active');
    
    if (hero && activeSlide) {
        activeSlide.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});

// ================================
// Show Details Navigation
// ================================
function showDetails() {
    window.location.href = 'index2.html';
}

function goDetail() {
    window.location.href = 'index2.html';
}

// ================================
// Portfolio Item Click Handler
// ================================
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('.portfolio-title').textContent;
        const category = item.querySelector('.portfolio-category').textContent;
        
        alert(`${title}\nCategory: ${category}\n\nIn a production environment, this would open a detailed portfolio view with more images and project information.`);
    });
});

// ================================
// Lazy Loading Images
// ================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ================================
// Social Links Handler
// ================================
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = link.querySelector('i').classList[1].replace('fa-', '');
        alert(`This would link to our ${platform} profile.\n\nIn production, replace # with actual social media URLs.`);
    });
});

// ================================
// Page Load Animation
// ================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ================================
// Prevent Default Link Behavior for Demo Links
// ================================
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// ================================
// Add Scroll-to-Top Button (Optional Enhancement)
// ================================
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 110px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: var(--brand-brown);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 998;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
    } else {
        scrollToTopBtn.style.opacity = '0';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
    scrollToTopBtn.style.backgroundColor = 'var(--accent-orange)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
    scrollToTopBtn.style.backgroundColor = 'var(--brand-brown)';
});

// ================================
// Performance Optimization
// ================================

// Debounce function for scroll events
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

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(setActiveNavLink, 100);
window.addEventListener('scroll', debouncedScrollHandler);

// ================================
// Accessibility Enhancements
// ================================

// Add keyboard navigation support for portfolio items
portfolioItems.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            item.click();
        }
    });
});

// Add ARIA labels dynamically
navLinks.forEach(link => {
    const text = link.textContent.trim();
    link.setAttribute('aria-label', `Navigate to ${text} section`);
});

// ================================
// Console Welcome Message
// ================================
console.log('%c🏠 M&B Remodeling', 'font-size: 24px; font-weight: bold; color: #FF6B35;');
console.log('%cWelcome to our website! We create exceptional living spaces.', 'font-size: 14px; color: #8B6F47;');
console.log('%cInterested in working with us? Contact: info@mbremodeling.com', 'font-size: 12px; color: #666;');

// ================================
// Error Handling
// ================================
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // In production, you might want to log this to an error tracking service
});

// ================================
// Service Worker Registration (Optional for PWA)
// ================================
if ('serviceWorker' in navigator) {
    // Uncomment when service worker is implemented
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered', reg))
    //     .catch(err => console.log('Service Worker registration failed', err));
}
