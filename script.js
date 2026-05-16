const character = document.getElementById('character');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageContent = document.getElementById('page-content');
const pages = ['pages/page1.html', 'pages/page2.html', 'pages/page3.html', 'pages/page4.html', 'pages/page5.html'];
let currentPageIndex = 0;
let isNavigating = false;

const leftImages = ['assets/Animation/left1.png', 'assets/Animation/left2.png', 'assets/Animation/left3.png', 'assets/Animation/left4.png'];
const rightImages = ['assets/Animation/right1.png', 'assets/Animation/right2.png', 'assets/Animation/right3.png', 'assets/Animation/right4.png'];

const bgLayer = document.getElementById('bg-layer');
let bgPosition = 0;

loadPage(pages[currentPageIndex]);
updateNavigationButtons();
updatePageIndicator();
bgLayer.style.transform = `translateX(${bgPosition}%)`;

function loadPage(page) {
    pageContent.classList.add('hidden');
    updatePageIndicator();

    fetch(page)
        .then(response => response.text())
        .then(data => {
            setTimeout(() => {
                pageContent.innerHTML = data;
                pageContent.scrollTop = 0;
                pageContent.classList.remove('hidden');
                pageContent.classList.add('fade-in');
                setTimeout(() => pageContent.classList.remove('fade-in'), 1000);
            }, 400);
        })
        .catch(error => console.error('Error loading page:', error));
}

function updateNavigationButtons() {
    prevBtn.classList.toggle('hidden', currentPageIndex === 0);
    nextBtn.classList.toggle('hidden', currentPageIndex === pages.length - 1);
}

function playAnimation(images, callback) {
    let index = 0;
    const interval = setInterval(() => {
        character.src = images[index];
        index++;
        if (index >= images.length) {
            clearInterval(interval);
            callback();
        }
    }, 100);
}

function moveBackground(direction) {
    const moveDistance = 25;
    if (direction === 'next') {
        bgPosition -= moveDistance;
    } else if (direction === 'prev') {
        bgPosition += moveDistance;
    }
    bgLayer.style.transform = `translateX(${bgPosition}%)`;
}

function handleNavigation(direction) {
    if (isNavigating) return;
    if (direction === 'prev' && currentPageIndex === 0) return;
    if (direction === 'next' && currentPageIndex === pages.length - 1) return;

    isNavigating = true;
    prevBtn.style.pointerEvents = 'none';
    nextBtn.style.pointerEvents = 'none';

    moveBackground(direction);

    if (direction === 'prev') {
        playAnimation(leftImages, () => {
            character.src = 'assets/Animation/idle.png';
            currentPageIndex--;
            loadPage(pages[currentPageIndex]);
            updateNavigationButtons();
            isNavigating = false;
            prevBtn.style.pointerEvents = 'auto';
            nextBtn.style.pointerEvents = 'auto';
        });
    } else {
        playAnimation(rightImages, () => {
            character.src = 'assets/Animation/idle.png';
            currentPageIndex++;
            loadPage(pages[currentPageIndex]);
            updateNavigationButtons();
            isNavigating = false;
            prevBtn.style.pointerEvents = 'auto';
            nextBtn.style.pointerEvents = 'auto';
        });
    }
}

function updatePageIndicator() {
    const indicators = document.querySelectorAll('.page-number');
    indicators.forEach((el, index) => {
        el.classList.toggle('active', index === currentPageIndex);
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
        handleNavigation('prev');
    } else if (e.key === 'ArrowRight' && currentPageIndex < pages.length - 1) {
        handleNavigation('next');
    }
});

// Touch / Swipe navigation
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only trigger on clear horizontal swipe (not vertical scroll)
    if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 50) {
        if (dx < 0) {
            handleNavigation('next');
        } else {
            handleNavigation('prev');
        }
<<<<<<< HEAD
    }
}, { passive: true });

// Button events
prevBtn.addEventListener('click', () => handleNavigation('prev'));
nextBtn.addEventListener('click', () => handleNavigation('next'));
=======
    });
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only handle horizontal swipes longer than 50px and more horizontal than vertical
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0 && currentPageIndex < pages.length - 1) {
            handleNavigation('next');
        } else if (dx > 0 && currentPageIndex > 0) {
            handleNavigation('prev');
        }
    }
}, { passive: true });
>>>>>>> 5da68a1ab351107123123647fea545f688d7bca3
