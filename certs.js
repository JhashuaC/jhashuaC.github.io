(function () {
  const d = document;
  const prefersReduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ==== Utils ====
  const $ = (s, r = d) => r.querySelector(s);
  const $$ = (s, r = d) => Array.from(r.querySelectorAll(s));
  const el = (t, cls = "", html = "") => {
    const e = d.createElement(t);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  };
  const fmtDate = (iso) =>
    !iso
      ? ""
      : new Date(iso).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
        });
  // Normaliza y abre enlaces externos de forma segura
  function normalizeUrl(u) {
    if (!u) return "";
    const s = String(u).trim();
    if (/^(https?:|mailto:|tel:|\/|\.\/|\.\.\/)/i.test(s)) return s;
    return "https://" + s;
  }

  function openExternal(u) {
    const url = normalizeUrl(u);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // ---- Animadores (slide + opacity) ----
  function expandEl(target, ms = 240) {
    if (prefersReduce) {
      target.style.height = "auto";
      target.style.opacity = "1";
      target.style.transform = "translateY(0)";
      return;
    }
    target.style.willChange = "height,opacity,transform";
    target.style.overflow = "hidden";
    target.style.opacity = "0";
    target.style.transform = "translateY(-4px)";
    target.style.height = "0px";
    const end = target.scrollHeight;
    target.getBoundingClientRect(); // reflow
    target.style.transition = `height ${ms}ms cubic-bezier(.2,.8,.2,1), opacity ${ms}ms ease, transform ${ms}ms ease`;
    target.style.opacity = "1";
    target.style.transform = "translateY(0)";
    target.style.height = end + "px";
    const done = (e) => {
      if (e.propertyName !== "height") return;
      target.style.transition = "";
      target.style.height = "auto";
      target.style.willChange = "";
      target.removeEventListener("transitionend", done);
    };
    target.addEventListener("transitionend", done);
  }
  function collapseEl(target, ms = 200) {
    if (prefersReduce) {
      target.style.height = "0px";
      target.style.opacity = "0";
      target.style.transform = "translateY(-4px)";
      return;
    }
    target.style.willChange = "height,opacity,transform";
    target.style.overflow = "hidden";
    target.style.height = target.scrollHeight + "px";
    target.getBoundingClientRect();
    target.style.transition = `height ${ms}ms cubic-bezier(.2,.8,.2,1), opacity ${ms}ms ease, transform ${ms}ms ease`;
    target.style.opacity = "0";
    target.style.transform = "translateY(-4px)";
    target.style.height = "0px";
    const done = (e) => {
      if (e.propertyName !== "height") return;
      target.style.transition = "";
      target.style.willChange = "";
      target.removeEventListener("transitionend", done);
    };
    target.addEventListener("transitionend", done);
  }

  // ==== DATA (edita libremente las fechas 'issued' si quieres ordenar por fecha) ====
  const certs = [
    // CYBERSECURITY
    {
      title: "Google Cybersecurity",
      issuer: "Google",
      category: "cyber",
      skills: ["SIEM", "Threat Detection", "SOC"],
      verify:
        "https://www.credly.com/badges/bcf03150-6723-4db1-9edc-6a0674373643/public_url",
      image: "img/Google.jpg",
      issued: "",
    },
    {
      title: "IBM Cybersecurity Analyst",
      issuer: "IBM",
      category: "cyber",
      skills: ["SOC", "Snort", "QRadar"],
      verify:
        "https://www.credly.com/badges/ff1a0291-580c-4dda-9abd-bee2a501fab1/public_url",
      image: "img/IBM.jpg",
      issued: "",
    },
    {
      title: "Cisco Ethical Hacking",
      issuer: "Cisco",
      category: "cyber",
      skills: ["Recon", "Exploits", "Pentest"],
      verify:
        "https://www.credly.com/badges/ad2ec193-758a-4e67-8565-48ada4df6df6/public_url",
      image: "img/CiscoEthicalHacking.jpg",
      issued: "",
    },
    {
      title: "Mastercard Job Experience",
      issuer: "Mastercard",
      category: "cyber",
      skills: ["Threat Intel", "Risk"],
      verify:
        "https://github.com/JhashuaC/jhashuaC.github.io/blob/main/certificados/Ciberseguridad/mastercard.pdf",
      image: "img/Mastercard.jpg",
      issued: "",
    },
    {
      title: "Microsoft Cybersecurity",
      issuer: "Microsoft",
      category: "cyber",
      skills: ["Defender", "Azure Sec"],
      verify:
        "https://www.credly.com/badges/09c1abf1-c7e2-4f30-8286-6850d2edf914/public_url",
      image: "img/Microsoft.jpg",
      issued: "",
    },

    // NETWORKING
    {
      title: "Cisco Certificate Cybersecurity",
      issuer: "Cisco",
      category: "network",
      skills: ["Networking", "Security"],
      verify:
        "https://www.credly.com/badges/5baf6daf-76c4-4a36-b3a8-637858ada6b3/public_url",
      image: "img/CiscoPath.jpg",
      issued: "",
    },
    {
      title: "Akamai Network Engineering",
      issuer: "Akamai",
      category: "network",
      skills: ["CDN", "Edge"],
      verify:
        "https://www.coursera.org/account/accomplishments/professional-cert/5OPQ6YGITFFR",
      image: "img/AkamaiEngineering.jpg",
      issued: "",
    },
    {
      title: "Advanced Network Security",
      issuer: "",
      category: "network",
      skills: ["Firewalls", "IDS/IPS"],
      verify:
        "https://github.com/JhashuaC/jhashuaC.github.io/blob/main/certificados/Redes/NetworkSecurity.pdf",
      image: "img/advancedNetwork.jpg",
      issued: "",
    },

    // AI
    {
      title: "Generative AI Security",
      issuer: "IBM",
      category: "ai",
      skills: ["GenAI", "Security"],
      verify:
        "https://www.credly.com/badges/afac117c-b829-457a-b737-88f7cec7ec69/public_url",
      image: "img/IBMGenerativeAI.jpg",
      issued: "",
    },
    {
      title: "IBM AI Engineering",
      issuer: "IBM",
      category: "ai",
      skills: ["ML", "MLOps"],
      verify:
        "https://www.credly.com/badges/5c58d405-b9b6-4d78-9d1d-6ca59c40463b/public_url",
      image: "img/IA.jpg",
      issued: "",
    },

    {
      title: "AI for Cybersecurity",
      issuer: "IBM",
      category: "ai",
      skills: ["AI x Sec", "Automation"],
      verify:
        "https://www.credly.com/badges/f1a86a8e-133a-4c1e-963d-9de47c9f4fc3/public_url",
      image: "img/AIForCybersecurity.jpg",
      issued: "",
    },

    // DEVELOPER
    {
      title: "IBM IA Developer",
      issuer: "IBM",
      category: "developer",
      skills: ["Node", "React", "Python"],
      verify:
        "https://www.credly.com/badges/4ebd6166-212b-428b-b5f9-d63a0c6b90a5/public_url",
      image: "img/IBMIaDeveloper.jpg",
      issued: "",
    },
    {
      title: "Amazon Junior Developer",
      issuer: "Amazon",
      category: "developer",
      skills: ["JS", "Cloud Basics"],
      verify: "https://coursera.org/share/97fb6e756c968b78a3fad75ca4eac4a4",
      image: "img/amazonDeveloper.jpeg",
      issued: "",
    },
    {
      title: "IBM DevOps & Software Engineering",
      issuer: "IBM",
      category: "developer",
      skills: ["DevOps", "CI/CD"],
      verify:
        "https://www.credly.com/badges/5305ee8e-d782-46ed-8705-1cc7020d7d0d/public_url",
      image: "img/DEVOPS.png",
      issued: "",
    },

    {
      title: "IBM Back-End Development",
      issuer: "IBM",
      category: "developer",
      skills: ["APIs", "DBs"],
      verify:
        "https://www.credly.com/badges/f8aed517-5580-4384-a1d8-25c8a508cc3f/public_url",
      image: "img/Back.jpg",
      issued: "",
    },
  ];

  const FAVORITES_KEY = "cert_favs";
  const loadFavs = () =>
    new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  const saveFavs = (set) =>
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(set)));
  const isVerified = (c) => /credly\.com|coursera\.org/i.test(c.verify || "");

  // ==== Toolbar ====
  function buildToolbar() {
    const host = $("#certsToolbar");
    if (!host) return;
    const wrapper = el(
      "div",
      "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    );

    const left = el("div", "flex flex-wrap items-center gap-2");
    const search = el(
      "input",
      "w-72 max-w-full px-3 py-2 rounded bg-slate-800/70 ring-1 ring-white/10 focus:outline-none focus:ring-teal-400/50"
    );
    search.type = "search";
    search.placeholder = "Search title, issuer or skills...";
    search.id = "certSearch";

    const categories = ["developer", "network", "cyber", "ai"];
    const catBar = el("div", "flex flex-wrap gap-2");
    const activeCats = new Set();
    categories.forEach((c) => {
      const btn = el(
        "button",
        "px-3 py-1 rounded-full bg-slate-800 text-teal-300 text-sm ring-1 ring-white/10 hover:bg-slate-700",
        labelCat(c)
      );
      btn.dataset.cat = c;
      btn.addEventListener("click", () => {
        btn.classList.toggle("bg-teal-500");
        btn.classList.toggle("text-gray-900");
        if (activeCats.has(c)) activeCats.delete(c);
        else activeCats.add(c);
        apply();
      });
      catBar.appendChild(btn);
    });

    left.append(search, catBar);

    const right = el("div", "flex flex-wrap items-center gap-2");
    // issuer select
    const issuers = [
      ...new Set(
        certs.map((c) => c.issuer || "Other").sort((a, b) => a.localeCompare(b))
      ),
    ];
    const selIssuer = el(
      "select",
      "px-3 py-2 rounded bg-slate-800/70 ring-1 ring-white/10 focus:outline-none focus:ring-teal-400/50"
    );
    selIssuer.innerHTML =
      `<option value="">All issuers</option>` +
      issuers.map((i) => `<option value="${i}">${i}</option>`).join("");

    // sort select
    const selSort = el(
      "select",
      "px-3 py-2 rounded bg-slate-800/70 ring-1 ring-white/10 focus:outline-none focus:ring-teal-400/50"
    );
    selSort.innerHTML = `
      <option value="new">Newest</option>
      <option value="old">Oldest</option>
      <option value="issuer">Issuer A–Z</option>
      <option value="az">Title A–Z</option>
    `;

    // verified only
    const verWrap = el(
      "label",
      "flex items-center gap-2 px-2 py-1 rounded bg-slate-800/60 ring-1 ring-white/10 cursor-pointer"
    );
    const chkVer = el("input");
    chkVer.type = "checkbox";
    chkVer.id = "certVerifiedOnly";
    const verTxt = el("span", "text-sm text-slate-200", "Verified only");
    verWrap.append(chkVer, verTxt);

    // clear
    const clear = el(
      "button",
      "px-3 py-2 rounded bg-slate-700 hover:bg-slate-600",
      "Clear"
    );

    right.append(selIssuer, selSort, verWrap, clear);
    wrapper.append(left, right);
    host.appendChild(wrapper);

    // eventos
    search.addEventListener("input", apply);
    selIssuer.addEventListener("change", apply);
    selSort.addEventListener("change", apply);
    chkVer.addEventListener("change", apply);
    clear.addEventListener("click", () => {
      search.value = "";
      selIssuer.value = "";
      selSort.value = "new";
      chkVer.checked = false;
      activeCats.clear();
      $$("#certsToolbar [data-cat]").forEach((b) =>
        b.classList.remove("bg-teal-500", "text-gray-900")
      );
      apply();
    });

    function apply() {
      const q = search.value.trim().toLowerCase();
      const issuer = selIssuer.value;
      const onlyVer = chkVer.checked;
      const sortBy = selSort.value;

      const filtered = certs.filter((c) => {
        const matchQ =
          !q ||
          (c.title + " " + (c.issuer || "") + " " + (c.skills || []).join(" "))
            .toLowerCase()
            .includes(q);
        const matchCat = activeCats.size ? activeCats.has(c.category) : true;
        const matchIssuer = issuer ? (c.issuer || "Other") === issuer : true;
        const matchVer = onlyVer ? isVerified(c) : true;
        return matchQ && matchCat && matchIssuer && matchVer;
      });

      paint(sortList(filtered, sortBy));
    }

    apply(); // inicial
  }

  function labelCat(c) {
    return (
      {
        developer: "Developer",
        network: "Networking",
        cyber: "Cybersecurity",
        ai: "AI & Automation",
      }[c] || c
    );
  }

  // ==== Render cards ====
  function paint(list) {
    const grid = $("#certsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const favs = loadFavs();
    // favoritos arriba, luego lo que venga
    const withFavs = list.slice().sort((a, b) => {
      const fa = favs.has(a.title),
        fb = favs.has(b.title);
      if (fa !== fb) return fa ? -1 : 1;
      return 0;
    });
    withFavs.forEach((c) => grid.appendChild(cardFor(c, favs)));
  }

  function sortList(list, sortBy) {
    const cop = list.slice();
    if (sortBy === "issuer") {
      cop.sort((a, b) => (a.issuer || "").localeCompare(b.issuer || ""));
    } else if (sortBy === "az") {
      cop.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "old" || sortBy === "new") {
      cop.sort((a, b) => {
        const da = a.issued ? +new Date(a.issued) : -Infinity;
        const db = b.issued ? +new Date(b.issued) : -Infinity;
        const r = db - da; // newest first
        return sortBy === "new" ? r : -r;
      });
    }
    return cop;
  }

  function pickEmoji(c) {
    const m = c.category;
    if (m === "cyber") return "🛡️";
    if (m === "network") return "🌐";
    if (m === "ai") return "🤖";
    if (m === "developer") return "💻";
    return "📜";
  }

  function cardFor(c, favs) {
    const TILT_MAX_DEG = 1.2; // 0 para desactivar tilt por completo

    const card = el(
      "article",
      "group relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-slate-900/40 shadow-xl hover:shadow-2xl focus-within:ring-teal-400/50"
    );
    card.tabIndex = 0;
    card.role = "group";
    card.ariaLabel = `${c.title} — ${c.issuer || ""}`;

    /* ---------- PORTADA: usa el ratio REAL de la imagen ---------- */
    const cover = el(
      "div",
      "relative rounded-2xl overflow-hidden bg-slate-800"
    );
    // ratio por defecto para evitar reflow visible hasta que cargue la imagen
    cover.style.aspectRatio = "16 / 10";

    const img = el(
      "img",
      "absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
    );
    img.loading = "lazy";
    img.alt = c.title;
    if (c.image) img.src = c.image;

    // Cuando cargue, usa su tamaño natural para fijar el aspect-ratio del card
    img.addEventListener("load", () => {
      const w = img.naturalWidth || 1600;
      const h = img.naturalHeight || 1000;
      cover.style.aspectRatio = `${w} / ${h}`; // <- sin recortes ni estiramientos
    });

    cover.appendChild(img);

    // Sólo el texto pequeño (issuer/fecha) para contexto
    const cap = el(
      "div",
      "absolute inset-x-0 bottom-0 p-2 pointer-events-none"
    );
    cap.appendChild(
      el(
        "div",
        "absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent"
      )
    );
    const small = el(
      "div",
      "relative text-[11px] md:text-xs text-slate-200/90"
    );
    small.textContent = `${c.issuer || "Issuer"}${
      c.issued ? " • " + fmtDate(c.issued) : ""
    }`;
    cap.appendChild(small);
    cover.appendChild(cap);

    // ⭐ favorito
    const favBtn = el(
      "button",
      "absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-800 text-yellow-300 grid place-items-center",
      favs.has(c.title) ? "⭐" : "☆"
    );
    favBtn.title = "Toggle favorite";
    favBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (favs.has(c.title)) favs.delete(c.title);
      else favs.add(c.title);
      favBtn.textContent = favs.has(c.title) ? "⭐" : "☆";
      saveFavs(favs);
      const grid = $("#certsGrid");
      if (grid && favs.has(c.title)) grid.prepend(card);
    });
    cover.appendChild(favBtn);

    /* ---------- PANEL (hover/focus) ---------- */
    const panel = el(
      "div",
      [
        "absolute inset-0 p-5 flex flex-col justify-end",
        "bg-gradient-to-b from-transparent via-slate-900/70 to-slate-900/95",
        "backdrop-blur-sm",
        "opacity-0 translate-y-2 pointer-events-none",
        "transition-all duration-300 ease-out",
        "group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
        "group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto",
      ].join(" ")
    );

    // Tags
    const tags = el("div", "flex flex-wrap gap-2 mb-3");
    (c.skills || []).forEach((s) =>
      tags.appendChild(
        el(
          "span",
          "text-xs px-2 py-1 rounded-full bg-slate-700/80 text-teal-200 ring-1 ring-white/10",
          s
        )
      )
    );

    // Details colapsable
    const details = el(
      "div",
      "mt-2 text-sm text-slate-300 leading-relaxed overflow-hidden will-change-[height,opacity,transform]"
    );
    details.innerHTML = `
    <ul class="list-disc list-inside space-y-1">
      <li><strong>Category:</strong> ${labelCat(c.category)}</li>
      ${
        c.skills?.length
          ? `<li><strong>Skills:</strong> ${c.skills.join(" • ")}</li>`
          : ""
      }
      ${isVerified(c) ? `<li><strong>Status:</strong> Verified</li>` : ""}
    </ul>`;
    details.style.height = "0px";
    details.style.opacity = "0";
    details.style.transform = "translateY(-4px)";
    details.style.pointerEvents = "none";
    details.dataset.open = "0";

    const toggleBtn = el(
      "button",
      "px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-sm",
      "Details"
    );
    toggleBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const willOpen = details.dataset.open !== "1";
      toggleDetails(details, toggleBtn);
      details.style.pointerEvents = willOpen ? "auto" : "none";
    });

    // CTAs
    const ctas = el("div", "mt-4 flex flex-wrap gap-3 relative z-10");
    const btnOpen = el(
      "button",
      "bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold px-3 py-2 rounded",
      "Open"
    );
    btnOpen.addEventListener("click", (ev) => {
      ev.stopPropagation();
      openExternal(c.verify);
    });

    const btnPreview = el(
      "button",
      "bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded",
      "Preview"
    );
    btnPreview.addEventListener("click", (ev) => {
      ev.stopPropagation();
      openCertPreview(c); // imagen/PDF/modal
    });

    ctas.append(btnOpen, btnPreview);
    panel.append(tags, toggleBtn, details, ctas);

    /* ---------- Compose ---------- */
    card.append(cover, panel);

    // Click tarjeta → abrir verify
    card.addEventListener("click", (e) => {
      if (e.target.closest("button, a, select")) return;
      openExternal(c.verify);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openExternal(c.verify);
      if (e.key === " ") {
        e.preventDefault();
        const willOpen = details.dataset.open !== "1";
        toggleDetails(details, toggleBtn);
        details.style.pointerEvents = willOpen ? "auto" : "none";
      }
    });

    // Tilt sutil (no deforma el texto)
    if (!prefersReduce && TILT_MAX_DEG > 0) {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(
          -y * TILT_MAX_DEG
        ).toFixed(2)}deg) rotateY(${(x * TILT_MAX_DEG).toFixed(
          2
        )}deg) translateZ(0)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
      });
    }

    return card;
  }

  function toggleDetails(details, btn) {
    const open = details.dataset.open === "1";
    if (open) {
      collapseEl(details);
      details.dataset.open = "0";
      btn.textContent = "Details";
    } else {
      expandEl(details);
      details.dataset.open = "1";
      btn.textContent = "Hide details";
    }
  }

  function zoomOrOpen(src) {
    const url = normalizeUrl(src);
    if (!url) return;

    // PDF u otros no-imagen -> abrir nueva pestaña
    if (
      /\.pdf($|\?)/i.test(url) ||
      !/\.(png|jpe?g|gif|webp|avif|svg)($|\?)/i.test(url)
    ) {
      openExternal(url);
      return;
    }

    // Imagen con modal
    const modal = $("#imgZoomModal");
    const img = $("#zoomedImg");
    if (modal && img) {
      img.src = url;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      modal.addEventListener(
        "click",
        () => {
          modal.classList.add("hidden");
          modal.classList.remove("flex");
        },
        { once: true }
      );
    } else {
      openExternal(url);
    }
  }

  // ==== JSON-LD (SEO) ====
  (function injectJSONLD() {
    const data = certs.map((c) => ({
      "@context": "https://schema.org",
      "@type": "EducationalOccupationalCredential",
      name: c.title,
      description: c.skills?.length ? `${c.skills.join(", ")}` : undefined,
      credentialCategory: labelCat(c.category),
      recognizedBy: c.issuer
        ? { "@type": "Organization", name: c.issuer }
        : undefined,
      url: c.verify || undefined,
      dateIssued: c.issued || undefined,
    }));
    const s = el("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    d.head.appendChild(s);
  })();

  // ==== Init ====
  buildToolbar();
})();
