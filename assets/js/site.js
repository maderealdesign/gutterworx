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

    const photoInputs = Array.from(form.querySelectorAll("[data-project-photo]"));
    const uploadError = form.querySelector("[data-upload-error]");
    const maxUploadBytes = 7 * 1024 * 1024;
    function validatePhotos() {
      const files = photoInputs.flatMap(function (input) { return Array.from(input.files || []); });
      const nonImages = files.filter(function (file) { return file.type && !file.type.startsWith("image/"); });
      const totalBytes = files.reduce(function (total, file) { return total + file.size; }, 0);
      let message = "";
      if (nonImages.length) message = "Please choose image files only.";
      else if (totalBytes > maxUploadBytes) message = "Those photos are over 7 MB combined. Please choose smaller images.";
      photoInputs.forEach(function (input) { input.setCustomValidity(message); });
      if (uploadError) {
        uploadError.textContent = message;
        uploadError.hidden = !message;
      }
      return !message;
    }
    photoInputs.forEach(function (input) { input.addEventListener("change", validatePhotos); });
    form.addEventListener("submit", function (event) {
      if (!validatePhotos()) {
        event.preventDefault();
        photoInputs.find(function (input) { return input.validationMessage; })?.focus();
      }
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
