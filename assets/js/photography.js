(() => {
  const site = window.SITE;
  if (!site) return;

  document.title = `Photography — ${site.siteTitle}`;
  document.getElementById("photo-brand").textContent = site.siteTitle;
  document.getElementById("photography-intro").textContent = site.photography?.intro || "";

  const cover = document.getElementById("photography-cover");
  cover.src = site.photography?.cover || site.homeCover || "assets/images/cover.jpeg";
  cover.style.objectPosition = site.photography?.coverPosition || "50% 50%";

  const grid = document.getElementById("collection-grid");
  (site.collections || []).forEach((collection, index) => {
    const card = document.createElement("a");
    card.className = "collection-card";
    card.href = `album.html?id=${encodeURIComponent(collection.id)}`;
    card.style.setProperty("--delay", `${Math.min(index, 8) * 55}ms`);

    const imageWrap = document.createElement("div");
    imageWrap.className = "collection-image-wrap";

    const img = document.createElement("img");
    img.src = collection.cover;
    img.alt = `${collection.title} collection cover`;
    img.loading = index < 3 ? "eager" : "lazy";
    img.style.objectPosition = collection.coverPosition || "50% 50%";

    const copy = document.createElement("div");
    copy.className = "collection-card-copy";
    copy.innerHTML = `
    <h3>${window.escapeHTML(collection.title)}</h3>
    ${collection.meta ? `<p>${window.escapeHTML(collection.meta)}</p>` : ""}
    `;

    imageWrap.appendChild(img);
    card.append(imageWrap, copy);
    grid.appendChild(card);
  });

  window.renderFooter("photo-social-links", "photo-copyright");
})();
