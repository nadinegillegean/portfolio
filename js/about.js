/*
  Renders about.html from window.SITE.profile, SITE.stories and SITE.toolkit.
  Called by main.js (via window.renderPage) before animations are set up.
*/
window.renderPage = function (h) {
  "use strict";
  var esc = h.esc;
  var profile = window.SITE.profile;
  var stories = window.SITE.stories;

  function fill(sel, html) {
    var el = document.querySelector(sel);
    if (el) el.innerHTML = html;
  }

  fill("[data-bio]", profile.bio.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""));

  fill("[data-facts]", (profile.facts || []).map(function (f) { return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join(""));

  // Portrait: set profile.portrait = "assets/img/portrait.jpg" in data.js to use a real photo.
  // profile.portraitAlt fades in on hover (tap on phones): the off-camera side.
  var portraitEl = document.querySelector("[data-portrait]");
  if (portraitEl) {
    portraitEl.innerHTML = h.media(profile.portrait, 3, "Your portrait here", "modelling", profile.name) +
      (profile.portraitAlt
        ? '<img class="portrait__alt" src="' + esc(profile.portraitAlt) + '" alt="' + esc(profile.short) + ' backstage on headset" loading="lazy">' +
          '<span class="portrait__tag" data-portrait-tag>On camera <i>/</i> hover for off camera</span>'
        : "");
    if (profile.portraitAlt) {
      var tag = portraitEl.querySelector("[data-portrait-tag]");
      var setTag = function (alt) { tag.innerHTML = alt ? "Off camera <i>/</i> stage manager" : "On camera <i>/</i> " + (matchMedia("(hover: hover)").matches ? "hover" : "tap") + " for off camera"; };
      setTag(false);
      portraitEl.addEventListener("mouseenter", function () { setTag(true); });
      portraitEl.addEventListener("mouseleave", function () { portraitEl.classList.remove("is-alt"); setTag(false); });
      portraitEl.addEventListener("click", function () { setTag(portraitEl.classList.toggle("is-alt")); });
    }
  }

  // "I'm a ___": cycle through profile.roles
  var roleEl = document.querySelector("[data-roles]");
  var roles = profile.roles || [];
  if (roleEl && roles.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ri = 0;
    setInterval(function () {
      roleEl.classList.add("is-out");
      setTimeout(function () {
        ri = (ri + 1) % roles.length;
        roleEl.textContent = roles[ri];
        roleEl.classList.remove("is-out");
      }, 450);
    }, 2400);
  }

  fill(
    "[data-stories]",
    stories
      .map(function (s) {
        return (
          '<a class="story" href="org.html?id=' + encodeURIComponent(s.org || "") + '">' +
          '<span class="story__stat">' + esc(s.stat) + "</span>" +
          '<h3 class="story__title">' + esc(s.title) + "</h3>" +
          '<p class="story__tag">' + esc(s.tag) + "</p>" +
          "<p>" + esc(s.text) + "</p></a>"
        );
      })
      .join("")
  );

  // Skills as a till receipt
  var total = 0;
  var rows = window.SITE.toolkit
    .map(function (g) {
      total += g.items.length;
      return (
        '<p class="receipt__group">' + esc(g.group) + "</p>" +
        g.items.map(function (t) { return '<div class="receipt__row"><span>1x ' + esc(t) + "</span><span>✓</span></div>"; }).join("")
      );
    })
    .join("");
  var d = new Date();
  var stamp = d.toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
  fill(
    "[data-receipt]",
    '<div class="receipt"><div class="receipt__paper">' +
      '<p class="receipt__title">SOFIA NADINE G.</p>' +
      '<p class="receipt__sub">SKILL RECEIPT</p>' +
      '<p class="receipt__meta"><span>ORDER #0001</span><span>' + stamp + "</span></p>" +
      '<hr class="receipt__rule">' + rows + '<hr class="receipt__rule">' +
      '<div class="receipt__row receipt__total"><span>TOTAL ITEMS</span><span>' + total + "</span></div>" +
      '<p class="receipt__thanks">THANK YOU, COME AGAIN</p>' +
      '<div class="receipt__bars" aria-hidden="true"></div>' +
    "</div></div>"
  );
};
