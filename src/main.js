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

    // Paginas: avanza de a un set completo de tarjetas visibles
    function getTotalSteps() {
        return Math.ceil(items.length / getVisibleCount())
    }

    // Ancho de una pagina completa
    function getStepWidth() {
        return Math.max(1, (items[0].offsetWidth + 16) * getVisibleCount())
    }

    function getMaxScroll() {
        return slider.scrollWidth - slider.clientWidth
    }

    // Genera
    function buildDots() {
        if (!dotsContainer) return
        dotsContainer.innerHTML = ''
        const steps = getTotalSteps()

        for (let i = 0; i < steps; i++) {
            const dot = document.createElement('button')
            dot.className = 'dot'
            dot.setAttribute('aria-label', `Pagina ${i + 1}`)
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

        slider.scrollTo({ left: Math.min(getStepWidth() * current, getMaxScroll()), behavior: 'smooth' })

        updateControls()
    }

    // Scroll
    slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(() => {
            // La ultima pagina queda recortada, el navegador topea el scroll
            if (slider.scrollLeft >= getMaxScroll() - 1) current = getTotalSteps() - 1
            else current = Math.round(slider.scrollLeft / getStepWidth())
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

initSlider('slider-confprensa')
