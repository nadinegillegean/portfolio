/*
  Shared site behaviour: rendering from data.js, smooth scroll (Lenis),
  scroll reveals (GSAP + ScrollTrigger), collection tabs, pick-a-card fan,
  floating dots, and contact links.
*/
(function () {
  "use strict";

  var SITE = window.SITE;
  var html = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);

  /* ---------- Helpers (also used by project.js / about.js via window.renderPage) ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var ICONS = {
    plane:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 28l36-14-8 22-10-8-8 6 2-10z"/></svg>',
    cat:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20L10 6l9 7h10l9-7 2 14c0 12-8 20-16 20S8 32 8 20z"/><circle cx="18" cy="24" r="1.6"/><circle cx="30" cy="24" r="1.6"/><path d="M22 30q2 2 4 0"/></svg>',
    coffee:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 16h26v12a10 10 0 01-10 10h-6A10 10 0 018 28z"/><path d="M34 20h4a4 4 0 010 10h-4M16 8v3M24 8v3"/></svg>',
    note:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 36V10l20-4v26"/><circle cx="13" cy="36" r="5"/><circle cx="33" cy="32" r="5"/></svg>',
    camera:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="14" width="36" height="26" rx="6"/><path d="M17 14l3-5h8l3 5"/><circle cx="24" cy="27" r="7"/></svg>',
    modelling:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="14" width="36" height="26" rx="6"/><path d="M17 14l3-5h8l3 5"/><circle cx="24" cy="27" r="7"/></svg>',
    brand:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6c10 0 18 7 18 16 0 6-5 8-9 8h-4a4 4 0 00-3 7c1 2 0 5-3 5C13 42 6 34 6 24S14 6 24 6z"/><circle cx="15" cy="22" r="2.5"/><circle cx="22" cy="14" r="2.5"/><circle cx="32" cy="16" r="2.5"/></svg>',
    research:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="21" cy="21" r="12"/><path d="M30 30l11 11M15 24l4-4 3 3 5-6"/></svg>',
  };

  // A curled-up sleeping cat — one of the few cat hints on the site.
  var SLEEPY_CAT =
    '<svg class="card__zzz" viewBox="0 0 64 44" aria-hidden="true"><path d="M8 36c0-12 9-20 22-20s22 8 22 18c0 4-3 6-7 6H14c-4 0-6-1-6-4z" fill="#fff"/><path d="M12 22l2-9 7 5zM34 17l5-7 3 8z" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M15 31q3 2 6 0" stroke="#33101f" stroke-width="1.6" fill="none" stroke-linecap="round"/><text x="46" y="12" font-size="10" fill="#33101f" font-family="serif" font-style="italic">z</text><text x="53" y="7" font-size="7" fill="#33101f" font-family="serif" font-style="italic">z</text></svg>';

  var CATEGORY_LABEL = { modelling: "Modelling", brand: "Past Works", research: "Future Research" };

  /** An image if `src` is given, otherwise a pink placeholder frame. */
  function media(src, tone, label, category, alt) {
    if (src) return '<img src="' + esc(src) + '" alt="' + esc(alt || label || "") + '" loading="lazy">';
    return (
      '<div class="ph tone-' + (tone || 1) + '" role="img" aria-label="' + esc("Placeholder: " + (label || "image")) + '">' +
      '<div class="ph__inner">' + (ICONS[category] || ICONS.brand) + "<span>" + esc(label || "Image coming soon") + "</span></div></div>"
    );
  }

  /* ---------- Interactive background: dots, glow, scroll gradient, paws ---------- */
  var dotsEl = document.querySelector("[data-dots]");
  var bg = null;
  var PAW =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="#8C0037"><ellipse cx="32" cy="42" rx="14" ry="12"/><circle cx="14" cy="26" r="7"/><circle cx="26" cy="14" r="7"/><circle cx="40" cy="14" r="7"/><circle cx="51" cy="26" r="7"/></g></svg>';

  if (dotsEl) {
    var canvas = document.createElement("canvas");
    dotsEl.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var COLORS = ["#f7c0d4", "#FFCD7C", "#f9d08a", "#f08db3", "#FFCD7C", "#f9d08a"];
    var W = 0, H = 0;
    var mouse = { x: -999, y: -999 };
    var dots = [];
    for (var i = 0; i < 20; i++) {
      dots.push({
        fx: Math.random(), fy: Math.random(),
        r: 14 + Math.random() * 26,
        c: COLORS[i % COLORS.length],
        ox: 0, oy: 0, vx: 0, vy: 0,
        ph: Math.random() * 6.28, sp: 0.15 + Math.random() * 0.25,
      });
    }
    var ripples = [];
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(function (d) {
        var bx = d.fx * W + Math.sin(t * 0.00009 * d.sp * 6 + d.ph) * 26;
        var by = d.fy * H + Math.cos(t * 0.00007 * d.sp * 6 + d.ph) * 30;
        if (!reduceMotion) {
          var dx = bx + d.ox - mouse.x, dy = by + d.oy - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 130) {
            var f = (130 - dist) / 130;
            d.vx += (dx / dist) * f * 0.7;
            d.vy += (dy / dist) * f * 0.7;
          }
          ripples.forEach(function (rp) {
            var rx = bx + d.ox - rp.x, ry = by + d.oy - rp.y;
            var rd = Math.sqrt(rx * rx + ry * ry) || 1;
            if (Math.abs(rd - rp.r) < 50) {
              d.vx += (rx / rd) * 0.9 * rp.a;
              d.vy += (ry / rd) * 0.9 * rp.a;
            }
          });
          d.vx += -d.ox * 0.008; d.vy += -d.oy * 0.008;
          d.vx *= 0.92; d.vy *= 0.92;
          d.ox += d.vx; d.oy += d.vy;
        }
        var px = bx + d.ox, py = by + d.oy;
        var gr = ctx.createRadialGradient(px, py, d.r * 0.15, px, py, d.r);
        gr.addColorStop(0, d.c);
        gr.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, 6.2832);
        ctx.fill();
      });
      ripples = ripples.filter(function (rp) {
        rp.r += 3; rp.a *= 0.965;
        ctx.globalAlpha = rp.a * 0.5;
        ctx.strokeStyle = "#E94584";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, 6.2832);
        ctx.stroke();
        return rp.a > 0.05;
      });
      if (bg) bg.ripples = ripples;
    }
    bg = { mouse: mouse, ripples: ripples };
    if (reduceMotion) {
      draw(0);
    } else {
      (function loop(t) { draw(t); requestAnimationFrame(loop); })(0);
    }
  }

  if (!reduceMotion) {
    // Cursor glow (desktop)
    if (finePointer) {
      var glow = document.createElement("div");
      glow.className = "glow";
      document.body.appendChild(glow);
      var gx = 0, gy = 0, gtx = 0, gty = 0;
      window.addEventListener("pointermove", function (e) {
        gtx = e.clientX; gty = e.clientY;
        glow.classList.add("is-on");
        if (bg) { bg.mouse.x = e.clientX; bg.mouse.y = e.clientY; }
      }, { passive: true });
      document.addEventListener("pointerleave", function () {
        glow.classList.remove("is-on");
        if (bg) { bg.mouse.x = -999; bg.mouse.y = -999; }
      });
      (function glowLoop() {
        gx += (gtx - gx) * 0.22; gy += (gty - gy) * 0.22;
        glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
        requestAnimationFrame(glowLoop);
      })();
    }

    // Click: ripple + a little paw print (not on links / bubbles)
    document.addEventListener("pointerdown", function (e) {
      if (bg) bg.ripples.push({ x: e.clientX, y: e.clientY, r: 10, a: 1 });
      if (e.target.closest && e.target.closest("a, button, .bubble, input")) return;
      var p = document.createElement("span");
      p.className = "paw";
      p.style.left = e.clientX + "px";
      p.style.top = e.clientY + "px";
      p.style.setProperty("--r", (Math.random() * 50 - 25).toFixed(0) + "deg");
      p.innerHTML = PAW;
      document.body.appendChild(p);
      setTimeout(function () { p.remove(); }, 1700);
    });

    // Scroll gradient: cream, pale pink, butter yellow, mint, pink
    var STOPS = [[255, 250, 218], [255, 244, 214], [255, 247, 226], [255, 238, 224], [255, 250, 218]];
    var paintBg = function () {
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var p = Math.min(1, Math.max(0, window.scrollY / max)) * (STOPS.length - 1);
      var i = Math.min(STOPS.length - 2, Math.floor(p)), f = p - i;
      var c = STOPS[i].map(function (v, k) { return Math.round(v + (STOPS[i + 1][k] - v) * f); });
      document.body.style.backgroundColor = "rgb(" + c.join(",") + ")";
    };
    window.addEventListener("scroll", paintBg, { passive: true });
    window.addEventListener("resize", paintBg);
    paintBg();
  }

  /* ---------- Home: hero portrait, intro, card fan ---------- */
  var heroPortrait = document.querySelector(".hero__portrait");
  if (heroPortrait) {
    heroPortrait.innerHTML = media(SITE.profile.portrait, 3, "Your photo here", "modelling", SITE.profile.name);
  }

  var introEl = document.querySelector("[data-intro]");
  if (introEl) {
    var phrase = "turns ideas into action";
    var words = SITE.profile.intro.split(" ").map(function (w) {
      return '<span class="w">' + esc(w) + "</span>";
    });
    var phraseHTML = phrase.split(" ").map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    introEl.innerHTML = words.join(" ").replace(phraseHTML, "<em>" + phraseHTML + "</em>");
  }

  var stampsEl = document.querySelector("[data-stamps]");
  if (stampsEl) {
    // Rough "ink" look shared by every stamp
    var defs = document.createElement("div");
    defs.setAttribute("aria-hidden", "true");
    defs.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    defs.innerHTML =
      '<svg width="0" height="0"><filter id="inked" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter></svg>';
    document.body.appendChild(defs);

    var ring = function (d, w) { return ' fill="none" stroke="currentColor" stroke-width="' + w + '" ' + d; };
    var ico = ' fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
    var STAMPS = [
      {
        go: "modelling", main: "Modelling", sub: "ENTRY ONE", script: "shoots", y: 112,
        shape: '<circle cx="100" cy="100" r="92"' + ring("", 4) + '/><circle cx="100" cy="100" r="82"' + ring("", 1.4) + '/><circle cx="100" cy="100" r="62"' + ring('stroke-dasharray="2 5"', 1.4) + "/>",
        icon: "<g" + ico + '><rect x="78" y="58" width="44" height="30" rx="7"/><circle cx="100" cy="73" r="8"/><path d="M90 58l3-6h14l3 6"/></g>',
      },
      {
        go: "brand", main: "Past Works", sub: "ENTRY TWO", script: "brands", y: 116,
        shape: '<polygon points="100,10 178,55 178,145 100,190 22,145 22,55"' + ring('stroke-linejoin="round"', 4) + '/><polygon points="100,22 168,61 168,139 100,178 32,139 32,61"' + ring('stroke-linejoin="round"', 1.4) + "/>",
        icon: "<g" + ico + '><path d="M100 50c14 0 24 9 24 21 0 8-6 10-12 10h-5a5 5 0 00-4 8c1 3 0 6-4 6-14 0-23-11-23-24s8-21 24-21z"/></g>',
      },
      {
        go: "research", main: "Research", sub: "COMING SOON", script: "", y: 122,
        shape: '<polygon points="100,12 186,166 14,166"' + ring('stroke-linejoin="round"', 4) + '/><polygon points="100,34 166,153 34,153"' + ring('stroke-linejoin="round"', 1.4) + "/>",
        icon: "<g" + ico + '><circle cx="96" cy="84" r="12"/><path d="M105 93l11 11"/></g>',
      },
      {
        href: "about.html", main: "About Me", sub: "ENTRY FOUR", script: "hello!", y: 112,
        shape: '<rect x="12" y="38" width="176" height="124" rx="16"' + ring("", 4) + '/><rect x="22" y="48" width="156" height="104" rx="10"' + ring('stroke-dasharray="3 5"', 1.4) + "/>",
        icon: "<g" + ico + '><circle cx="100" cy="62" r="9"/><path d="M82 88c2-12 34-12 36 0"/></g>',
      },
    ];
    stampsEl.innerHTML = STAMPS.map(function (s) {
      var href = s.href || "index.html?cat=" + s.go + "#work";
      return (
        '<a class="stamp" href="' + href + '"' + (s.go ? ' data-go="' + s.go + '"' : "") + ' aria-label="' + s.main + '">' +
        '<svg viewBox="0 0 200 200" aria-hidden="true">' + s.shape + s.icon +
        '<text class="st-main" x="100" y="' + s.y + '" text-anchor="middle">' + s.main + "</text>" +
        (s.script ? '<text class="st-script" x="100" y="' + (s.y + 27) + '" text-anchor="middle">' + s.script + "</text>" : "") +
        '<text class="st-sub" x="100" y="' + (s.y + (s.script ? 43 : 22)) + '" text-anchor="middle">' + s.sub + "</text></svg></a>"
      );
    }).join("");
  }

  /* ---------- Home: work grid (one collection at a time) ---------- */
  var grid = document.querySelector("[data-grid]");
  var filterBar = document.querySelector("[data-filters]");
  var countEl = document.querySelector("[data-count]");

  function cardHTML(p) {
    var soon = p.status === "coming-soon";
    return (
      '<article class="card" data-category="' + esc(p.category) + '">' +
      '<a href="project.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="card__media">' +
      '<span class="card__badge' + (soon ? " soon" : "") + '">' + (soon ? "Coming soon" : esc(CATEGORY_LABEL[p.category])) + "</span>" +
      media(p.cover, p.tone, p.title, p.category) +
      (soon ? SLEEPY_CAT : '<span class="card__arrow" aria-hidden="true">→</span>') +
      "</div>" +
      '<div class="card__meta"><h3 class="card__title">' + esc(p.title) + '</h3><span class="card__year">' + esc(p.year) + "</span></div>" +
      '<p class="card__sub">' + esc(p.summary) + "</p>" +
      "</a></article>"
    );
  }

  var currentFilter = null;
  function setFilter(id) {
    if (!grid || id === currentFilter) return;
    var first = currentFilter === null;
    currentFilter = id;
    Array.prototype.forEach.call(filterBar.querySelectorAll(".chip"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === id));
    });
    var shown = 0;
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (c) {
      var show = c.getAttribute("data-category") === id;
      c.classList.toggle("is-hidden", !show);
      if (show) shown++;
      // A filter change takes over the entrance: drop any pending scroll reveal.
      if (c._reveal) {
        if (c._reveal.scrollTrigger) c._reveal.scrollTrigger.kill();
        c._reveal.kill();
        c._reveal = null;
      }
      if (hasGSAP) window.gsap.set(c, { clearProps: "opacity,transform" });
      if (show && !first && !reduceMotion) c.classList.add("is-entering");
    });
        void grid.offsetWidth; // flush so the entering state is painted before it transitions out
    Array.prototype.forEach.call(grid.querySelectorAll(".card.is-entering"), function (c, i) {
      setTimeout(function () { c.classList.remove("is-entering"); }, 20 + i * 80);
    });
    if (hasGSAP) window.ScrollTrigger.refresh();
  }

  if (grid) {
    grid.innerHTML = SITE.projects.map(cardHTML).join("");
    filterBar.innerHTML = SITE.categories
      .map(function (c) {
        return '<button class="chip" type="button" data-filter="' + c.id + '" aria-pressed="false">' + esc(c.label) + "</button>";
      })
      .join("");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (btn) setFilter(btn.getAttribute("data-filter"));
    });
    var wanted = new URLSearchParams(window.location.search).get("cat");
    var valid = SITE.categories.some(function (c) { return c.id === wanted; });
    setFilter(valid ? wanted : SITE.categories[0].id);
  }

   /* ---------- Messages: brush the cursor across them and they swish away, then drift back ---------- */
  var wall = document.querySelector("[data-wall]");
  if (wall) {
    var POS = [[3, 4, -5], [34, 1, 3], [62, 6, -4], [10, 34, 4], [46, 30, -3], [68, 40, 5], [4, 64, -4], [36, 62, 3], [62, 72, -3]];
    var msgs = SITE.highlights.map(function (h, i) {
      var p = POS[i % POS.length];
      var el = document.createElement("div");
      el.className = "msg" + (i % 3 === 1 ? " msg--alt" : "");
      el.style.left = p[0] + "%";
      el.style.top = p[1] + "%";
      el.style.zIndex = String(i + 1);
      el.innerHTML = "<b>" + esc(h.short) + "</b><span>" + esc(h.detail) + "</span>";
      wall.appendChild(el);
      return { el: el, x: 0, y: 0, vx: 0, vy: 0, rot: p[2], rv: 0, base: p[2] };
    });

    var ptr = { x: -999, y: -999, vx: 0, vy: 0, t: 0, on: false };
    function wallPoint(e) {
      var r = wall.getBoundingClientRect();
      var nx = e.clientX - r.left, ny = e.clientY - r.top;
      var dt = Math.max(1, e.timeStamp - ptr.t);
      ptr.vx = ptr.on ? (nx - ptr.x) / dt : 0;
      ptr.vy = ptr.on ? (ny - ptr.y) / dt : 0;
      ptr.x = nx; ptr.y = ny; ptr.t = e.timeStamp; ptr.on = true;
    }
    wall.addEventListener("pointermove", wallPoint);
    wall.addEventListener("pointerdown", wallPoint);
    wall.addEventListener("pointerleave", function () { ptr.on = false; ptr.vx = ptr.vy = 0; });

    var wallVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { wallVisible = en[0].isIntersecting; }, { threshold: 0 }).observe(wall);
    }

    function wallStep() {
      var speed = Math.sqrt(ptr.vx * ptr.vx + ptr.vy * ptr.vy);
      msgs.forEach(function (m) {
        var w = m.el.offsetWidth, h = m.el.offsetHeight;
        var cx = m.el.offsetLeft + w / 2 + m.x, cy = m.el.offsetTop + h / 2 + m.y;
        if (ptr.on && !reduceMotion) {
          var dx = cx - ptr.x, dy = cy - ptr.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
          var reach = Math.max(w, h) * 0.55;
          if (d < reach) {
            var f = (1 - d / reach) * Math.min(1.6, 0.35 + speed * 1.4);
            m.vx += (dx / d) * f * 2.4 + ptr.vx * 4.5 * f;
            m.vy += (dy / d) * f * 2.4 + ptr.vy * 4.5 * f;
            m.rv += ptr.vx * 0.9 * f;
          }
        }
        // slow spring back to where it started
        m.vx += -m.x * 0.006; m.vy += -m.y * 0.006; m.rv += (m.base - m.rot) * 0.01;
        m.vx *= 0.93; m.vy *= 0.93; m.rv *= 0.9;
        m.x += m.vx; m.y += m.vy; m.rot += m.rv;
        m.el.style.transform = "translate3d(" + m.x.toFixed(1) + "px," + m.y.toFixed(1) + "px,0) rotate(" + m.rot.toFixed(2) + "deg)";
      });
    }
    msgs.forEach(function (m) { m.el.style.transform = "rotate(" + m.rot + "deg)"; });
    if (!reduceMotion) {
      (function wloop() { if (wallVisible) wallStep(); requestAnimationFrame(wloop); })();
    }
  }

  /* ---------- Digital camera: scroll to roll the photos and captions up ---------- */
  var camEl = document.querySelector("[data-cam]");
  if (camEl) {
    var slides = SITE.camera;
    var reel = camEl.querySelector("[data-cam-reel]");
    var texts = camEl.querySelector("[data-cam-texts]");
    reel.innerHTML = slides
      .map(function (s, i) {
        return '<div class="cam__frame">' + media(s.src, s.tone, s.label || s.title, s.icon, s.title) + "</div>";
      })
      .join("");
    texts.innerHTML = slides
      .map(function (s) {
        return '<div class="cam__slide"><h3>' + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></div>";
      })
      .join("");
    camEl.style.setProperty("--n", String(slides.length));
    camEl.__slides = slides.length;
  }

  /* ---------- Scrapbook ending: photobooth strip, postcard, ticket ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-scrap]"), function (box) {
    var pr = SITE.profile;
    var booth = pr.photobooth || [];
    var frames = [0, 1, 2, 3].map(function (i) {
      return '<div class="booth__frame">' + media(booth[i], [1, 2, 4, 6][i], "Photobooth", "modelling", "Photobooth photo " + (i + 1)) + "</div>";
    }).join("");
    box.innerHTML =
      '<div class="scrap__booth" data-scrap-item>' + frames + '<span class="tape tape--a"></span></div>' +
      '<div class="scrap__postcard" data-scrap-item><div class="postcard__img">' + media(pr.postcard, 6, "Your postcard here", "brand", "Postcard") + '</div><span class="tape tape--b"></span><span class="tape tape--c"></span></div>' +
      '<div class="ticket" data-scrap-item>' +
      '<div class="ticket__main"><span class="ticket__kicker">Admit one · Collaboration</span>' +
      '<p class="ticket__name">' + esc(pr.name) + "</p>" +
      '<p class="ticket__role">Model · Creative · Brand &amp; Research</p>' +
      '<p class="ticket__place">' + esc(pr.location) + "</p></div>" +
      '<div class="ticket__stub"><span class="ticket__kicker">Say hello</span><a class="contact__mail" data-email href="#"></a><ul class="socials" data-socials></ul></div></div>';
  });

  /* ---------- Contact links ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-email]"), function (a) {
    a.href = "mailto:" + SITE.profile.email;
    if (!a.textContent.trim()) a.textContent = SITE.profile.email;
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-socials]"), function (ul) {
    ul.innerHTML = (SITE.profile.socials || [])
      .filter(function (s) { return s.url && s.url !== "#"; })
      .map(function (s) { return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a></li>"; })
      .join("");
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Page-specific renderer (project.html / about.html) ---------- */
  if (typeof window.renderPage === "function") {
    window.renderPage({ esc: esc, media: media, CATEGORY_LABEL: CATEGORY_LABEL });
  }

  /* ---------- Nav state ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Motion: Lenis + GSAP ---------- */
  var lenis = null;

  // In-page navigation to a collection (nav pills + cards). On other pages the href does it.
  function scrollToEl(el) {
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a) return;
    var go = a.getAttribute("data-go");
    if (go && grid) {
      e.preventDefault();
      setFilter(go);
      history.replaceState(null, "", "?cat=" + go + "#work");
      scrollToEl(document.getElementById("work"));
      return;
    }
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#" && href.length > 1) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        scrollToEl(target);
      }
    }
  });

  if (reduceMotion || !hasGSAP) {
    html.classList.remove("js-motion");
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  window.__motionReady = true;

  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.7, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Landing: everything eases in together, top to bottom
  gsap.from(".nav", { y: -16, opacity: 0, duration: 0.9, ease: "power3.out" });
  var heroLines = document.querySelectorAll(".hero__title .line > span, .page-title .line > span");
  if (heroLines.length) {
    gsap.from(heroLines, { yPercent: 105, duration: 1.6, ease: "power4.out", stagger: 0.16, delay: 0.25 });
  }
  gsap.from(".hero .eyebrow, .hero__sub, .hero__cta, .lede, .proj-meta", { y: 16, opacity: 0, duration: 1.3, ease: "power3.out", stagger: 0.12, delay: 0.7 });
  gsap.from(".hero__portrait", { scale: 0.92, opacity: 0, duration: 1.3, ease: "power3.out", delay: 0.1 });

  // Passport stamps: thud in one by one
  var stampEls = document.querySelectorAll(".stamp");
  if (stampEls.length) {
    gsap.from(stampEls, {
      y: 24,
      scale: 0.9,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      stagger: 0.18,
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: ".stamps", start: "top 80%", once: true },
    });
  }

  // Intro: words brighten as you scroll
  var introWords = document.querySelectorAll(".intro__text .w");
  if (introWords.length) {
    gsap.fromTo(
      introWords,
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: { trigger: ".intro", start: "top 80%", end: "bottom 55%", scrub: true },
      }
    );
  }

  // Generic reveals
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  // Cards: soft staggered entrance
  if (grid) {
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (card, i) {
      card._reveal = gsap.fromTo(
        card,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          delay: (i % 3) * 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: card, start: "top 94%", once: true },
        }
      );
    });
  }

  // Digital camera: scroll rolls the photos up through the screen and lifts the captions
  var camSec = document.querySelector("[data-cam]");
  if (camSec && camSec.__slides) {
    var camN = camSec.__slides;
    var camReel = camSec.querySelector("[data-cam-reel]");
    var camSlides = camSec.querySelectorAll(".cam__slide");
    var smooth = function (x) { return x * x * (3 - 2 * x); };
    ScrollTrigger.create({
      trigger: camSec,
      start: "top top",
      end: "bottom bottom",
      onUpdate: function (self) {
        var p = self.progress * (camN - 1);
        var idx = Math.min(camN - 2, Math.floor(p));
        var f = p - idx;
        var pe = idx + smooth(Math.min(1, Math.max(0, (f - 0.22) / 0.56)));
        if (self.progress >= 1) pe = camN - 1;
        gsap.set(camReel, { yPercent: -(100 / camN) * pe });
        Array.prototype.forEach.call(camSlides, function (el, i) {
          var d = Math.abs(pe - i);
          gsap.set(el, { opacity: Math.max(0, 1 - d * 1.8), y: (i - pe) * 70 });
        });
      },
    });
    gsap.set(camSlides, { opacity: 0, y: 70 });
    gsap.set(camSlides[0], { opacity: 1, y: 0 });
  }

  // Gentle parallax inside image frames
  gsap.utils.toArray(".proj-hero").forEach(function (frame) {
    var inner = frame.querySelector(".ph, img");
    if (!inner) return;
    gsap.fromTo(inner, { yPercent: -4 }, {
      yPercent: 4,
      ease: "none",
      scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
