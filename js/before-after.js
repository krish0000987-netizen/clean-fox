/**
 * CLEANFOX — BEFORE & AFTER COMPARISON SLIDER
 * Supports interactive dragging with mouse and touch events
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSliders();
});

function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.before-after-wrapper');
  if (!sliders.length) return;

  sliders.forEach(slider => {
    const afterLayer = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    if (!afterLayer || !handle) return;

    let isDragging = false;

    function updateSliderPosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let offsetX = clientX - rect.left;

      // Bound between 0% and 100%
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;

      afterLayer.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    // Mouse events
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
      if (e.target.closest('.ba-badge')) return;
      isDragging = true;
      if (e.touches && e.touches.length > 0) {
        updateSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchcancel', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches.length > 0) {
        updateSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    // Click anywhere on the slider container to move handle
    slider.addEventListener('click', (e) => {
      if (e.target.closest('.ba-badge')) return;
      updateSliderPosition(e.clientX);
    });
  });
}

