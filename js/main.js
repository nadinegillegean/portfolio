/*
  Shared site behaviour: rendering from data.js, smooth scroll (Lenis),
  scroll reveals (GSAP + ScrollTrigger), folder tabs, reel videos, TikTok embeds,
  digital-camera scroll, achievements wall, scrapbook ending and contact links.
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

  var SVG = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">';
  var ICONS = {
    plane: SVG + '<path d="M6 28l36-14-8 22-10-8-8 6 2-10z"/></svg>',
    cat: SVG + '<path d="M8 20L10 6l9 7h10l9-7 2 14c0 12-8 20-16 20S8 32 8 20z"/><circle cx="18" cy="24" r="1.6"/><circle cx="30" cy="24" r="1.6"/><path d="M22 30q2 2 4 0"/></svg>',
    note: SVG + '<path d="M18 36V10l20-4v26"/><circle cx="13" cy="36" r="5"/><circle cx="33" cy="32" r="5"/></svg>',
    camera: SVG + '<rect x="6" y="14" width="36" height="26" rx="6"/><path d="M17 14l3-5h8l3 5"/><circle cx="24" cy="27" r="7"/></svg>',
    modelling: SVG + '<rect x="6" y="14" width="36" height="26" rx="6"/><path d="M17 14l3-5h8l3 5"/><circle cx="24" cy="27" r="7"/></svg>',
    brand: SVG + '<path d="M24 6c10 0 18 7 18 16 0 6-5 8-9 8h-4a4 4 0 00-3 7c1 2 0 5-3 5C13 42 6 34 6 24S14 6 24 6z"/><circle cx="15" cy="22" r="2.5"/><circle cx="22" cy="14" r="2.5"/><circle cx="32" cy="16" r="2.5"/></svg>',
    research: SVG + '<circle cx="21" cy="21" r="12"/><path d="M30 30l11 11M15 24l4-4 3 3 5-6"/></svg>',
    video: SVG + '<rect x="6" y="12" width="26" height="24" rx="5"/><path d="M32 22l10-6v16l-10-6z"/></svg>',
  };

  // A small sleeping cat: one of the few quiet cat hints on the site.
  var SLEEPY_CAT =
    '<svg class="card__zzz" viewBox="0 0 64 44" aria-hidden="true"><path d="M8 36c0-12 9-20 22-20s22 8 22 18c0 4-3 6-7 6H14c-4 0-6-1-6-4z" fill="#fff"/><path d="M12 22l2-9 7 5zM34 17l5-7 3 8z" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M15 31q3 2 6 0" stroke="#1c2540" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>';

  var CATEGORY_LABEL = { modelling: "Modelling", brand: "Past Projects", research: "Case Studies" };

  /** An image if `src` is given, otherwise a neutral placeholder frame. */
  function media(src, tone, label, category, alt) {
    if (src) return '<img src="' + esc(src) + '" alt="' + esc(alt || label || "") + '" loading="lazy">';
    return (
      '<div class="ph tone-' + (tone || 1) + '" role="img" aria-label="' + esc("Placeholder: " + (label || "image")) + '">' +
      '<div class="ph__inner">' + (ICONS[category] || ICONS.brand) + "<span>" + esc(label || "Image coming soon") + "</span></div></div>"
    );
  }

  /* ---------- Home: hero portrait, credential, intro, trusted strip ---------- */
  var heroMedia = document.querySelector(".hero__media");
  if (heroMedia) heroMedia.innerHTML = media(SITE.profile.portrait, 3, "Portrait", "modelling", SITE.profile.name);

  var cred = document.querySelector("[data-credential]");
  if (cred && SITE.profile.credential) cred.textContent = SITE.profile.credential;

  /* ---------- Hero: soft drifting dots and an aura that follows the cursor ---------- */
  var heroSec = document.querySelector(".hero");
  if (heroSec && !reduceMotion) {
    var hcv = document.createElement("canvas");
    hcv.className = "hero__bg";
    heroSec.insertBefore(hcv, heroSec.firstChild);
    var hctx = hcv.getContext("2d");
    var aura = null;
    if (finePointer) {
      aura = document.createElement("div");
      aura.className = "hero__aura";
      heroSec.insertBefore(aura, heroSec.firstChild);
    }
    var HC = ["#718bbc", "#eac4d5", "#a3bccf", "#eac4d5", "#c8d7e3", "#718bbc"];
    var hd = [];
    for (var hi = 0; hi < 18; hi++) {
      hd.push({ fx: Math.random(), fy: Math.random(), r: 16 + Math.random() * 30, c: HC[hi % HC.length], ox: 0, oy: 0, vx: 0, vy: 0, ph: Math.random() * 6.28, sp: 0.2 + Math.random() * 0.3 });
    }
    var hW = 0, hH = 0, hm = { x: -999, y: -999, on: false };
    var hsize = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      hW = heroSec.clientWidth; hH = heroSec.clientHeight;
      hcv.width = hW * dpr; hcv.height = hH * dpr;
      hctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    hsize();
    window.addEventListener("resize", hsize);
    heroSec.addEventListener("pointermove", function (e) {
      var r = heroSec.getBoundingClientRect();
      hm.x = e.clientX - r.left; hm.y = e.clientY - r.top; hm.on = true;
      if (aura) aura.classList.add("is-on");
    }, { passive: true });
    heroSec.addEventListener("pointerleave", function () { hm.on = false; hm.x = hm.y = -999; if (aura) aura.classList.remove("is-on"); });
    var ax = 0, ay = 0, heroVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }, { threshold: 0 }).observe(heroSec);
    }
    (function hloop(t) {
      if (heroVisible) {
        hctx.clearRect(0, 0, hW, hH);
        hd.forEach(function (d) {
          var bx = d.fx * hW + Math.sin(t * 0.00009 * d.sp * 6 + d.ph) * 26;
          var by = d.fy * hH + Math.cos(t * 0.00007 * d.sp * 6 + d.ph) * 30;
          if (hm.on) {
            var dx = bx + d.ox - hm.x, dy = by + d.oy - hm.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 150) { var f = (150 - dist) / 150; d.vx += (dx / dist) * f * 0.7; d.vy += (dy / dist) * f * 0.7; }
          }
          d.vx += -d.ox * 0.008; d.vy += -d.oy * 0.008; d.vx *= 0.92; d.vy *= 0.92; d.ox += d.vx; d.oy += d.vy;
          var px = bx + d.ox, py = by + d.oy;
          var gr = hctx.createRadialGradient(px, py, d.r * 0.15, px, py, d.r);
          gr.addColorStop(0, d.c); gr.addColorStop(1, "rgba(255,255,255,0)");
          hctx.globalAlpha = 0.5; hctx.fillStyle = gr; hctx.beginPath(); hctx.arc(px, py, d.r, 0, 6.2832); hctx.fill();
        });
        if (aura) {
          ax += (hm.x - ax) * 0.18; ay += (hm.y - ay) * 0.18;
          aura.style.transform = "translate3d(" + ax + "px," + ay + "px,0)";
        }
      }
      requestAnimationFrame(hloop);
    })(0);
  }

  var introEl = document.querySelector("[data-intro]");
  if (introEl) {
    var phrase = "turns ideas into action";
    var words = SITE.profile.intro.split(" ").map(function (w) { return '<span class="w">' + esc(w) + "</span>"; });
    var phraseHTML = phrase.split(" ").map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    introEl.innerHTML = words.join(" ").replace(phraseHTML, "<em>" + phraseHTML + "</em>");
  }


  /* ---------- Home: experience list with a floating preview ---------- */
  var expEl = document.querySelector("[data-exp]");
  if (expEl) {
    expEl.innerHTML = SITE.orgs
      .map(function (o, i) {
        return (
          '<li data-reveal><a class="exp__row" href="org.html?id=' + encodeURIComponent(o.id) + '" data-i="' + i + '">' +
          '<span class="exp__name">' + esc(o.name) + "</span>" +
          '<span class="exp__role">' + esc(o.role) + "</span>" +
          '<span class="exp__years">' + esc(o.years) + "</span>" +
          '<span class="exp__arrow" aria-hidden="true">→</span></a></li>'
        );
      })
      .join("");

    var prev = document.querySelector("[data-exp-preview]");
    if (prev && finePointer && !reduceMotion) {
      var px = 0, py = 0, ptx = 0, pty = 0, pOn = false, pLoop = false;
      var showPreview = function (o) {
        prev.innerHTML = media(o.cover, o.tone, o.name, o.icon, o.name);
        prev.classList.add("is-on");
        pOn = true;
        if (!pLoop) {
          pLoop = true;
          (function loop() {
            px += (ptx - px) * 0.16; py += (pty - py) * 0.16;
            prev.style.transform = "translate3d(" + (px + 26) + "px," + (py - 140) + "px,0) rotate(" + ((ptx - px) * 0.04).toFixed(2) + "deg)";
            requestAnimationFrame(loop);
          })();
        }
      };
      expEl.addEventListener("pointermove", function (e) {
        ptx = e.clientX; pty = e.clientY;
        var row = e.target.closest(".exp__row");
        if (row) {
          var rowOrg = SITE.orgs[Number(row.getAttribute("data-i"))];
          if (!rowOrg.cover) { prev.classList.remove("is-on"); prev.removeAttribute("data-i"); pOn = false; return; }
          if (!pOn) { px = ptx; py = pty; }
          if (prev.getAttribute("data-i") !== row.getAttribute("data-i")) {
            prev.setAttribute("data-i", row.getAttribute("data-i"));
            showPreview(SITE.orgs[Number(row.getAttribute("data-i"))]);
          } else prev.classList.add("is-on");
        }
      });
      expEl.addEventListener("pointerleave", function () { prev.classList.remove("is-on"); pOn = false; prev.removeAttribute("data-i"); });
    }
  }

  /* ---------- Home: work, folder tabs ---------- */
  var grid = document.querySelector("[data-grid]");
  var tabsEl = document.querySelector("[data-tabs]");
  var folderTitle = document.querySelector("[data-folder-title]");
  var folderDesc = document.querySelector("[data-folder-desc]");

  function cardHTML(p) {
    if (p.empty) {
      return '<article class="card card--empty" data-category="' + esc(p.category) + '"><div class="card__media"><span>' + esc(p.title) + "</span></div></article>";
    }
    var soon = p.status === "coming-soon";
    return (
      '<article class="card" data-category="' + esc(p.category) + '">' +
      '<a href="project.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="card__media">' +
      '<span class="card__badge' + (soon ? " soon" : "") + '">' + (soon ? (p.category === "research" ? "In progress" : "Coming soon") : esc(CATEGORY_LABEL[p.category])) + "</span>" +
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
    var cat = SITE.categories.filter(function (c) { return c.id === id; })[0];
    Array.prototype.forEach.call(tabsEl.querySelectorAll(".tab"), function (b) {
      b.setAttribute("aria-selected", String(b.getAttribute("data-filter") === id));
    });
    if (folderTitle && cat) folderTitle.innerHTML = esc(cat.label) + "<span>.</span>";
    if (folderDesc && cat) folderDesc.textContent = cat.desc || "";
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (c) {
      var show = c.getAttribute("data-category") === id;
      c.classList.toggle("is-hidden", !show);
      if (c._reveal) {
        if (c._reveal.scrollTrigger) c._reveal.scrollTrigger.kill();
        c._reveal.kill();
        c._reveal = null;
      }
      if (hasGSAP) window.gsap.set(c, { clearProps: "opacity,transform" });
      if (show && !first && !reduceMotion) c.classList.add("is-entering");
    });
    void grid.offsetWidth;
    Array.prototype.forEach.call(grid.querySelectorAll(".card.is-entering"), function (c, i) {
      setTimeout(function () { c.classList.remove("is-entering"); }, 30 + i * 90);
    });
    if (hasGSAP) window.ScrollTrigger.refresh();
  }

  if (grid && tabsEl) {
    grid.innerHTML = SITE.projects.map(cardHTML).join("");
    tabsEl.innerHTML = SITE.categories
      .map(function (c) { return '<button class="tab" type="button" role="tab" data-filter="' + c.id + '" aria-selected="false">' + esc(c.label) + "</button>"; })
      .join("");
    tabsEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (btn) setFilter(btn.getAttribute("data-filter"));
    });
    var wanted = new URLSearchParams(window.location.search).get("cat");
    var valid = SITE.categories.some(function (c) { return c.id === wanted; });
    setFilter(valid ? wanted : SITE.categories[0].id);
  }

  /* ---------- Reel: phone-frame videos + TikTok ---------- */
  var videosEl = document.querySelector("[data-videos]");
  if (videosEl) {
    videosEl.innerHTML = SITE.videos
      .map(function (v) {
        var inner;
        if (v.src) {
          inner =
            '<video src="' + esc(v.src) + '"' + (v.poster ? ' poster="' + esc(v.poster) + '"' : "") + ' muted loop playsinline preload="metadata"></video>' +
            '<button class="phone__sound" type="button" aria-label="Toggle sound">♪</button>';
        } else {
          inner = media("", 4, v.title, "video", v.title);
        }
        return (
          '<div class="phone" data-reveal><div class="phone__screen">' + inner +
          '<div class="phone__label">' + esc(v.title) + (v.note ? "<small>" + esc(v.note) + "</small>" : "") + "</div></div></div>"
        );
      })
      .join("");

    var vids = videosEl.querySelectorAll("video");
    if ("IntersectionObserver" in window && vids.length) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting && !reduceMotion) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else v.pause();
        });
      }, { threshold: 0.5 });
      Array.prototype.forEach.call(vids, function (v) { vio.observe(v); });
    }
    Array.prototype.forEach.call(videosEl.querySelectorAll(".phone__sound"), function (btn) {
      btn.addEventListener("click", function () {
        var v = btn.closest(".phone__screen").querySelector("video");
        v.muted = !v.muted;
        btn.textContent = v.muted ? "♪" : "♫";
        btn.style.background = v.muted ? "" : "#4a6397";
        btn.style.color = v.muted ? "" : "#fff";
        if (reduceMotion) v.play();
      });
    });
  }

  var tiktokEl = document.querySelector("[data-tiktok]");
  var ttProfile = (SITE.profile.socials.filter(function (s) { return s.label === "TikTok"; })[0] || {}).url || "#";
  Array.prototype.forEach.call(document.querySelectorAll("[data-tiktok-link]"), function (a) { a.href = ttProfile; });
  if (tiktokEl) {
    var ttScript = false;
    tiktokEl.innerHTML = SITE.tiktok
      .map(function (url, i) {
        var id = (String(url).match(/video\/(\d+)/) || [])[1];
        var ready = !!id;
        return (
          '<div class="phone" data-reveal><div class="phone__screen" data-tt="' + (ready ? esc(url) : "") + '" data-ttid="' + (id || "") + '">' +
          media("", [2, 6, 1, 4][i % 4], "TikTok video", "video", "TikTok video") +
          (ready
            ? '<button class="phone__play" type="button" aria-label="Load TikTok video"><span>▶</span></button>'
            : '<a class="phone__play" href="' + esc(ttProfile) + '" target="_blank" rel="noopener" aria-label="Open TikTok"><span>▶</span></a>') +
          '<div class="phone__label">TikTok<small>' + (ready ? "Tap to play" : "Add a video link in data.js") + "</small></div></div></div>"
        );
      })
      .join("");
    tiktokEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button.phone__play");
      if (!btn) return;
      var screen = btn.closest(".phone__screen");
      var url = screen.getAttribute("data-tt"), id = screen.getAttribute("data-ttid");
      var box = document.createElement("div");
      box.className = "phone__embed";
      box.innerHTML = '<blockquote class="tiktok-embed" cite="' + esc(url) + '" data-video-id="' + esc(id) + '" style="max-width:605px;min-width:325px;"><section></section></blockquote>';
      screen.appendChild(box);
      if (!ttScript) {
        ttScript = true;
        var s = document.createElement("script");
        s.async = true; s.src = "https://www.tiktok.com/embed.js";
        document.body.appendChild(s);
      } else if (window.tiktokEmbed && window.tiktokEmbed.lib) {
        window.tiktokEmbed.lib.render(box);
      }
    });
  }

  /* ---------- Achievements: brush the cursor across a message and it fades away, then fades back in ---------- */
  var wall = document.querySelector("[data-wall]");
  if (wall) {
    var POS = [[3, 5, -4], [33, 3, 3], [64, 6, -3], [8, 36, -4], [60, 36, 3], [3, 66, -3], [32, 68, 3], [62, 64, -3]];
    var msgs = SITE.highlights.map(function (h, i) {
      var p = POS[i % POS.length];
      var el = document.createElement("div");
      el.className = "msg" + (i % 3 === 1 ? " msg--alt" : i % 3 === 2 ? " msg--blue" : "");
      el.style.left = p[0] + "%";
      el.style.top = p[1] + "%";
      el.style.zIndex = String(i + 1);
      el.innerHTML = "<b>" + esc(h.short) + "</b><span>" + esc(h.detail) + "</span>";
      wall.appendChild(el);
      el.style.transform = "rotate(" + p[2] + "deg)";
      return { el: el, x: 0, y: 0, vx: 0, vy: 0, rot: p[2], rv: 0, base: p[2], state: "idle", t: 0 };
    });

    var ptr = { x: -999, y: -999, vx: 0, vy: 0, t: 0, on: false };
    var wallPoint = function (e) {
      var r = wall.getBoundingClientRect();
      var nx = e.clientX - r.left, ny = e.clientY - r.top;
      var dt = Math.max(1, e.timeStamp - ptr.t);
      ptr.vx = ptr.on ? (nx - ptr.x) / dt : 0;
      ptr.vy = ptr.on ? (ny - ptr.y) / dt : 0;
      ptr.x = nx; ptr.y = ny; ptr.t = e.timeStamp; ptr.on = true;
    };
    wall.addEventListener("pointermove", wallPoint);
    wall.addEventListener("pointerdown", wallPoint);
    wall.addEventListener("pointerleave", function () { ptr.on = false; ptr.vx = ptr.vy = 0; });

    var wallVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { wallVisible = en[0].isIntersecting; }, { threshold: 0 }).observe(wall);
    }
    var paintMsg = function (m) {
      m.el.style.transform = "translate3d(" + m.x.toFixed(1) + "px," + m.y.toFixed(1) + "px,0) rotate(" + m.rot.toFixed(2) + "deg)";
    };
    var wallStep = function (now) {
      var speed = Math.sqrt(ptr.vx * ptr.vx + ptr.vy * ptr.vy);
      msgs.forEach(function (m) {
        if (m.state === "idle") {
          if (ptr.on) {
            var w = m.el.offsetWidth, h = m.el.offsetHeight;
            var cx = m.el.offsetLeft + w / 2 + m.x, cy = m.el.offsetTop + h / 2 + m.y;
            var dx = cx - ptr.x, dy = cy - ptr.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
            if (d < Math.max(w, h) * 0.5 && speed > 0.12) {
              m.state = "out"; m.t = now;
              m.vx = (dx / d) * 1.2 + ptr.vx * 2.4;
              m.vy = (dy / d) * 1.2 + ptr.vy * 2.4;
              m.rv = ptr.vx * 1.4;
              m.el.classList.add("is-out");
            }
          }
        } else if (m.state === "out") {
          m.x += m.vx; m.y += m.vy; m.rot += m.rv;
          m.vx *= 0.94; m.vy *= 0.94; m.rv *= 0.94;
          paintMsg(m);
          if (now - m.t > 3200) {
            // back in its spot, invisible, then fade in
            m.x = 0; m.y = 0; m.vx = m.vy = m.rv = 0; m.rot = m.base;
            paintMsg(m);
            m.state = "back"; m.t = now;
            m.el.classList.remove("is-out");
          }
        } else if (m.state === "back" && now - m.t > 1000) {
          m.state = "idle";
        }
      });
    };
    if (reduceMotion) {
      msgs.forEach(function (m) { m.el.style.transition = "none"; });
    } else {
      (function wloop(t) { if (wallVisible) wallStep(t); requestAnimationFrame(wloop); })(0);
    }
  }

  /* ---------- Digital camera: scroll rolls photos and captions up ---------- */
  var camEl = document.querySelector("[data-cam]");
  if (camEl) {
    var slides = SITE.camera;
    camEl.querySelector("[data-cam-reel]").innerHTML = slides
      .map(function (s) { return '<div class="cam__frame">' + media(s.src, s.tone, s.label || s.title, s.icon, s.title) + "</div>"; })
      .join("");
    camEl.querySelector("[data-cam-texts]").innerHTML = slides
      .map(function (s) { return '<div class="cam__slide"><h3>' + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></div>"; })
      .join("");
    camEl.style.setProperty("--n", String(slides.length));
    camEl.__slides = slides.length;
  }

  /* ---------- Ending: photostrip, postcard and contact card ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-scrap]"), function (box) {
    var pr = SITE.profile;
    var booth = pr.photobooth || [];
    var frames = [0, 1, 2, 3].map(function (i) {
      return '<div class="booth__frame">' + media(booth[i], [1, 2, 4, 6][i], "Photobooth", "modelling", "Photobooth photo " + (i + 1)) + "</div>";
    }).join("");
    box.innerHTML =
      '<div class="scrap__booth">' + frames + '<span class="tape tape--a"></span></div>' +
      '<div class="scrap__postcard"><div class="postcard__img">' + media(pr.postcard, 6, "Postcard", "brand", "Postcard") + '</div><span class="tape tape--b"></span><span class="tape tape--c"></span></div>' +
      '<div class="contact-card"><p class="contact-card__label">Email</p><a class="contact__mail" data-email href="#"></a>' +
      '<ul class="socials" data-socials></ul>' +
      '<p class="contact-card__meta">' + esc(pr.location) + " · Open to shoots, brand work and collaborations.</p></div>";
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
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Contact drawer (slides in from the right) ---------- */
  (function () {
    var pr = SITE.profile;
    var drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML =
      '<div class="drawer__backdrop" data-close></div>' +
      '<aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle" tabindex="-1">' +
      '<button class="drawer__close" type="button" aria-label="Close contact panel" data-close>×</button>' +
      '<p class="eyebrow">Contact</p>' +
      '<h2 class="drawer__title" id="drawerTitle">Let’s <em>talk.</em></h2>' +
      '<p class="drawer__lead">Open to shoots, brand work and collaborations. Email is the fastest way to reach me.</p>' +
      '<div class="drawer__mail"><a class="drawer__email" href="mailto:' + esc(pr.email) + '">' + esc(pr.email) + '</a><button class="drawer__copy" type="button" data-copy>Copy</button></div>' +
      '<ul class="drawer__links">' +
      (pr.socials || []).filter(function (s) { return s.url && s.url !== "#"; })
        .map(function (s) { return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener"><span>' + esc(s.label) + '</span><span aria-hidden="true">↗</span></a></li>'; }).join("") +
      "</ul>" +
      '<p class="drawer__meta">' + esc(pr.location) + "</p></aside>";
    document.body.appendChild(drawer);

    var panel = drawer.querySelector(".drawer__panel");
    var copyBtn = drawer.querySelector("[data-copy]");
    var lastFocus = null;
    function openDrawer() {
      lastFocus = document.activeElement;
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      html.classList.add("drawer-open");
      if (lenis && lenis.stop) lenis.stop();
      setTimeout(function () { panel.focus(); }, 60);
    }
    function closeDrawer() {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      html.classList.remove("drawer-open");
      if (lenis && lenis.start) lenis.start();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    drawer.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeDrawer(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer(); });
    copyBtn.addEventListener("click", function () {
      var done = function () { copyBtn.textContent = "Copied"; copyBtn.classList.add("is-done"); setTimeout(function () { copyBtn.textContent = "Copy"; copyBtn.classList.remove("is-done"); }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pr.email).then(done, done);
      else { var t = document.createElement("textarea"); t.value = pr.email; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (err) {} t.remove(); done(); }
    });
    // Any "Let's talk" / "Get in touch" link opens the drawer instead of navigating
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (a.classList.contains("nav__cta") || a.hasAttribute("data-contact") || href === "#contact" || href === "index.html#contact") {
        e.preventDefault();
        e.stopPropagation();
        openDrawer();
      }
    }, true);
  })();

  /* ---------- Crayon doodles, tucked at the edges ---------- */
  (function () {
    var wrapSvg = document.createElement("div");
    wrapSvg.setAttribute("aria-hidden", "true");
    wrapSvg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    wrapSvg.innerHTML = '<svg width="0" height="0"><filter id="crayon" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.6"/></filter></svg>';
    document.body.appendChild(wrapSvg);

    var SHAPES = {
      heart: ["M20 34C7 25 4 13 12 9c4-2 8 0 8 4 1-4 6-6 10-4 8 4 4 17-10 25z"],
      star: ["M20 4l4.6 10.6 11.4 1-8.7 7.5 2.7 11.2L20 28.2 9.9 34.3l2.7-11.2L4 15.6l11.4-1z"],
      squiggle: ["M3 22q5-14 10 0t10 0 10 0 6-6"],
      sparkle: ["M20 3q2 15 17 17-15 2-17 17-2-15-17-17 15-2 17-17z"],
      spiral: ["M20 20a3 3 0 1 1 6 0 8 8 0 1 1-14 0 14 14 0 1 1 26-2"],
      arrow: ["M4 32Q14 6 36 14", "M29 6l8 8-10 5"]
    };
    var CFG = [
      { p: ".hero", k: "star", c: "b", s: 44, st: "left:47%;top:17%;rotate:12deg" },
      { p: ".hero", k: "squiggle", c: "p", s: 76, st: "left:5%;bottom:8%;rotate:-6deg" },
      { p: ".hero__art", k: "heart", c: "p", s: 54, st: "right:-30px;top:-14px;rotate:14deg" },
      { p: ".hero__art", k: "sparkle", c: "b", s: 42, st: "left:-26px;top:16%;rotate:-8deg" },
      { p: ".exp .section-head", k: "spiral", c: "b", s: 56, st: "left:54%;top:-10px;rotate:-8deg" },
      { p: ".reel .section-head", k: "star", c: "p", s: 46, st: "left:36%;top:-6px;rotate:10deg" },
      { p: ".wins .wrap", k: "sparkle", c: "w", s: 50, st: "right:10px;top:-6px" },
      { p: ".contact .wrap", k: "heart", c: "b", s: 48, st: "right:6%;top:9%;rotate:-12deg" },
      { p: ".contact .wrap", k: "arrow", c: "p", s: 64, st: "left:34%;top:70px;rotate:8deg" }
    ];
    CFG.forEach(function (d) {
      var host = document.querySelector(d.p);
      if (!host) return;
      var paths = SHAPES[d.k].map(function (p) { return '<path d="' + p + '"/>'; }).join("");
      var el = document.createElement("div");
      el.className = "doodle d--" + d.c;
      el.setAttribute("aria-hidden", "true");
      el.style.cssText = "--s:" + d.s + "px;" + d.st;
      el.innerHTML = '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#crayon)"><g>' + paths + '</g><g transform="translate(0.9 0.7)" opacity="0.45">' + paths + "</g></svg>";
      host.appendChild(el);
    });
  })();

  /* ---------- Page-specific renderer (project.html / about.html) ---------- */
  if (typeof window.renderPage === "function") {
    window.renderPage({ esc: esc, media: media, CATEGORY_LABEL: CATEGORY_LABEL });
  }

  /* ---------- Nav: floating pill that hides on scroll down ---------- */
  var nav = document.querySelector(".nav");
  var lastY = 0;
  var onScroll = function () {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 20);
      if (y > 140 && y > lastY + 4) nav.classList.add("is-hidden");
      else if (y < lastY - 4 || y < 140) nav.classList.remove("is-hidden");
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Loader (cat peeking out of a box) + page-transition panels ---------- */
  var heroBase = 0;
  var loaderEl = null;
  var ptEl = null;
  var ptIn = false;
  (function () {
    var seen = false;
    try {
      seen = !!sessionStorage.getItem("sn_loaded");
      sessionStorage.setItem("sn_loaded", "1");
      ptIn = !!sessionStorage.getItem("sn_pt");
      sessionStorage.removeItem("sn_pt");
    } catch (err) {}
    if (reduceMotion || !hasGSAP) { html.classList.remove("pt-cover"); return; }

    // Page-transition panels live on every page
    ptEl = document.createElement("div");
    ptEl.className = "pt";
    ptEl.innerHTML = '<div class="pt__pink"></div><div class="pt__blue"><span class="pt__mono">SNG</span></div>';
    document.body.appendChild(ptEl);
    if (ptIn) heroBase = 1.0;

    if (seen) return;
    loaderEl = document.createElement("div");
    loaderEl.className = "loader";
    loaderEl.innerHTML =
      '<div class="loader__pink"></div><div class="loader__blue"><div class="loader__stage">' +
      '<svg class="loader__cat" viewBox="0 0 160 150" aria-hidden="true" fill="none" stroke="#1c2540" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<ellipse cx="80" cy="140" rx="46" ry="5" fill="rgba(28,37,64,0.14)" stroke="none"/>' +
      '<g class="lc-cat">' +
      '<path d="M54 54L56 28L76 44Z" fill="#fff"/><path d="M106 54L104 28L84 44Z" fill="#fff"/>' +
      '<path d="M60 47L61 36L69 44Z" fill="#eac4d5" stroke="none"/><path d="M100 47L99 36L91 44Z" fill="#eac4d5" stroke="none"/>' +
      '<ellipse cx="80" cy="72" rx="32" ry="28" fill="#fff"/>' +
      '<g class="lc-eyes"><ellipse cx="68" cy="70" rx="3.2" ry="4.2" fill="#1c2540" stroke="none"/><ellipse cx="92" cy="70" rx="3.2" ry="4.2" fill="#1c2540" stroke="none"/></g>' +
      '<path d="M76 79h8l-4 4z" fill="#eac4d5" stroke-width="2"/><path d="M80 83q-4 5-8 2M80 83q4 5 8 2" stroke-width="2"/>' +
      '<path d="M50 78l-14-3M50 83l-14 3M110 78l14-3M110 83l14 3" stroke-width="2"/>' +
      "</g>" +
      '<path d="M26 98l-14-18h34l8 18z" fill="#8ba3d0"/><path d="M134 98l14-18h-34l-8 18z" fill="#8ba3d0"/>' +
      '<rect x="24" y="96" width="112" height="42" rx="9" fill="#718bbc"/>' +
      '<rect x="62" y="110" width="36" height="9" rx="4.5" fill="#fff" fill-opacity="0.75" stroke="none"/>' +
      '<g class="lc-paws"><ellipse cx="60" cy="97" rx="9" ry="6" fill="#fff"/><ellipse cx="100" cy="97" rx="9" ry="6" fill="#fff"/></g>' +
      "</svg>" +
      '<div class="loader__name"><span>Sofia <em>Nadine</em></span><span class="loader__bar"><i></i></span></div></div></div>';
    document.body.appendChild(loaderEl);
    html.classList.add("is-loading");
    heroBase = 3.5;
  })();

  /* ---------- Motion: Lenis + GSAP ---------- */
  var lenis = null;
  function scrollToEl(el) {
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#" && href.length > 1) {
      var target = document.querySelector(href);
      if (target) { e.preventDefault(); scrollToEl(target); }
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
    lenis = new window.Lenis({ duration: 1.5, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Loader timeline: the cat peeks out of the box, looks around, blinks, hops out; then the panels sweep up
  if (loaderEl) {
    var lbar = loaderEl.querySelector(".loader__bar i");
    var lname = loaderEl.querySelector(".loader__name");
    var lcat = loaderEl.querySelector(".lc-cat");
    var lcatSvg = loaderEl.querySelector(".loader__cat");
    var leyes = loaderEl.querySelector(".lc-eyes");
    var lpaws = loaderEl.querySelector(".lc-paws");
    var lblue = loaderEl.querySelector(".loader__blue");
    var lpink = loaderEl.querySelector(".loader__pink");
    var finish = function () { if (loaderEl) { loaderEl.remove(); loaderEl = null; } html.classList.remove("is-loading"); };
    gsap.set(lcat, { y: 64, transformOrigin: "80px 96px" });
    gsap.set(lpaws, { opacity: 0, y: 6 });
    gsap.set(leyes, { transformOrigin: "80px 70px" });
    var ltl = gsap.timeline({ onComplete: finish });
    ltl.from(lcatSvg, { y: 14, opacity: 0, duration: 0.6, ease: "power3.out" }, 0)
      .from(lname, { y: 12, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.1)
      .to(lbar, { scaleX: 1, duration: 2.1, ease: "power1.inOut" }, 0.2)
      .to(lcat, { y: 0, duration: 0.7, ease: "back.out(1.5)" }, 0.35)
      .to(lpaws, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.95)
      .to(leyes, { x: 5, duration: 0.25, ease: "power2.inOut" }, 1.15)
      .to(leyes, { x: -5, duration: 0.4, ease: "power2.inOut" }, 1.45)
      .to(leyes, { x: 0, duration: 0.25, ease: "power2.inOut" }, 1.9)
      .to(leyes, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: 1 }, 2.0)
      .to(lcat, { rotation: -7, duration: 0.25, ease: "power2.out" }, 2.1)
      .to(lcat, { rotation: 0, duration: 0.2, ease: "power2.inOut" }, 2.35)
      .to(lcat, { y: -34, scaleY: 1.06, duration: 0.3, ease: "power2.out" }, 2.4)
      .to(lcat, { y: -120, opacity: 0, scaleY: 1, duration: 0.5, ease: "power2.in" }, 2.7)
      .to(lname, { y: -14, opacity: 0, duration: 0.45, ease: "power2.in" }, 2.85)
      .to(lblue, { yPercent: -100, duration: 1, ease: "power4.inOut" }, 3.0)
      .to(lpink, { yPercent: -100, duration: 1, ease: "power4.inOut" }, 3.14);
    setTimeout(finish, 8000);
  }

  // Page transitions: colour wipe covers the page before leaving, and lifts away on the next page
  if (ptEl) {
    var ptPink = ptEl.querySelector(".pt__pink");
    var ptBlue = ptEl.querySelector(".pt__blue");
    gsap.set([ptPink, ptBlue], { yPercent: 100 });
    var ptReset = function () { gsap.set([ptPink, ptBlue], { yPercent: 100 }); ptEl.style.visibility = "hidden"; html.classList.remove("pt-cover"); };
    if (ptIn) {
      gsap.set([ptPink, ptBlue], { yPercent: 0 });
      html.classList.remove("pt-cover");
      gsap.to(ptBlue, { yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.1 });
      gsap.to(ptPink, { yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.22, onComplete: ptReset });
    } else {
      ptEl.style.visibility = "hidden";
    }
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      if (a.protocol !== window.location.protocol || (a.protocol !== "file:" && a.host !== window.location.host)) return;
      if (a.pathname === window.location.pathname && (a.hash || a.getAttribute("href").charAt(0) === "#")) return;
      if (a.pathname === window.location.pathname && a.search === window.location.search) return;
      e.preventDefault();
      try { sessionStorage.setItem("sn_pt", "1"); } catch (err) {}
      var href = a.href;
      ptEl.style.visibility = "visible";
      gsap.set([ptPink, ptBlue], { yPercent: 100 });
      gsap.timeline({ onComplete: function () { window.location.href = href; } })
        .to(ptPink, { yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 0)
        .to(ptBlue, { yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 0.12)
        .from(ptBlue.querySelector(".pt__mono"), { scale: 0.8, opacity: 0, duration: 0.4, ease: "power3.out" }, 0.45)
        .to({}, { duration: 0.18 });
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) ptReset(); });
  }

  // Landing: calm, staggered
  gsap.from(".nav__inner", { y: -20, opacity: 0, duration: 1.1, ease: "power3.out", delay: heroBase + 0.3 });
  var heroLines = document.querySelectorAll(".hero__title .line > span, .page-title .line > span");
  if (heroLines.length) gsap.from(heroLines, { yPercent: 105, duration: 1.5, ease: "power4.out", stagger: 0.14, delay: heroBase + 0.2 });
  gsap.from(".hero .eyebrow, .hero__sub, .hero__cta, .hero__foot", { y: 18, opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.1, delay: heroBase + 0.7 });
  var heroImg = document.querySelector(".hero__media");
  if (heroImg) {
    gsap.from(heroImg, { clipPath: "inset(100% 0 0 0)", duration: 1.6, ease: "power4.out", delay: heroBase + 0.3 });
    var heroInner = heroImg.querySelector(".ph, img");
    if (heroInner) {
      gsap.fromTo(heroInner, { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: heroImg, start: "top bottom", end: "bottom top", scrub: true } });
    }
  }

  // Intro: words light up as you scroll
  var introWords = document.querySelectorAll(".intro__text .w");
  if (introWords.length) {
    gsap.fromTo(introWords, { opacity: 0.14 }, {
      opacity: 1, stagger: 0.06, ease: "none",
      scrollTrigger: { trigger: ".intro", start: "top 80%", end: "bottom 55%", scrub: true },
    });
  }

  // Generic reveals
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });

  // Work cards
  if (grid) {
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (card, i) {
      card._reveal = gsap.fromTo(card, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.3, delay: (i % 3) * 0.08, ease: "power3.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: card, start: "top 94%", once: true },
      });
    });
  }

  // Digital camera: scroll rolls the photos up through the screen and lifts the captions
  if (camEl && camEl.__slides) {
    var camN = camEl.__slides;
    var camReel = camEl.querySelector("[data-cam-reel]");
    var camSlides = camEl.querySelectorAll(".cam__slide");
    var smooth = function (x) { return x * x * (3 - 2 * x); };
    ScrollTrigger.create({
      trigger: camEl, start: "top top", end: "bottom bottom",
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

  // Doodles: draw themselves in, then drift gently as you scroll
  gsap.utils.toArray(".doodle").forEach(function (el, i) {
    var paths = el.querySelectorAll("path");
    Array.prototype.forEach.call(paths, function (p) {
      var len = p.getTotalLength ? p.getTotalLength() : 100;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    gsap.to(paths, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", delay: i < 4 ? heroBase + 1.2 : 0, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    gsap.fromTo(el, { y: -16 }, { y: 16, ease: "none", scrollTrigger: { trigger: el.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Project page hero parallax
  gsap.utils.toArray(".proj-hero").forEach(function (frame) {
    var inner = frame.querySelector(".ph, img");
    if (!inner) return;
    gsap.fromTo(inner, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
