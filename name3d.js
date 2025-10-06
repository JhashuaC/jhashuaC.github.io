// name3d.js
(() => {
  const mount = document.getElementById("name3d-hero");
  if (!mount) return;

  // --- 1) Asegura altura visible (por si Tailwind no aplicó altura en el SSR)
  if (mount.clientHeight < 60) {
    mount.style.height = "180px";
  }

  // --- 2) Utilidad: leer colores de Tailwind (teal/cyan actuales)
  const probe = document.createElement("span");
  document.body.appendChild(probe);
  const pick = (cls, fallback) => {
    probe.className = cls;
    const c = getComputedStyle(probe).color;
    const m = c.match(/\d+/g);
    if (!m) return fallback;
    const [r, g, b] = m.map(Number);
    return (r << 16) | (g << 8) | b;
  };
  const COLOR = pick("text-teal-400", 0x14b8a6);
  const ACCENT = pick("text-cyan-400", 0x22d3ee);
  document.body.removeChild(probe);

  // --- 3) Guardas por si THREE no está
  if (
    typeof THREE === "undefined" ||
    !THREE.FontLoader ||
    !THREE.TextGeometry
  ) {
    fallbackText();
    return;
  }

  // --- 4) Escena básica
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w = mount.clientWidth,
    h = mount.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(DPR);
  renderer.setSize(w, h);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.pointerEvents = "none";
  mount.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const dir = new THREE.DirectionalLight(0xffffff, 0.95);
  dir.position.set(2, 3, 6);
  scene.add(dir);

  const group = new THREE.Group();
  scene.add(group);

  // Aro sutil detrás
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(7.5, 0.12, 16, 120),
    new THREE.MeshBasicMaterial({
      color: ACCENT,
      transparent: true,
      opacity: 0.22,
    })
  );
  ring.rotation.x = Math.PI * 0.5;
  ring.position.z = -1.5;
  group.add(ring);

  // --- 5) Carga de fuente + texto
  let textMesh, strokeMesh, bbox;
  new THREE.FontLoader().load(
    "https://unpkg.com/three@0.158.0/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      const geo = new THREE.TextGeometry("Hi, I'm Jhashua", {
        font,
        size: 2.4,
        height: 0.6,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.12,
        bevelSize: 0.08,
        bevelOffset: 0,
        bevelSegments: 2,
      });
      geo.computeBoundingBox();
      geo.center();
      bbox = geo.boundingBox.clone();

      // relleno
      const mat = new THREE.MeshStandardMaterial({
        color: COLOR,
        metalness: 0.55,
        roughness: 0.28,
        emissive: 0x0a0a0a,
      });
      textMesh = new THREE.Mesh(geo, mat);
      group.add(textMesh);

      // contorno (ligeramente más grande y oscuro)
      const strokeMat = new THREE.MeshBasicMaterial({
        color: 0x0b1220, // tono del fondo
        transparent: true,
        opacity: 0.35,
      });
      strokeMesh = new THREE.Mesh(geo.clone(), strokeMat);
      strokeMesh.scale.setScalar(1.02);
      group.add(strokeMesh);

      fitToContainer();
      render();
    },
    undefined,
    () => {
      // Si falla la fuente, degradamos a texto HTML
      fallbackText();
    }
  );

  // --- 6) Auto-fit sin distorsión
  function fitToContainer() {
    if (!bbox) return;
    w = mount.clientWidth;
    h = mount.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);

    const dist = camera.position.z;
    const vH = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * dist;
    const vW = vH * camera.aspect;

    const textW = bbox.max.x - bbox.min.x;
    const scale = (vW * 0.86) / textW;
    group.scale.setScalar(scale);
  }

  // --- 7) Interacción con puntero
  let mx = 0,
    my = 0;
  mount.addEventListener(
    "mousemove",
    (e) => {
      const r = mount.getBoundingClientRect();
      mx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      my = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      mx = Math.max(-1, Math.min(1, mx));
      my = Math.max(-1, Math.min(1, my));
    },
    { passive: true }
  );

  // --- 8) Resize observer
  new ResizeObserver(fitToContainer).observe(mount);

  // --- 9) Animación
  const clock = new THREE.Clock();
  function render() {
    const t = clock.getElapsedTime();
    const ty = mx * 0.35;
    const tx = -my * 0.25;

    group.rotation.y += (ty - group.rotation.y) * 0.08;
    group.rotation.x += (tx - group.rotation.x) * 0.08;

    group.position.y = Math.sin(t * 0.8) * 0.18;
    ring.rotation.z += 0.0015;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // --- 10) Fallback HTML si algo va mal
  function fallbackText() {
    mount.innerHTML = "";
    const div = document.createElement("div");
    div.className =
      "text-4xl sm:text-5xl md:text-6xl font-extrabold text-teal-400";
    div.textContent = "Hi, I'm Jhashua";
    div.style.filter = "drop-shadow(0 4px 18px rgba(20,184,166,0.25))";
    div.style.userSelect = "none";
    div.style.pointerEvents = "none";
    div.style.display = "grid";
    div.style.placeItems = "center";
    div.style.height = "100%";
    mount.appendChild(div);
  }
})();
