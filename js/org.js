/*
  Renders org.html?id=<org-id> from window.SITE.orgs.
  Called by main.js (via window.renderPage) before animations are set up.
*/
window.renderPage = function (h) {
  "use strict";
  var root = document.querySelector("[data-org]");
  if (!root) return;

  var orgs = window.SITE.orgs;
  var id = new URLSearchParams(window.location.search).get("id");
  var index = -1;
  for (var i = 0; i < orgs.length; i++) if (orgs[i].id === id) index = i;
  var esc = h.esc;

  if (index === -1) {
    document.title = "Not found — Sofia Nadine Gillegean";
    root.innerHTML =
      '<section class="notfound"><div class="wrap">' +
      '<p class="eyebrow">404</p>' +
      '<h1 class="page-title"><span class="line"><span>Page <em>not found.</em></span></span></h1>' +
      '<p class="lede" style="margin-inline:auto">That page could not be found.</p>' +
      '<p style="margin-top:32px"><a class="btn" href="index.html#experience">Back to experience</a></p>' +
      "</div></section>";
    return;
  }

  var o = orgs[index];
  var next = orgs[(index + 1) % orgs.length];
  document.title = o.name + " — Sofia Nadine Gillegean";

  function section(title, inner) {
    return '<section class="proj__block" data-reveal><h2>' + esc(title) + "</h2><div>" + inner + "</div></section>";
  }

  var words = o.name.split(" ");
  var last = words.pop();
  var titleHTML = '<span class="line"><span>' + (words.length ? esc(words.join(" ")) + " " : "") + "<em>" + esc(last) + "</em></span></span>";

  // Same layout as project pages: photo on the left, details on the right
  var out =
    '<div class="proj wrap">' +
    '<aside class="proj__media"><div class="proj__photo">' + h.media(o.cover, o.tone, o.name + " photo", o.icon, o.name) + "</div></aside>" +
    '<div class="proj__info"><header class="proj__head">' +
    '<p class="eyebrow">' + esc(o.years) + " · " + esc(o.place) + "</p>" +
    '<h1 class="page-title">' + titleHTML + "</h1>" +
    '<p class="lede">' + esc(o.summary) + "</p>" +
    '<dl class="proj-meta"><div><dt>Role</dt><dd>' + esc(o.role) + "</dd></div><div><dt>Years</dt><dd>" + esc(o.years) + "</dd></div><div><dt>Where</dt><dd>" + esc(o.place) + "</dd></div></dl>" +
    "</header>";

  if (o.did && o.did.length) {
    out += section("What I did", '<ul class="did-list">' + o.did.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>");
  }
  if (o.results && o.results.length) {
    out += section("Results", '<div class="stats">' + o.results.map(function (s) { return '<div class="stat"><b>' + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>"; }).join("") + "</div>");
  }
  if (o.gallery && o.gallery.length) {
    out += section("Gallery", '<div class="gallery">' +
      o.gallery.map(function (g, i) {
        return '<figure><div class="frame">' + h.media(g.src, ((o.tone + i) % 8) + 1, g.caption, o.icon, g.caption) + "</div>" + (g.caption ? "<figcaption>" + esc(g.caption) + "</figcaption>" : "") + "</figure>";
      }).join("") + "</div>");
  }
  out += "</div></div>";

  out += '<a class="next-proj" href="org.html?id=' + encodeURIComponent(next.id) + '" data-section><div class="wrap"><p class="eyebrow">Next</p><p class="display" style="font-weight:600">' + esc(next.name) + " →</p></div></a>";
  root.innerHTML = out;
};
