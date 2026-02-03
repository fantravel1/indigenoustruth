/* ============================================================
   INDIGENOUS TRUTH — Main JavaScript
   Navigation, TOC tracking, Animations, FAQ, Accessibility
   ============================================================ */

(function() {
  'use strict';

  /* ---------- DOM READY ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavigation();
    initScrollEffects();
    initTOC();
    initFAQ();
    initBackToTop();
    initFadeInAnimations();
  }

  /* ---------- MOBILE NAVIGATION ---------- */
  function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.nav-overlay');
    if (!toggle || !menu) return;

    function openMenu() {
      toggle.classList.add('active');
      menu.classList.add('open');
      if (overlay) overlay.classList.add('visible');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('active');
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function() {
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close on nav link click
    menu.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---------- SCROLL EFFECTS ---------- */
  function initScrollEffects() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var lastScroll = 0;

    window.addEventListener('scroll', function() {
      var currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ---------- TABLE OF CONTENTS TRACKING ---------- */
  function initTOC() {
    var tocLinks = document.querySelectorAll('.toc__link');
    var sections = document.querySelectorAll('.topic-section[id]');
    if (!tocLinks.length || !sections.length) return;

    var observerOptions = {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    };

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          tocLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function(section) {
      observer.observe(section);
    });

    // Smooth scroll for TOC links
    tocLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL without jump
          history.pushState(null, null, this.getAttribute('href'));
        }
      });
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function(item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function() {
        var isOpen = item.classList.contains('open');

        // Close all others
        faqItems.forEach(function(other) {
          other.classList.remove('open');
          var btn = other.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        }
      });

      // Keyboard accessibility
      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  /* ---------- BACK TO TOP ---------- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 600) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- FADE IN ON SCROLL ---------- */
  function initFadeInAnimations() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      elements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all
      elements.forEach(function(el) {
        el.classList.add('visible');
      });
    }
  }

})();
