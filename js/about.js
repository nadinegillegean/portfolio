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

  // Portrait: set profile.portrait = "assets/img/portrait.jpg" in data.js to use a real photo
  fill("[data-portrait]", h.media(profile.portrait, 3, "Your portrait here", "modelling", profile.name));

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
