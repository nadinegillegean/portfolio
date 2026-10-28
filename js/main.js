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

  /* ---------- Cursor aura (whole site) ---------- */
  var storyEl = document.querySelector("[data-story]");
  var deckEl = document.querySelector("[data-deck]");
  var typeOn = true;
  var STAR = '<svg viewBox="0 0 100 100"><path d="M50 2Q55 45 98 50Q55 55 50 98Q45 55 2 50Q45 45 50 2Z" fill="currentColor"/></svg>';
  // Minimal sparkle trail: a small pink or red star every so often, no click burst
  var GLITTER = ["#fe9bb8", "#ae2831", "#fe9bb8", "#f6e4be"];
  function glitter(x, y) {
    if (document.querySelectorAll(".spark").length > 24) return;
    var sp = document.createElement("span");
    sp.className = "spark";
    sp.setAttribute("aria-hidden", "true");
    sp.style.color = GLITTER[Math.floor(Math.random() * GLITTER.length)];
    sp.style.left = x + "px"; sp.style.top = y + "px";
    sp.style.setProperty("--sz", (7 + Math.random() * 6).toFixed(0) + "px");
    sp.style.setProperty("--rot", (Math.random() * 60 - 30).toFixed(0) + "deg");
    sp.style.setProperty("--dx", ((Math.random() - 0.5) * 18).toFixed(0) + "px");
    sp.style.setProperty("--dy", (12 + Math.random() * 18).toFixed(0) + "px");
    sp.innerHTML = STAR;
    document.body.appendChild(sp);
    sp.addEventListener("animationend", function () { sp.remove(); });
  }
  if (finePointer && !reduceMotion) {
    var aura = document.createElement("div");
    aura.className = "aura";
    aura.setAttribute("aria-hidden", "true");
    document.body.appendChild(aura);
    var ax = -300, ay = -300, tx = -300, ty = -300, auraOn = false, lastSpark = { x: -999, y: -999 };
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!auraOn) { auraOn = true; ax = tx; ay = ty; aura.classList.add("is-on"); }
      var sdx = tx - lastSpark.x, sdy = ty - lastSpark.y;
      if (sdx * sdx + sdy * sdy > 2800) { lastSpark.x = tx; lastSpark.y = ty; glitter(tx, ty); }
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", function () { auraOn = false; aura.classList.remove("is-on"); });
    (function aloop() {
      ax += (tx - ax) * 0.14; ay += (ty - ay) * 0.14;
      aura.style.transform = "translate3d(" + ax.toFixed(1) + "px," + ay.toFixed(1) + "px,0)";
      requestAnimationFrame(aloop);
    })();

    // Magnetic pills: buttons lean toward the cursor
    var mags = [];
    var collectMags = function () { mags = Array.prototype.slice.call(document.querySelectorAll(".btn, .circ, .pillbtn, .nav__links a, .logo, .tab")); };
    collectMags(); setTimeout(collectMags, 1800);
    window.addEventListener("pointermove", function (e) {
      mags.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        if (Math.sqrt(dx * dx + dy * dy) < Math.max(r.width, r.height) * 0.6) { el.style.translate = (dx * 0.06).toFixed(1) + "px " + (dy * 0.08).toFixed(1) + "px"; el._m = true; }
        else if (el._m) { el.style.translate = ""; el._m = false; }
      });
    }, { passive: true });
  }

  // Intro type: every letter lifts and leans as the cursor passes
  var typeLetters = [];
  Array.prototype.forEach.call(document.querySelectorAll(".type__line > span"), function (line) {
    line.innerHTML = line.textContent.split("").map(function (c) {
      return c === " " ? '<span class="ch ch--sp">&nbsp;</span>' : '<span class="ch">' + esc(c) + "</span>";
    }).join("");
  });
  typeLetters = Array.prototype.slice.call(document.querySelectorAll(".type .ch:not(.ch--sp)"));
  if (typeLetters.length && finePointer && !reduceMotion) {
    var tpx = -999, tpy = -999;
    window.addEventListener("pointermove", function (e) { tpx = e.clientX; tpy = e.clientY; }, { passive: true });
    (function tloop() {
      if (typeOn) {
        typeLetters.forEach(function (c) {
          var r = c.getBoundingClientRect();
          var dx = tpx - (r.left + r.width / 2), dy = tpy - (r.top + r.height / 2);
          var k = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 170);
          c._k = (c._k || 0) + (k - (c._k || 0)) * 0.16;
          if (c._k > 0.003 || c._on) {
            c._on = c._k > 0.003;
            c.style.transform = "translateY(" + (-c._k * 0.2).toFixed(3) + "em) rotate(" + (c._k * (dx < 0 ? 9 : -9)).toFixed(2) + "deg) scale(" + (1 + c._k * 0.1).toFixed(3) + ")";
            c.style.setProperty("--k", c._k.toFixed(3));
          }
        });
      }
      requestAnimationFrame(tloop);
    })();
  }

  /* ---------- Hero deck: one card per line, flip through with the arrows ---------- */
  if (deckEl) {
    var cards = SITE.deck || [];
    deckEl.innerHTML = cards.map(function (c, i) {
      var face = c.kind === "photo"
        ? '<div class="dc__photo">' + media(SITE.profile.portrait, 3, "Portrait", "modelling", SITE.profile.name) + "</div>"
        : '<i class="dc__suit" aria-hidden="true">' + c.suit + "</i><h3>" + esc(c.title) + "</h3><p>" + esc(c.text) + "</p>";
      var idx = "<b>" + esc(c.idx) + "</b><i>" + c.suit + "</i>";
      return (
        '<div class="dc dc--' + (c.tone || "photo") + '" data-i="' + i + '" role="group" aria-label="' + esc(c.title) + '"><div class="dc__in">' +
        '<span class="pc__idx pc__idx--tl" aria-hidden="true">' + idx + "</span>" + face +
        '<span class="pc__idx pc__idx--br" aria-hidden="true">' + idx + "</span></div></div>"
      );
    }).join("");
    var dcs = Array.prototype.slice.call(deckEl.children);
    var order = dcs.map(function (_, i) { return i; });
    var deckLabel = document.querySelector("[data-deck-label]");
    var paintDeck = function () {
      order.forEach(function (ci, pos) {
        dcs[ci].setAttribute("data-pos", String(Math.min(pos, 3)));
        dcs[ci].setAttribute("aria-hidden", pos === 0 ? "false" : "true");
      });
      if (deckLabel) deckLabel.textContent = cards[order[0]].title;
    };
    var deckBusy = false, deckFlipAt = Date.now(), deckHover = false;
    var goDeck = function (dir, side) {
      if (deckBusy || dcs.length < 2) return;
      deckBusy = true;
      deckFlipAt = Date.now();
      var cls = side ? (side < 0 ? "is-out-l" : "is-out") : "is-flip";
      if (dir > 0) {
        var topCard = dcs[order[0]];
        topCard.classList.add(cls);
        setTimeout(function () { topCard.classList.remove("is-out", "is-out-l", "is-flip"); topCard.style.transform = ""; order.push(order.shift()); paintDeck(); deckBusy = false; }, side ? 460 : 820);
      } else {
        var back = dcs[order[order.length - 1]];
        back.classList.add(cls, "no-tr");
        void back.offsetWidth;
        order.unshift(order.pop());
        paintDeck();
        requestAnimationFrame(function () { back.classList.remove("no-tr"); back.classList.remove(cls); deckBusy = false; });
      }
    };
    paintDeck();
    var nextB = document.querySelector("[data-next]"), prevB = document.querySelector("[data-prev]");
    if (nextB) nextB.addEventListener("click", function () { goDeck(1); });
    if (prevB) prevB.addEventListener("click", function () { goDeck(-1); });
    var suppressClick = false, drag = null;
    deckEl.addEventListener("dragstart", function (e) { e.preventDefault(); });
    deckEl.addEventListener("click", function (e) { if (!suppressClick && e.target.closest(".dc") === dcs[order[0]]) goDeck(1); });
    // Drag the top card: fling it away, or let go to snap back
    deckEl.addEventListener("pointerdown", function (e) {
      var t = e.target.closest(".dc");
      if (!t || t !== dcs[order[0]] || deckBusy) return;
      drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, el: t, moved: false };
      t.classList.add("no-tr");
      try { deckEl.setPointerCapture(e.pointerId); } catch (err) {}
    });
    deckEl.addEventListener("pointermove", function (e) {
      if (!drag) return;
      drag.dx = e.clientX - drag.x; drag.dy = e.clientY - drag.y;
      if (Math.abs(drag.dx) > 6 || Math.abs(drag.dy) > 6) drag.moved = true;
      drag.el.style.transform = "translate(" + drag.dx + "px," + (drag.dy * 0.4) + "px) rotate(" + (drag.dx * 0.06) + "deg)";
    });
    var endDrag = function () {
      if (!drag) return;
      var d = drag; drag = null;
      d.el.classList.remove("no-tr");
      if (Math.abs(d.dx) > 90) goDeck(1, d.dx < 0 ? -1 : 1); else d.el.style.transform = "";
      if (d.moved) { suppressClick = true; setTimeout(function () { suppressClick = false; }, 60); }
    };
    deckEl.addEventListener("pointerup", endDrag);
    deckEl.addEventListener("pointercancel", endDrag);
    var deckUi = document.querySelector("[data-deck-ui]");
    // Auto-play: while the deck is on screen and live, it flips to the next card by itself
    deckEl.addEventListener("pointerenter", function () { deckHover = true; });
    deckEl.addEventListener("pointerleave", function () { deckHover = false; });
    if (!reduceMotion) {
      setInterval(function () {
        if (!deckUi || !deckUi.classList.contains("is-live") || deckHover || drag || document.hidden || deckBusy) return;
        var r = storyEl.getBoundingClientRect();
        if (r.bottom < window.innerHeight * 0.6 || r.top > 0) return;
        if (Date.now() - deckFlipAt > 3600) goDeck(1);
      }, 400);
    }
    document.addEventListener("keydown", function (e) {
      if (!deckUi || !deckUi.classList.contains("is-live")) return;
      if (e.key === "ArrowRight") goDeck(1);
      else if (e.key === "ArrowLeft") goDeck(-1);
    });
    if (storyEl && finePointer && !reduceMotion) {
      storyEl.addEventListener("pointermove", function (e) {
        var r = deckEl.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        var y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        deckEl.style.setProperty("--rx", (x * 26).toFixed(2) + "deg");
        deckEl.style.setProperty("--ry", (-y * 20).toFixed(2) + "deg");
        deckEl.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
        deckEl.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
      }, { passive: true });
      storyEl.addEventListener("pointerleave", function () { deckEl.style.setProperty("--rx", "0deg"); deckEl.style.setProperty("--ry", "0deg"); });
    }
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

  var SUIT = { modelling: "♥", brand: "♠", research: "♣" };

  function cardHTML(p) {
    if (p.empty) {
      return (
        '<article class="card card--empty" data-category="' + esc(p.category) + '"><div class="pcard pcard--back" aria-label="' + esc(p.title) + '">' +
        '<span class="pcard__back"><i>' + SUIT[p.category] + "</i>" + esc(p.title) + "</span></div></article>"
      );
    }
    var soon = p.status === "coming-soon";
    return (
      '<article class="card" data-category="' + esc(p.category) + '">' +
      '<a href="project.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="pcard suit-' + esc(p.category) + '">' +
      '<div class="pcard__tab"><span>' + esc(p.title) + '</span><i aria-hidden="true">' + SUIT[p.category] + "</i></div>" +
      '<div class="pcard__body">' +
      '<div class="pcard__media">' +
      (soon ? '<span class="pcard__badge">' + (p.category === "research" ? "In progress" : "Coming soon") + "</span>" : "") +
      media(p.cover, p.tone, p.title, p.category) +
      "</div>" +
      '<p class="pcard__sum">' + esc(p.summary) + "</p>" +
      '<span class="pcard__meta">' + esc(p.subtitle || CATEGORY_LABEL[p.category]) + " · " + esc(p.year) + '<b aria-hidden="true">→</b></span>' +
      "</div></div></a></article>"
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
    var shown = Array.prototype.filter.call(grid.querySelectorAll(".card"), function (c) { return !c.classList.contains("is-hidden"); });
    shown.forEach(function (c, i) {
      var o = i - (shown.length - 1) / 2;
      c.style.setProperty("--o", o.toFixed(2));
      c.style.setProperty("--o2", (o * o).toFixed(2));
      c.classList.toggle("is-first", i === 0);
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
      .map(function (c) { return '<button class="tab" type="button" role="tab" data-filter="' + c.id + '" aria-selected="false"><i aria-hidden="true">' + SUIT[c.id] + "</i>" + esc(c.label) + "</button>"; })
      .join("");
    tabsEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (btn) setFilter(btn.getAttribute("data-filter"));
    });
    var wanted = new URLSearchParams(window.location.search).get("cat");
    var valid = SITE.categories.some(function (c) { return c.id === wanted; });
    setFilter(valid ? wanted : SITE.categories[0].id);
  }

  /* ---------- Instagram reels: a poster with a play button; the embed loads on tap ---------- */
  function igId(url) { return (String(url).match(/\/(?:reel|p)\/([\w-]+)/) || [])[1]; }
  function igPhone(r, i) {
    var id = igId(r.url);
    return (
      '<div class="phone" data-reveal><div class="phone__screen" data-ig="' + esc(id || "") + '">' +
      (id
        ? '<div class="phone__embed"><iframe src="https://www.instagram.com/reel/' + esc(id) + '/embed/" title="Instagram reel: ' + esc(r.title) + " " + esc(r.note || "") + '" allowfullscreen loading="lazy"></iframe></div>'
        : media("", [1, 4][i % 2], r.title, "video", r.title) +
          '<a class="phone__play" href="' + esc(r.url) + '" target="_blank" rel="noopener" aria-label="Open on Instagram"><span>▶</span></a>' +
          '<div class="phone__label">' + esc(r.title) + (r.note ? "<small>" + esc(r.note) + "</small>" : "") + "</div>") +
      "</div></div>"
    );
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("button.phone__play");
    var screen = btn && btn.closest(".phone__screen[data-ig]");
    if (!screen || !screen.getAttribute("data-ig")) return;
    var box = document.createElement("div");
    box.className = "phone__embed";
    box.innerHTML = '<iframe src="https://www.instagram.com/reel/' + esc(screen.getAttribute("data-ig")) + '/embed/" title="Instagram reel" allowfullscreen loading="lazy"></iframe>';
    screen.appendChild(box);
    btn.remove();
  });

  var featureEl = document.querySelector("[data-feature]");
  if (featureEl) {
    var uq = SITE.projects.filter(function (p) { return p.id === "uniqlo-ph"; })[0];
    if (uq && uq.reels && uq.reels.length) {
      featureEl.querySelector("[data-feature-title]").textContent = uq.title;
      featureEl.querySelector("[data-feature-note]").textContent = uq.summary;
      featureEl.querySelector("[data-feature-reels]").innerHTML = uq.reels.map(igPhone).join("");
    } else {
      (featureEl.closest(".reelstage") || featureEl).remove();
      var moreHead = document.querySelector(".reel .subhead");
      if (moreHead) moreHead.remove();
    }
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
          inner = '<div class="soon"><span class="soon__play" aria-hidden="true">\u25B6</span><b>Coming soon</b></div>';
        }
        return (
          '<div class="phone' + (v.src ? "" : " phone--soon") + '" data-reveal><div class="phone__screen">' + inner +
          '<div class="phone__label">' + esc(v.title) + (v.note ? "<small>" + esc(v.note) + "</small>" : "") + "</div></div></div>"
        );
      })
      .join("");

    var railStep = function (d) {
      var card = videosEl.querySelector(".phone");
      if (card) videosEl.scrollBy({ left: d * (card.offsetWidth + 20), behavior: "smooth" });
    };
    var rp = document.querySelector("[data-rail-prev]"), rn = document.querySelector("[data-rail-next]");
    if (rp) rp.addEventListener("click", function () { railStep(-1); });
    if (rn) rn.addEventListener("click", function () { railStep(1); });
    if (finePointer) {
      var rd = null;
      videosEl.addEventListener("pointerdown", function (e) { if (e.button === 0) rd = { x: e.clientX, left: videosEl.scrollLeft, moved: false }; });
      window.addEventListener("pointermove", function (e) {
        if (!rd) return;
        var dx = e.clientX - rd.x;
        if (!rd.moved && Math.abs(dx) > 6) { rd.moved = true; videosEl.classList.add("is-drag"); }
        if (rd.moved) videosEl.scrollLeft = rd.left - dx;
      });
      window.addEventListener("pointerup", function () { if (rd && rd.moved) setTimeout(function () { videosEl.classList.remove("is-drag"); }, 0); rd = null; });
      videosEl.addEventListener("dragstart", function (e) { e.preventDefault(); });
    }

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
    var ttReady = SITE.tiktok.filter(function (u) { return /video\/(\d+)/.test(u); });
    var ttSolo =
      '<a class="ttcard" data-reveal href="' + esc(ttProfile) + '" target="_blank" rel="noopener">' +
      '<span class="ttcard__star" aria-hidden="true">' + STAR + "</span>" +
      "<span><b>Follow @dimbokki</b><small>New videos land here first.</small></span>" +
      '<span class="btn">Open TikTok &rarr;</span></a>';
    tiktokEl.classList.toggle("is-solo", !ttReady.length);
    tiktokEl.innerHTML = !ttReady.length ? ttSolo : ttReady
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
    box.innerHTML =
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

  /* ---------- Illustrations: big filled shapes that sway ---------- */
  (function () {
    var defs = document.createElement("div");
    defs.setAttribute("aria-hidden", "true");
    defs.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    defs.innerHTML =
      '<svg width="0" height="0"><defs>' +
      '<linearGradient id="gPom" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FE9BB8"/><stop offset="1" stop-color="#AE2831"/></linearGradient>' +
      '<linearGradient id="gFlax" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E4BE"/><stop offset="1" stop-color="#FE9BB8"/></linearGradient>' +
      '<linearGradient id="gPink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E4BE"/><stop offset="1" stop-color="#F4C9D6"/></linearGradient>' +
      "</defs></svg>";
    document.body.appendChild(defs);

    function flower(fill, centre) {
      var petals = "";
      for (var i = 0; i < 5; i++) {
        var a = (i * 72 - 90) * Math.PI / 180;
        petals += '<circle cx="' + (50 + 27 * Math.cos(a)).toFixed(1) + '" cy="' + (50 + 27 * Math.sin(a)).toFixed(1) + '" r="21" fill="' + fill + '"/>';
      }
      return petals + '<circle cx="50" cy="50" r="12" fill="' + centre + '"/>';
    }
    function burst(fill) {
      var pts = [];
      for (var i = 0; i < 20; i++) {
        var a = (i * 18 - 90) * Math.PI / 180, r = i % 2 ? 27 : 49;
        pts.push((50 + r * Math.cos(a)).toFixed(1) + "," + (50 + r * Math.sin(a)).toFixed(1));
      }
      return '<polygon points="' + pts.join(" ") + '" fill="' + fill + '" stroke-linejoin="round"/>';
    }
    var SHAPES = {
      flowerPom: function () { return flower("url(#gPom)", "#F5F1E6"); },
      flowerFlax: function () { return flower("url(#gFlax)", "#AE2831"); },
      flowerPink: function () { return flower("#FE9BB8", "#3E2622"); },
      leaf: function () { return '<path d="M8 92C6 44 40 8 94 8C94 58 62 94 8 92Z" fill="#3E2622"/><path d="M12 88C34 62 58 38 86 14M40 62L24 60M52 48L36 44M64 36L52 28M30 74L18 76" fill="none" stroke="#F4C9D6" stroke-width="3.4" stroke-linecap="round"/>'; },
      leafPom: function () { return '<path d="M8 92C6 44 40 8 94 8C94 58 62 94 8 92Z" fill="#AE2831"/><path d="M12 88C34 62 58 38 86 14M40 62L24 60M52 48L36 44M64 36L52 28M30 74L18 76" fill="none" stroke="#FE9BB8" stroke-width="3.4" stroke-linecap="round"/>'; },
      burst: function () { return burst("#F6E4BE"); },
      burstPink: function () { return burst("#FE9BB8"); },
      heart: function () { return '<path d="M50 90C6 60 4 24 28 17C41 13 50 23 50 30C50 23 59 13 72 17C96 24 94 60 50 90Z" fill="url(#gPom)"/><path d="M30 34C24 38 24 46 28 52" fill="none" stroke="#F5F1E6" stroke-width="4" stroke-linecap="round"/>'; },
      heartPink: function () { return '<path d="M50 90C6 60 4 24 28 17C41 13 50 23 50 30C50 23 59 13 72 17C96 24 94 60 50 90Z" fill="#F4C9D6"/>'; },
      oval: function () { return '<ellipse cx="50" cy="50" rx="34" ry="48" fill="#F4C9D6"/><g fill="#F5F1E6"><circle cx="38" cy="30" r="11"/><circle cx="52" cy="26" r="13"/><circle cx="64" cy="32" r="10"/><rect x="26" y="30" width="48" height="12" rx="6"/><circle cx="42" cy="68" r="12"/><circle cx="57" cy="64" r="14"/><rect x="30" y="66" width="46" height="14" rx="7"/></g>'; },
      sparkle: function () { return '<path d="M50 4Q54 46 96 50Q54 54 50 96Q46 54 4 50Q46 46 50 4Z" fill="#F5F1E6"/>'; }
    };
    function illo(o) {
      var el = document.createElement("div");
      el.className = "illo" + (o.side ? " illo--" + o.side : "") + (o.bg ? " illo--bg" : "");
      el.setAttribute("aria-hidden", "true");
      el.style.cssText = "width:clamp(" + o.min + "px," + o.vw + "vw," + o.max + "px);" + o.pos + ";--rot:" + (o.rot || 0) + "deg;--sway:" + (o.sway || 5) + "deg;--dur:" + (o.dur || 7) + "s;--del:" + (o.del || 0) + "s";
      el.innerHTML = '<div class="illo__in"><svg viewBox="0 0 100 100" class="' + (o.spin ? "is-spin" : "") + '">' + SHAPES[o.k]() + "</svg></div>";
      return el;
    }

    var heroHost = document.querySelector("[data-illos]");
    if (heroHost) {
      [
        { k: "flowerPom", side: "l", min: 150, vw: 24, max: 380, pos: "left:-5%;top:50%", rot: -8 },
        { k: "leaf", side: "l", min: 110, vw: 17, max: 280, pos: "left:7%;top:12%", rot: 18, sway: 7 },
        { k: "heartPink", side: "l", min: 70, vw: 10, max: 170, pos: "left:19%;top:72%", rot: 14 },
        { k: "flowerFlax", side: "l", min: 80, vw: 12, max: 200, pos: "left:1%;top:8%", rot: 12, del: 1 },
        { k: "sparkle", side: "l", min: 30, vw: 4, max: 60, pos: "left:24%;top:30%", spin: true },
        { k: "burst", side: "r", min: 120, vw: 19, max: 330, pos: "right:5%;top:12%", spin: true },
        { k: "flowerPom", side: "r", min: 130, vw: 21, max: 340, pos: "right:-4%;top:46%", rot: 10, del: 0.6 },
        { k: "leaf", side: "r", min: 110, vw: 17, max: 280, pos: "right:11%;top:64%", rot: 200, sway: 6 },
        { k: "oval", side: "r", min: 70, vw: 10, max: 170, pos: "right:-1%;top:2%", rot: 8 },
        { k: "heart", side: "r", min: 60, vw: 8, max: 150, pos: "right:27%;top:78%", rot: -12 }
      ].forEach(function (o) { heroHost.appendChild(illo(o)); });
    }
    [
      [".work .wrap", { k: "burstPink", min: 70, vw: 8, max: 140, pos: "right:2%;top:-30px", spin: true, bg: true }],
      [".wins .wrap", { k: "burst", min: 90, vw: 11, max: 190, pos: "right:2%;top:-34px", spin: true, bg: true }],
      [".wins .wrap", { k: "flowerFlax", min: 80, vw: 9, max: 160, pos: "right:15%;top:-30px", rot: 10, bg: true }],
      [".contact .wrap", { k: "flowerPom", min: 90, vw: 12, max: 210, pos: "right:2%;top:6%", rot: -10, bg: true }],
      [".contact .wrap", { k: "heart", min: 60, vw: 7, max: 130, pos: "right:19%;top:34%", rot: 12, bg: true, del: 1 }],
      [".reel .section-head", { k: "flowerPink", min: 60, vw: 7, max: 120, pos: "left:40%;top:-22px", rot: 8, bg: true }]
    ].forEach(function (d) {
      var host = document.querySelector(d[0]);
      if (host) host.appendChild(illo(d[1]));
    });
  })();

  /* ---------- Marquee content ---------- */
  var mqEl = document.querySelector("[data-marquee]");
  if (mqEl) {
    var phrase = ["Creative", "Researcher", "Student", "Model"].map(function (w) { return "<span>" + w + "</span><i aria-hidden=\"true\">" + STAR + "</i>"; }).join("");
    var half = phrase + phrase + phrase;
    mqEl.innerHTML = half + half;
  }

  /* ---------- Project cards: 3D tilt toward the cursor ---------- */
  if (grid && finePointer && !reduceMotion) {
    grid.addEventListener("pointermove", function (e) {
      var body = e.target.closest(".pcard__body");
      if (!body) return;
      var r = body.getBoundingClientRect();
      body.style.setProperty("--tx", (((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(2) + "deg");
      body.style.setProperty("--ty", (-((e.clientY - r.top) / r.height - 0.5) * 12).toFixed(2) + "deg");
    });
    grid.addEventListener("pointerout", function (e) {
      var body = e.target.closest && e.target.closest(".pcard__body");
      if (body) { body.style.setProperty("--tx", "0deg"); body.style.setProperty("--ty", "0deg"); }
    });
  }

  /* ---------- Page-specific renderer (project.html / about.html) ---------- */
  if (typeof window.renderPage === "function") {
    window.renderPage({ esc: esc, media: media, igPhone: igPhone, CATEGORY_LABEL: CATEGORY_LABEL });
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
      '<div class="loader__card"><span class="loader__idx"><b>S</b><i>♥</i></span><span class="loader__mono">SNG</span><span class="loader__idx loader__idx--br"><b>S</b><i>♥</i></span></div>' +
      '<div class="loader__name"><span>Sofia <em>Nadine</em></span><span class="loader__bar"><i></i></span></div></div></div>';
    document.body.appendChild(loaderEl);
    html.classList.add("is-loading");
    heroBase = 2.7;
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
    if (deckEl) deckEl.classList.add("is-dealt");
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  window.__motionReady = true;

  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.07, wheelMultiplier: 0.85, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Loader timeline: a card flips over while the bar fills; then the panels sweep up
  if (loaderEl) {
    var lbar = loaderEl.querySelector(".loader__bar i");
    var lname = loaderEl.querySelector(".loader__name");
    var lcard = loaderEl.querySelector(".loader__card");
    var lblue = loaderEl.querySelector(".loader__blue");
    var lpink = loaderEl.querySelector(".loader__pink");
    var finish = function () { if (loaderEl) { loaderEl.remove(); loaderEl = null; } html.classList.remove("is-loading"); };
    var ltl = gsap.timeline({ onComplete: finish });
    ltl.from(lcard, { y: 40, opacity: 0, rotation: -10, duration: 0.7, ease: "back.out(1.6)" }, 0)
      .from(lname, { y: 12, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.1)
      .to(lbar, { scaleX: 1, duration: 1.7, ease: "power1.inOut" }, 0.2)
      .to(lcard, { rotationY: 360, duration: 1.2, ease: "power2.inOut" }, 0.7)
      .to(lcard, { y: -30, opacity: 0, duration: 0.4, ease: "power2.in" }, 2.0)
      .to(lname, { y: -14, opacity: 0, duration: 0.4, ease: "power2.in" }, 2.05)
      .to(lblue, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 2.2)
      .to(lpink, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 2.32);
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

  // Landing: nav pills
  gsap.from(".nav__inner", { y: -20, opacity: 0, duration: 1.1, ease: "power3.out", delay: heroBase + 0.3 });

  // Story: type intro, then the page floods, the deck tumbles in and the drawings slide on
  if (storyEl && deckEl) {
    var typeEl = storyEl.querySelector("[data-type]");
    var floodEl = storyEl.querySelector("[data-flood]");
    var typeLines = storyEl.querySelectorAll(".type__line > span");
    var typeExtras = storyEl.querySelectorAll(".type__side, .type__pron, .type__cue");
    var storyIllos = storyEl.querySelectorAll(".illo");
    var uiEl = storyEl.querySelector("[data-deck-ui]");
    var stageEl = storyEl.querySelector("[data-stage]");
    var deckStep = null;

    gsap.from(typeLines, { yPercent: 118, duration: 1.4, ease: "power4.out", stagger: 0.14, delay: heroBase + 0.1, onComplete: function () { typeEl.querySelector(".type").classList.add("is-in"); } });
    gsap.from(typeExtras, { opacity: 0, duration: 1.2, ease: "power2.out", delay: heroBase + 1 });

    var stl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: storyEl, start: "top top", end: "bottom bottom", scrub: 0.7,
        onUpdate: function (self) {
          typeOn = self.progress < 0.3;
          storyEl.classList.toggle("is-flooded", self.progress > 0.2);
          uiEl.classList.toggle("is-live", self.progress > 0.66);
          stageEl.classList.toggle("is-live", self.progress > 0.3);
          if (cards.length > 1 && uiEl.classList.contains("is-live")) {
            var step = Math.max(0, Math.floor((self.progress - 0.8) / 0.19 * (cards.length - 1)));
            if (deckStep === null) deckStep = step;
            else if (step !== deckStep) { var dd = step > deckStep ? 1 : -1; deckStep = step; goDeck(dd); }
          }
        },
      },
    });
    stl.fromTo(floodEl, { "--r": "0%" }, { "--r": "150%", duration: 2.6, ease: "power2.in" }, 1.4)
      .to(typeEl, { opacity: 0, scale: 1.14, duration: 1.4, ease: "power2.in" }, 1.9)
      .fromTo(deckEl, { yPercent: 135, rotation: -150, scale: 0.35, opacity: 0 }, { yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 2.8, ease: "power3.out" }, 3.4);
    Array.prototype.forEach.call(storyIllos, function (el, i) {
      var left = el.classList.contains("illo--l");
      stl.fromTo(el, { x: (left ? -1 : 1) * window.innerWidth * 0.8, rotation: (left ? -40 : 40) }, { x: 0, rotation: 0, duration: 2.3, ease: "power3.out" }, 4 + i * 0.12);
    });
    // Drawings drift against the cursor, and pop (spin + bounce) when clicked
    var illoIn = storyEl.querySelectorAll(".illo__in");
    if (finePointer) {
      var qx = [], qy = [];
      Array.prototype.forEach.call(illoIn, function (el) { qx.push(gsap.quickTo(el, "x", { duration: 1.3, ease: "power3.out" })); qy.push(gsap.quickTo(el, "y", { duration: 1.3, ease: "power3.out" })); });
      storyEl.addEventListener("pointermove", function (e) {
        var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
        Array.prototype.forEach.call(illoIn, function (el, i) { var d = (i % 4 + 1) * 22; qx[i](-nx * d); qy[i](-ny * d); });
      }, { passive: true });
    }
    storyEl.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest(".illo__in");
      if (!el || !stageEl.classList.contains("is-live")) return;
      gsap.timeline().to(el, { rotation: "+=360", scale: 1.3, duration: 0.7, ease: "back.out(2)" }).to(el, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.5)" }, ">-0.2");
    });
    stl.fromTo(uiEl, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 6.3)
      .to({}, { duration: 2.2 }, 7.3);
  }

  // Marquee: runs by itself, speeds up (and reverses) with your scroll
  var mq = document.querySelector("[data-marquee]");
  if (mq) {
    var mqt = gsap.to(mq, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
    ScrollTrigger.create({
      onUpdate: function (self) {
        var v = Math.abs(self.getVelocity()) / 350;
        gsap.to(mqt, { timeScale: (1 + v) * (self.direction < 0 ? -1 : 1), duration: 0.5, overwrite: true });
      },
    });
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
    gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });

  // Headings and notes reveal line by line (each line slides up out of a mask)
  function splitLines(el) {
    if (el._orig === undefined) el._orig = el.innerHTML;
    el.innerHTML = el._orig;
    var tokens = [], glue = false;
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { glue = false; return; }
          if (glue && tokens.length) tokens[tokens.length - 1] += esc(p); else tokens.push(esc(p));
          glue = true;
        });
      } else if (n.nodeType === 1) {
        if (glue && tokens.length) tokens[tokens.length - 1] += n.outerHTML; else tokens.push(n.outerHTML);
        glue = true;
      }
    });
    el.innerHTML = tokens.map(function (t) { return '<span class="tk">' + t + "</span>"; }).join(" ");
    var groups = [], lastTop = null;
    Array.prototype.forEach.call(el.querySelectorAll(".tk"), function (tk) {
      if (lastTop === null || Math.abs(tk.offsetTop - lastTop) > 4) { groups.push([]); lastTop = tk.offsetTop; }
      groups[groups.length - 1].push(tk.innerHTML);
    });
    el.innerHTML = groups.map(function (g) { return '<span class="ln"><span class="ln__in">' + g.join(" ") + "</span></span>"; }).join("");
    return el.querySelectorAll(".ln__in");
  }
  var lineEls = Array.prototype.slice.call(document.querySelectorAll("[data-lines]"));
  function runLines() {
    lineEls.forEach(function (el) {
      var lines = splitLines(el);
      el.style.visibility = "visible";
      if (el._done) { gsap.set(lines, { yPercent: 0 }); return; }
      gsap.from(lines, { yPercent: 118, duration: 1.3, ease: "power4.out", stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 88%", once: true, onEnter: function () { el._done = true; } } });
    });
    ScrollTrigger.refresh();
  }
  if (lineEls.length) {
    var linesRan = false;
    var startLines = function () { if (linesRan) return; linesRan = true; runLines(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(startLines);
    setTimeout(startLines, 1500);
    var lw = window.innerWidth, lt = null;
    window.addEventListener("resize", function () {
      if (!linesRan || window.innerWidth === lw) return;
      lw = window.innerWidth; clearTimeout(lt);
      lt = setTimeout(function () { lineEls.forEach(function (el) { el._done = true; }); runLines(); }, 250);
    });
  }

  // Sections slide over each other: work, reel and wins stay put while the next one covers them
  var stackEls = Array.prototype.slice.call(document.querySelectorAll(".work"));
  var stackNext = { work: ".reel" };
  if (stackEls.length && gsap.matchMedia) {
    gsap.matchMedia().add("(min-width: 900px) and (pointer: fine)", function () {
      var place = function () { stackEls.forEach(function (el) { el.style.top = Math.min(0, window.innerHeight - el.offsetHeight) + "px"; }); };
      html.classList.add("js-stack");
      place();
      ScrollTrigger.addEventListener("refreshInit", place);
      var ro = window.ResizeObserver ? new ResizeObserver(place) : null;
      stackEls.forEach(function (el) {
        if (ro) ro.observe(el);
        var nxt = document.querySelector(stackNext.work);
        var wrap = el.querySelector(".wrap");
        if (!nxt || !wrap) return;
        gsap.fromTo(wrap, { scale: 1, opacity: 1 }, { scale: 0.93, opacity: 0.3, ease: "none", transformOrigin: "50% 100%",
          scrollTrigger: { trigger: nxt, start: "top bottom", end: "top 15%", scrub: true } });
      });
      return function () {
        html.classList.remove("js-stack");
        ScrollTrigger.removeEventListener("refreshInit", place);
        if (ro) ro.disconnect();
        stackEls.forEach(function (el) { el.style.top = ""; });
      };
    });
  }

  // Reels: the dark panel tilts, grows to fill the screen, then a big headline rises over it
  var reelStage = document.querySelector("[data-reelstage]");
  var reelPanel = reelStage && reelStage.querySelector("[data-feature]");
  if (reelStage && reelPanel && gsap.matchMedia) {
    gsap.matchMedia().add("(min-width: 900px)", function () {
      html.classList.add("js-reelpin");
      var small = reelPanel.querySelector(".feature__text");
      var big = reelPanel.querySelector(".feature__big");
      var bigLines = big.querySelectorAll(".ln__in");
      var bigBtn = big.querySelector(".btn");
      gsap.set(reelPanel, { scale: 0.8, borderRadius: 44, rotationX: 10, rotationZ: -3, transformPerspective: 1200 });
      gsap.set(bigLines, { yPercent: 118 });
      gsap.set(bigBtn, { autoAlpha: 0, y: 20 });
      gsap.to(reelPanel, { scale: 1, borderRadius: 0, rotationX: 0, rotationZ: 0, ease: "none",
        scrollTrigger: { trigger: reelStage, start: "top 80%", end: "top top", scrub: 0.6 } });
      gsap.timeline({ scrollTrigger: { trigger: reelStage, start: "top top", end: "bottom bottom", scrub: 0.6 } })
        .to(small, { x: 160, rotation: 5, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.05)
        .to(bigLines, { yPercent: 0, duration: 0.35, stagger: 0.1, ease: "power3.out" }, 0.3)
        .to(bigBtn, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.62)
        .to({}, { duration: 0.25 });
      return function () { html.classList.remove("js-reelpin"); };
    });
  }

  // Work cards
  if (grid) {
    Array.prototype.forEach.call(grid.querySelectorAll(".card"), function (card, i) {
      card._reveal = gsap.fromTo(card, { y: 150, rotation: (i % 2 ? 8 : -8), opacity: 0 }, {
        y: 0, rotation: 0, opacity: 1, duration: 1.3, delay: (i % 4) * 0.1, ease: "back.out(1.15)", clearProps: "transform,opacity",
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

  // Illustrations in the sections: drift gently as you scroll
  gsap.utils.toArray(".illo--bg").forEach(function (el) {
    gsap.fromTo(el, { y: -26 }, { y: 26, ease: "none", scrollTrigger: { trigger: el.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Project page hero parallax
  gsap.utils.toArray(".proj-hero").forEach(function (frame) {
    var inner = frame.querySelector(".ph, img");
    if (!inner) return;
    gsap.fromTo(inner, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
