(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.querySelector("#primary-nav");
  var toggle = document.querySelector(".nav-toggle");
  var toTop = document.querySelector(".to-top");
  var yearNodes = document.querySelectorAll("[data-year]");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  yearNodes.forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  }

  function openNav() {
    document.body.classList.add("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (document.body.classList.contains("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeNav();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();
      }
    });
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  function updateToTop() {
    if (!toTop) return;
    if (window.scrollY > 500) {
      toTop.classList.add("is-visible");
    } else {
      toTop.classList.remove("is-visible");
    }
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a[data-nav]"));

  function setActiveNav() {
    if (!navLinks.length) return;

    var page = document.body.getAttribute("data-page");
    if (page && page !== "home") {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("data-nav") === page);
      });
      return;
    }

    var fromTop = window.scrollY + ((header && header.offsetHeight) || 80) + 12;
    var current = "home";

    document.querySelectorAll("section[id]").forEach(function (section) {
      if (section.offsetTop <= fromTop) {
        current = section.id;
      }
    });

    if (window.scrollY < 80) {
      current = "home";
    }

    navLinks.forEach(function (link) {
      var key = link.getAttribute("data-nav");
      link.classList.toggle("is-active", key === current);
    });
  }

  function onScroll() {
    updateToTop();
    setActiveNav();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var filterButtons = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter") || "all";

      filterButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });

      projectCards.forEach(function (card) {
        var category = card.getAttribute("data-category") || "";
        var show = filter === "all" || category.indexOf(filter) !== -1;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
    });
    link.setAttribute("aria-disabled", "true");
    if (!link.getAttribute("title")) {
      link.setAttribute("title", "Add your URL in the HTML when ready");
    }
  });

  document.querySelectorAll(".copy-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-copy") || "";
      if (!value || !navigator.clipboard) return;

      navigator.clipboard.writeText(value).then(function () {
        var original = button.textContent;
        button.textContent = "Copied";
        window.setTimeout(function () {
          button.textContent = original;
        }, 1400);
      });
    });
  });
})();
