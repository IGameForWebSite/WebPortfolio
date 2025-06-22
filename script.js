const character = document.getElementById('character');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageContent = document.getElementById('page-content');
const pages = ['pages/page1.html', 'pages/page2.html', 'pages/page3.html','pages/page4.html','pages/page5.html'];
let currentPageIndex = 2;

// รูปภาพสำหรับอนิเมชั่น
const leftImages = ['assets/Animation/left1.png', 'assets/Animation/left2.png', 'assets/Animation/left3.png', 'assets/Animation/left4.png', 'assets/Animation/left5.png'];
const rightImages = ['assets/Animation/right1.png', 'assets/Animation/right2.png', 'assets/Animation/right3.png', 'assets/Animation/right4.png'];

const bgLayer = document.getElementById('bg-layer');

// ตำแหน่งเริ่มต้นของพื้นหลัง
let bgPosition = 0; // เริ่มที่ 0

// โหลดหน้าแรก
loadPage(pages[currentPageIndex]);
updateNavigationButtons();
// ตั้งค่าตำแหน่งพื้นหลังเริ่มต้น
bgLayer.style.transform = `translateX(${bgPosition}%)`;

// ฟังก์ชันโหลดหน้า + ซ่อน/แสดง
function loadPage(page) {
    // ซ่อนหน้าปัจจุบัน
    pageContent.classList.add('hidden');
    updatePageIndicator();

    fetch(page)
        .then(response => response.text())
        .then(data => {
            // แสดงหน้าถัดไปหลังอนิเมชั่น
            setTimeout(() => {
                pageContent.innerHTML = data;
                pageContent.classList.remove('hidden');
            }, 500); // ตรงกับเวลาอนิเมชั่น
        })
        .catch(error => console.error('Error:', error));
}

// ฟังก์ชันอัปเดตลูกศร
function updateNavigationButtons() {
    prevBtn.classList.toggle('hidden', currentPageIndex === 0);
    nextBtn.classList.toggle('hidden', currentPageIndex === pages.length - 1);
}

// ฟังก์ชันเล่นอนิเมชั่นด้วยรูปภาพ
function playAnimation(images, callback) {
    let index = 0;
    const interval = setInterval(() => {
        character.src = images[index];
        index++;
        if (index >= images.length) {
            clearInterval(interval);
            callback();
        }
    }, 100); // เปลี่ยนรูปทุก 100ms
}

// ฟังก์ชันเลื่อนพื้นหลัง (แบบไม่จำกัด)
function moveBackground(direction) {
    // กำหนดระยะการเลื่อนต่อครั้ง
    const moveDistance = 25; // เลื่อน 25% ต่อครั้ง
    
    if (direction === 'next') {
        bgPosition -= moveDistance; // เลื่อนไปทางซ้าย
    } else if (direction === 'prev') {
        bgPosition += moveDistance; // เลื่อนกลับทางขวา
    }
    
    bgLayer.style.transform = `translateX(${bgPosition}%)`;
}

// แก้ไขฟังก์ชัน handleNavigation
function handleNavigation(direction) {
    // ซ่อนลูกศรชั่วคราว
    prevBtn.style.pointerEvents = 'none';
    nextBtn.style.pointerEvents = 'none';

    // เลื่อนพื้นหลังก่อน
    moveBackground(direction);

    // เล่นอนิเมชั่นตัวละคร
    if (direction === 'prev') {
        playAnimation(leftImages, () => {
            character.src = 'assets/Animation/idle.png';
            if (currentPageIndex > 0) {
                currentPageIndex--;
                loadPage(pages[currentPageIndex]);
                updateNavigationButtons();
            }
            prevBtn.style.pointerEvents = 'auto';
            nextBtn.style.pointerEvents = 'auto';
        });
    } else {
        playAnimation(rightImages, () => {
            character.src = 'assets/Animation/idle.png';
            if (currentPageIndex < pages.length - 1) {
                currentPageIndex++;
                loadPage(pages[currentPageIndex]);
                updateNavigationButtons();
            }
            prevBtn.style.pointerEvents = 'auto';
            nextBtn.style.pointerEvents = 'auto';
        });
    }
}

// Event Listeners
prevBtn.addEventListener('click', () => handleNavigation('prev'));
nextBtn.addEventListener('click', () => handleNavigation('next'));

// เพิ่ม Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
        handleNavigation('prev');
    } else if (e.key === 'ArrowRight' && currentPageIndex < pages.length - 1) {
        handleNavigation('next');
    }
});


function updatePageIndicator() {
    const indicators = document.querySelectorAll('.page-number');
    indicators.forEach((el, index) => {
        if (index === currentPageIndex) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}