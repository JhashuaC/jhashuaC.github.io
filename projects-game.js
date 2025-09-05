/* =========================================================================
   Projects 2D Game – v3 (Maze + big tiles + dual access)
   ========================================================================= */

(() => {
  const viewport = document.getElementById("projects-game");
  const gridEl = document.getElementById("pj-grid");
  const playerEl = document.getElementById("pj-player");
  const tipEl = document.getElementById("pj-tooltip");
  const hintEl = document.getElementById("pj-hint");

  // Modal refs (same as v2)
  const modal = document.getElementById("pj-modal");
  const modalCloseBtn = document.getElementById("pj-modal-close");
  const modalTitle = document.getElementById("pj-modal-title");
  const modalImg = document.getElementById("pj-modal-img");
  const modalDesc = document.getElementById("pj-modal-desc");
  const modalTags = document.getElementById("pj-modal-tags");
  const modalOpenBtn = document.getElementById("pj-modal-open");
  const modalGitBtn = document.getElementById("pj-modal-github");

  if (!viewport || !gridEl || !playerEl) return;

  /* ===========================
     MAP (maze) – editable
     Legend:
       # = wall
       . = walkable path
       S = player start
       Letters A..G = project stands
     =========================== */

  // Keep rows small to make tiles BIG on screen
  const MAP = [
    "###############",
    "#A....#..B..C.#",
    "###.#.#.###.#.#",
    "#...#.#.....#.#",
    "#.###.#####.#.#",
    "#.#...#...#.#.#",
    "#.#.###.#.#.#.#",
    "#.#...#.#.#.#.#",
    "#.###.#.#.#.#.#",
    "#...#...#...#.#",
    "#S###########D#",
  ];
  // Projects appear on row 0 (arriba) en distintos caminos (A,B,C,D…)

  const COLS = MAP[0].length;
  const ROWS = MAP.length;

  // Project data bound to letters in MAP
  const PROJECTS_DATA = {
    A: {
      id: "arduino",
      name: "Arduino XOR Authentication",
      desc: "Binary inputs + XOR encryption between two Arduinos.",
      url: "https://www.tinkercad.com/things/1vqRrahyEhI-fantabulous-gaaris",
      github: null,
      tags: ["Arduino", "XOR", "Serial"],
      color: "#10b981",
      img: "img/cover_arduino.jpg",
    },
    B: {
      id: "ml",
      name: "ML Price Prediction",
      desc: "Flask API + scikit-learn regression. +15% accuracy.",
      url: "https://github.com/JhashuaC/Price-Prediction_ML",
      github: "https://github.com/JhashuaC/Price-Prediction_ML",
      tags: ["Python", "Flask", "ML"],
      color: "#60a5fa",
      img: "img/cover_ml.jpg",
    },
    C: {
      id: "virtualclass",
      name: "VirtualClassroomAPI",
      desc: "REST API for academic records and management.",
      url: "https://github.com/JhashuaC/academic-records-api",
      github: "https://github.com/JhashuaC/academic-records-api",
      tags: ["Node", "REST", "Auth"],
      color: "#a78bfa",
      img: "img/cover_virtual.jpg",
    },
    D: {
      id: "logic",
      name: "Logic Circuit Car",
      desc: "Digital logic simulation (LogicCircuit).",
      url: "https://github.com/JhashuaC/Logic-Circuit",
      github: "https://github.com/JhashuaC/Logic-Circuit",
      tags: ["Logic", "FSM"],
      color: "#f59e0b",
      img: "img/cover_logic.jpg",
    },
    E: {
      id: "asm",
      name: "Assembly Paint",
      desc: "DOS paint with draw, colors and save/load.",
      url: "https://github.com/JhashuaC/Assembly-Paint",
      github: "https://github.com/JhashuaC/Assembly-Paint",
      tags: ["ASM", "DOS"],
      color: "#f43f5e",
      img: "img/cover_asm.jpg",
    },
    F: {
      id: "graduate",
      name: "Graduate Platform",
      desc: "Graduates, careers, users, entities dashboard.",
      url: "https://github.com/JhashuaC/GraduatePlatform",
      github: "https://github.com/JhashuaC/GraduatePlatform",
      tags: ["Full-stack", "MySQL", "Auth"],
      color: "#14b8a6",
      img: "img/cover_grad.jpg",
    },
    G: {
      id: "cobol",
      name: "COBOL Inventory",
      desc: "Indexed + sequential files inventory system.",
      url: "https://github.com/JhashuaC/sistemaVentasCobol",
      github: "https://github.com/JhashuaC/sistemaVentasCobol",
      tags: ["COBOL", "Files"],
      color: "#22c55e",
      img: "img/cover_cobol.jpg",
    },
  };

  /* ===========================
     Build grid from MAP
     =========================== */
  const blocked = new Set();
  const standsByPos = new Map();
  let startCol = 1,
    startRow = ROWS - 1; // fallback

  const k = (c, r) => `${c},${r}`;
  const block = (c, r) => blocked.add(k(c, r));

  gridEl.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  gridEl.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ch = MAP[r][c];
      const cell = document.createElement("div");
      cell.className = "relative";

      // bigger tiles look – strong checker
      cell.style.background =
        (r + c) % 2 === 0 ? "rgba(4,9,20,0.92)" : "rgba(10,17,35,0.96)";
      cell.style.boxShadow = "inset 0 0 0 1px rgba(45,212,191,0.06)";

      // walls
      if (ch === "#") {
        block(c, r);
        const wall = document.createElement("div");
        wall.className =
          "absolute inset-0 bg-slate-800/60 ring-1 ring-black/30";
        cell.appendChild(wall);
      }
      // start
      if (ch === "S") {
        startCol = c;
        startRow = r;
      }

      // stands (letters)
      if (/[A-Z]/.test(ch) && PROJECTS_DATA[ch]) {
        const p = PROJECTS_DATA[ch];
        // The stand tile itself is blocked (so you stop in front / lado)
        block(c, r);

        const wrap = document.createElement("div");
        wrap.className = "relative cursor-pointer group";

        // Bigger stand
        const base = document.createElement("div");
        base.className =
          "absolute inset-1 rounded-xl flex items-center justify-center font-semibold text-[11px] text-slate-900 ring-1 ring-black/10";
        base.style.background = p.color;
        base.style.filter = "drop-shadow(0 8px 18px rgba(0,0,0,0.35))";
        base.textContent = "Stand";
        base.dataset.pid = p.id;

        // name label (bigger)
        const chip = document.createElement("div");
        chip.className =
          "absolute left-1/2 -translate-x-1/2 -top-2 text-[11px] px-2 py-0.5 rounded bg-black/70 text-teal-200 whitespace-nowrap";
        chip.textContent = p.name;

        // glow when near
        const ring = document.createElement("div");
        ring.className =
          "absolute -inset-1 rounded-2xl opacity-0 pointer-events-none transition-opacity ring-4 ring-teal-400/40 group-[.near]:opacity-100";

        wrap.append(base, chip, ring);
        wrap.addEventListener("click", () => openProjectModal(p)); // CLICK DIRECTO → reclutadores
        cell.appendChild(wrap);
        standsByPos.set(k(c, r), p);
      }

      gridEl.appendChild(cell);
    }
  }

  /* ===========================
     Player & movement (no-stick fix)
     =========================== */
  playerEl.classList.add("shadow-xl", "ring-2", "ring-white/10", "bg-teal-400");
  let px = startCol,
    py = startRow; // start from S at the bottom
  let xPix = 0,
    yPix = 0,
    targetX = 0,
    targetY = 0;

  function placeTarget() {
    const rect = viewport.getBoundingClientRect();
    const tw = rect.width / COLS;
    const th = rect.height / ROWS;
    targetX = (px + 0.5) * tw;
    targetY = (py + 0.5) * th;
    if (xPix === 0 && yPix === 0) {
      xPix = targetX;
      yPix = targetY;
    }
    // make player bigger relative to tile
    const size = Math.min(tw, th) * 0.8;
    playerEl.style.width = `${Math.min(size, 44)}px`;
    playerEl.style.height = playerEl.style.width;
  }
  placeTarget();

  // Smooth follow
  function renderPlayer() {
    xPix += (targetX - xPix) * 0.24;
    yPix += (targetY - yPix) * 0.24;
    playerEl.style.transform = `translate(${xPix}px, ${yPix}px)`;
    tipEl.style.transform = `translate(${xPix}px, ${yPix - 18}px)`;
  }

  function isBlocked(nx, ny) {
    return (
      nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || blocked.has(k(nx, ny))
    );
  }

  // IMPORTANT (anti-stick): movement never writes to blocked set,
  // and we never change current tile to blocked. Interact/open modal
  // does NOT modify movement state, so you can always walk away.
  function move(dx, dy) {
    const nx = px + dx,
      ny = py + dy;
    if (isBlocked(nx, ny)) return false;
    px = nx;
    py = ny;
    placeTarget();
    highlightNear();
    return true;
  }

  // Key repeat (hold to keep walking)
  const held = new Set();
  let moveTimer = 0;
  function stepLoop() {
    // walking cadence
    if (held.size) {
      const up = held.has("ArrowUp") || held.has("w");
      const down = held.has("ArrowDown") || held.has("s");
      const left = held.has("ArrowLeft") || held.has("a");
      const right = held.has("ArrowRight") || held.has("d");

      if (up) move(0, -1);
      else if (down) move(0, 1);
      else if (left) move(-1, 0);
      else if (right) move(1, 0);
    }
    moveTimer = setTimeout(stepLoop, 110);
  }

  window.addEventListener("keydown", (e) => {
    const k = e.key;
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "w",
        "a",
        "s",
        "d",
      ].includes(k)
    ) {
      if (!held.size) stepLoop();
      held.add(k);
      e.preventDefault();
    }
    if (k === "Enter" || k.toLowerCase() === "e") interact();
  });
  window.addEventListener("keyup", (e) => {
    held.delete(e.key);
    if (!held.size) clearTimeout(moveTimer);
  });

  window.addEventListener("resize", placeTarget);

  /* ===========================
     Near detection + tooltip + glow
     =========================== */
  function adjStands(x, y) {
    return [
      standsByPos.get(`${x + 1},${y}`),
      standsByPos.get(`${x - 1},${y}`),
      standsByPos.get(`${x},${y + 1}`),
      standsByPos.get(`${x},${y - 1}`),
    ].filter(Boolean);
  }

  function highlightNear() {
    const near = adjStands(px, py);
    gridEl
      .querySelectorAll(".group.near")
      .forEach((el) => el.classList.remove("near"));
    if (near.length) {
      hintEl && hintEl.classList.remove("opacity-0");
      tipEl.textContent = `${near[0].name} — press E`;
      tipEl.classList.remove("opacity-0");
      // glow only on those stands
      gridEl.querySelectorAll("[data-pid]").forEach((el) => {
        if (near.some((p) => p.id === el.dataset.pid))
          el.parentElement.classList.add("near");
      });
    } else {
      tipEl.classList.add("opacity-0");
    }
  }
  highlightNear();

  function interact() {
    const p = adjStands(px, py)[0];
    if (!p) return;
    openProjectModal(p);
  }

  /* ===========================
     Modal (unchanged)
     =========================== */
  function openProjectModal(p) {
    modalTitle.textContent = p.name;
    modalDesc.textContent = p.desc;
    modalImg.src = p.img || "";
    modalImg.alt = p.name;

    modalTags.innerHTML = "";
    (p.tags || []).forEach((t) => {
      const span = document.createElement("span");
      span.className =
        "text-xs px-2 py-1 rounded-full bg-slate-800 text-teal-300 ring-1 ring-white/10";
      span.textContent = t;
      modalTags.appendChild(span);
    });

    modalOpenBtn.href = p.url;
    if (p.github) {
      modalGitBtn.href = p.github;
      modalGitBtn.classList.remove("hidden");
    } else {
      modalGitBtn.classList.add("hidden");
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  function closeProjectModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
  modalCloseBtn && modalCloseBtn.addEventListener("click", closeProjectModal);
  modal &&
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeProjectModal();
    });

  /* ===========================
     Main render loop
     =========================== */
  (function loop() {
    renderPlayer();
    requestAnimationFrame(loop);
  })();
})();
