/* =============================================
   LCC – Lakhotia Computer Centre
   JavaScript – Interactions & Animations
   ============================================= */


/* ---- NAVBAR SCROLL ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
})();


/* ---- HAMBURGER MENU ---- */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
    }
  });
})();


/* ---- SYLLABUS TOGGLE ---- */
function toggleSyllabus(btn) {
  const item = btn.closest('.syllabus-item');
  const isOpen = item.classList.contains('open');

  // Close all open items first
  document.querySelectorAll('.syllabus-item.open').forEach(openItem => {
    openItem.classList.remove('open');
  });

  // Open clicked item if it wasn't already open
  if (!isOpen) {
    item.classList.add('open');
    // Scroll the item into view smoothly
    setTimeout(() => {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }
}


/* ---- ACTIVE NAV LINK ON SCROLL ---- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active-nav',
            link.getAttribute('href') === '#' + id
          );
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ---- SMOOTH REVEAL ON SCROLL ---- */
(function initReveal() {
  const targets = document.querySelectorAll(
    '.course-card, .fee-card, .syllabus-item, .contact-card, .step, .highlight, .float-card, .doc-item'
  );

  const style = document.createElement('style');
  style.textContent = `
    .reveal-hidden {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal-hidden.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  targets.forEach((el, i) => {
    el.classList.add('reveal-hidden');
    el.style.transitionDelay = (i % 4) * 0.09 + 's';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


/* ---- 3D CARD TILT EFFECT ---- */
(function init3DTilt() {
  const cards = document.querySelectorAll('.course-card, .fee-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 6;
      const rotY   =  dx * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ---- COURSE CARD → SCROLL TO SYLLABUS ---- */
(function initCourseLinks() {
  document.querySelectorAll('[data-course]').forEach(card => {
    card.querySelector('.course-btn').addEventListener('click', (e) => {
      e.preventDefault();
      const courseId = card.dataset.course;
      document.getElementById('syllabus').scrollIntoView({ behavior: 'smooth' });

      // After scrolling, open the right syllabus panel
      setTimeout(() => {
        const items = document.querySelectorAll('.syllabus-item');
        const map   = { dca: 0, tally: 1, adca: 2, pgdca: 3 };
        const idx   = map[courseId];
        if (idx !== undefined) {
          const btn = items[idx].querySelector('.syllabus-toggle');
          if (!items[idx].classList.contains('open')) {
            toggleSyllabus(btn);
          }
        }
      }, 700);
    });
  });
})();
