const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const form = document.querySelector(".cta__form");

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

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const text = [
      "Заявка с сайта УралДом",
      "",
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      message ? `Что планируют: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const maxUrl = `https://max.ru/:share?text=${encodeURIComponent(text)}`;
    window.open(maxUrl, "_blank", "noopener,noreferrer");

    const button = form.querySelector("button");
    const originalText = button.textContent;

    button.textContent = "Откройте MAX и отправьте";
    button.disabled = true;
    form.reset();

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 3500);
  });
}
