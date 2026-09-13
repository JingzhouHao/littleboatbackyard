(() => {
  const site = window.SITE;
  if (!site) return;

  window.escapeHTML = function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
  };

  window.renderFooter = function renderFooter(socialTargetId, copyrightTargetId) {
    const linksTarget = document.getElementById(socialTargetId);
    const copyrightTarget = document.getElementById(copyrightTargetId);

    if (linksTarget) {
      const links = [];
      if (site.social?.instagram) {
        links.push(`<a href="${escapeAttribute(site.social.instagram)}" target="_blank" rel="noreferrer">Instagram</a>`);
      }
      if (site.social?.linkedin) {
        links.push(`<a href="${escapeAttribute(site.social.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>`);
      }
      linksTarget.innerHTML = links.join("");
      linksTarget.hidden = links.length === 0;
    }

    if (copyrightTarget) {
      const year = new Date().getFullYear();
      const owner = site.ownerName || site.siteTitle || "";
      const rights = site.copyright || "All rights reserved.";
      copyrightTarget.textContent = `© ${year} ${owner}. ${rights}`;
    }
  };

  function escapeAttribute(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
})();
