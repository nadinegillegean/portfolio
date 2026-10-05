/*
  Renders about.html from window.SITE.profile and window.SITE.cv.
  Called by main.js (via window.renderPage) before animations are set up.
*/
window.renderPage = function (h) {
  "use strict";
  var esc = h.esc;
  var profile = window.SITE.profile;
  var cv = window.SITE.cv;

  function fill(sel, html) {
    var el = document.querySelector(sel);
    if (el) el.innerHTML = html;
  }

  function list(items) {
    return items && items.length ? "<ul>" + items.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" : "";
  }

  fill("[data-bio]", profile.bio.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""));

  // Portrait: set profile.portrait = "assets/img/portrait.jpg" in data.js to use a real photo
  fill("[data-portrait]", h.media(profile.portrait, 3, "Your portrait here", "modelling", profile.name));

  fill(
    "[data-experience]",
    cv.experience
      .map(function (x) {
        return (
          '<li data-reveal><span class="years">' + esc(x.years) + "</span><div>" +
          "<h3>" + esc(x.org) + "</h3>" +
          '<p class="role">' + esc(x.role) + " · " + esc(x.place) + "</p>" +
          list(x.points) + "</div></li>"
        );
      })
      .join("")
  );

  fill(
    "[data-education]",
    cv.education
      .map(function (e) {
        return (
          '<li data-reveal><span class="years">' + esc(e.years) + "</span><div>" +
          "<h3>" + esc(e.school) + "</h3>" +
          '<p class="role">' + esc(e.program) + " · " + esc(e.place) + "</p>" +
          list(e.notes) + "</div></li>"
        );
      })
      .join("")
  );

  fill(
    "[data-skills]",
    Object.keys(cv.skills)
      .map(function (group) {
        return (
          '<div data-reveal><h3>' + esc(group) + '</h3><ul class="pills">' +
          cv.skills[group].map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") +
          "</ul></div>"
        );
      })
      .join("") +
      '<div data-reveal><h3>Organizations</h3><ul class="pills">' +
      cv.organizations.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") +
      "</ul></div>"
  );

  fill(
    "[data-achievements]",
    cv.achievements.map(function (a) { return '<li data-reveal><span class="years">★</span><div><h3>' + esc(a) + "</h3></div></li>"; }).join("")
  );
};
