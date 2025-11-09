// Hero Background Image Carousel
const heroImages = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg'];
let currentHeroIndex = 0;
const heroBg = document.getElementById('heroBg');

if (heroBg) {
  // Preload images
  heroImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Change hero background every 8 seconds
  setInterval(() => {
    currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
    heroBg.style.opacity = '0';
    setTimeout(() => {
      heroBg.src = heroImages[currentHeroIndex];
      heroBg.style.opacity = '1';
    }, 500);
  }, 8000);

  heroBg.style.transition = 'opacity 1s ease-in-out';
}

// Header shrink on scroll
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 50;
  header?.classList.toggle('shrink', scrolled);
  lastScrollY = window.scrollY;
}, { passive: true });

// Mobile menu
const menuBtn = document.querySelector('#hamburger');
const mobileMenu = document.querySelector('#mobileMenu');
const overlay = document.querySelector('#overlay');

function toggleMenu(open) {
  const isOpen = open ?? !mobileMenu?.classList.contains('open');
  mobileMenu?.classList.toggle('open', isOpen);
  overlay?.classList.toggle('show', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  document.body.classList.toggle('menu-open', isOpen);
  if (menuBtn) {
    menuBtn.textContent = isOpen ? '✕' : '☰';
  }
}

menuBtn?.addEventListener('click', () => toggleMenu());
overlay?.addEventListener('click', () => toggleMenu(false));

// Close mobile menu on link click
document.querySelectorAll('.mobile-links a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// FAQ accordion
document.querySelectorAll('.accordion').forEach(acc => {
  const singleOpen = acc.dataset.singleOpen === 'true';
  
  acc.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const button = header?.querySelector('button');
    
    if (!header || !content) return;
    
    header.addEventListener('click', () => {
      const isOpen = content.classList.contains('open');
      
      if (singleOpen) {
        // Close all other items
        acc.querySelectorAll('.accordion-content').forEach(c => {
          if (c !== content) {
            c.style.maxHeight = null;
            c.classList.remove('open');
            const btn = c.parentElement.querySelector('.accordion-header button');
            if (btn) {
              btn.textContent = '+';
              btn.setAttribute('aria-expanded', 'false');
            }
          }
        });
      }
      
      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.classList.add('open');
        if (button) {
          button.textContent = '−';
          button.setAttribute('aria-expanded', 'true');
        }
      } else {
        content.style.maxHeight = null;
        content.classList.remove('open');
        if (button) {
          button.textContent = '+';
          button.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Intersection Observer for fade-in animations
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

// Observe cards and sections
document.querySelectorAll('.card, .stat, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Animated background sections - ensure background images load
document.querySelectorAll('.animated-bg-section').forEach(section => {
  const bgImage = section.style.getPropertyValue('--bg-image');
  if (bgImage) {
    // Preload the background image
    const img = new Image();
    const imageUrl = bgImage.replace(/url\(['"]?|['"]?\)/g, '');
    img.src = imageUrl;
    
    // Ensure the CSS variable is properly set
    section.style.setProperty('--bg-image', bgImage);
    
    // Add a class when image is loaded for smooth transition
    img.onload = () => {
      section.classList.add('bg-loaded');
    };
    
    // If image is already cached, add class immediately
    if (img.complete) {
      section.classList.add('bg-loaded');
    }
  }
});

// Parallax effect for hero on scroll
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.hero-bg');
      if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Contact form handling with backend
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      alert('Please fill in name, email and message.');
      return;
    }

    // Try to submit to a serverless endpoint (Vercel /api/contact)
    // If that fails (no server), fall back to the client-only behaviour.
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({ success: false }));

      if (res.ok && json && json.success) {
        form.reset();
        alert(json.message || 'Thanks for reaching out! We will contact you shortly.');
      } else {
        // If server responded with an error, surface message and keep form data
        alert(json.message || 'There was an error sending your message. Please try again later.');
      }
    } catch (err) {
      // Network or fetch failure - fallback to client-only UX
      form.reset();
      alert('Thanks for reaching out! We will contact you shortly. (offline fallback)');
      console.warn('Contact submit fallback (fetch failed):', err);
    }
  });
}


// Performance: Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Add loading animation to images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('load', function() {
    this.style.opacity = '1';
  });
  if (!img.complete) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
  }
});
