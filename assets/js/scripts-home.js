// scripts-home.js

let currentHomeView = localStorage.getItem('homeViewPreference') || 'grid';

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeView);
} else {
    initHomeView();
}

function initHomeView() {
    setHomeView(currentHomeView);
    
    // Bind click events explicitly
    const btnGrid = document.getElementById('btnViewGrid');
    const btnCarousel = document.getElementById('btnViewCarousel');
    if (btnGrid) {
        btnGrid.addEventListener('click', (e) => {
            e.preventDefault();
            setHomeView('grid');
        });
    }
    if (btnCarousel) {
        btnCarousel.addEventListener('click', (e) => {
            e.preventDefault();
            setHomeView('carousel');
        });
    }
}

function setHomeView(mode) {
    currentHomeView = mode;
    localStorage.setItem('homeViewPreference', mode);
    
    const container = document.getElementById('homeViewContainer');
    const btnGrid = document.getElementById('btnViewGrid');
    const btnCarousel = document.getElementById('btnViewCarousel');
    
    if (!container || !btnGrid || !btnCarousel) return;
    
    const slider = document.getElementById('viewModeSlider');
    if (mode === 'carousel') {
        container.classList.remove('grid-view');
        container.classList.add('carousel-view');
        btnGrid.classList.remove('active');
        btnCarousel.classList.add('active');
        if (slider) slider.classList.add('is-carousel');
        
        // Initialize carousel logic if not already running
        if (!window.__carouselInitDone) {
            setupHomeCarousel();
            window.__carouselInitDone = true;
        } else if (window.__carouselObj) {
            window.__carouselObj.setAutoplay(true);
            window.__carouselObj.update();
        }
    } else {
        container.classList.remove('carousel-view');
        container.classList.add('grid-view');
        btnCarousel.classList.remove('active');
        btnGrid.classList.add('active');
        if (slider) slider.classList.remove('is-carousel');
        
        // Pause carousel if switching to grid
        if (window.__carouselObj) {
            window.__carouselObj.setAutoplay(false);
        }
    }
}

function setupHomeCarousel() {
    const root = document.getElementById('homeViewContainer');
    if (!root) return;
    
    const track = document.getElementById('homeCarouselTrack');
    // Select all cards inside the track
    const cards = Array.from(track.querySelectorAll('.mod-card'));
    const dotsWrap = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    const n = cards.length;
    if (n === 0) return;
    
    let idx = 0;
    let autoplay = true;
    let timer = null;

    // Build dots
    if (dotsWrap) {
        dotsWrap.innerHTML = ''; // clear if any
        cards.forEach((_, i) => {
            const b = document.createElement('button');
            b.className = 'carousel-dot';
            b.setAttribute('aria-label', 'Go to slide ' + (i+1));
            b.addEventListener('click', (e) => { 
                e.stopPropagation();
                goTo(i); 
                resetAuto(); 
            });
            dotsWrap.appendChild(b);
        });
    }
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

    function update() {
        if (!root.classList.contains('carousel-view')) return;
        
        cards.forEach((card, i) => {
            const diff = ((i - idx) % n + n) % n;
            let pos;
            if (diff === 0) pos = 'center';
            else if (diff === 1) pos = 'right';
            else if (diff === n - 1) pos = 'left';
            else if (diff === 2) pos = 'far-right';
            else if (diff === n - 2) pos = 'far-left';
            else pos = 'hidden';
            card.setAttribute('data-pos', pos);
        });
        
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(i) {
        idx = ((i % n) + n) % n;
        update();
    }
    
    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    if(prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); resetAuto(); });
    if(nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); resetAuto(); });
    
    // Allow clicking on side cards to navigate to them
    cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
            if (!root.classList.contains('carousel-view')) return; // let normal link work in grid
            if (dragMoved) {
                e.preventDefault();
                return;
            }
            if (i !== idx) { 
                e.preventDefault(); // prevent navigation
                goTo(i); 
                resetAuto(); 
            }
        });
    });

    // Keyboard navigation
    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => {
        if (!root.classList.contains('carousel-view')) return;
        if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
        if (e.key === 'ArrowRight') { next(); resetAuto(); }
    });

    // Drag / swipe logic
    let dragStartX = 0, dragX = 0, dragging = false, dragMoved = false;
    
    function onDown(x) { 
        if (!root.classList.contains('carousel-view')) return;
        dragStartX = x; dragX = 0; dragging = true; dragMoved = false; 
        root.classList.add('dragging'); 
        stopAuto(); 
    }
    
    function onMove(x) {
        if (!dragging) return;
        dragX = x - dragStartX;
        if (Math.abs(dragX) > 6) dragMoved = true;
    }
    
    function onUp() {
        if (!dragging) return;
        dragging = false;
        root.classList.remove('dragging');
        
        const threshold = 50;
        if (dragX > threshold) prev();
        else if (dragX < -threshold) next();
        else update();
        
        dragX = 0;
        resetAuto();
        
        setTimeout(() => { dragMoved = false; }, 50);
    }

    root.addEventListener('mousedown', (e) => onDown(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onUp);
    
    root.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
    root.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
    root.addEventListener('touchend', onUp);

    // Hover pause
    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', () => { if (autoplay) startAuto(); });

    function startAuto() {
        stopAuto();
        if (!autoplay) return;
        timer = setInterval(next, 3800);
    }
    
    function stopAuto() { 
        if (timer) { clearInterval(timer); timer = null; } 
    }
    
    function resetAuto() { 
        if (autoplay && root.classList.contains('carousel-view')) { 
            stopAuto(); startAuto(); 
        } 
    }

    window.__carouselObj = {
        setAutoplay(v) { 
            autoplay = !!v; 
            if (autoplay) startAuto(); else stopAuto(); 
        },
        update: update
    };

    update();
    if (autoplay) startAuto();
}


window.setHomeView = setHomeView;
