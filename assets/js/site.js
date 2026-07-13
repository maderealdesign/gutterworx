(function () {
  "use strict";
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      }
    });
  }

  document.querySelectorAll("[data-quote-form]").forEach(function (form) {
    const service = form.querySelector("[name='service']");
    const cutDrop = form.querySelector("[data-cut-drop-fields]");
    if (!service || !cutDrop) return;
    const tradeInputs = cutDrop.querySelectorAll("input, select, textarea");
    function updateCutDrop() {
      const active = service.value === "Cut & Drop Trade Service";
      cutDrop.classList.toggle("is-visible", active);
      cutDrop.hidden = !active;
      tradeInputs.forEach(function (input) { input.disabled = !active; });
    }
    service.addEventListener("change", updateCutDrop);
    const queryService = new URLSearchParams(window.location.search).get("service");
    if (queryService) {
      const match = Array.from(service.options).find(function (option) {
        return option.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === queryService;
      });
      if (match) service.value = match.value;
    }
    updateCutDrop();
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
