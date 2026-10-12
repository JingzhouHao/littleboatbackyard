(() => {

  const site = window.SITE;

  if (
    !site ||
    !Array.isArray(site.collections)
  ) {
    console.error("SITE data is missing.");
    return;
  }


  const get = id =>
    document.getElementById(id);


  const params =
    new URLSearchParams(
      window.location.search
    );


  const requestedId =
    params.get("id");


  const collection =
    site.collections.find(
      item =>
        item.id === requestedId
    )
    ||
    site.collections[0];


  if (!collection) {
    return;
  }


  const photos =
    (collection.photos || []).map(
      photo =>
        typeof photo === "string"
          ? {
              src: photo,
              caption: "",
              note: "",
              alt: ""
            }
          : photo
    );


  const lightbox =
    get("lightbox");

  const lightboxImage =
    get("lightbox-image");

  const lightboxCaption =
    get("lightbox-caption");

  let currentIndex = 0;



  /* ======================================================
     HELPERS
     ====================================================== */

  function localized(value) {

    if (
      typeof window.localized ===
      "function"
    ) {
      return window.localized(value);
    }


    if (
      value &&
      typeof value === "object"
    ) {

      const lang =
        typeof window.getLang ===
        "function"
          ? window.getLang()
          : "en";

      return (
        value[lang] ||
        value.en ||
        value.zh ||
        ""
      );
    }


    return value || "";
  }


  function escapeHTML(value) {

    if (
      typeof window.escapeHTML ===
      "function"
    ) {
      return window.escapeHTML(value);
    }


    const div =
      document.createElement("div");

    div.textContent =
      value ?? "";

    return div.innerHTML;
  }



  /* ======================================================
     COLLECTION TITLE
     ====================================================== */

  function collectionTitles() {

    const lang =
      typeof window.getLang ===
      "function"
        ? window.getLang()
        : "en";


    if (lang === "zh") {

      return {
        primary:
          collection.titleZh ||
          collection.title ||
          "",

        secondary:
          collection.title ||
          ""
      };
    }


    return {
      primary:
        collection.title ||
        collection.titleZh ||
        "",

      secondary:
        collection.titleZh ||
        ""
    };
  }



  /* ======================================================
     MAIN PAGE
     ====================================================== */

  function renderPage() {

    const titles =
      collectionTitles();


    document.title =
      `${titles.primary} — ${
        typeof window.siteTitle === "function"
          ? window.siteTitle()
          : "Little Boat's Backyard"
      }`;


    const brand =
      get("album-brand");

    if (brand) {

      brand.textContent =
        typeof window.siteTitle ===
        "function"
          ? window.siteTitle()
          : "Little Boat's Backyard";
    }


    const title =
      get("album-title");

    if (title) {
      title.textContent =
        titles.primary;
    }


    const meta =
      get("album-meta");

    if (meta) {

      meta.textContent =
        titles.secondary;

      meta.hidden =
        !titles.secondary;
    }



    /* ---------- Cover ---------- */

    const cover =
      get("album-cover");

    if (cover) {

      cover.src =
        collection.cover ||
        "assets/images/cover.jpeg";

      cover.alt =
        `${titles.primary} collection cover`;

      cover.style.objectPosition =
        collection.coverPosition ||
        "50% 50%";
    }



    /* ---------- Intro ---------- */

    const intro =
      get("album-intro");

    if (intro) {

      intro.textContent =
        localized(
          collection.intro
        );

      intro.hidden =
        !intro.textContent.trim();
    }



    /* ---------- Back link ---------- */

    const backLink =
      document.querySelector(
        ".back-link"
      );

    if (backLink) {

      backLink.textContent =
        typeof window.uiText ===
        "function"
          ? window.uiText(
              "allCollections"
            )
          : "← All collections";
    }



    /* ---------- Content ---------- */

    if (collection.textOnly) {

      renderTextSections();

    } else {

      renderPhotos();
    }



    /* ---------- Footer ---------- */

    if (
      typeof window.renderFooter ===
      "function"
    ) {

      window.renderFooter(
        "album-social-links",
        "album-copyright"
      );
    }
  }



  /* ======================================================
     TEXT-ONLY COLLECTION
     ====================================================== */

  function renderTextSections() {

    const stories =
      get("photo-stories");

    if (!stories) {
      return;
    }


    stories.innerHTML =
      "";

    stories.classList.add(
      "text-stories"
    );


    const sections =
      Array.isArray(
        collection.sections
      )
        ? collection.sections
        : [];


    sections.forEach(
      section => {

        const text =
          localized(
            section.text || ""
          ).trim();


        /*
          Empty sections II / III / IV
          are simply skipped.
        */
        if (!text) {
          return;
        }


        const label =
          localized(
            section.label || ""
          ).trim();


        const article =
          document.createElement(
            "article"
          );

        article.className =
          "text-story";


        if (label) {

          const labelElement =
            document.createElement(
              "div"
            );

          labelElement.className =
            "text-story-label";

          labelElement.textContent =
            label;

          article.appendChild(
            labelElement
          );
        }


        const paragraph =
          document.createElement(
            "p"
          );

        paragraph.className =
          "text-story-body";

        paragraph.textContent =
          text;


        article.appendChild(
          paragraph
        );


        stories.appendChild(
          article
        );
      }
    );
  }



  /* ======================================================
     PHOTO COLLECTION
     ====================================================== */

  function renderPhotos() {

    const stories =
      get("photo-stories");

    if (!stories) {
      return;
    }


    stories.innerHTML =
      "";

    stories.classList.remove(
      "text-stories"
    );


    photos.forEach(
      (photo, index) => {

        if (!photo?.src) {
          return;
        }


        const article =
          document.createElement(
            "article"
          );

        article.className =
          "photo-story";

        article.dataset.photoIndex =
          String(index);

        article.hidden =
          true;



        const figure =
          document.createElement(
            "figure"
          );

        figure.className =
          "photo-story-figure";



        const button =
          document.createElement(
            "button"
          );

        button.className =
          "photo-open";

        button.type =
          "button";

        button.setAttribute(
          "aria-label",
          `Open photograph ${index + 1}`
        );



        const img =
          document.createElement(
            "img"
          );


        const caption =
          localized(
            photo.caption || ""
          );


        const note =
          localized(
            photo.note || ""
          );


        const alt =
          localized(
            photo.alt || ""
          );


        img.alt =
          alt ||
          caption ||
          `${
            collectionTitles().primary
          } photograph ${index + 1}`;


        img.loading =
          index < 2
            ? "eager"
            : "lazy";


        img.addEventListener(
          "load",
          () => {

            const isPortrait =
              img.naturalHeight >
              img.naturalWidth;


            article.classList.add(
              isPortrait
                ? "photo-story--portrait"
                : "photo-story--landscape"
            );


            if (
              !caption &&
              !note
            ) {

              article.classList.add(
                "photo-story--no-note"
              );
            }


            article.hidden =
              false;
          },
          {
            once: true
          }
        );


        /*
          Broken path:
          remove that item instead
          of showing a broken image.
        */
        img.addEventListener(
          "error",
          () => {

            article.remove();

          },
          {
            once: true
          }
        );


        img.src =
          photo.src;


        button.appendChild(
          img
        );


        button.addEventListener(
          "click",
          () => {

            openLightbox(
              index
            );

          }
        );


        figure.appendChild(
          button
        );


        article.appendChild(
          figure
        );



        /* Caption + camera / film */

        if (
          caption ||
          note
        ) {

          const comment =
            document.createElement(
              "div"
            );

          comment.className =
            "photo-note";


          if (caption) {

            const captionElement =
              document.createElement(
                "p"
              );

            captionElement.className =
              "photo-caption";

            captionElement.textContent =
              caption;

            comment.appendChild(
              captionElement
            );
          }


          if (note) {

            const techElement =
              document.createElement(
                "p"
              );

            techElement.className =
              "photo-tech";

            techElement.textContent =
              note;

            comment.appendChild(
              techElement
            );
          }


          article.appendChild(
            comment
          );
        }


        stories.appendChild(
          article
        );
      }
    );
  }



  /* ======================================================
     LIGHTBOX
     ====================================================== */

  function availableIndices() {

    const stories =
      get("photo-stories");

    if (!stories) {
      return [];
    }


    return Array.from(
      stories.querySelectorAll(
        ".photo-story:not([hidden])"
      )
    )
      .map(
        element =>
          Number(
            element.dataset
              .photoIndex
          )
      )
      .filter(
        Number.isFinite
      );
  }



  function openLightbox(index) {

    if (
      collection.textOnly ||
      !photos[index]
    ) {
      return;
    }


    currentIndex =
      index;


    renderLightbox();


    lightbox
      ?.classList
      .add(
        "is-open"
      );


    lightbox
      ?.setAttribute(
        "aria-hidden",
        "false"
      );


    document.body
      .classList
      .add(
        "no-scroll"
      );
  }



  function closeLightbox() {

    lightbox
      ?.classList
      .remove(
        "is-open"
      );


    lightbox
      ?.setAttribute(
        "aria-hidden",
        "true"
      );


    document.body
      .classList
      .remove(
        "no-scroll"
      );
  }



  function move(step) {

    const available =
      availableIndices();


    if (!available.length) {
      return;
    }


    let position =
      available.indexOf(
        currentIndex
      );


    if (position < 0) {
      position = 0;
    }


    currentIndex =
      available[
        (
          position +
          step +
          available.length
        )
        %
        available.length
      ];


    renderLightbox();
  }



  function renderLightbox() {

    const photo =
      photos[currentIndex];


    if (
      !photo ||
      !lightboxImage ||
      !lightboxCaption
    ) {
      return;
    }


    const caption =
      localized(
        photo.caption || ""
      );


    const note =
      localized(
        photo.note || ""
      );


    lightboxImage.src =
      photo.src;


    lightboxImage.alt =
      localized(
        photo.alt || ""
      )
      ||
      caption
      ||
      `${
        collectionTitles().primary
      } photograph ${
        currentIndex + 1
      }`;


    lightboxCaption.textContent =
      [
        caption,
        note
      ]
        .filter(Boolean)
        .join(" · ");
  }



  /* ======================================================
     LIGHTBOX EVENTS
     ====================================================== */

  get("lightbox-close")
    ?.addEventListener(
      "click",
      closeLightbox
    );


  get("lightbox-prev")
    ?.addEventListener(
      "click",
      () =>
        move(-1)
    );


  get("lightbox-next")
    ?.addEventListener(
      "click",
      () =>
        move(1)
    );


  lightbox
    ?.addEventListener(
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


  document.addEventListener(
    "keydown",
    event => {

      if (
        !lightbox
          ?.classList
          .contains(
            "is-open"
          )
      ) {
        return;
      }


      if (
        event.key ===
        "Escape"
      ) {
        closeLightbox();
      }


      if (
        event.key ===
        "ArrowLeft"
      ) {
        move(-1);
      }


      if (
        event.key ===
        "ArrowRight"
      ) {
        move(1);
      }
    }
  );



  /* ======================================================
     LANGUAGE CHANGE
     ====================================================== */

  window.addEventListener(
    "languagechange",
    () => {

      closeLightbox();

      renderPage();
    }
  );



  /* ======================================================
     START
     ====================================================== */

  renderPage();

})();
