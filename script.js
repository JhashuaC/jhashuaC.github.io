/* ===========================
   Portfolio – Single script.js
   =========================== */

/* -------- Utils guarded query -------- */
function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

/* -------- Micro helpers -------- */
function add(...args) {
  args[0].classList.add(...args.slice(1));
}
function rem(...args) {
  args[0].classList.remove(...args.slice(1));
}

/* -------- Public functions used by HTML attributes -------- */
function openCertificate(url) {
  const modal = $("#certModal");
  const frame = $("#certFrame");
  if (!modal || !frame) return;
  rem(modal, "hidden");
  add(modal, "flex");
  frame.src = url;
}
function closeCertificate() {
  const modal = $("#certModal");
  const frame = $("#certFrame");
  if (!modal || !frame) return;
  rem(modal, "flex");
  add(modal, "hidden");
  frame.src = "";
}
function zoomImage(src) {
  const modal = $("#imgZoomModal");
  const img = $("#zoomedImg");
  if (!modal || !img) return;
  rem(modal, "hidden");
  add(modal, "flex");
  img.src = src;
}
function closeModal() {
  const m = $("#imageModal");
  if (!m) return;
  rem(m, "flex");
  add(m, "hidden");
}
/* Exponerlas si sigues usando atributos inline en HTML */
window.openCertificate = openCertificate;
window.closeCertificate = closeCertificate;
window.zoomImage = zoomImage;
window.closeModal = closeModal;

/* -------- Global (fuera de DOMContentLoaded) -------- */
/* Cierre de zoom al click fuera de la imagen */
(function attachZoomClose() {
  const modal = $("#imgZoomModal");
  if (!modal) return;
  modal.addEventListener("click", (e) => {
    if (e.target.id === "imgZoomModal") {
      rem(modal, "flex");
      add(modal, "hidden");
      const img = $("#zoomedImg");
      if (img) img.src = "";
    }
  });
})();

/* Botones magnéticos */
(function magneticButtons() {
  $all(".magnetic-btn").forEach((btn) => {
    btn.addEventListener(
      "mousemove",
      (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      },
      { passive: true }
    );
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });
})();

/* Animación genérica al hacer scroll para .fade-section (si la usas) */
(function fadeSections() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        add(entry.target, "opacity-100", "translate-y-0");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );
  $all(".fade-section").forEach((el) => {
    // Asegura estado inicial si quieres efecto
    el.classList.add(
      "opacity-0",
      "translate-y-4",
      "transition",
      "duration-700"
    );
    obs.observe(el);
  });
})();

/* -------- DOMContentLoaded: resto de features -------- */
document.addEventListener("DOMContentLoaded", () => {
  /* Smooth scroll en anclas */
  $all('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id.length <= 1) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* Typewriter */
  (function typewriter() {
    const el = $("#typewriter");
    if (!el) return;
    const roles = [
      "Cybersecurity Enthusiast",
      "IA Developer",
      "Backend Developer",
      "Software Engineer",
      "Problem Solver",
      "Tech Explorer",
    ];
    let i = 0,
      j = 0,
      del = false;
    function tick() {
      const t = roles[i];
      el.textContent = t.slice(0, j);
      if (!del) {
        j++;
        if (j > t.length + 10) del = true;
      } else {
        j--;
        if (j === 0) {
          del = false;
          i = (i + 1) % roles.length;
        }
      }
      setTimeout(tick, del ? 60 : 100);
    }
    tick();
  })();

  /* Barras de skill cuando #skills entra en viewport */
  (function skillsOnView() {
    const section = $("#skills");
    if (!section) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          $all(".skill-bar", section).forEach((bar) => {
            const w = bar.getAttribute("data-width") || "0%";
            bar.style.width = w;
          });
          io.unobserve(section);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(section);
  })();

  /* Timeline: aparecer (soluciona que no se vea online) */
  (function revealTimeline() {
    const entries = $all(".timeline-entry");
    if (!entries.length) return;
    // Estado inicial (si no lo tienes en HTML)
    entries.forEach((el) => {
      el.classList.add(
        "opacity-0",
        "translate-x-10",
        "transition-all",
        "duration-700"
      );
    });
    const io = new IntersectionObserver(
      (obsEntries, ioSelf) => {
        obsEntries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          rem(entry.target, "opacity-0", "translate-x-10");
          add(entry.target, "opacity-100", "translate-x-0");
          ioSelf.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    entries.forEach((el) => io.observe(el));
  })();

  /* Modal de perfil (About) */
  (function profileModal() {
    const img = $("#profileImage");
    const modal = $("#imageModal");
    const closeBtn = $("#closeModal"); // opcional si lo agregas
    if (!img || !modal) return;
    img.addEventListener("click", () => {
      rem(modal, "hidden");
      add(modal, "flex");
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        rem(modal, "flex");
        add(modal, "hidden");
      });
    }
  })();

  /* Filtro de certificaciones */
  (function certFilters() {
    const buttons = $all(".filter-btn");
    const items = $all(".project");
    const clearBtn = $("#clearFilters");

    function sortDeveloperFirst() {
      const grid = $("#certGrid");
      if (!grid) return;
      const cards = Array.from(grid.children);
      const sorted = cards.slice().sort((a, b) => {
        const aDev = a.classList.contains("category-developer");
        const bDev = b.classList.contains("category-developer");
        if (aDev && !bDev) return -1;
        if (!aDev && bDev) return 1;
        return 0;
      });
      sorted.forEach((node) => grid.appendChild(node));
    }

    function applyFilter(cat) {
      items.forEach((it) => {
        const match = it.classList.contains(`category-${cat}`);
        it.classList.toggle("hidden", !match);
      });
    }

    function showAll() {
      items.forEach((it) => it.classList.remove("hidden"));
      sortDeveloperFirst();
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-filter");
        // Estilos activos
        buttons.forEach((b) => {
          rem(b, "bg-teal-400", "text-gray-900");
          add(b, "bg-gray-700");
        });
        rem(btn, "bg-gray-700");
        add(btn, "bg-teal-400", "text-gray-900");
        if (cat === "all" || !cat) showAll();
        else applyFilter(cat);
      });
    });

    if (clearBtn) clearBtn.addEventListener("click", showAll);

    // Inicial: mostrar todo y developer primero
    showAll();
  })();

  /* Scroll progress (protegido si no existe el elemento) */
  (function scrollProgress() {
    const bar = $("#scrollProgress");
    if (!bar) return;
    function setProgress() {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      bar.style.width = scrolled * 100 + "%";
    }
    document.addEventListener("scroll", setProgress, { passive: true });
    setProgress();
  })();

  /* Reveal genérico para contenedores .reveal (opcional) */
  (function revealStagger() {
    const parents = $all(".reveal");
    if (!parents.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const parent = entry.target;
          add(parent, "in");
          // Stagger hijos dentro de .grid o .group
          const children = parent.querySelectorAll(
            ":scope > .grid > * , :scope > .grid > .group, :scope > .group"
          );
          children.forEach((c, i) => {
            c.style.animationDelay = 0.05 * i + "s";
            add(c, "reveal", "in");
          });
          io.unobserve(parent);
        });
      },
      { threshold: 0.15 }
    );
    parents.forEach((p) => io.observe(p));
  })();

  /* Tilt 3D básico */
  (function tilt3D() {
    $all(".tilt").forEach((el) => {
      const max = 8;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (y - 0.5) * -2 * max;
        const ry = (x - 0.5) * 2 * max;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        const glare = el.querySelector(".glare");
        if (glare) {
          glare.style.setProperty("--mx", x * 100 + "%");
          glare.style.setProperty("--my", y * 100 + "%");
        }
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = `perspective(900px) rotateX(0) rotateY(0) translateZ(0)`;
      });
    });
  })();

  /* Parallax suave en Hero */
  (function heroParallax() {
    const hero = $("#home");
    if (!hero) return;
    hero.addEventListener(
      "mousemove",
      (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        hero.style.backgroundPosition = `${50 + x * 2}% ${50 + y * 2}%`;
      },
      { passive: true }
    );
  })();

  /* Scrollspy navbar */
  (function scrollSpy() {
    const ids = [
      "home",
      "about",
      "projects",
      "certifications",
      "skills",
      "timeline",
      "contact",
      "CV",
    ];
    const sections = ids.map((id) => $("#" + id)).filter(Boolean);
    const navLinks = $all('nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const link = navLinks.find(
            (a) => a.getAttribute("href") === `#${id}`
          );
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("text-teal-300"));
            link.classList.add("text-teal-300");
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => io.observe(s));
  })();

  /* Starfield canvas en Hero */
  (function starfield() {
    const canvas = $("#starfieldCanvas");
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ctx = canvas.getContext("2d");
    let w,
      h,
      cx,
      cy,
      stars = [],
      mouseX = 0,
      mouseY = 0;
    const motionOK = !matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      genStars();
    }
    function genStars() {
      const count = Math.floor(Math.min(160, (w * h) / 8000));
      stars = Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * w * 1.6,
        y: (Math.random() - 0.5) * h * 1.6,
        z: Math.random() * 2 + 0.5,
        r: Math.random() * 1.2 + 0.2,
        s: Math.random() * 0.6 + 0.2,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const parX = (mouseX - w / 2) / w;
      const parY = (mouseY - h / 2) / h;
      for (const st of stars) {
        const x = cx + st.x / st.z + parX * 25;
        const y = cy + st.y / st.z + parY * 25;
        const alpha = Math.max(0.2, 1.4 - st.z);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = "#a7f3d0";
        ctx.fill();
        // trail
        ctx.globalAlpha = alpha * 0.35;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - parX * 16, y - parY * 16);
        ctx.strokeStyle = "#67e8f9";
        ctx.lineWidth = st.s;
        ctx.stroke();
        // z depth
        st.z -= 0.003 + st.s * 0.0015;
        if (st.z < 0.5) st.z = Math.random() * 2 + 1.4;
      }
      ctx.globalAlpha = 1;
      motionOK && requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      },
      { passive: true }
    );
    resize();
    motionOK && draw();
  })();
});
