(() => {
  const menu = document.querySelector("[data-nav-menu]");
  if (!menu) return;

  const toggle = menu.querySelector("[data-menu-toggle]");
  const panel = menu.querySelector("[data-menu-panel]");
  const links = Array.from(panel.querySelectorAll("a"));

  const openMenu = () => {
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    panel.hidden = false;
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  };

  toggle.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && menu.classList.contains("is-open")) {
      closeMenu();
    }
  });
})();
