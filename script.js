const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
  observer.observe(item);
});

const PORTFOLIO_CAPTIONS = {
  "IMG_20260607_084019.webp": "Ландшафт",
  "IMG_20260607_084023.webp": "Красота!",
  "IMG_20260607_084026.webp": "Законченная коробка",
  "IMG_20260607_084029.webp": "Готовый объект",
  "IMG_20260607_084033.webp": "Под черновую отделку",
  "IMG_20260607_084036.webp": "Коробка, пример 2",
  "IMG_20260607_084039.webp": "Коробка, пример 3",
  "IMG_20260607_084325.png": "Готовый объект",
};

const PORTFOLIO_IMAGES = [
  "IMG_20260607_084019.webp",
  "IMG_20260607_084023.webp",
  "IMG_20260607_084026.webp",
  "IMG_20260607_084029.webp",
  "IMG_20260607_084033.webp",
  "IMG_20260607_084036.webp",
  "IMG_20260607_084039.webp",
  "IMG_20260607_084325.png",
  "IMG_20260608_095355.png",
  "IMG_20260608_095400.png",
  "IMG_20260608_095403.png",
  "IMG_20260608_095409.png",
  "IMG_20260608_095415.png",
  "IMG_20260608_095447.png",
  "IMG_20260608_095529.png",
  "IMG_20260608_095549.png",
  "IMG_20260608_095552.png",
  "IMG_20260608_095605.png",
  "IMG_20260608_095704.png",
  "IMG_20260608_095713.png",
  "IMG_20260608_095723.png",
  "IMG_20260608_095732.png",
  "IMG_20260608_095738.png",
  "IMG_20260608_095741.png",
  "IMG_20260608_095747.png",
  "IMG_20260608_095752.png",
  "IMG_20260608_095757.png",
  "IMG_20260608_095802.png",
  "IMG_20260608_095808.png",
  "IMG_20260608_095812.png",
  "IMG_20260609_141903.webp",
  "IMG_20260609_141937.webp",
  "IMG_20260609_141947.webp",
  "IMG_20260609_141951.webp",
  "IMG_20260609_141955.webp",
  "IMG_20260609_141959.webp",
  "IMG_20260609_142002.webp",
  "IMG_20260609_142006.webp",
  "IMG_20260609_142012.webp",
  "IMG_20260609_142014.webp",
  "IMG_20260609_142019.webp",
  "IMG_20260609_142022.webp",
];

function initPortfolioCarousel() {
  const carousel = document.querySelector("[data-portfolio-carousel]");
  const track = document.querySelector("[data-portfolio-track]");
  const viewport = document.querySelector("[data-portfolio-viewport]");
  const counter = document.querySelector("[data-portfolio-counter]");
  const prevBtn = document.querySelector(".portfolio-carousel__btn--prev");
  const nextBtn = document.querySelector(".portfolio-carousel__btn--next");

  if (!carousel || !track || !viewport) {
    return;
  }

  PORTFOLIO_IMAGES.forEach((filename) => {
    const src = `images/${filename}`;
    const caption = PORTFOLIO_CAPTIONS[filename] || "";
    const alt = caption || "Пример работы — строительство и благоустройство";

    const item = document.createElement("article");
    item.className = "portfolio-carousel__item";

    const link = document.createElement("a");
    link.className = "portfolio-carousel__link";
    link.href = src;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = caption ? `${caption} — открыть в полном размере` : "Открыть фото в полном размере";

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";

    link.appendChild(img);

    if (caption) {
      const captionEl = document.createElement("span");
      captionEl.className = "portfolio-carousel__caption";
      captionEl.textContent = caption;
      link.appendChild(captionEl);
    }

    item.appendChild(link);
    track.appendChild(item);
  });

  const items = Array.from(track.querySelectorAll(".portfolio-carousel__item"));
  let activeIndex = 0;
  let dragStartX = 0;
  let dragScrollLeft = 0;
  let isDragging = false;
  let dragMoved = false;

  const getClosestIndex = () => {
    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const updateCounter = () => {
    activeIndex = getClosestIndex();
    if (counter) {
      counter.textContent = `${activeIndex + 1} / ${items.length}`;
    }
    if (prevBtn) {
      prevBtn.disabled = activeIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = activeIndex === items.length - 1;
    }
  };

  const scrollToIndex = (index) => {
    const target = items[Math.max(0, Math.min(index, items.length - 1))];
    if (!target) {
      return;
    }

    viewport.scrollTo({
      left: target.offsetLeft - (viewport.clientWidth - target.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => scrollToIndex(activeIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => scrollToIndex(activeIndex + 1));
  }

  let wheelCooldown = false;

  const handleWheel = (event) => {
    const delta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

    if (Math.abs(delta) < 1 || wheelCooldown) {
      return;
    }

    event.preventDefault();

    wheelCooldown = true;
    scrollToIndex(activeIndex + (delta > 0 ? 1 : -1));

    window.setTimeout(() => {
      wheelCooldown = false;
    }, 280);
  };

  carousel.addEventListener("wheel", handleWheel, { passive: false });

  viewport.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(updateCounter);
    },
    { passive: true }
  );

  viewport.addEventListener("mousedown", (event) => {
    isDragging = true;
    dragMoved = false;
    dragStartX = event.pageX;
    dragScrollLeft = viewport.scrollLeft;
    viewport.classList.add("is-dragging");
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    viewport.classList.remove("is-dragging");
    scrollToIndex(getClosestIndex());
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) {
      return;
    }

    const walk = event.pageX - dragStartX;
    if (Math.abs(walk) > 6) {
      dragMoved = true;
      event.preventDefault();
      viewport.scrollLeft = dragScrollLeft - walk;
    }
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
  });

  track.addEventListener(
    "click",
    (event) => {
      if (dragMoved) {
        event.preventDefault();
        dragMoved = false;
      }
    },
    true
  );

  updateCounter();
}

initPortfolioCarousel();
