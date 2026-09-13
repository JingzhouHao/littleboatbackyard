(() => {
  const site = window.SITE;
  if (!site) return;

  document.title = site.siteTitle || "Photography";
  document.getElementById("site-title").textContent = site.siteTitle || "";
  document.getElementById("tagline").textContent = site.tagline || "";

  const image = document.getElementById("home-image");
  const backdrop = document.getElementById("home-backdrop");
  [image, backdrop].forEach(img => {
    img.src = site.homeCover || "assets/images/cover.jpeg";
  });
  image.alt = site.homeCoverAlt || "Website cover";

  window.renderFooter("home-social-links", "home-copyright");
})();
