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
    modelling:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="14" width="36" height="26" rx="6"/><path d="M17 14l3-5h8l3 5"/><circle cx="24" cy="27" r="7"/></svg>',
    brand:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6c10 0 18 7 18 16 0 6-5 8-9 8h-4a4 4 0 00-3 7c1 2 0 5-3 5C13 42 6 34 6 24S14 6 24 6z"/><circle cx="15" cy="22" r="2.5"/><circle cx="22" cy="14" r="2.5"/><circle cx="32" cy="16" r="2.5"/></svg>',
    research:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="21" cy="21" r="12"/><path d="M30 30l11 11M15 24l4-4 3 3 5-6"/></svg>',
  };

  // A curled-up sleeping cat — one of the few cat hints on the site.
  var SLEEPY_CAT =
    '<svg class="card__zzz" viewBox="0 0 64 44" aria-hidden="true"><path d="M8 36c0-12 9-20 22-20s22 8 22 18c0 4-3 6-7 6H14c-4 0-6-1-6-4z" fill="#fff"/><path d="M12 22l2-9 7 5zM34 17l5-7 3 8z" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M15 31q3 2 6 0" stroke="#2b1e24" stroke-width="1.6" fill="none" stroke-linecap="round"/><text x="46" y="12" font-size="10" fill="#2b1e24" font-family="serif" font-style="italic">z</text><text x="53" y="7" font-size="7" fill="#2b1e24" font-family="serif" font-style="italic">z</text></svg>';

  var CATEGORY_LABEL = { modelling: "Modelling", brand: "Past Works", research: "Future Research" };

  /** An image if `src` is given, otherwise a pink placeholder frame. */
  function media(src, tone, label, category, alt) {
    if (src) return '<img src="' + esc(src) + '" alt="' + esc(alt || label || "") + '" loading="lazy">';
    return (
      '<div class="ph tone-' + (tone || 1) + '" role="img" aria-label="' + esc("Placeholder: " + (label || "image")) + '">' +
      '<div class="ph__inner">' + (ICONS[category] || ICONS.brand) + "<span>" + esc(label || "Image coming soon") + "</span></div></div>"
    );
  }

  /* ---------- Floating dots ---------- */
  var dotsEl = document.querySelector("[data-dots]");
  if (dotsEl) {
    var colors = ["#f8c8d8", "#fbeaa0", "#cfe5c8", "#f3b0c7", "#fbeaa0", "#cfe5c8"];
    var spots = [
      [6, 14], [14, 68], [22, 36], [34, 88], [46, 8], [52, 58], [64, 24],
      [72, 80], [80, 44], [88, 12], [92, 64], [58, 94], [30, 52], [96, 90],
    ];
    dotsEl.innerHTML = spots
      .map(function (p, i) {
        var s = 10 + ((i * 7) % 5) * 5;
        return (
          '<span class="dot" style="left:' + p[0] + "%;top:" + p[1] + "%;--d:" + (6 + (i % 4) * 6) + '">' +
          '<i style="--s:' + s + "px;--c:" + colors[i % colors.length] + ";--t:" + (11 + (i % 5) * 2) + "s;--delay:-" + (i % 7) +
          "s;--dx:" + ((i % 2 ? 1 : -1) * (10 + (i % 3) * 6)) + "px;--dy:" + (-14 - (i % 4) * 6) + 'px"></i></span>'
        );
      })
      .join("");
    if (finePointer && !reduceMotion) {
      window.addEventListener(
        "pointermove",
        function (e) {
          dotsEl.style.setProperty("--mx", (e.clientX / window.innerWidth - 0.5).toFixed(3));
          dotsEl.style.setProperty("--my", (e.clientY / window.innerHeight - 0.5).toFixed(3));
        },
        { passive: true }
      );
    }
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

  var fan = document.querySelector("[data-fan]");
  if (fan) {
    var CARDS = [
      { go: "modelling", rank: "A", suit: "♥", label: "Modelling" },
      { go: "brand", rank: "K", suit: "♣", label: "Past Works" },
      { go: "research", rank: "Q", suit: "♦", label: "Future Research" },
      { href: "about.html", rank: "J", suit: "♠", label: "About me" },
    ];
    fan.innerHTML = CARDS.map(function (c) {
      var href = c.href || "index.html?cat=" + c.go + "#work";
      return (
        '<a class="pcard" href="' + href + '"' + (c.go ? ' data-go="' + c.go + '"' : "") + ">" +
        '<span class="pcard__corner"><b>' + c.rank + "</b>" + c.suit + "</span>" +
        '<span><span class="pcard__suit">' + c.suit + '</span><span class="pcard__label">' + c.label + "</span></span>" +
        '<span class="pcard__corner br"><b>' + c.rank + "</b>" + c.suit + "</span></a>"
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
    if (countEl) countEl.textContent = String(shown).padStart(2, "0");
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
    lenis = new window.Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Landing: everything eases in together, top to bottom
  gsap.from(".nav", { y: -16, opacity: 0, duration: 0.9, ease: "power3.out" });
  var heroLines = document.querySelectorAll(".hero__title .line > span, .page-title .line > span");
  if (heroLines.length) {
    gsap.from(heroLines, { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: 0.1, delay: 0.15 });
  }
  gsap.from(".hero .eyebrow, .hero__sub, .hero__cta, .lede, .proj-meta", { y: 16, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.45 });
  gsap.from(".hero__portrait", { scale: 0.92, opacity: 0, duration: 1.3, ease: "power3.out", delay: 0.1 });

  // Playing cards: fan out as they arrive
  var pcards = document.querySelectorAll(".pcard");
  if (pcards.length) {
    gsap.from(pcards, {
      y: 50,
      opacity: 0,
      rotate: 0,
      duration: 1.1,
      ease: "power3.out",
      stagger: 0.09,
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: ".fan", start: "top 85%", once: true },
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
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: ".intro", start: "top 78%", end: "bottom 62%", scrub: true },
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
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  // Cards: soft staggered entrance
  if (grid) {
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (card, i) {
      card._reveal = gsap.fromTo(
        card,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: (i % 3) * 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: card, start: "top 94%", once: true },
        }
      );
    });
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
