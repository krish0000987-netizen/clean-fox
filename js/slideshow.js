/**
 * CLEANFOX — HERO SLIDESHOW MODULE
 * Automatic 3-second transitions with progress bars, dot navigation, touch swipe support
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlideshow();
});

function initHeroSlideshow() {
  const container = document.querySelector('.hero-slider-container');
  if (!container) return;

  const slides = container.querySelectorAll('.hero-slide');
  const dotsContainer = container.querySelector('.slider-indicators');
  const prevBtn = container.querySelector('.slider-prev');
  const nextBtn = container.querySelector('.slider-next');

  if (!slides.length) return;

  let currentIndex = 0;
  const slideDuration = 3000; // Exact 3 seconds transition
  let slideTimer = null;
  let isPaused = false;

  // Create dot indicators if container exists and is empty
  if (dotsContainer && !dotsContainer.children.length) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.innerHTML = '<div class="slider-dot-progress"></div>';
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

  function updateSlides() {
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlides();
  }

  function goToSlide(idx) {
    currentIndex = idx;
    updateSlides();
  }

  function startTimer() {
    stopTimer();
    slideTimer = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, slideDuration);
  }

  function stopTimer() {
    if (slideTimer) clearInterval(slideTimer);
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  // Navigation button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartTimer();
    });
  }

  // Hover pause
  container.addEventListener('mouseenter', () => { isPaused = true; });
  container.addEventListener('mouseleave', () => { isPaused = false; });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isPaused = true;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    isPaused = false;
    handleSwipe();
    restartTimer();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }

  // Initialize
  updateSlides();
  startTimer();
}
