document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktopView = window.matchMedia("(min-width: 981px)").matches;

  if (navToggle && siteNav) {
    const closeNav = () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      siteNav.classList.toggle("is-open");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (!siteNav.contains(target) && !navToggle.contains(target)) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });
  }

  document.querySelectorAll("#year").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length > 0) {
    if ("IntersectionObserver" in window && !reducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      );

      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }

  const heroParallax = document.querySelector("[data-parallax]");
  if (heroParallax && !reducedMotion && isDesktopView) {
    let ticking = false;

    const updateParallax = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const offset = Math.min(scrollTop * 0.08, 22);
      heroParallax.style.transform = `translateY(${offset}px)`;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  const applyMenuStagger = (items) => {
    if (reducedMotion) {
      items.forEach((item) => {
        item.classList.remove("is-staggered");
        item.style.animationDelay = "";
      });
      return;
    }

    let visibleIndex = 0;
    items.forEach((item) => {
      if (item.classList.contains("is-hidden")) {
        item.classList.remove("is-staggered");
        item.style.animationDelay = "";
        return;
      }

      item.classList.remove("is-staggered");
      // Trigger restart for every filter click without forcing layout on the full page.
      void item.offsetWidth;
      item.style.animationDelay = `${visibleIndex * 45}ms`;
      item.classList.add("is-staggered");
      visibleIndex += 1;
    });
  };

  const filterWrap = document.querySelector("[data-menu-filters]");
  if (filterWrap) {
    const filterButtons = Array.from(filterWrap.querySelectorAll("button"));
    const menuItems = Array.from(document.querySelectorAll(".menu-item"));

    applyMenuStagger(menuItems);

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("is-active"));
        button.classList.add("is-active");

        const activeFilter = button.getAttribute("data-filter");
        menuItems.forEach((item) => {
          const category = item.getAttribute("data-category");
          const visible = activeFilter === "all" || category === activeFilter;
          item.classList.toggle("is-hidden", !visible);
        });

        applyMenuStagger(menuItems);
      });
    });
  }

  const testimonialCards = Array.from(document.querySelectorAll("[data-testimonials] .testimonial"));
  if (testimonialCards.length > 1 && !reducedMotion) {
    let activeIndex = 0;
    setInterval(() => {
      testimonialCards[activeIndex].classList.remove("is-active");
      activeIndex = (activeIndex + 1) % testimonialCards.length;
      testimonialCards[activeIndex].classList.add("is-active");
    }, 5000);
  }

  const reservationForm = document.querySelector(".reservation-form");
  if (reservationForm) {
    const status = document.createElement("p");
    status.className = "form-status";
    reservationForm.appendChild(status);

    reservationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      status.textContent = "Reservation request sent. We will contact you shortly.";
      reservationForm.reset();
    });
  }
});

