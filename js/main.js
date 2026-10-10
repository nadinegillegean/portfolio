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

  var CATEGORY_LABEL = { modelling: "Modelling", brand: "Past Works", research: "Case Studies" };

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

  var introEl = document.querySelector("[data-intro]");
  if (introEl) {
    var phrase = "turns ideas into action";
    var words = SITE.profile.intro.split(" ").map(function (w) { return '<span class="w">' + esc(w) + "</span>"; });
    var phraseHTML = phrase.split(" ").map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    introEl.innerHTML = words.join(" ").replace(phraseHTML, "<em>" + phraseHTML + "</em>");
  }

  var trustedEl = document.querySelector("[data-trusted]");
  if (trustedEl) trustedEl.innerHTML = SITE.trusted.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

  /* ---------- Home: work, folder tabs ---------- */
  var grid = document.querySelector("[data-grid]");
  var tabsEl = document.querySelector("[data-tabs]");
  var folderTitle = document.querySelector("[data-folder-title]");
  var folderDesc = document.querySelector("[data-folder-desc]");

  function cardHTML(p) {
    var soon = p.status === "coming-soon";
    return (
      '<article class="card" data-category="' + esc(p.category) + '">' +
      '<a href="project.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="card__media">' +
      '<span class="card__badge' + (soon ? " soon" : "") + '">' + (soon ? "In progress" : esc(CATEGORY_LABEL[p.category])) + "</span>" +
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
    var POS = [[3, 4, -5], [34, 1, 3], [62, 6, -4], [10, 34, 4], [46, 30, -3], [68, 40, 5], [4, 64, -4], [36, 62, 3], [62, 72, -3]];
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

  /* ---------- Page-specific renderer (project.html / about.html) ---------- */
  if (typeof window.renderPage === "function") {
    window.renderPage({ esc: esc, media: media, CATEGORY_LABEL: CATEGORY_LABEL });
  }

  /* ---------- Nav state ---------- */
  var nav = document.querySelector(".nav");
  var onScroll = function () { if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 20); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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

  // Landing: calm, staggered
  gsap.from(".nav", { y: -14, opacity: 0, duration: 1, ease: "power3.out" });
  var heroLines = document.querySelectorAll(".hero__title .line > span, .page-title .line > span");
  if (heroLines.length) gsap.from(heroLines, { yPercent: 105, duration: 1.5, ease: "power4.out", stagger: 0.14, delay: 0.2 });
  gsap.from(".hero .eyebrow, .hero__sub, .hero__cta, .hero__foot", { y: 18, opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.1, delay: 0.7 });
  var heroImg = document.querySelector(".hero__media");
  if (heroImg) {
    gsap.from(heroImg, { clipPath: "inset(100% 0 0 0)", duration: 1.6, ease: "power4.out", delay: 0.3 });
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

  // Project page hero parallax
  gsap.utils.toArray(".proj-hero").forEach(function (frame) {
    var inner = frame.querySelector(".ph, img");
    if (!inner) return;
    gsap.fromTo(inner, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
