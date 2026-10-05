/*
  The cat 🐱 — a chunky, clay-like 3D cat built from Three.js primitives.
  - Head + eyes follow the cursor, random blinks, tail sway, breathing.
  - Click it to make it hop. window.Cat.peek() / .wave() are triggered by main.js.
  - Home page: big in the hero, then shrinks into the corner on scroll.
    Other pages: always a small corner companion.
  - No WebGL / Three.js? Falls back to an SVG cat with CSS animations.
*/
(function () {
  "use strict";

  var mode = document.body.getAttribute("data-cat") || "corner"; // "hero" | "corner"
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var isSmall = window.innerWidth < 760;

  /* ---------- Stage ---------- */
  var stage = document.createElement("div");
  stage.className = "cat-stage" + (mode === "hero" ? "" : " is-corner");
  stage.setAttribute("role", "img");
  stage.setAttribute("aria-label", "A chubby white and pink 3D cat mascot");
  stage.innerHTML =
    '<div class="cat-fallback">' + fallbackSVG() + "</div>" +
    (mode === "hero" ? '<span class="cat-hint">psst — click the cat</span>' : "");
  document.body.appendChild(stage);

  var api = { hop: noop, peek: noop, wave: noop, stage: stage };
  window.Cat = api;

  function noop() {}

  function hasWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  if (!window.THREE || !hasWebGL()) {
    useFallback();
    return;
  }

  var THREE = window.THREE;

  /* ---------- Renderer / scene ---------- */
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (e) {
    useFallback();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  stage.insertBefore(renderer.domElement, stage.firstChild);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xf3b0c7, 0.85));
  var key = new THREE.DirectionalLight(0xffffff, 0.75);
  key.position.set(3, 5, 6);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0xffd6e4, 0.45);
  rim.position.set(-4, 3, -3);
  scene.add(rim);

  /* ---------- Materials ---------- */
  var seg = isSmall ? 24 : 40;
  function clay(color, rough) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.62 : rough, metalness: 0 });
  }
  var M = {
    fur: clay(0xfffafc),
    belly: clay(0xfde6ee),
    pink: clay(0xf6b3c9, 0.5),
    pinkDeep: clay(0xee8fb0, 0.45),
    ink: new THREE.MeshStandardMaterial({ color: 0x2b1e24, roughness: 0.12, metalness: 0.15 }),
    shine: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    blush: new THREE.MeshBasicMaterial({ color: 0xf7a8c2, transparent: true, opacity: 0.75 }),
    bell: new THREE.MeshStandardMaterial({ color: 0xf7d774, roughness: 0.25, metalness: 0.5 }),
  };

  function sphere(r, mat, x, y, z, sx, sy, sz) {
    var m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75)), mat);
    m.position.set(x || 0, y || 0, z || 0);
    m.scale.set(sx || 1, sy || sx || 1, sz || sx || 1);
    return m;
  }

  /* ---------- Build the cat ---------- */
  var root = new THREE.Group(); // hop + squash
  var cat = new THREE.Group(); // body turn
  root.add(cat);
  scene.add(root);

  // Body
  var body = new THREE.Group();
  body.add(sphere(1, M.fur, 0, 1.0, 0, 1.0, 1.05, 0.92));
  body.add(sphere(0.6, M.belly, 0, 0.92, 0.55, 1.0, 1.15, 0.55));
  body.add(sphere(0.5, M.fur, -0.72, 0.36, 0.1, 0.78, 0.72, 1.1)); // haunches
  body.add(sphere(0.5, M.fur, 0.72, 0.36, 0.1, 0.78, 0.72, 1.1));
  cat.add(body);

  // Paws (left static, right can wave)
  var pawL = sphere(0.3, M.fur, -0.38, 0.17, 0.74, 1, 0.72, 1.2);
  cat.add(pawL);
  var pawR = new THREE.Group();
  pawR.add(sphere(0.3, M.fur, 0, 0, 0, 1, 0.72, 1.2));
  var pawPad = sphere(0.13, M.pink, 0, -0.02, 0.3, 1, 0.8, 0.4);
  pawPad.visible = false;
  pawR.add(pawPad);
  var pawRBase = new THREE.Vector3(0.38, 0.17, 0.74);
  pawR.position.copy(pawRBase);
  cat.add(pawR);

  // Tail
  var tail = new THREE.Group();
  tail.position.set(0.2, 0.3, -0.7);
  var tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.6, -0.08, -0.25),
    new THREE.Vector3(1.15, 0.2, 0.05),
    new THREE.Vector3(1.25, 0.8, 0.35),
    new THREE.Vector3(1.0, 1.2, 0.5),
  ]);
  tail.add(new THREE.Mesh(new THREE.TubeGeometry(tailCurve, isSmall ? 24 : 48, 0.15, isSmall ? 10 : 16, false), M.fur));
  tail.add(sphere(0.19, M.pink, 1.0, 1.2, 0.5));
  cat.add(tail);

  // Collar + bell
  var collar = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.09, 14, seg * 2), M.pinkDeep);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 1.55, 0.02);
  cat.add(collar);
  var bell = sphere(0.14, M.bell, 0, 1.42, 0.9);
  cat.add(bell);

  // Head
  var head = new THREE.Group();
  head.position.set(0, 2.32, 0.05);
  cat.add(head);
  head.add(sphere(0.95, M.fur, 0, 0, 0, 1.12, 0.92, 0.95));
  head.add(sphere(0.42, M.fur, -0.46, -0.3, 0.3, 1, 0.85, 1)); // fluffy cheeks
  head.add(sphere(0.42, M.fur, 0.46, -0.3, 0.3, 1, 0.85, 1));

  // Ears
  var ears = [];
  [-1, 1].forEach(function (s) {
    var ear = new THREE.Group();
    ear.position.set(s * 0.6, 0.66, -0.05);
    ear.rotation.z = -s * 0.36;
    ear.rotation.x = -0.08;
    var outer = new THREE.Mesh(new THREE.ConeGeometry(0.37, 0.66, seg), M.fur);
    var inner = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, seg), M.pink);
    inner.position.set(0, -0.06, 0.15);
    ear.add(outer, inner);
    head.add(ear);
    ears.push(ear);
  });

  // Eyes (each in a group so we can blink by scaling Y)
  var eyes = [];
  [-1, 1].forEach(function (s) {
    var eye = new THREE.Group();
    eye.position.set(s * 0.36, 0.04, 0.8);
    eye.add(sphere(0.17, M.ink, 0, 0, 0, 1, 1.15, 0.6));
    eye.add(sphere(0.055, M.shine, 0.05, 0.08, 0.09));
    eye.add(sphere(0.025, M.shine, -0.05, -0.06, 0.1));
    head.add(eye);
    eyes.push(eye);
  });

  // Nose, mouth, blush, forehead stripes
  head.add(sphere(0.08, M.pinkDeep, 0, -0.13, 0.9, 1.3, 0.9, 0.8));
  [-1, 1].forEach(function (s) {
    var arc = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 20, Math.PI), M.ink);
    arc.position.set(s * 0.075, -0.2, 0.875);
    arc.rotation.z = Math.PI;
    head.add(arc);
    head.add(sphere(0.14, M.blush, s * 0.6, -0.13, 0.73, 1.3, 0.7, 0.3));
  });
  if (THREE.CapsuleGeometry) {
    [-0.17, 0, 0.17].forEach(function (x, i) {
      var stripe = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, i === 1 ? 0.2 : 0.13, 4, 8), M.pink);
      stripe.position.set(x, 0.6 - (i === 1 ? 0 : 0.03), 0.64);
      stripe.rotation.x = -0.8;
      stripe.rotation.z = -x * 1.4;
      head.add(stripe);
    });
  }

  // Soft contact shadow
  var shadowTex = (function () {
    var c = document.createElement("canvas");
    c.width = c.height = 128;
    var g = c.getContext("2d");
    var grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(120,40,70,0.32)");
    grd.addColorStop(1, "rgba(120,40,70,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  var shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 3.4),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  scene.add(shadow);

  /* ---------- Sizing ---------- */
  function resize() {
    var w = stage.clientWidth;
    var h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    var halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    var fitH = 4.3 / (2 * halfTan);
    var fitW = 4.0 / (2 * halfTan * camera.aspect);
    var d = Math.max(fitH, fitW);
    camera.position.set(0, 1.9, d);
    camera.lookAt(0, 1.45, 0);
    camera.updateProjectionMatrix();
    if (reduceMotion) render();
  }
  window.addEventListener("resize", resize);

  /* ---------- Interaction state ---------- */
  var pointer = { x: 0, y: 0, active: false };
  window.addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    },
    { passive: true }
  );

  var clock = new THREE.Clock();
  var hopAt = -10, peekAt = -10, waveAt = -10, twitchAt = -10, twitchSide = 0;
  var nextBlink = 1.5, blinkAt = -10, nextTwitch = 3;

  api.hop = function () { if (clock.elapsedTime - hopAt > 0.65) hopAt = clock.elapsedTime; meow(); };
  api.peek = function () { peekAt = clock.elapsedTime; };
  api.wave = function () { if (clock.elapsedTime - waveAt > 2.2) waveAt = clock.elapsedTime; };

  renderer.domElement.addEventListener("click", function () {
    api.hop();
  });

  /* Little speech bubble on click */
  var bubble = null, bubbleTimer = 0;
  var lines = ["meow!", "hi, I'm Mochi ♡", "mrrp?", "pet me again", "purrrr…", "look at the work!"];
  function meow() {
    if (stage.classList.contains("is-corner")) return;
    if (!bubble) {
      bubble = document.createElement("span");
      bubble.className = "cat-bubble";
      stage.appendChild(bubble);
    }
    bubble.textContent = lines[Math.floor(Math.random() * lines.length)];
    bubble.classList.add("is-on");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.classList.remove("is-on"); }, 1600);
  }

  /* ---------- Animation ---------- */
  var lerp = THREE.MathUtils.lerp;
  var clamp = THREE.MathUtils.clamp;
  var look = { y: 0, x: 0 };

  function animate() {
    requestAnimationFrame(animate);
    update(clock.getElapsedTime());
    render();
  }

  function update(t) {
    // Where to look
    var tx, ty;
    if (pointer.active && finePointer) {
      var r = stage.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height * 0.4;
      tx = clamp(((pointer.x - cx) / window.innerWidth) * 1.6, -0.7, 0.7);
      ty = clamp(((pointer.y - cy) / window.innerHeight) * 1.2, -0.35, 0.45);
    } else {
      tx = Math.sin(t * 0.45) * 0.3;
      ty = Math.sin(t * 0.3) * 0.08;
    }
    look.y = lerp(look.y, tx, 0.07);
    look.x = lerp(look.x, ty, 0.07);
    head.rotation.y = look.y;
    head.rotation.x = look.x;
    cat.rotation.y = look.y * 0.25;
    eyes.forEach(function (e, i) {
      e.position.x = (i ? 0.36 : -0.36) + look.y * 0.04;
    });

    // Peek: curious head tilt
    var pk = (t - peekAt) / 0.9;
    head.rotation.z = pk >= 0 && pk < 1 ? Math.sin(pk * Math.PI) * 0.28 : lerp(head.rotation.z, 0, 0.1);

    // Blink
    if (t > nextBlink) {
      blinkAt = t;
      nextBlink = t + 2 + Math.random() * 3.5;
      if (Math.random() < 0.2) nextBlink = t + 0.25; // double blink
    }
    var bk = (t - blinkAt) / 0.16;
    var lid = bk >= 0 && bk < 1 ? 1 - Math.sin(bk * Math.PI) * 0.92 : 1;
    eyes.forEach(function (e) { e.scale.y = lid; });

    // Ear twitch
    if (t > nextTwitch) {
      twitchAt = t;
      twitchSide = Math.random() < 0.5 ? 0 : 1;
      nextTwitch = t + 3 + Math.random() * 5;
    }
    var tw = (t - twitchAt) / 0.35;
    ears.forEach(function (e, i) {
      var base = (i ? -1 : 1) * 0.36;
      e.rotation.z = base + (i === twitchSide && tw >= 0 && tw < 1 ? Math.sin(tw * Math.PI * 2) * 0.18 : 0);
    });

    // Tail + breathing
    tail.rotation.y = Math.sin(t * 1.5) * 0.35;
    tail.rotation.z = Math.sin(t * 1.1 + 1) * 0.08;
    body.scale.set(1, 1 + Math.sin(t * 2.2) * 0.012, 1);

    // Hop with squash & stretch
    var hp = (t - hopAt) / 0.6;
    if (hp >= 0 && hp < 1) {
      var up = Math.sin(hp * Math.PI);
      root.position.y = up * 0.7;
      var squash = hp < 0.12 ? 1 - Math.sin((hp / 0.12) * Math.PI) * 0.12 : 1 + up * 0.06;
      root.scale.set(2 - squash, squash, 2 - squash);
      shadow.scale.setScalar(1 - up * 0.35);
      shadow.material.opacity = 1 - up * 0.5;
    } else {
      root.position.y = 0;
      root.scale.set(1, 1, 1);
      shadow.scale.setScalar(1);
      shadow.material.opacity = 1;
    }

    // Wave the right paw
    var wv = (t - waveAt) / 2;
    if (wv >= 0 && wv < 1) {
      var lift = Math.sin(Math.min(wv * 4, 1) * Math.PI * 0.5) * (wv > 0.8 ? (1 - wv) / 0.2 : 1);
      pawR.position.set(
        lerp(pawRBase.x, 0.95, lift),
        lerp(pawRBase.y, 1.55, lift),
        lerp(pawRBase.z, 0.75, lift)
      );
      pawR.rotation.x = -lift * 1.3;
      pawR.rotation.z = lift * Math.sin(t * 12) * 0.35;
      pawPad.visible = lift > 0.3;
    } else {
      pawR.position.copy(pawRBase);
      pawR.rotation.set(0, 0, 0);
      pawPad.visible = false;
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  resize();
  if (reduceMotion) {
    update(0);
    render();
    api.hop = api.peek = api.wave = noop;
  } else {
    animate();
  }

  /* ---------- Fallback ---------- */
  function useFallback() {
    stage.classList.add("no-webgl");
    var svg = stage.querySelector(".cat-fallback");
    function play(cls, ms) {
      if (reduceMotion) return;
      svg.classList.remove(cls);
      void svg.offsetWidth;
      svg.classList.add(cls);
      setTimeout(function () { svg.classList.remove(cls); }, ms);
    }
    api.hop = function () { play("do-hop", 650); };
    api.peek = function () { play("do-peek", 900); };
    api.wave = function () { play("do-peek", 900); };
    svg.addEventListener("click", api.hop);
  }

  function fallbackSVG() {
    return (
      '<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="100" cy="200" rx="64" ry="8" fill="#782846" opacity=".12"/>' +
      '<g class="fb-body">' +
      '<path d="M138 182 C182 180 186 140 160 120" stroke="#fffafc" stroke-width="18" fill="none" stroke-linecap="round"/>' +
      '<circle cx="160" cy="120" r="11" fill="#f6b3c9"/>' +
      '<ellipse cx="100" cy="152" rx="56" ry="48" fill="#fffafc"/>' +
      '<ellipse cx="100" cy="158" rx="30" ry="32" fill="#fde6ee"/>' +
      '<ellipse cx="80" cy="196" rx="16" ry="10" fill="#fffafc"/>' +
      '<ellipse cx="120" cy="196" rx="16" ry="10" fill="#fffafc"/>' +
      '<path d="M62 118 Q100 134 138 118" stroke="#ee8fb0" stroke-width="9" fill="none" stroke-linecap="round"/>' +
      '<circle cx="100" cy="132" r="7" fill="#f7d774"/>' +
      "</g>" +
      '<g class="fb-head">' +
      '<path d="M46 72 L52 18 L92 50 Z" fill="#fffafc" stroke="#fffafc" stroke-width="10" stroke-linejoin="round"/>' +
      '<path d="M154 72 L148 18 L108 50 Z" fill="#fffafc" stroke="#fffafc" stroke-width="10" stroke-linejoin="round"/>' +
      '<path d="M58 60 L60 32 L80 50 Z" fill="#f6b3c9" stroke="#f6b3c9" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M142 60 L140 32 L120 50 Z" fill="#f6b3c9" stroke="#f6b3c9" stroke-width="6" stroke-linejoin="round"/>' +
      '<ellipse cx="100" cy="82" rx="62" ry="50" fill="#fffafc"/>' +
      '<g class="fb-eyes"><ellipse cx="78" cy="82" rx="9" ry="11" fill="#2b1e24"/><ellipse cx="122" cy="82" rx="9" ry="11" fill="#2b1e24"/>' +
      '<circle cx="81" cy="78" r="3" fill="#fff"/><circle cx="125" cy="78" r="3" fill="#fff"/></g>' +
      '<ellipse cx="62" cy="98" rx="10" ry="6" fill="#f7a8c2" opacity=".8"/>' +
      '<ellipse cx="138" cy="98" rx="10" ry="6" fill="#f7a8c2" opacity=".8"/>' +
      '<ellipse cx="100" cy="95" rx="6" ry="4" fill="#ee8fb0"/>' +
      '<path d="M92 101 q4 6 8 0 q4 6 8 0" stroke="#2b1e24" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M92 42 l1 10 M100 39 v12 M108 42 l-1 10" stroke="#f6b3c9" stroke-width="4" stroke-linecap="round"/>' +
      "</g></svg>"
    );
  }
})();
