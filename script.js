const character = document.getElementById('character');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageContent = document.getElementById('page-content');
const pages = ['pages/page1.html', 'pages/page2.html', 'pages/page3.html','pages/page4.html'];
let currentPageIndex = 0;

// รูปภาพสำหรับอนิเมชั่น
const leftImages = ['assets/Animation/left1.png', 'assets/Animation/left2.png', 'assets/Animation/left3.png', 'assets/Animation/left4.png', 'assets/Animation/left5.png'];
const rightImages = ['assets/Animation/right1.png', 'assets/Animation/right2.png', 'assets/Animation/right3.png', 'assets/Animation/right4.png'];


const bgLayer = document.getElementById('bg-layer');
let bgPosition = 50; // ตำแหน่งเริ่มต้น (%)

// โหลดหน้าแรก
loadPage(pages[currentPageIndex]);
updateNavigationButtons();

// ฟังก์ชันโหลดหน้า + ซ่อน/แสดง
function loadPage(page) {
    // ซ่อนหน้าปัจจุบัน
    pageContent.classList.add('hidden');

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


// ฟังก์ชันเลื่อนพื้นหลัง
function moveBackground(direction) {
    const speed = 25;
    const maxPosition = 50 + (pages.length - 1) * speed; // คำนวณตำแหน่งสูงสุดตามจำนวนหน้า

    if (direction === 'next' && bgPosition < maxPosition) {
        bgPosition += speed;
    } else if (direction === 'prev' && bgPosition > 0) {
        bgPosition -= speed;
    }

    bgLayer.style.transform = `translateX(-${bgPosition}%)`;
}


// แก้ไขฟังก์ชัน handleNavigation
function handleNavigation(direction) {
    // ซ่อนลูกศรชั่วคราว
    prevBtn.style.pointerEvents = 'none';
    nextBtn.style.pointerEvents = 'none';

    // เลื่อนพื้นหลัง
    moveBackground(direction);

    // เล่นอนิเมชั่นตัวละคร
    if (direction === 'prev') {
        playAnimation(leftImages, () => {
            character.src = 'assets/Animation/idle.png';
            if (currentPageIndex > 0) currentPageIndex--;
            loadPage(pages[currentPageIndex]);
            updateNavigationButtons();
            prevBtn.style.pointerEvents = 'auto';
            nextBtn.style.pointerEvents = 'auto';
        });
    } else {
        playAnimation(rightImages, () => {
            character.src = 'assets/Animation/idle.png';
            if (currentPageIndex < pages.length - 1) currentPageIndex++;
            loadPage(pages[currentPageIndex]);
            updateNavigationButtons();
            prevBtn.style.pointerEvents = 'auto';
            nextBtn.style.pointerEvents = 'auto';
        });
    }
}

// Event Listeners
prevBtn.addEventListener('click', () => handleNavigation('prev'));
nextBtn.addEventListener('click', () => handleNavigation('next'));