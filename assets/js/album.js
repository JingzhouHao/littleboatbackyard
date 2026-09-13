(() => {
  const site = window.SITE;

  if (!site || !Array.isArray(site.collections)) {
    console.error("SITE data or collections are missing.");
    return;
  }

  /* =========================================================
     Helpers
     ========================================================= */

  const get = id => document.getElementById(id);

  const escapeHTML =
    window.escapeHTML ||
    function (text) {
      return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    };


  /* =========================================================
     Find current collection
     ========================================================= */

  const params = new URLSearchParams(window.location.search);

  const requestedId = params.get("id");

  const collection =
    site.collections.find(item => item.id === requestedId) ||
    site.collections[0];

  if (!collection) {
    console.error("No collection found.");
    return;
  }


  /* =========================================================
     Page title
     ========================================================= */

  document.title =
    `${collection.title} — ${site.siteTitle}`;


  /* =========================================================
     Header / branding
     ========================================================= */

  const albumBrand = get("album-brand");

  if (albumBrand) {
    albumBrand.textContent = site.siteTitle;
  }


  /* =========================================================
     Album hero
     ========================================================= */

  const albumTitle = get("album-title");
  const albumMeta = get("album-meta");
  const albumCover = get("album-cover");

  /*
    English title:
    Back to Human

    Chinese title above it:
    回到人类
  */

  if (albumTitle) {
    albumTitle.textContent = collection.title || "";
  }

  if (albumMeta) {
    albumMeta.textContent = collection.titleZh || "";

    /*
      If there is no Chinese title,
      don't leave an empty line.
    */

    albumMeta.hidden = !collection.titleZh;
  }


  /*
    Collection cover image
  */

  if (albumCover) {
    albumCover.src = collection.cover || "";

    albumCover.alt =
      collection.title
        ? `${collection.title} collection cover`
        : "Collection cover";

    albumCover.style.objectPosition =
      collection.coverPosition || "50% 50%";
  }


  /* =========================================================
     Collection introduction
     ========================================================= */

  const albumIntro = get("album-intro");

  if (albumIntro) {
    albumIntro.textContent =
      collection.intro || "";

    albumIntro.hidden =
      !collection.intro?.trim();
  }


  /* =========================================================
     Collection reflection
     ========================================================= */

  const albumReflection =
    get("album-reflection");

  if (albumReflection) {
    albumReflection.textContent =
      collection.reflection || "";

    albumReflection.hidden =
      !collection.reflection?.trim();
  }


  /* =========================================================
     Normalize photo data
     ========================================================= */

  const photos =
    (collection.photos || []).map(photo => {

      if (typeof photo === "string") {
        return {
          src: photo,
          caption: "",
          note: "",
          alt: ""
        };
      }

      return {
        src: photo.src || "",
        caption: photo.caption || "",
        note: photo.note || "",
        alt: photo.alt || ""
      };
    });


  /* =========================================================
     Render photographs
     ========================================================= */

  const stories = get("photo-stories");

  if (!stories) {
    console.error(
      'Element with id="photo-stories" was not found.'
    );
    return;
  }

  stories.innerHTML = "";


  photos.forEach((photo, index) => {

    /*
      Entire photo block
    */

    const article =
      document.createElement("article");

    article.className = "photo-story";

    article.dataset.photoIndex =
      String(index);

    /*
      Keep it hidden until the image loads.

      This prevents the page from briefly showing
      broken image placeholders while orientation
      is being detected.
    */

    article.hidden = true;


    /* ---------------------------------------------------------
       Figure
       --------------------------------------------------------- */

    const figure =
      document.createElement("figure");

    figure.className =
      "photo-story-figure";


    /* ---------------------------------------------------------
       Clickable photo
       --------------------------------------------------------- */

    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "photo-open";

    button.setAttribute(
      "aria-label",
      `Open photograph ${index + 1}`
    );


    /* ---------------------------------------------------------
       Image
       --------------------------------------------------------- */

    const img =
      document.createElement("img");

    img.alt =
      photo.alt ||
      photo.caption ||
      `${collection.title} photograph ${index + 1}`;

    /*
      First two photographs load immediately.
      The rest lazy-load.
    */

    img.loading =
      index < 2 ? "eager" : "lazy";


    /*
      When the photo loads,
      determine whether it is portrait or landscape.
    */

    img.addEventListener(
      "load",
      () => {

        const isPortrait =
          img.naturalHeight >
          img.naturalWidth;

        if (isPortrait) {
          article.classList.add(
            "photo-story--portrait"
          );
        } else {
          article.classList.add(
            "photo-story--landscape"
          );
        }


        /*
          If there is no written note,
          add an extra class.

          CSS can use this to remove unnecessary
          blank text space.
        */

        const hasNote =
          Boolean(photo.note.trim());

        if (!hasNote) {
          article.classList.add(
            "photo-story--no-note"
          );
        }


        /*
          Photo is now ready.
        */

        article.hidden = false;
      },
      { once: true }
    );


    /*
      If the image path is wrong,
      remove the entire block.

      This prevents:

      broken-image icon
      +
      "Back to Human photograph"
    */

    img.addEventListener(
      "error",
      () => {
        article.remove();
      },
      { once: true }
    );


    img.src = photo.src;


    button.appendChild(img);

    figure.appendChild(button);


    /* ---------------------------------------------------------
       Optional caption
       --------------------------------------------------------- */

    if (photo.caption.trim()) {

      const figcaption =
        document.createElement(
          "figcaption"
        );

      figcaption.textContent =
        photo.caption;

      figure.appendChild(
        figcaption
      );
    }


    article.appendChild(figure);


    /* ---------------------------------------------------------
       Optional short comment / note
       --------------------------------------------------------- */

    if (photo.note.trim()) {

      const note =
        document.createElement("div");

      note.className =
        "photo-note";


      /*
        Number is retained in case you want it.
        CSS can hide .photo-number later if desired.
      */

      const number =
        String(index + 1)
          .padStart(2, "0");


      note.innerHTML = `
        <span class="photo-number">
          ${number}
        </span>

        <p>
          ${escapeHTML(photo.note)}
        </p>
      `;


      article.appendChild(note);
    }


    /* ---------------------------------------------------------
       Open lightbox
       --------------------------------------------------------- */

    button.addEventListener(
      "click",
      () => {
        openLightbox(index);
      }
    );


    stories.appendChild(article);
  });


  /* =========================================================
     Lightbox
     ========================================================= */

  const lightbox =
    get("lightbox");

  const lightboxImage =
    get("lightbox-image");

  const lightboxCaption =
    get("lightbox-caption");

  const lightboxClose =
    get("lightbox-close");

  const lightboxPrev =
    get("lightbox-prev");

  const lightboxNext =
    get("lightbox-next");


  let currentIndex = 0;


  /*
    Return only photos that successfully loaded
    and are currently visible on the page.

    This means a broken file will NOT be included
    when pressing the arrow keys.
  */

  function getAvailableIndices() {

    return Array
      .from(
        stories.querySelectorAll(
          ".photo-story:not([hidden])"
        )
      )
      .map(article =>
        Number(
          article.dataset.photoIndex
        )
      )
      .filter(index =>
        Number.isFinite(index)
      );
  }


  function openLightbox(index) {

    if (!lightbox) return;

    currentIndex = index;

    renderLightbox();

    lightbox.classList.add(
      "is-open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "no-scroll"
    );
  }


  function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove(
      "is-open"
    );

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "no-scroll"
    );
  }


  function renderLightbox() {

    const photo =
      photos[currentIndex];

    if (!photo) return;


    if (lightboxImage) {

      lightboxImage.src =
        photo.src;

      lightboxImage.alt =
        photo.alt ||
        photo.caption ||
        `${collection.title} photograph ${currentIndex + 1}`;
    }


    if (lightboxCaption) {

      lightboxCaption.textContent =
        photo.caption ||
        photo.note ||
        "";
    }
  }


  function moveLightbox(step) {

    const available =
      getAvailableIndices();

    if (!available.length) {
      return;
    }


    let position =
      available.indexOf(
        currentIndex
      );


    /*
      If for some reason current image
      is not in the valid-image list,
      start from the first one.
    */

    if (position === -1) {
      position = 0;
    }


    position =
      (
        position +
        step +
        available.length
      ) %
      available.length;


    currentIndex =
      available[position];

    renderLightbox();
  }


  /* =========================================================
     Lightbox controls
     ========================================================= */

  if (lightboxClose) {

    lightboxClose.addEventListener(
      "click",
      closeLightbox
    );
  }


  if (lightboxPrev) {

    lightboxPrev.addEventListener(
      "click",
      () => moveLightbox(-1)
    );
  }


  if (lightboxNext) {

    lightboxNext.addEventListener(
      "click",
      () => moveLightbox(1)
    );
  }


  /*
    Clicking the dark background
    closes the lightbox.
  */

  if (lightbox) {

    lightbox.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          lightbox
        ) {
          closeLightbox();
        }
      }
    );
  }


  /*
    Keyboard controls
  */

  document.addEventListener(
    "keydown",
    event => {

      if (
        !lightbox ||
        !lightbox.classList.contains(
          "is-open"
        )
      ) {
        return;
      }


      if (event.key === "Escape") {
        closeLightbox();
      }


      if (event.key === "ArrowLeft") {
        moveLightbox(-1);
      }


      if (event.key === "ArrowRight") {
        moveLightbox(1);
      }
    }
  );


  /* =========================================================
     Footer
     ========================================================= */

  if (
    typeof window.renderFooter ===
    "function"
  ) {

    window.renderFooter(
      "album-social-links",
      "album-copyright"
    );
  }

})();
