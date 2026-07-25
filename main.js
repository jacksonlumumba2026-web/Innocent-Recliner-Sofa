// ===== Innocent Recliner & Sofa — Site scripts =====

document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav toggle */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));
    document.querySelectorAll('.nav-links a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Counter animation */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  }

  /* Button ripple effect */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* Testimonials slider */
  const track = document.querySelector('.testi-track');
  if (track) {
    const slides = track.querySelectorAll('.testi-slide');
    const dotsWrap = document.querySelector('.testi-dots');
    let current = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('.testi-dot');
    function goTo(i) {
      current = i;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[i].classList.add('active');
    }
    let auto = setInterval(() => goTo((current + 1) % slides.length), 5000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', () => {
      auto = setInterval(() => goTo((current + 1) % slides.length), 5000);
    });
  }

  /* Before / After sliders */
  document.querySelectorAll('.ba-card').forEach(card => {
    const after = card.querySelector('.ba-after');
    const handle = card.querySelector('.ba-handle');
    const images = card.querySelector('.ba-images');
    let dragging = false;

    const setPos = (clientX) => {
      const rect = images.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = pct + '%';
    };

    handle.addEventListener('mousedown', () => dragging = true);
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => dragging && setPos(e.clientX));

    handle.addEventListener('touchstart', () => dragging = true, {passive:true});
    window.addEventListener('touchend', () => dragging = false);
    window.addEventListener('touchmove', (e) => {
      if (dragging) setPos(e.touches[0].clientX);
    }, {passive:true});

    images.addEventListener('click', (e) => setPos(e.clientX));
  });

  /* Gallery lightbox */
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const lightbox = document.querySelector('.lightbox');
  if (lightbox && galleryItems.length) {
    const lbImg = lightbox.querySelector('img');
    const images = Array.from(galleryItems).map(img => img.src);
    let idx = 0;
    const open = (i) => {
      idx = i;
      lbImg.src = images[idx];
      lightbox.classList.add('open');
    };
    galleryItems.forEach((img, i) => img.closest('.gallery-item').addEventListener('click', () => open(i)));
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => open((idx + 1) % images.length));
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => open((idx - 1 + images.length) % images.length));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowRight') open((idx + 1) % images.length);
      if (e.key === 'ArrowLeft') open((idx - 1 + images.length) % images.length);
    });
  }

  /* Gallery filters */
  const gfilters = document.querySelectorAll('.gfilter');
  const gitems = document.querySelectorAll('.gallery-item');
  gfilters.forEach(btn => {
    btn.addEventListener('click', () => {
      gfilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      gitems.forEach(item => {
        item.style.display = (cat === 'all' || item.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });

  /* Shop filters */
  const sfilters = document.querySelectorAll('.sfilter');
  const sitems = document.querySelectorAll('.shop-item');
  sfilters.forEach(btn => {
    btn.addEventListener('click', () => {
      sfilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      sitems.forEach(item => {
        item.style.display = (cat === 'all' || item.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });

  /* Nav background on scroll (subtle) */
  const navEl = document.querySelector('.nav');
  if (navEl) {
    window.addEventListener('scroll', () => {
      navEl.style.background = window.scrollY > 40 ? 'rgba(17,17,17,0.98)' : 'rgba(17,17,17,0.92)';
    });
  }

  /* Contact form -> WhatsApp handoff (no backend) */
  const quoteForm = document.querySelector('#quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = quoteForm.name.value.trim();
      const phone = quoteForm.phone.value.trim();
      const service = quoteForm.service ? quoteForm.service.value : '';
      const message = quoteForm.message.value.trim();
      const text = `Hello Innocent Recliner & Sofa, I'd like a quote.%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AService: ${encodeURIComponent(service)}%0ADetails: ${encodeURIComponent(message)}`;
      window.open(`https://wa.me/254727408022?text=${text}`, '_blank');
    });
  }

  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const phone = contactForm.phone.value.trim();
      const message = contactForm.message.value.trim();
      const text = `Hello Innocent Recliner & Sofa,%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AMessage: ${encodeURIComponent(message)}`;
      window.open(`https://wa.me/254727408022?text=${text}`, '_blank');
    });
  }

});

/* WhatsApp order helper used by inline buttons */
function waOrder(productName, price) {
  const text = `Hello, I'd like to order: ${productName} (${price}). Is it available?`;
  window.open(`https://wa.me/254727408022?text=${encodeURIComponent(text)}`, '_blank');
}
