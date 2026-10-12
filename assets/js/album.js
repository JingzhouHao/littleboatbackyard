(() => {

  const site = window.SITE;

  if (
    !site ||
    !Array.isArray(site.collections)
  ) {
    console.error("SITE data is missing.");
    return;
  }


  /* ======================================================
     BASIC HELPERS
     ====================================================== */

  const get = id =>
    document.getElementById(id);


  function getLanguage() {

    if (
      typeof window.getLang ===
      "function"
    ) {
      return window.getLang();
    }

    return "en";
  }


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
        getLanguage();

      return (
        value[lang] ||
        value.en ||
        value.zh ||
        ""
      );
    }


    return value || "";
  }


  function siteTitle() {

    if (
      typeof window.siteTitle ===
      "function"
    ) {
      return window.siteTitle();
    }


    if (
      site.siteTitle &&
      typeof site.siteTitle ===
      "object"
    ) {

      return (
        localized(site.siteTitle) ||
        "Little Boat's Backyard"
      );
    }


    return (
      site.siteTitle ||
      "Little Boat's Backyard"
    );
  }



  /* ======================================================
     FIND CURRENT COLLECTION
     ====================================================== */

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
    console.error(
      "No collection found."
    );
    return;
  }



  /* ======================================================
     NORMALIZE PHOTOS
     ====================================================== */

  const photos =
    (
      Array.isArray(
        collection.photos
      )
        ? collection.photos
        : []
    ).map(
      photo => {

        if (
          typeof photo ===
          "string"
        ) {

          return {
            src: photo,
            caption: "",
            note: "",
            alt: ""
          };
        }

        return photo;
      }
    );



  /* ======================================================
     LIGHTBOX REFERENCES
     ====================================================== */

  const lightbox =
    get("lightbox");

  const lightboxImage =
    get("lightbox-image");

  const lightboxCaption =
    get("lightbox-caption");


  let currentIndex =
    0;



  /* ======================================================
     COLLECTION TITLES
     ====================================================== */

  function collectionTitles() {

    const lang =
      getLanguage();


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
     MAIN RENDER
     ====================================================== */

  function renderPage() {

    const titles =
      collectionTitles();


    /* ---------- Browser title ---------- */

    document.title =
      `${titles.primary} — ${siteTitle()}`;



    /* ---------- Brand ---------- */

    const brand =
      get("album-brand");

    if (brand) {

      brand.textContent =
        siteTitle();
    }



    /* ---------- Collection title ---------- */

    const title =
      get("album-title");

    if (title) {

      title.textContent =
        titles.primary;
    }



    /* ---------- Secondary title ---------- */

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

      const introText =
        localized(
          collection.intro
        );

      intro.textContent =
        introText;

      intro.hidden =
        !introText.trim();
    }



    /* ---------- Back link ---------- */

    const backLink =
      document.querySelector(
        ".back-link"
      );

    if (backLink) {

      if (
        typeof window.uiText ===
        "function"
      ) {

        backLink.textContent =
          window.uiText(
            "allCollections"
          );

      } else {

        backLink.textContent =
          getLanguage() === "zh"
            ? "← 返回全部合集"
            : "← All collections";
      }
    }



    /* ---------- Main content ---------- */

    if (
      collection.textOnly ===
      true
    ) {

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
          Do not render empty
          sections such as II, III, IV.
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



        /* Section number */

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



        /* Main prose */

        const body =
          document.createElement(
            "p"
          );

        body.className =
          "text-story-body";

        body.textContent =
          text;


        article.appendChild(
          body
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

        if (
          !photo ||
          !photo.src
        ) {
          return;
        }



        /* ---------- Article ---------- */

        const article =
          document.createElement(
            "article"
          );

        article.className =
          "photo-story";

        article.dataset.photoIndex =
          String(index);



        /*
          IMPORTANT:

          Do NOT set:

          article.hidden = true;

          A hidden parent prevents
          lazy-loaded images from loading.
        */



        /* ---------- Figure ---------- */

        const figure =
          document.createElement(
            "figure"
          );

        figure.className =
          "photo-story-figure";



        /* ---------- Image button ---------- */

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



        /* ---------- Image ---------- */

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



        /*
          First two images load
          immediately.

          Remaining images can lazy-load
          normally because their parent
          is NOT hidden.
        */

        img.loading =
          index < 2
            ? "eager"
            : "lazy";


        img.decoding =
          "async";



        /* ---------- Detect orientation ---------- */

        img.addEventListener(
          "load",
          () => {

            const isPortrait =
              img.naturalHeight >
              img.naturalWidth;


            article.classList.remove(
              "photo-story--portrait",
              "photo-story--landscape"
            );


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

            } else {

              article.classList.remove(
                "photo-story--no-note"
              );
            }

          },
          {
            once: true
          }
        );



        /* ---------- Broken image ---------- */

        img.addEventListener(
          "error",
          () => {

            /*
              Wrong filename/path:
              remove the whole item
              instead of showing a
              broken-image icon.
            */

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



        /* ---------- Lightbox ---------- */

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



        /* ==================================================
           CAPTION + CAMERA / FILM NOTE
           ================================================== */

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
     AVAILABLE LIGHTBOX PHOTOS
     ====================================================== */

  function availableIndices() {

    const stories =
      get("photo-stories");


    if (!stories) {
      return [];
    }


    return Array.from(
      stories.querySelectorAll(
        ".photo-story"
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



  /* ======================================================
     OPEN LIGHTBOX
     ====================================================== */

  function openLightbox(index) {

    if (
      collection.textOnly ||
      !photos[index] ||
      !lightbox
    ) {
      return;
    }


    currentIndex =
      index;


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



  /* ======================================================
     CLOSE LIGHTBOX
     ====================================================== */

  function closeLightbox() {

    if (!lightbox) {
      return;
    }


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



  /* ======================================================
     LIGHTBOX NAVIGATION
     ====================================================== */

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


    position =
      (
        position +
        step +
        available.length
      )
      %
      available.length;


    currentIndex =
      available[position];


    renderLightbox();
  }



  /* ======================================================
     RENDER LIGHTBOX
     ====================================================== */

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


    const alt =
      localized(
        photo.alt || ""
      );


    lightboxImage.src =
      photo.src;


    lightboxImage.alt =
      alt ||
      caption ||
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
     LIGHTBOX BUTTON EVENTS
     ====================================================== */

  get("lightbox-close")
    ?.addEventListener(
      "click",
      closeLightbox
    );


  get("lightbox-prev")
    ?.addEventListener(
      "click",
      () => {

        move(-1);

      }
    );


  get("lightbox-next")
    ?.addEventListener(
      "click",
      () => {

        move(1);

      }
    );



  /* Click background to close */

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



  /* Keyboard */

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
     LANGUAGE SWITCH
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
