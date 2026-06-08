// JU OS interface interactions
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navAnchors = [...document.querySelectorAll(".nav-links a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const cursorGlow = document.querySelector(".cursor-glow");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastScrollY = window.scrollY;

  document.getElementById("year").textContent = new Date().getFullYear();

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
      const counter = entry.target.querySelector("[data-count]");
      if (counter && !reduceMotion) animateCounter(counter);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -50px" });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  function animateCounter(element) {
    const target = Number(element.dataset.count);
    const duration = 1300;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = (target * eased).toFixed(1);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function closeMenu() {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menü öffnen");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
    document.body.classList.toggle("menu-open", isOpen);
  });

  navAnchors.forEach((anchor) => anchor.addEventListener("click", closeMenu));

  function updateScrollState() {
    const currentScrollY = window.scrollY;
    header.classList.toggle("scrolled", currentScrollY > 20);
    if (currentScrollY > lastScrollY && currentScrollY > 500 && !navLinks.classList.contains("open")) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }
    lastScrollY = currentScrollY;
    let currentSection = "home";
    sections.forEach((section) => {
      if (currentScrollY >= section.offsetTop - 180) currentSection = section.id;
    });
    navAnchors.forEach((anchor) => {
      anchor.classList.toggle("active", anchor.getAttribute("href") === `#${currentSection}`);
    });
  }

  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }, { passive: true });

    document.querySelectorAll(".feature-card, .edition-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
      });
    });

    const stage = document.querySelector(".product-stage");
    const windowMockup = document.querySelector(".os-window");
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      windowMockup.style.transform = `rotateX(${2 - y * 3}deg) rotateY(${x * 3}deg)`;
    });
    stage.addEventListener("pointerleave", () => {
      windowMockup.style.transform = "rotateX(2deg) rotateY(0deg)";
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) closeMenu();
  });
});