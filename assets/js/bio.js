(() => {
  const site = window.SITE;
  if (!site) return;

  document.title = `Bio — ${site.siteTitle}`;
  document.getElementById("bio-brand").textContent = site.siteTitle;
  document.getElementById("bio-name").textContent = site.ownerName || "Bio";

  const cover = document.getElementById("bio-cover");
  cover.src = site.bio?.cover || site.homeCover || "assets/images/cover.jpeg";
  cover.style.objectPosition = site.bio?.coverPosition || "50% 50%";

  const portrait = document.getElementById("bio-portrait");
  portrait.src = site.bio?.portrait || site.homeCover || "assets/images/cover.jpeg";
  portrait.alt = site.bio?.portraitAlt || `Portrait of ${site.ownerName || "the photographer"}`;
  portrait.style.objectPosition = site.bio?.portraitPosition || "50% 50%";

  const text = document.getElementById("bio-text");
  (site.bio?.paragraphs || []).forEach(paragraph => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    text.appendChild(p);
  });

  document.getElementById("cv-description").textContent = site.bio?.cvDescription || "A PDF copy of my CV is available here.";
  const link = document.getElementById("cv-link");
  const missing = document.getElementById("cv-missing");
  if (site.bio?.cvFile) {
    link.href = site.bio.cvFile;
    link.hidden = false;
    missing.hidden = true;
  } else {
    link.hidden = true;
    missing.hidden = false;
  }

  window.renderFooter("bio-social-links", "bio-copyright");
})();
