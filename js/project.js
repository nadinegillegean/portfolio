/*
  Renders project.html?id=<project-id> from window.SITE.projects.
  Called by main.js (via window.renderPage) before animations are set up.
*/
window.renderPage = function (h) {
  "use strict";
  var root = document.querySelector("[data-project]");
  if (!root) return;

  var projects = window.SITE.projects;
  var id = new URLSearchParams(window.location.search).get("id");
  var index = -1;
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id === id) index = i;
  }

  if (index === -1) {
    document.title = "Not found — Sofia Nadine Gillegean";
    root.innerHTML =
      '<section class="notfound"><div class="wrap">' +
      '<p class="eyebrow">404</p>' +
      '<h1 class="page-title"><span class="line"><span>Page <em>not found.</em></span></span></h1>' +
      '<p class="lede" style="margin-inline:auto">That project could not be found. Head back to see all the work.</p>' +
      '<p style="margin-top:32px"><a class="btn" href="index.html#work">See all work →</a></p>' +
      "</div></section>";
    return;
  }

  var p = projects[index];
  var next = projects[(index + 1) % projects.length];
  var soon = p.status === "coming-soon";
  var esc = h.esc;
  document.title = p.title + " — Sofia Nadine Gillegean";

  function section(title, inner) {
    return (
      '<section class="proj__block" data-reveal>' +
      "<h2>" + esc(title) + "</h2>" +
      "<div>" + inner + "</div></section>"
    );
  }

  var titleWords = p.title.split(" ");
  var lastWord = titleWords.pop();
  var titleHTML =
    '<span class="line"><span>' + (titleWords.length ? esc(titleWords.join(" ")) + " " : "") + "<em>" + esc(lastWord) + "</em></span></span>";

  var meta = [
    ["Role", p.role],
    ["Year", p.year],
    ["Category", h.CATEGORY_LABEL[p.category]],
  ].filter(function (m) { return m[1]; });
  if (p.credits && p.credits.length) meta.push(["Credits", p.credits.join(" · ")]);
  if (soon) meta.push(["Status", "In progress"]);

  var out = "";

  // Two columns: the photo stays on the left, the details scroll on the right
  out +=
    '<div class="proj wrap">' +
    '<aside class="proj__media"><div class="proj__photo">' +
    h.media(p.cover, p.tone, soon ? "Photos coming soon" : p.title + " — cover", p.category, p.title) +
    "</div></aside>" +
    '<div class="proj__info">';

  // Header
  out +=
    '<header class="proj__head">' +
    '<p class="eyebrow">' + esc(h.CATEGORY_LABEL[p.category]) + (p.subtitle ? " · " + esc(p.subtitle) : "") + "</p>" +
    '<h1 class="page-title">' + titleHTML + "</h1>" +
    '<p class="lede">' + esc(p.summary) + "</p>" +
    '<dl class="proj-meta">' +
    meta.map(function (m) { return "<div><dt>" + esc(m[0]) + "</dt><dd>" + esc(m[1]) + "</dd></div>"; }).join("") +
    "</dl></header>";

  // Body
  out += section("Overview", "<p>" + esc(p.overview) + "</p>");

  if (p.reels && p.reels.length) {
    out += section("The reels", '<div class="phones phones--duo">' + p.reels.map(h.igPhone).join("") + "</div>");
  }

  if (soon) {
    out += section(p.category === "research" ? "The plan" : "What's coming",
      '<ol class="plan-list">' + (p.plan || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>"
    );
    out += section(
      "Status",
      "<p>" + (p.category === "research" ? "This study is in progress. Want to collaborate or see early findings?" : "Details will be added once the work is released. Want to work together in the meantime?") + "</p>" +
      '<p style="margin-top:24px"><a class="btn" data-email href="#">Get in touch →</a></p>'
    );
  } else {
    if (p.process) out += section("Process", "<p>" + esc(p.process) + "</p>");
    if (p.outcome) {
      var stats = (p.stats || [])
        .map(function (s) { return '<div class="stat"><b>' + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>"; })
        .join("");
      out += section("Outcome", "<p>" + esc(p.outcome) + "</p>" + (stats ? '<div class="stats">' + stats + "</div>" : ""));
    }
  }

  // Gallery
  if (p.gallery && p.gallery.length) {
    out += section("Gallery",
      '<div class="gallery">' +
      p.gallery
        .map(function (g, i) {
          return (
            '<figure><div class="frame">' +
            h.media(g.src, ((p.tone + i) % 8) + 1, g.caption, p.category, g.caption) +
            "</div>" + (g.caption ? "<figcaption>" + esc(g.caption) + "</figcaption>" : "") + "</figure>"
          );
        })
        .join("") +
      "</div>");
  }

  out += "</div></div>";

  // Next project
  out +=
    '<a class="next-proj" href="project.html?id=' + encodeURIComponent(next.id) + '" data-section data-wave data-cursor="big">' +
    '<div class="wrap"><p class="eyebrow">Next project</p>' +
    '<p class="display" style="font-weight:600">' + esc(next.title) + " →</p></div></a>";

  root.innerHTML = out;

  // Wire any email buttons that were just rendered
  Array.prototype.forEach.call(root.querySelectorAll("[data-email]"), function (a) {
    a.href = "mailto:" + window.SITE.profile.email;
  });
};
