// =========================================================
// VARIÁVEIS GLOBAIS
// =========================================================
const targetDate = new Date("December 31, 2025 23:59:00").getTime();
const lockScreen = document.querySelector(".lock-screen-countdown");
const countdownTimeDisplay = document.getElementById("countdown-time");

// Verifica imediatamente se o parâmetro 'dev=true' está na URL
const urlParams = new URLSearchParams(window.location.search);
const isDevMode = urlParams.get("dev") === "true";

let countdownInterval = null; // Variável para armazenar o ID do intervalo do contador

// =========================================================
// FUNÇÕES PRINCIPAIS
// =========================================================

function updateCountdown() {
  // Esta função só é chamada se NÃO estivermos no modo DEV
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const format = (num) => String(num).padStart(2, "0");

  if (distance < 0) {
    // *** DESBLOQUEIO POR DATA: A data chegou! ***
    clearInterval(countdownInterval);
    if (lockScreen) {
      lockScreen.classList.add("hidden");
    }
    countdownTimeDisplay.innerHTML = "É HOJE!"; // 🔑 CHAMA O SWIPER SOMENTE AO DESBLOQUEAR
    initializeSwiper();
  } else {
    // Bloqueio ativo: Atualiza o tempo.
    countdownTimeDisplay.innerHTML = `${days} dias ${format(hours)}:${format(minutes)}:${format(seconds)}`;
    if (lockScreen) {
      lockScreen.classList.remove("hidden");
    }
  }
}

// =========================================================
// NOVO BLOCO: INICIALIZAÇÃO DO SWIPER
// =========================================================

function initializeSwiper() {
  // Garante que o Swiper só inicialize uma vez
  if (document.querySelector(".mySwiper").swiper) return;

  const carouselWrapper = document.getElementById("carousel-wrapper");
  const totalPhotos = 104; // NÚMERO TOTAL DE FOTOS
  // 1. Geração Automática dos Slides

  if (carouselWrapper) {
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= totalPhotos; i++) {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");

      const img = document.createElement("img"); // Usa SRC para carregamento imediato (sem lazy loading, conforme configuração)
      img.setAttribute("src", `assets/photo${i}.jpg`);

      img.alt = `Momento nosso ${i}`;

      slide.appendChild(img);
      fragment.appendChild(slide);
    }

    carouselWrapper.appendChild(fragment); // 2. Inicialização do Swiper com Configurações

    new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 1.2,
        },
        1024: {
          slidesPerView: 1.5,
        },
      },
    });
  }
}

function initializeApp() {
  // 1. Lógica do Modo DEV
  if (isDevMode) {
    console.log("Modo DEV ativado. Desbloqueando a página.");
    if (lockScreen) {
      lockScreen.classList.add("hidden");
    } // 🔑 NOVO: Inicializa o Swiper imediatamente no modo DEV
    initializeSwiper();
  } else {
    // 2. Lógica do Contador Regressivo (Modo Normal)
    updateCountdown(); // Chama uma vez para inicializar o display
    countdownInterval = setInterval(updateCountdown, 1000); // Inicia o loop
  } // 3. Inicializa Tema (Dark/Light)

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("theme-dark");
  }
}

// =========================================================
// EVENT LISTENERS
// =========================================================

// Inicia o aplicativo e a lógica de bloqueio assim que o DOM estiver carregado
window.onload = initializeApp;

// Observer para animações de fade (só funciona se a tela não estiver bloqueada)
const observer = new IntersectionObserver((entries) => {
  // A animação só deve ocorrer se a tela estiver desbloqueada (modo DEV ou data alcançada)
  if (isDevMode || (lockScreen && lockScreen.classList.contains("hidden"))) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }
});

document.querySelectorAll(".fade").forEach((el) => observer.observe(el));

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("theme-dark");
  const isDarkMode = document.body.classList.contains("theme-dark");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// Início da música - Não desbloqueia a tela, só permite o som
document.addEventListener(
  "click",
  () => {
    const audio = document.getElementById("music");
    audio.muted = false;
    audio.play().catch((error) => {
      console.log("Autoplay bloqueado. A música tocará após o desbloqueio.");
    });
  },
  { once: true },
);

// Remove o bloco DOMContentLoaded antigo do Swiper
