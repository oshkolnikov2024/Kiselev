const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

const updateHeaderOffset = () => {
  if (!siteHeader) {
    return;
  }

  const height = siteHeader.offsetHeight;
  document.documentElement.style.setProperty("--header-height", `${height}px`);
};

updateHeaderOffset();
window.addEventListener("resize", updateHeaderOffset);

const scrollToAnchor = (hash, { smooth = true } = {}) => {
  if (!hash || hash === "#") {
    return;
  }

  if (hash === "#top") {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    return;
  }

  const target = document.querySelector(hash);
  if (!target) {
    return;
  }

  const offset = siteHeader?.offsetHeight ?? 0;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") {
      return;
    }

    const target = hash === "#top" ? document.querySelector("#top") : document.querySelector(hash);
    if (!target) {
      return;
    }

    event.preventDefault();
    scrollToAnchor(hash);

    if (nav && navToggle && nav.contains(link)) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

if (window.location.hash) {
  window.requestAnimationFrame(() => {
    scrollToAnchor(window.location.hash, { smooth: false });
  });
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
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

  const getStride = () => {
    if (items.length < 2) {
      return items[0]?.offsetWidth || 1;
    }
    return items[1].offsetLeft - items[0].offsetLeft;
  };

  const getActiveIndex = () => {
    if (items.length === 0) {
      return 0;
    }

    if (viewport.scrollLeft <= 8) {
      return 0;
    }

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    if (viewport.scrollLeft >= maxScroll - 8) {
      return items.length - 1;
    }

    const stride = getStride();
    const index = Math.round(viewport.scrollLeft / stride);
    return Math.max(0, Math.min(index, items.length - 1));
  };

  const updateCounter = () => {
    activeIndex = getActiveIndex();
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
    const targetIndex = Math.max(0, Math.min(index, items.length - 1));
    const target = items[targetIndex];
    if (!target) {
      return;
    }

    activeIndex = targetIndex;

    if (targetIndex === 0) {
      viewport.scrollTo({ left: 0, behavior: "smooth" });
    } else if (targetIndex === items.length - 1) {
      viewport.scrollTo({
        left: viewport.scrollWidth - viewport.clientWidth,
        behavior: "smooth",
      });
    } else {
      viewport.scrollTo({
        left: target.offsetLeft - (viewport.clientWidth - target.offsetWidth) / 2,
        behavior: "smooth",
      });
    }

    updateCounter();
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
    scrollToIndex(getActiveIndex());
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

  viewport.scrollLeft = 0;
  activeIndex = 0;
  updateCounter();

  window.addEventListener("resize", () => {
    updateCounter();
  });
}

initPortfolioCarousel();
