(() => {
  const site = window.SITE;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const collection = site?.collections?.find(item => item.id === id) || site?.collections?.[0];

  if (!site || !collection) return;

  document.title = `${collection.title} — ${site.siteTitle}`;
  document.getElementById("album-brand").textContent = site.siteTitle;
  document.getElementById("album-footer-name").textContent = site.name || site.siteTitle;
  document.getElementById("album-year").textContent = new Date().getFullYear();

  const cover = document.getElementById("album-cover");
  cover.src = collection.cover;
  cover.alt = `${collection.title} 合集封面`;
  cover.style.objectPosition = collection.coverPosition || "50% 50%";

  document.getElementById("album-title").textContent = collection.title;
  document.getElementById("album-meta").textContent = collection.meta || "";
  document.getElementById("album-intro").textContent = collection.intro || "";
  document.getElementById("album-reflection").textContent = collection.reflection || "";

  const photos = (collection.photos || []).map(photo =>
    typeof photo === "string" ? { src: photo, caption: "" } : photo
  );

  const grid = document.getElementById("photo-grid");
  photos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.className = "photo-item";
    button.type = "button";
    button.setAttribute("aria-label", `打开第 ${index + 1} 张照片`);

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || `${collection.title} 照片 ${index + 1}`;
    img.loading = "lazy";

    button.appendChild(img);
    button.addEventListener("click", () => openLightbox(index));
    grid.appendChild(button);
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function move(step) {
    if (!photos.length) return;
    currentIndex = (currentIndex + step + photos.length) % photos.length;
    renderLightbox();
  }

  function renderLightbox() {
    const photo = photos[currentIndex];
    if (!photo) return;
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.caption || `${collection.title} 照片 ${currentIndex + 1}`;
    lightboxCaption.textContent = photo.caption || "";
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => move(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => move(1));

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
})();
