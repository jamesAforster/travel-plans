// June 2027 Travel Plan — behaviour.
// 1. Highlights the sidebar link for the section you're reading.
// 2. Opens/closes the sidebar drawer on small screens.
// 3. Labels table cells so tables marked class="stack" can show as cards on phones.

const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".menu-toggle");
const backdrop = document.querySelector(".backdrop");
const links = Array.from(document.querySelectorAll(".sidebar a[href^='#']"));

const linkFor = new Map(
  links.map((link) => [link.getAttribute("href").slice(1), link])
);

const headings = Array.from(document.querySelectorAll("main h2[id], main h3[id]"));

function setActive(id) {
  links.forEach((link) => link.classList.remove("active"));
  const link = linkFor.get(id);
  if (!link) return;
  link.classList.add("active");
  // Keep the active link visible inside the scrolling sidebar.
  const top = link.offsetTop;
  const { scrollTop, clientHeight } = sidebar;
  if (top < scrollTop + 40 || top > scrollTop + clientHeight - 60) {
    sidebar.scrollTo({ top: top - clientHeight / 3, behavior: "auto" });
  }
}

// A heading is "current" once it passes the top fifth of the viewport.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { rootMargin: "0px 0px -80% 0px", threshold: 0 }
);

headings.forEach((heading) => observer.observe(heading));

// ---------- Drawer (phones) ----------

function setNav(open) {
  sidebar.classList.toggle("open", open);
  backdrop.hidden = !open;
  document.body.classList.toggle("nav-open", open);
  toggle.setAttribute("aria-expanded", String(open));
}

toggle.addEventListener("click", () => setNav(!sidebar.classList.contains("open")));
backdrop.addEventListener("click", () => setNav(false));
links.forEach((link) => link.addEventListener("click", () => setNav(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNav(false);
});

// Rotating to landscape or resizing to desktop closes the drawer.
window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
  if (event.matches) setNav(false);
});

// ---------- Stacked tables (phones) ----------

document.querySelectorAll("table.stack").forEach((table) => {
  const labels = Array.from(table.querySelectorAll("thead th")).map((th) => th.textContent.trim());
  table.querySelectorAll("tbody tr").forEach((row) => {
    Array.from(row.children).forEach((cell, i) => {
      if (labels[i]) cell.dataset.label = labels[i];
    });
  });
});
