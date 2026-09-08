/**
 * CLEANFOX — GALLERY & LIGHTBOX MODULE
 * Category filter tabs and responsive fullscreen modal lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilters();
  initLightbox();
});

function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

function initLightbox() {
  const modal = document.querySelector('.lightbox-modal');
  const modalImg = modal ? modal.querySelector('.lightbox-img') : null;
  const modalCaption = modal ? modal.querySelector('.lightbox-caption') : null;
  const closeBtn = modal ? modal.querySelector('.lightbox-close') : null;
  const prevBtn = modal ? modal.querySelector('.lightbox-prev') : null;
  const nextBtn = modal ? modal.querySelector('.lightbox-next') : null;
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!modal || !galleryItems.length) return;

  let visibleItems = [];
  let currentIndex = 0;

  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  function openLightbox(index) {
    updateVisibleItems();
    currentIndex = index;
    const item = visibleItems[currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title');
    const cat = item.querySelector('.gallery-item-cat');

    if (modalImg && img) modalImg.src = img.src;
    if (modalCaption) {
      modalCaption.textContent = title ? title.textContent : (cat ? cat.textContent : 'Cleanfox Gallery');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    updateVisibleItems();
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  }

  function prevImage() {
    updateVisibleItems();
    if (!visibleItems.length) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) openLightbox(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}
