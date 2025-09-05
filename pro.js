(function () {
  const d = document;
  const prefersReduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Utils
  const $ = (sel, root = d) => root.querySelector(sel);
  const $$ = (sel, root = d) => Array.from(root.querySelectorAll(sel));
  const el = (tag, cls = "", html = "") => {
    const e = d.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  };

  /* 1) Scroll progress bar */
  (function progressBar() {
    const bar = el(
      "div",
      "fixed left-0 top-0 h-[3px] w-0 bg-gradient-to-r from-teal-400 to-cyan-400 z-[70]"
    );
    bar.id = "scrollProgress";
    d.body.appendChild(bar);
    const set = () => {
      const h = d.documentElement;
      const sc = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.width = (sc * 100).toFixed(2) + "%";
    };
    d.addEventListener("scroll", set, { passive: true });
    set();
  })();

  /* 2) Navbar scrollspy */
  (function scrollSpy() {
    const navLinks = $$('nav a[href^="#"]');
    const ids = navLinks
      .map((a) => a.getAttribute("href"))
      .filter((h) => h.length > 1);
    const sections = ids.map((id) => $(id)).filter(Boolean);
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = "#" + entry.target.id;
          const link = navLinks.find((a) => a.getAttribute("href") === id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) =>
              a.classList.remove(
                "text-teal-300",
                "underline",
                "decoration-teal-400",
                "decoration-2"
              )
            );
            link.classList.add(
              "text-teal-300",
              "underline",
              "decoration-teal-400",
              "decoration-2"
            );
          }
        });
      },
      { threshold: 0.55 }
    );

    sections.forEach((s) => obs.observe(s));
  })();

  /* 3) Section reveal */
  (function reveal() {
    const targets = $$(".fade-section");
    if (!targets.length) return;
    if (prefersReduce) {
      targets.forEach((t) => t.classList.add("opacity-100", "translate-y-0"));
      return;
    }
    targets.forEach((t) =>
      t.classList.add(
        "opacity-0",
        "translate-y-4",
        "transition",
        "duration-500"
      )
    );
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("opacity-0", "translate-y-4");
            e.target.classList.add("opacity-100", "translate-y-0");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    targets.forEach((t) => obs.observe(t));
  })();

  /* 4) Projects – data (sin imágenes) */
  const projects = [
    {
      title: "Arduino XOR Authentication",
      desc: "Verification system between two Arduinos using binary inputs and XOR encryption.",
      live: "https://www.tinkercad.com/things/1vqRrahyEhI-fantabulous-gaaris",
      code: null,
      tags: ["Arduino", "XOR", "Serial"],
    },
    {
      title: "ML Price Prediction App",
      desc: "Regression model in Python (scikit-learn) deployed via Flask API; improved accuracy by 15%.",
      live: "https://github.com/JhashuaC/Price-Prediction_ML",
      code: "https://github.com/JhashuaC/Price-Prediction_ML",
      tags: ["Python", "Flask", "ML"],
    },
    {
      title: "VirtualClassroomAPI",
      desc: "RESTful API for a university-grade management system.",
      live: "https://github.com/JhashuaC/academic-records-api",
      code: "https://github.com/JhashuaC/academic-records-api",
      tags: ["Node", "REST", "Auth"],
    },
    {
      title: "Logic Circuit Car Project",
      desc: "Digital logic simulation of a car system built in LogicCircuit.",
      live: "https://github.com/JhashuaC/Logic-Circuit",
      code: "https://github.com/JhashuaC/Logic-Circuit",
      tags: ["Logic", "FSM"],
    },
    {
      title: "Assembly Paint Project",
      desc: "Paint application for DOS with drawing, color changes, and saving/loading sketches.",
      live: "https://github.com/JhashuaC/Assembly-Paint",
      code: "https://github.com/JhashuaC/Assembly-Paint",
      tags: ["ASM", "DOS"],
    },
    {
      title: "Graduate Platform Project",
      desc: "Web system to manage and visualize data of graduates, careers, users, and entities.",
      live: "https://github.com/JhashuaC/GraduatePlatform",
      code: "https://github.com/JhashuaC/GraduatePlatform",
      tags: ["Full-stack", "MySQL"],
    },
    {
      title: "Inventory System in COBOL",
      desc: "Indexed and sequential files simulating a complete inventory system.",
      live: "https://github.com/JhashuaC/sistemaVentasCobol",
      code: "https://github.com/JhashuaC/sistemaVentasCobol",
      tags: ["COBOL", "Files"],
    },
  ];

  /* 4.1 Toolbar (search + tag filter) */
  function ensureToolbar(grid) {
    let tb = $("#projectsToolbar");
    if (tb) return tb;
    tb = el(
      "div",
      "mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
      `
      <div class="flex items-center gap-2">
        <input id="pjSearch" type="search" placeholder="Search projects or tags..."
          class="w-72 max-w-full px-3 py-2 rounded bg-slate-800/70 ring-1 ring-white/10 focus:outline-none focus:ring-teal-400/50"
          />
      </div>
      <div id="pjTagBar" class="flex flex-wrap gap-2"></div>
    `
    );
    grid.parentElement.insertBefore(tb, grid);
    return tb;
  }

  const FAVORITES_KEY = "pj_favs";
  const loadFavs = () =>
    new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  const saveFavs = (set) =>
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(set)));

  /* 4.2 Render cards (sin imágenes) */
  (function renderProjects() {
    const grid = $("#projectsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const toolbar = ensureToolbar(grid);

    // Tag list from data
    const allTags = [...new Set(projects.flatMap((p) => p.tags))].sort();
    const tagBar = $("#pjTagBar");
    tagBar.innerHTML = "";
    const activeTags = new Set();

    allTags.forEach((t) => {
      const btn = el(
        "button",
        "px-3 py-1 rounded-full bg-slate-800 text-teal-300 text-sm ring-1 ring-white/10 hover:bg-slate-700",
        t
      );
      btn.addEventListener("click", () => {
        if (activeTags.has(t)) activeTags.delete(t);
        else activeTags.add(t);
        btn.classList.toggle("bg-teal-500");
        btn.classList.toggle("text-gray-900");
        applyFilters();
      });
      tagBar.appendChild(btn);
    });

    const favs = loadFavs();

    function cardFor(p) {
      // Card container
      const card = el(
        "article",
        "group relative overflow-hidden rounded-2xl bg-slate-800/60 ring-1 ring-white/10 hover:ring-teal-400/40 transition shadow-xl hover:shadow-2xl focus-within:ring-teal-400/50"
      );
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${p.title} — Open`);

      // Tilt
      if (!prefersReduce) {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(
            2
          )}deg) rotateY(${(x * 6).toFixed(2)}deg) translateZ(0)`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform =
            "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
        });
      }

      // Header sin imagen: gradient y avatar con iniciales/emoji por stack
      const emoji = pickEmoji(p.tags);
      const header = el(
        "div",
        "p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 ring-1 ring-white/5 flex items-center gap-3"
      );
      const avatar = el(
        "div",
        "w-11 h-11 rounded-lg grid place-items-center text-lg font-bold bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/20",
        emoji
      );
      const titleLink = el(
        "a",
        "text-lg md:text-xl font-semibold text-teal-300 hover:text-teal-200"
      );
      titleLink.href = p.live;
      titleLink.target = "_blank";
      titleLink.rel = "noopener";
      titleLink.textContent = p.title;
      const favBtn = el(
        "button",
        "ml-auto px-2 py-1 rounded text-yellow-300 hover:text-yellow-200",
        favs.has(p.title) ? "⭐" : "☆"
      );
      favBtn.title = "Toggle favorite";
      favBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (favs.has(p.title)) favs.delete(p.title);
        else favs.add(p.title);
        favBtn.textContent = favs.has(p.title) ? "⭐" : "☆";
        saveFavs(favs);
        sortAndRender(); // reordenar para subir favoritos
      });
      header.append(avatar, titleLink, favBtn);

      // Body + tags
      const body = el("div", "p-5 pt-4");
      const desc = el("p", "text-slate-200 text-sm mb-3", p.desc);
      const tags = el("div", "flex flex-wrap gap-2 mb-4");
      (p.tags || []).forEach((t) => {
        const chip = el(
          "button",
          "text-xs px-2 py-1 rounded-full bg-slate-700 text-teal-200 ring-1 ring-white/10 hover:bg-slate-600",
          t
        );
        chip.addEventListener("click", (ev) => {
          ev.stopPropagation();
          toggleTag(t);
        });
        tags.appendChild(chip);
      });

      // Inline details (expand/collapse)
      const details = el(
        "div",
        "hidden mt-2 text-sm text-slate-300 leading-relaxed"
      );
      details.innerHTML = `
        <ul class="list-disc list-inside space-y-1">
          <li><strong>Focus:</strong> ${p.tags.join(" • ")}</li>
          <li><strong>Highlights:</strong> Clean architecture, error handling, docs.</li>
          <li><strong>Role:</strong> Design & implementation end-to-end.</li>
        </ul>
      `;
      const toggleBtn = el(
        "button",
        "px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-sm",
        "Details"
      );
      toggleBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        toggleDetails(details, toggleBtn);
      });

      // CTAs
      const ctas = el("div", "mt-4 flex gap-3");
      const aLive = el(
        "a",
        "bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold px-3 py-2 rounded",
        "Open"
      );
      aLive.href = p.live;
      aLive.target = "_blank";
      aLive.rel = "noopener";
      const aCode = el(
        "a",
        "bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded",
        "GitHub"
      );
      if (p.code) {
        aCode.href = p.code;
        aCode.target = "_blank";
        aCode.rel = "noopener";
      } else {
        aCode.classList.add("hidden");
      }

      body.append(desc, tags, toggleBtn, details, ctas);
      ctas.append(aLive, aCode);
      card.append(header, body);

      // Click tarjeta → Open
      card.addEventListener("click", (e) => {
        if (e.target.closest("a,button")) return; // respeta botones/enlaces
        window.open(p.live, "_blank", "noopener");
      });
      // Accesibilidad teclado
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          window.open(p.live, "_blank", "noopener");
        }
        if (e.key === " ") {
          e.preventDefault();
          toggleDetails(details, toggleBtn);
        }
      });

      return card;
    }

    function toggleDetails(details, btn) {
      const open = details.classList.contains("hidden");
      details.classList.toggle("hidden");
      btn.textContent = open ? "Hide details" : "Details";
    }

    function pickEmoji(tags) {
      const t = (tags[0] || "").toLowerCase();
      if (t.includes("arduino")) return "🔧";
      if (t.includes("ml") || t.includes("python")) return "🤖";
      if (t.includes("node") || t.includes("rest")) return "🧩";
      if (t.includes("asm")) return "⌨️";
      if (t.includes("cobol")) return "📇";
      if (t.includes("logic")) return "🧠";
      return "🚀";
    }

    // Search
    const search = $("#pjSearch");
    function textMatch(p, q) {
      const hay = (
        p.title +
        " " +
        p.desc +
        " " +
        p.tags.join(" ")
      ).toLowerCase();
      return hay.includes(q.toLowerCase());
    }
    function toggleTag(t) {
      const btn = [...tagBar.children].find((b) => b.textContent === t);
      btn?.click();
    }

    function applyFilters() {
      const q = (search?.value || "").trim();
      const filtered = projects.filter(
        (p) =>
          (q ? textMatch(p, q) : true) &&
          (activeTags.size ? p.tags.some((t) => activeTags.has(t)) : true)
      );
      paint(filtered);
    }

    function sortAndRender() {
      // Favoritos arriba, luego por título
      const favSet = loadFavs();
      const sorted = projects.slice().sort((a, b) => {
        const fa = favSet.has(a.title),
          fb = favSet.has(b.title);
        if (fa !== fb) return fa ? -1 : 1;
        return a.title.localeCompare(b.title);
      });
      paint(sorted);
    }

    function paint(list) {
      grid.innerHTML = "";
      list.forEach((p) => grid.appendChild(cardFor(p)));
    }

    search?.addEventListener("input", applyFilters);
    sortAndRender();
  })();

  /* 5) Copy email helper */
  (function copyEmail() {
    const emailLink = $('#contact a[href^="mailto:"]');
    if (!emailLink) return;
    emailLink.addEventListener("click", () => {
      const email = emailLink.href.replace("mailto:", "");
      navigator.clipboard?.writeText(email).then(() => {
        const tip = el("span", "ml-2 text-xs text-teal-300");
        tip.textContent = "copied ✓";
        emailLink.parentElement.appendChild(tip);
        setTimeout(() => tip.remove(), 1500);
      });
    });
  })();

  /* 6) JSON-LD (SEO) */
  (function injectJSONLD() {
    const data = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Jhashua Canton Ruiz",
      jobTitle: "Backend Developer / Cybersecurity",
      url: location.origin,
      sameAs: [
        "https://www.linkedin.com/in/jhashua-canton",
        "mailto:jhashua10@gmail.com",
        "https://github.com/JhashuaC",
      ],
      hasPart: projects.map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        description: p.desc,
        url: p.live,
        codeRepository: p.code || undefined,
      })),
    };
    const s = el("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    d.head.appendChild(s);
  })();
})();
