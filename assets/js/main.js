(() => {
  const site = window.SITE;
  if (!site) return;

  document.title = site.siteTitle || "摄影作品集";
  document.getElementById("site-title").textContent = site.siteTitle || "";
  document.getElementById("display-name").textContent = site.name || "";
  document.getElementById("hero-intro").textContent = site.intro || "";
  document.getElementById("footer-name").textContent = site.name || site.siteTitle || "";
  document.getElementById("year").textContent = new Date().getFullYear();

  const grid = document.getElementById("collection-grid");

  site.collections.forEach((collection, index) => {
    const card = document.createElement("a");
    card.className = "collection-card";
    card.href = `album.html?id=${encodeURIComponent(collection.id)}`;
    card.style.setProperty("--delay", `${index * 70}ms`);

    const imageWrap = document.createElement("div");
    imageWrap.className = "collection-image-wrap";

    const img = document.createElement("img");
    img.src = collection.cover;
    img.alt = `${collection.title} 合集封面`;
    img.loading = index < 2 ? "eager" : "lazy";
    img.style.objectPosition = collection.coverPosition || "50% 50%";

    const copy = document.createElement("div");
    copy.className = "collection-copy";
    copy.innerHTML = `
      <div>
        <h3>${escapeHTML(collection.title)}</h3>
        <p>${escapeHTML(collection.meta || "")}</p>
      </div>
      <span class="collection-arrow" aria-hidden="true">↗</span>
    `;

    imageWrap.appendChild(img);
    card.append(imageWrap, copy);
    grid.appendChild(card);
  });

  function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
  }
})();
