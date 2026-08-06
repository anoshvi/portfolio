// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle with localStorage persistence
(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
  updateIcon();

  btn.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateIcon();
  });

  function updateIcon() {
    const isLight = root.getAttribute("data-theme") === "light";
    btn.textContent = isLight ? "☀️" : "🌙";
  }
})();
