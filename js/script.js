const header = document.getElementById('site-header');
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const navLinks = document.querySelectorAll('.nav-link');
const reveals = document.querySelectorAll('.reveal');
const yearEl = document.getElementById('year');

const testimonialTrack = document.getElementById('testimonial-track');
const testimonialDots = document.getElementById('testimonial-dots');
const testimonialPrev = document.getElementById('testimonial-prev');
const testimonialNext = document.getElementById('testimonial-next');

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

const testimonials = [
  {
    quote: 'Ellaphone creates such a calm, encouraging space to learn in. My confidence has grown so much, and I finally feel connected to my voice.',
    name: 'Student Testimonial',
    detail: 'Beginner vocalist'
  },
  {
    quote: 'Her ear for phrasing and expression is incredible. Every lesson feels artistic as well as practical, and my singing has become far more expressive.',
    name: 'Student Testimonial',
    detail: 'Intermediate singer'
  },
  {
    quote: 'She helped me develop better technique without losing what made my voice unique. I came away feeling more polished and more myself.',
    name: 'Student Testimonial',
    detail: 'Performance coaching student'
  },
  {
    quote: 'Ellaphone explains difficult concepts in a way that feels intuitive. Her lessons are warm, musical, and genuinely inspiring.',
    name: 'Student Testimonial',
    detail: 'Online lesson student'
  }
];

let currentTestimonial = 0;
let testimonialInterval;
let currentLightboxIndex = 0;

function handleHeader() {
  if (window.scrollY > 24) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  reveals.forEach((item) => observer.observe(item));
}

function setActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  let current = 'hero';

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

function renderTestimonial(index) {
  const item = testimonials[index];
  testimonialTrack.style.opacity = '0';

  setTimeout(() => {
    testimonialTrack.innerHTML = `
      <blockquote class="max-w-4xl">
        <p class="font-serif text-3xl leading-tight text-cream sm:text-4xl" style="font-family: 'Cormorant Garamond', serif;">“${item.quote}”</p>
        <footer class="mt-6 text-sm uppercase tracking-[0.28em] text-gold/90">
          ${item.name} <span class="text-cream/40">·</span> <span class="text-cream/70">${item.detail}</span>
        </footer>
      </blockquote>
    `;
    testimonialTrack.style.opacity = '1';

    Array.from(testimonialDots.children).forEach((dot, dotIndex) => {
      dot.classList.toggle('bg-gold', dotIndex === index);
      dot.classList.toggle('bg-white/20', dotIndex !== index);
    });
  }, 180);
}

function createTestimonialDots() {
  testimonialDots.innerHTML = '';
  testimonials.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'h-2.5 w-2.5 rounded-full transition-all duration-300 ' + (index === 0 ? 'bg-gold' : 'bg-white/20');
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => {
      currentTestimonial = index;
      renderTestimonial(currentTestimonial);
      restartTestimonialAutoPlay();
    });
    testimonialDots.appendChild(dot);
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  renderTestimonial(currentTestimonial);
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  renderTestimonial(currentTestimonial);
}

function startTestimonialAutoPlay() {
  testimonialInterval = setInterval(nextTestimonial, 5000);
}

function restartTestimonialAutoPlay() {
  clearInterval(testimonialInterval);
  startTestimonialAutoPlay();
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const item = galleryItems[index];
  lightboxImage.src = item.dataset.full;
  lightboxCaption.textContent = item.dataset.caption || '';
  lightbox.classList.remove('hidden');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showPrevImage() {
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentLightboxIndex);
}

function showNextImage() {
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
  openLightbox(currentLightboxIndex);
}

window.addEventListener('scroll', () => {
  handleHeader();
  setActiveNav();
});

menuBtn?.addEventListener('click', toggleMenu);
mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

testimonialPrev?.addEventListener('click', () => {
  prevTestimonial();
  restartTestimonialAutoPlay();
});

testimonialNext?.addEventListener('click', () => {
  nextTestimonial();
  restartTestimonialAutoPlay();
});

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', showPrevImage);
lightboxNext?.addEventListener('click', showNextImage);

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (lightbox.classList.contains('hidden')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showPrevImage();
  if (event.key === 'ArrowRight') showNextImage();
});

window.addEventListener('DOMContentLoaded', () => {
  yearEl.textContent = new Date().getFullYear();
  handleHeader();
  setActiveNav();
  revealOnScroll();
  createTestimonialDots();
  renderTestimonial(currentTestimonial);
  startTestimonialAutoPlay();
});
