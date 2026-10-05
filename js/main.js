/*
  Shared site behaviour: rendering from data.js, smooth scroll (Lenis),
  scroll reveals (GSAP + ScrollTrigger), work-grid filters, card tilt,
  custom cursor, and cues for the cat.
*/
(function () {
  "use strict";

  var SITE = window.SITE;
  var html = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);

  /* ---------- Helpers (also used by project.js via window.renderPage) ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var ICONS = {
    modelling:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="14" width="36" height="26" rx="6"/><path d="M17 14l3-5h8l3 5"/><circle cx="24" cy="27" r="7"/></svg>',
    brand:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6c10 0 18 7 18 16 0 6-5 8-9 8h-4a4 4 0 00-3 7c1 2 0 5-3 5C13 42 6 34 6 24S14 6 24 6z"/><circle cx="15" cy="22" r="2.5"/><circle cx="22" cy="14" r="2.5"/><circle cx="32" cy="16" r="2.5"/></svg>',
    research:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="21" cy="21" r="12"/><path d="M30 30l11 11M15 24l4-4 3 3 5-6"/></svg>',
  };

  var CATEGORY_LABEL = { modelling: "Modelling", brand: "Brand Design", research: "Research" };

  /** An image if `src` is given, otherwise a pink placeholder frame. */
  function media(src, tone, label, category, alt) {
    if (src) return '<img src="' + esc(src) + '" alt="' + esc(alt || label || "") + '" loading="lazy">';
    return (
      '<div class="ph tone-' + (tone || 1) + '" role="img" aria-label="' + esc("Placeholder: " + (label || "image")) + '">' +
      '<div class="ph__inner">' + (ICONS[category] || ICONS.brand) + "<span>" + esc(label || "Image coming soon") + "</span></div></div>"
    );
  }

  /* ---------- Home: intro ---------- */
  var introEl = document.querySelector("[data-intro]");
  if (introEl) {
    var phrase = "turns ideas into action";
    var words = SITE.profile.intro.split(" ").map(function (w) {
      return '<span class="w">' + esc(w) + "</span>";
    });
    var joined = words.join(" ");
    var phraseHTML = phrase.split(" ").map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    introEl.innerHTML = joined.replace(phraseHTML, "<em>" + phraseHTML + "</em>");
  }

  /* ---------- Home: work grid ---------- */
  var grid = document.querySelector("[data-grid]");
  var filterBar = document.querySelector("[data-filters]");
  var countEl = document.querySelector("[data-count]");
  var SIZES = ["size-wide", "size-mid", "size-third", "size-third", "size-third", "size-mid", "size-wide"];

  function interleave(projects) {
    var buckets = {};
    var order = [];
    projects.forEach(function (p) {
      if (!buckets[p.category]) {
        buckets[p.category] = [];
        order.push(p.category);
      }
      buckets[p.category].push(p);
    });
    // Brand first so the strongest real project leads.
    order.sort(function (a, b) { return (a === "brand" ? -1 : 0) - (b === "brand" ? -1 : 0); });
    var out = [];
    var more = true;
    for (var i = 0; more; i++) {
      more = false;
      order.forEach(function (c) {
        if (buckets[c][i]) {
          out.push(buckets[c][i]);
          more = true;
        }
      });
    }
    return out;
  }

  function cardHTML(p) {
    var soon = p.status === "coming-soon";
    return (
      '<article class="card" data-category="' + esc(p.category) + '">' +
      '<a href="project.html?id=' + encodeURIComponent(p.id) + '" data-cursor="big">' +
      '<div class="card__media">' +
      '<span class="card__badge' + (soon ? " soon" : "") + '">' + (soon ? "Coming soon" : esc(CATEGORY_LABEL[p.category])) + "</span>" +
      media(p.cover, p.tone, p.title, p.category) +
      '<span class="card__arrow" aria-hidden="true">→</span>' +
      "</div>" +
      '<div class="card__meta"><h3 class="card__title">' + esc(p.title) + '</h3><span class="card__year">' + esc(p.year) + "</span></div>" +
      '<p class="card__sub">' + esc(p.summary) + "</p>" +
      "</a></article>"
    );
  }

  function applySizes() {
    var visible = grid.querySelectorAll(".card:not(.is-hidden)");
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (c) {
      SIZES.forEach(function (s) { c.classList.remove(s); });
    });
    Array.prototype.forEach.call(visible, function (c, i) {
      // Short lists (a single filter) read better as an even row of thirds.
      c.classList.add(visible.length <= 3 ? "size-third" : SIZES[i % SIZES.length]);
    });
    if (countEl) countEl.textContent = String(visible.length).padStart(2, "0");
  }

  function setFilter(id) {
    Array.prototype.forEach.call(filterBar.querySelectorAll(".chip"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === id));
    });
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (c) {
      var show = id === "all" || c.getAttribute("data-category") === id;
      c.classList.toggle("is-hidden", !show);
      // Filtering takes over the entrance: drop any pending scroll reveal.
      if (c._reveal) {
        if (c._reveal.scrollTrigger) c._reveal.scrollTrigger.kill();
        c._reveal.kill();
        c._reveal = null;
      }
      if (hasGSAP) window.gsap.set(c, { clearProps: "opacity,transform" });
      if (show && !reduceMotion) c.classList.add("is-entering");
    });
    applySizes();
    void grid.offsetWidth; // flush styles so the entering state is painted before it transitions out
    Array.prototype.forEach.call(grid.querySelectorAll(".card.is-entering"), function (c, i) {
      setTimeout(function () { c.classList.remove("is-entering"); }, 20 + i * 70);
    });
    if (hasGSAP) window.ScrollTrigger.refresh();
  }

  if (grid) {
    grid.innerHTML = interleave(SITE.projects).map(cardHTML).join("");
    if (filterBar) {
      filterBar.innerHTML = SITE.categories
        .map(function (c) {
          return '<button class="chip" type="button" data-filter="' + c.id + '" aria-pressed="' + (c.id === "all") + '">' + esc(c.label) + "</button>";
        })
        .join("");
      filterBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".chip");
        if (btn) setFilter(btn.getAttribute("data-filter"));
      });
    }
    applySizes();
  }

  /* ---------- Marquee ---------- */
  var marquee = document.querySelector("[data-marquee]");
  if (marquee) {
    var items = SITE.highlights.map(function (h) { return '<span class="marquee__item">' + esc(h) + "</span>"; }).join("");
    marquee.innerHTML = items + items; // doubled for a seamless loop
  }

  /* ---------- Contact links ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-email]"), function (a) {
    a.href = "mailto:" + SITE.profile.email;
    if (!a.textContent.trim()) a.textContent = SITE.profile.email;
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-linkedin]"), function (a) {
    var url = SITE.profile.linkedin;
    if (!url || url === "#") a.parentElement.remove();
    else a.href = url;
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-instagram]"), function (a) {
    if (!SITE.profile.instagram) a.parentElement.remove();
    else a.href = SITE.profile.instagram;
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
    var y = window.scrollY;
    if (nav) nav.classList.toggle("is-scrolled", y > 20);
    if (window.Cat && document.body.getAttribute("data-cat") === "hero") {
      window.Cat.stage.classList.toggle("is-corner", y > window.innerHeight * 0.35);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Cat cues: peek at each new section, wave at the footer ---------- */
  if ("IntersectionObserver" in window && window.Cat) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || seen.has(en.target)) return;
          seen.add(en.target);
          if (en.target.hasAttribute("data-wave")) window.Cat.wave();
          else window.Cat.peek();
        });
      },
      { threshold: 0.35 }
    );
    Array.prototype.forEach.call(document.querySelectorAll("[data-section]"), function (s) { io.observe(s); });
  }

  /* ---------- Card tilt ---------- */
  if (finePointer && !reduceMotion) {
    document.addEventListener("pointermove", function (e) {
      var m = e.target.closest && e.target.closest(".card__media");
      if (!m) return;
      var r = m.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      m.style.transform = "rotateY(" + px * 8 + "deg) rotateX(" + -py * 8 + "deg) translateY(-6px)";
    });
    document.addEventListener(
      "pointerout",
      function (e) {
        var m = e.target.closest && e.target.closest(".card__media");
        if (m && !m.contains(e.relatedTarget)) m.style.transform = "";
      },
      true
    );
  }

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    var cur = document.createElement("div");
    cur.className = "cursor";
    document.body.appendChild(cur);
    var cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      cur.classList.add("is-on");
      var big = e.target.closest && e.target.closest("a, button, canvas, [data-cursor]");
      cur.classList.toggle("is-big", !!big);
    }, { passive: true });
    document.addEventListener("pointerleave", function () { cur.classList.remove("is-on"); });
    (function loop() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cur.style.left = cx + "px";
      cur.style.top = cy + "px";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Motion: Lenis + GSAP ---------- */
  if (reduceMotion || !hasGSAP) {
    html.classList.remove("js-motion");
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  window.__motionReady = true;

  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Smooth in-page anchor links
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -60 });
    else target.scrollIntoView({ behavior: "smooth" });
  });

  // Hero headline: lines slide up
  var heroLines = document.querySelectorAll(".hero__title .line > span, .page-title .line > span");
  if (heroLines.length) {
    gsap.from(heroLines, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.09, delay: 0.15 });
  }
  gsap.from(".hero__tags li, .lede, .proj-meta", { y: 20, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.06, delay: 0.6 });

  // Intro: words brighten as you scroll
  var introWords = document.querySelectorAll(".intro__text .w");
  if (introWords.length) {
    gsap.fromTo(
      introWords,
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: ".intro", start: "top 75%", end: "bottom 60%", scrub: true },
      }
    );
  }

  // Generic reveals
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // Cards: staggered entrance
  if (grid) {
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (card, i) {
      card._reveal = gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: (i % 2) * 0.12,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        }
      );
    });
  }

  // Parallax inside image frames
  gsap.utils.toArray("[data-parallax]").forEach(function (frame) {
    var inner = frame.querySelector(".ph, img");
    if (!inner) return;
    gsap.fromTo(inner, { yPercent: -5 }, {
      yPercent: 5,
      ease: "none",
      scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
