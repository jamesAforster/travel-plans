// June 2027 Travel Plan — behaviour.
// 1. Highlights the sidebar link for the section you're reading.
// 2. Opens/closes the sidebar on small screens.

const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".menu-toggle");
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

toggle.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

links.forEach((link) =>
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);
