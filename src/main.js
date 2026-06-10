import './style.css'
import Alpine from 'alpinejs'

window.Alpine = Alpine
Alpine.start()

// SLIDER
function initSlider(sliderId) {
    const slider = document.getElementById(sliderId)
    if (!slider) return

    const items = slider.querySelectorAll('[data-slide-item]')
    if (items.length === 0) return

    const dotsContainer = document.querySelector(`[data-dots="${sliderId}"]`)
    const prevBtn = document.querySelector(`[data-arrows="${sliderId}"] .arrow-prev`)
    const nextBtn = document.querySelector(`[data-arrows="${sliderId}"] .arrow-next`)

    let current = 0
    let scrollTimer = null

    function getVisibleCount() {
        const sliderWidth = slider.offsetWidth
        const cardWidth   = items[0].offsetWidth
        return Math.round(sliderWidth / (cardWidth + 16)) || 1
    }

    // Scroll posibles
    function getTotalSteps() {
        return items.length - getVisibleCount() + 1
    }

    // Genera
    function buildDots() {
        if (!dotsContainer) return
        dotsContainer.innerHTML = ''
        const steps = getTotalSteps()

        for (let i = 0; i < steps; i++) {
            const dot = document.createElement('button')
            dot.className = 'dot'
            dot.setAttribute('aria-label', `Slide ${i + 1}`)
            dot.addEventListener('click', () => goToSlide(i))
            dotsContainer.appendChild(dot)
        }
    }

    function getDots() {
        return dotsContainer ? dotsContainer.querySelectorAll('.dot') : []
    }

    function updateControls() {
        const steps = getTotalSteps()
        const dots  = getDots()

        dots.forEach((dot, i) => {
            if (i === current) dot.setAttribute('data-active', 'true')
            else               dot.removeAttribute('data-active')
        })

        if (prevBtn) prevBtn.classList.toggle('opacity-30', current === 0)
        if (nextBtn) nextBtn.classList.toggle('opacity-30', current >= steps - 1)
    }

    function goToSlide(index) {
        const steps = getTotalSteps()
        current = Math.max(0, Math.min(index, steps - 1))

        const cardWidth = items[0].offsetWidth
        const gap = 16
        slider.scrollTo({ left: (cardWidth + gap) * current, behavior: 'smooth' })

        updateControls()
    }

    // Scroll
    slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(() => {
            const cardWidth = items[0].offsetWidth
            const gap = 16
            current = Math.round(slider.scrollLeft / (cardWidth + gap))
            updateControls()
        }, 80)
    })

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(current - 1))
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(current + 1))

    // Resize
    const resizeObserver = new ResizeObserver(() => {
        buildDots()
        goToSlide(current)
    })
    resizeObserver.observe(slider)

    buildDots()
    goToSlide(0)
}

initSlider('slider-amautas')
initSlider('slider-2024')
initSlider('slider-2025')

// MODAL
const modal       = document.getElementById('customModal');
const modalTitle  = document.getElementById('modalTitle');
const modalDesc   = document.getElementById('modalDescription');
const closeModalX = document.getElementById('closeModalX');

const openModal = ({ name, description, img }) => {
  modalTitle.textContent       = name;
  modalDesc.textContent        = description;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modal.classList.remove('flex');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
};

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.open-modal-btn');
  if (btn) {
    openModal({
      name:        btn.dataset.name,
      description: btn.dataset.description,
    });
  }
});

closeModalX.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
