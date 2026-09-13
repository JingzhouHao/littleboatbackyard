(() => {
  const site = window.SITE;
  if (!site) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id");

  const collection =
    site.collections?.find(item => item.id === requestedId) ||
    site.collections?.[0];

  if (!collection) return;

  document.title = `${collection.title} — ${site.siteTitle}`;

  document.getElementById("album-brand").textContent = site.siteTitle;
  document.getElementById("album-title").textContent = collection.title;

  // Meta such as "2026" can stay in site-data.js,
  // but CSS now hides it from the album hero.
  document.getElementById("album-meta").textContent =
    collection.meta || "";

  document.getElementById("album-intro").textContent =
    collection.intro || "";

  const reflection = document.getElementById("album-reflection");
  reflection.textContent = collection.reflection || "";
  reflection.hidden = !collection.reflection;

  // Collection cover
  const cover = document.getElementById("album-cover");
  cover.src = collection.cover;
  cover.alt = `${collection.title} collection cover`;
  cover.style.objectPosition =
    collection.coverPosition || "50% 50%";

  // Normalize photo entries
  const photos = (collection.photos || []).map(photo => {
    if (typeof photo === "string") {
      return {
        src: photo,
        caption: "",
        note: "",
        alt: ""
      };
    }

    return photo;
  });

  const stories = document.getElementById("photo-stories");

  photos.forEach((photo, index) => {
    const article = document.createElement("article");

    const hasNote = Boolean(photo.note?.trim());

    article.className =
      `photo-story${hasNote ? "" : " photo-story--no-note"}`;

    // Hide until image loads so orientation can be detected first
    article.hidden = true;

    const figure = document.createElement("figure");
    figure.className = "photo-story-figure";

    const button = document.createElement("button");
    button.className = "photo-open";
    button.type = "button";
    button.setAttribute(
      "aria-label",
      `Open photograph ${index + 1}`
    );

    const img = document.createElement("img");

    img.alt =
      photo.alt ||
      photo.caption ||
      `${collection.title} photograph ${index + 1}`;

    img.loading = index < 2 ? "eager" : "lazy";

    // Automatically detect portrait vs landscape
    img.addEventListener(
      "load",
      () => {
        const isPortrait =
          img.naturalHeight > img.naturalWidth;

        article.classList.add(
          isPortrait
            ? "photo-story--portrait"
            : "photo-story--landscape"
        );

        article.hidden = false;
      },
      { once: true }
    );

    // If a path is wrong, remove the broken image entirely
    // instead of showing the broken-image icon + alt text.
    img.addEventListener(
      "error",
      () => {
        article.remove();
      },
      { once: true }
    );

    img.src = photo.src;

    button.appendChild(img);

    button.addEventListener("click", () => {
      openLightbox(index);
    });

    figure.appendChild(button);

    // Optional caption under the photo
    if (photo.caption) {
      const figcaption =
        document.createElement("figcaption");

      figcaption.textContent = photo.caption;

      figure.appendChild(figcaption);
    }

    article.appendChild(figure);

    // Optional note
    if (hasNote) {
      const note = document.createElement("div");
      note.className = "photo-note";

      note.innerHTML = `
        <span class="photo-number">
          ${String(index + 1).padStart(2, "0")}
        </span>
        <p>${window.escapeHTML(photo.note)}</p>
      `;

      article.appendChild(note);
    }

    stories.appendChild(article);
  });

  // ---------- Lightbox ----------
  const lightbox =
    document.getElementById("lightbox");

  const lightboxImage =
    document.getElementById("lightbox-image");

  const lightboxCaption =
    document.getElementById("lightbox-caption");

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

    currentIndex =
      (currentIndex + step + photos.length) %
      photos.length;

    renderLightbox();
  }

  function renderLightbox() {
    const photo = photos[currentIndex];

    if (!photo) return;

    lightboxImage.src = photo.src;

    lightboxImage.alt =
      photo.alt ||
      photo.caption ||
      `${collection.title} photograph ${currentIndex + 1}`;

    lightboxCaption.textContent =
      photo.caption ||
      photo.note ||
      "";
  }

  document
    .getElementById("lightbox-close")
    .addEventListener("click", closeLightbox);

  document
    .getElementById("lightbox-prev")
    .addEventListener("click", () => move(-1));

  document
    .getElementById("lightbox-next")
    .addEventListener("click", () => move(1));

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      move(-1);
    }

    if (event.key === "ArrowRight") {
      move(1);
    }
  });

  window.renderFooter(
    "album-social-links",
    "album-copyright"
  );
})();
