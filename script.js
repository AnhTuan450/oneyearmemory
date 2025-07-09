// DOM elements
const pages = document.querySelectorAll('.page');
const nextBtn1 = document.getElementById('nextBtn1');
const openBtn = document.getElementById('openBtn');
const noBtn = document.getElementById('noBtn');
const againBtn = document.getElementById('againBtn');
const restartBtn = document.getElementById('restartBtn');
const audioBtn = document.getElementById('audioBtn');
const bgMusic = document.getElementById('bgMusic');
const heartsContainer = document.getElementById('hearts');

// Button audio effect - Cute pop sound
function playButtonSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create pop sound
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Higher pitch for cuter sound
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.08);
    
    // Quick attack and release for pop effect
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.08);
}

// Create hearts animation
function createHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (6 + Math.random() * 4) + 's';
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }, 300);
}

// Button animations
function addButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('pulse');
            setTimeout(() => {
                btn.classList.remove('pulse');
            }, 500);
        });
    });
}

// Navigate between pages
function navigateTo(pageIndex) {
    pages.forEach((page, index) => {
        if (index === pageIndex) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
    
    // Add special animations based on page
    if (pageIndex === 0) {
        document.querySelector('#page1 .image-container').classList.add('bounce');
        setTimeout(() => {
            document.querySelector('#page1 .image-container').classList.remove('bounce');
        }, 500);
    } else if (pageIndex === 3) {
        document.querySelector('#page4 .container').classList.add('pulse');
        setTimeout(() => {
            document.querySelector('#page4 .container').classList.remove('pulse');
        }, 500);
    }
}

// Audio management
function initAudio() {
    let isMusicPlaying = false;
    let autoPlayAttempted = false;
    bgMusic.volume = 0.7;
    bgMusic.currentTime = 0;

    function startMusic() {
        return bgMusic.play().then(() => {
            audioBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isMusicPlaying = true;
        }).catch(e => {
            setupInteractionListener();
        });
    }

    function stopMusic() {
        bgMusic.pause();
        audioBtn.innerHTML = '<i class="fas fa-music"></i>';
        isMusicPlaying = false;
    }

    function handleMusicToggle() {
        if (isMusicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
        audioBtn.classList.add('bounce');
        setTimeout(() => {
            audioBtn.classList.remove('bounce');
        }, 500);
    }
    audioBtn.style.pointerEvents = '';
    audioBtn.style.opacity = '1';
    audioBtn.addEventListener('click', handleMusicToggle);

    function attemptAutoPlay() {
        if (autoPlayAttempted) return;
        autoPlayAttempted = true;
        startMusic();
    }
    setTimeout(attemptAutoPlay, 200);
    bgMusic.addEventListener('canplaythrough', attemptAutoPlay);

    function setupInteractionListener() {
        const tryPlay = () => {
            startMusic();
            document.removeEventListener('click', tryPlay);
            document.removeEventListener('keydown', tryPlay);
            document.removeEventListener('touchstart', tryPlay);
        };
        document.addEventListener('click', tryPlay);
        document.addEventListener('keydown', tryPlay);
        document.addEventListener('touchstart', tryPlay);
    }

    bgMusic.addEventListener('play', () => {
        audioBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isMusicPlaying = true;
    });
    bgMusic.addEventListener('pause', () => {
        audioBtn.innerHTML = '<i class="fas fa-music"></i>';
        isMusicPlaying = false;
    });
}

// Event listeners setup
function setupEventListeners() {
    // Page navigation
    nextBtn1.addEventListener('click', () => navigateTo(1));
    openBtn.addEventListener('click', () => navigateTo(3));
    noBtn.addEventListener('click', () => navigateTo(2));
    againBtn.addEventListener('click', () => navigateTo(1));
    restartBtn.addEventListener('click', () => navigateTo(0));
    
    // Add shake animation to "No" button
    noBtn.addEventListener('mouseenter', () => {
        noBtn.classList.add('shake');
        setTimeout(() => {
            noBtn.classList.remove('shake');
        }, 500);
    });
    
    // Add click sound to all clickable elements
    document.addEventListener('click', (e) => {
        if (e.target.matches('button, .btn, .audio-btn')) {
            playButtonSound();
        }
    });
}

// Initialize
function init() {
    console.log('Initializing application...');
    
    // Setup all event listeners
    setupEventListeners();
    
    // Initialize audio
    initAudio();
    
    // Button animations
    addButtonAnimations();
    
    // Hearts animation
    createHearts();
    
    console.log('Application initialized successfully');
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', init);
