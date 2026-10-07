/*
  Renders about.html from window.SITE.profile and window.SITE.stories.
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
      .map(function (s, i) {
        return (
          '<article class="story" data-story>' +
          '<span class="story__stat">' + esc(s.stat) + "</span>" +
          '<h3 class="story__title">' + esc(s.title) + "</h3>" +
          '<p class="story__tag">' + esc(s.tag) + "</p>" +
          "<p>" + esc(s.text) + "</p></article>"
        );
      })
      .join("")
  );

  fill(
    "[data-toolkit]",
    window.SITE.toolkit
      .map(function (t) { return "<span>" + esc(t) + "</span>"; })
      .join("")
  );
};
