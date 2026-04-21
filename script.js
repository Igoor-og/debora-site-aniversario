document.addEventListener("DOMContentLoaded", () => {
    // Initialize AOS Animation Library
    AOS.init({
        once: true,
        offset: 80,
        easing: 'ease-in-out-cubic',
    });

    // 1. Background Floating Hearts
    const heartsContainer = document.getElementById('hearts-container');
    const createHeart = () => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 6 + 's'; // 6 to 9 seconds
        heart.style.fontSize = Math.random() * 15 + 10 + 'px';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 9000);
    };
    setInterval(createHeart, 400);

    // 2. Audio Player Logic
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            audio.play().catch(e => console.log('Autoplay blocked'));
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
        isPlaying = !isPlaying;
    });

    // 3. Dual Count-up Timers
    const firstDate = new Date("April 21, 2023 00:00:00").getTime();
    const secondDate = new Date("January 01, 2025 00:00:00").getTime();
    
    function updateCounters() {
        const now = new Date().getTime();
        
        // Timer 1 (Desde 21.04.2023)
        const dist1 = now - firstDate;
        if (dist1 > 0) {
            document.getElementById('days1').innerText = Math.floor(dist1 / (1000 * 60 * 60 * 24));
            document.getElementById('hours1').innerText = Math.floor((dist1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('minutes1').innerText = Math.floor((dist1 % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('seconds1').innerText = Math.floor((dist1 % (1000 * 60)) / 1000);
        }

        // Timer 2 (Desde 01.01.2025)
        const dist2 = now - secondDate;
        if (dist2 > 0) {
            document.getElementById('days2').innerText = Math.floor(dist2 / (1000 * 60 * 60 * 24));
            document.getElementById('hours2').innerText = Math.floor((dist2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('minutes2').innerText = Math.floor((dist2 % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('seconds2').innerText = Math.floor((dist2 % (1000 * 60)) / 1000);
        }
    }
    
    setInterval(updateCounters, 1000);
    updateCounters();

    // 4. Easter Egg Confetti Logic (Fires when reaching bottom of letter)
    let confettiFired = false;
    const trigger = document.getElementById('easter-egg-trigger');
    
    if (trigger) {
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !confettiFired) {
                fireConfetti();
                confettiFired = true;
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(trigger);
    }

    function fireConfetti() {
        var duration = 4 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // 5. Masonry Gallery with Lazy Loading
    const galleryContainer = document.getElementById('masonry-gallery');
    const totalPhotos = 104; // As discovered in the original script
    
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= totalPhotos; i++) {
        const imgContainer = document.createElement('div');
        imgContainer.setAttribute('data-aos', 'zoom-in');
        
        const img = document.createElement('img');
        img.dataset.src = `assets/photo${i}.jpg`;
        img.classList.add('gallery-img');
        img.alt = `Nosso momento ${i}`;
        // Native lazy loading for compatible browsers fallback
        img.loading = "lazy";
        
        fragment.appendChild(img);
    }
    if (galleryContainer) {
        galleryContainer.appendChild(fragment);
    }

    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.onload = () => img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "0px 0px 400px 0px" });

    document.querySelectorAll('.gallery-img').forEach(img => imgObserver.observe(img));

    // 6. Mini-Game: Nosso Termooo
    const targetWord = "AMOR"; 
    const numRows = 6;
    let currentRow = 0;
    let currentCell = 0;
    let boardState = Array.from({ length: numRows }, () => Array(targetWord.length).fill(''));
    let gameOver = false;

    const board = document.getElementById('term-board');
    const keyboard = document.getElementById('keyboard');

    if (board && keyboard) {
        // Build Board
        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('div');
            row.classList.add('term-row');
            for (let j = 0; j < targetWord.length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('term-cell');
                cell.id = `cell-${i}-${j}`;
                row.appendChild(cell);
            }
            board.appendChild(row);
        }

        // Build Keyboard
        const keys = [
            ['Q','W','E','R','T','Y','U','I','O','P'],
            ['A','S','D','F','G','H','J','K','L'],
            ['DEL','Z','X','C','V','B','N','M','ENTER']
        ];
        
        keys.forEach(rowKeys => {
            const row = document.createElement('div');
            row.classList.add('key-row');
            rowKeys.forEach(k => {
                const btn = document.createElement('button');
                btn.classList.add('key');
                btn.innerText = k === 'DEL' ? '⌫' : (k === 'ENTER' ? 'OK' : k);
                btn.dataset.key = k;
                btn.addEventListener('click', () => handleKey(k));
                row.appendChild(btn);
            });
            keyboard.appendChild(row);
        });

        function handleKey(key) {
            if (gameOver) return;

            if (key === 'DEL' || key === 'BACKSPACE') {
                if (currentCell > 0) {
                    currentCell--;
                    boardState[currentRow][currentCell] = '';
                    updateBoard();
                }
            } else if (key === 'ENTER') {
                if (currentCell === targetWord.length) {
                    checkWord();
                } else {
                    alert('Preencha a palavra completa!');
                }
            } else if (currentCell < targetWord.length && /^[A-Z]$/.test(key)) {
                boardState[currentRow][currentCell] = key;
                currentCell++;
                updateBoard();
            }
        }

        document.addEventListener('keydown', (e) => {
            const k = e.key.toUpperCase();
            if (k === 'BACKSPACE') handleKey('DEL');
            else if (k === 'ENTER') handleKey('ENTER');
            else if (/^[A-Z]$/.test(k)) handleKey(k);
        });

        function updateBoard() {
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < targetWord.length; j++) {
                    const cell = document.getElementById(`cell-${i}-${j}`);
                    if (cell) {
                        cell.innerText = boardState[i][j];
                        // Add some pop animation
                        if (boardState[i][j] !== '' && i === currentRow && j === currentCell - 1) {
                            cell.style.transform = 'scale(1.1)';
                            setTimeout(() => cell.style.transform = 'scale(1)', 100);
                        }
                    }
                }
            }
        }

        function checkWord() {
            const guess = boardState[currentRow].join('');
            const answerArr = targetWord.split('');
            const guessArr = guess.split('');
            
            let correctCount = 0;
            
            // Mark correct (green)
            guessArr.forEach((letter, i) => {
                const cell = document.getElementById(`cell-${currentRow}-${i}`);
                const keyBtn = document.querySelector(`.key[data-key="${letter}"]`);
                if (letter === answerArr[i]) {
                    setTimeout(() => {
                        cell.classList.add('correct');
                        if(keyBtn) {
                           keyBtn.style.background = '#a8e6cf';
                           keyBtn.style.color = '#2b2b2b';
                        }
                    }, i * 200);
                    answerArr[i] = null;
                    guessArr[i] = null;
                    correctCount++;
                }
            });

            // Mark present (yellow) and absent (gray)
            guessArr.forEach((letter, i) => {
                if (letter === null) return; 
                
                setTimeout(() => {
                    const cell = document.getElementById(`cell-${currentRow}-${i}`);
                    const keyBtn = document.querySelector(`.key[data-key="${letter}"]`);
                    
                    if (answerArr.includes(letter)) {
                        cell.classList.add('present');
                        if(keyBtn && keyBtn.style.background !== 'rgb(168, 230, 207)') { 
                           keyBtn.style.background = 'var(--gold-light)';
                           keyBtn.style.color = '#2b2b2b';
                        }
                        answerArr[answerArr.indexOf(letter)] = null;
                    } else {
                        cell.classList.add('absent');
                        if(keyBtn && !keyBtn.style.background) {
                           keyBtn.style.background = '#e0e0e0';
                        }
                    }
                }, i * 200);
            });

            setTimeout(() => {
                if (correctCount === targetWord.length) {
                    gameOver = true;
                    fireConfetti();
                    setTimeout(() => alert('Parabéns! Você acertou nossa palavra especial! Te amo! ❤️'), 500);
                } else if (currentRow === numRows - 1) {
                    gameOver = true;
                    setTimeout(() => alert(`Fim de jogo! A palavra era ${targetWord}`), 500);
                } else {
                    currentRow++;
                    currentCell = 0;
                }
            }, targetWord.length * 200 + 100);
        }
    }
});
