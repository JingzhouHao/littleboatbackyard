(() => {

  const site = window.SITE;


  if (
    !site ||
    !Array.isArray(site.collections)
  ) {

    console.error(
      "SITE data or collections are missing."
    );

    return;
  }



  /* =========================================================
     HELPERS
     ========================================================= */

  const get = (id) =>
    document.getElementById(id);



  function currentLanguage() {

    if (
      typeof window.getLang === "function"
    ) {

      return window.getLang();
    }


    return (
      site.defaultLang === "zh"
        ? "zh"
        : "en"
    );
  }



  function localizedNonEmpty(value) {

    /*
      This version intentionally treats
      an empty translation as missing.

      Example:

      intro: {
        en: "",
        zh: "中文介绍"
      }

      Even if the page happens to be in
      English mode, the Chinese intro is
      still shown instead of disappearing.
    */


    if (value == null) {

      return "";
    }


    if (
      typeof value === "string"
    ) {

      return value.trim()
        ? value
        : "";
    }


    const lang =
      currentLanguage();


    const preferred =
      value[lang];


    if (
      typeof preferred === "string" &&
      preferred.trim()
    ) {

      return preferred;
    }


    /*
      Try English next.
    */

    if (
      typeof value.en === "string" &&
      value.en.trim()
    ) {

      return value.en;
    }


    /*
      Then Chinese.
    */

    if (
      typeof value.zh === "string" &&
      value.zh.trim()
    ) {

      return value.zh;
    }


    return "";
  }



  function safeSiteTitle() {

    if (
      typeof window.siteTitle === "function"
    ) {

      return window.siteTitle();
    }


    return (
      localizedNonEmpty(
        site.siteTitle
      )
      ||
      "Little Boat's Backyard"
    );
  }



  function uiText(
    key,
    fallback
  ) {

    if (
      typeof window.uiText === "function"
    ) {

      return window.uiText(key);
    }


    return fallback;
  }



  function escapeHTML(value) {

    if (
      typeof window.escapeHTML === "function"
    ) {

      return window.escapeHTML(
        value
      );
    }


    const div =
      document.createElement("div");


    div.textContent =
      value ?? "";


    return div.innerHTML;
  }



  /* =========================================================
     FIND CURRENT COLLECTION
     ========================================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );


  const requestedId =
    params.get("id");


  const collection =
    site.collections.find(
      (item) =>
        item.id === requestedId
    )

    ||

    site.collections[0];


  if (!collection) {

    console.error(
      "No collection was found."
    );

    return;
  }



  /* =========================================================
     NORMALIZE PHOTOS
     ========================================================= */

  const photos =
    (collection.photos || []).map(
      (photo) => {


        if (
          typeof photo === "string"
        ) {

          return {

            src: photo,

            caption: "",

            note: "",

            alt: ""
          };
        }


        return {

          src:
            photo.src || "",

          caption:
            photo.caption || "",

          note:
            photo.note || "",

          alt:
            photo.alt || ""
        };
      }
    );



  /*
    Only actual failed image URLs
    enter this Set.

    Nothing is hidden merely because
    it hasn't loaded yet.
  */

  const failedPhotoIndices =
    new Set();



  /* =========================================================
     BILINGUAL TITLES
     ========================================================= */

  function collectionTitles() {

    /*
      Chinese mode:

      Back to Human      <- secondary
      回到人类            <- primary

      English mode:

      回到人类            <- secondary
      Back to Human      <- primary
    */


    if (
      currentLanguage() === "zh"
    ) {

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



  /* =========================================================
     LIGHTBOX REFERENCES
     ========================================================= */

  const lightbox =
    get("lightbox");


  const lightboxImage =
    get("lightbox-image");


  const lightboxCaption =
    get("lightbox-caption");


  let currentIndex = 0;



  /* =========================================================
     PAGE
     ========================================================= */

  function renderPage() {

    const titles =
      collectionTitles();



    /* ---------------------------------------------------------
       Browser title
       --------------------------------------------------------- */

    document.title =
      `${titles.primary} — ${safeSiteTitle()}`;



    /* ---------------------------------------------------------
       Header brand
       --------------------------------------------------------- */

    const brand =
      get("album-brand");


    if (brand) {

      brand.textContent =
        safeSiteTitle();
    }



    /* ---------------------------------------------------------
       Collection titles
       --------------------------------------------------------- */

    const albumTitle =
      get("album-title");


    const albumMeta =
      get("album-meta");


    if (albumTitle) {

      albumTitle.textContent =
        titles.primary;
    }


    if (albumMeta) {

      albumMeta.textContent =
        titles.secondary;


      albumMeta.hidden =
        !titles.secondary;
    }



    /* ---------------------------------------------------------
       Cover
       --------------------------------------------------------- */

    const cover =
      get("album-cover");


    if (cover) {

      cover.src =
        collection.cover || "";


      cover.alt =
        titles.primary

          ? `${titles.primary} collection cover`

          : "Collection cover";


      cover.style.objectPosition =
        collection.coverPosition ||
        "50% 50%";
    }



    /* ---------------------------------------------------------
       INTRO ONLY
       --------------------------------------------------------- */

    const intro =
      get("album-intro");


    if (intro) {

      intro.textContent =
        localizedNonEmpty(
          collection.intro
        );


      intro.hidden =
        !intro.textContent.trim();
    }



    /* ---------------------------------------------------------
       Back link
       --------------------------------------------------------- */

    const backLink =
      document.querySelector(
        ".back-link"
      );


    if (backLink) {

      backLink.textContent =
        uiText(
          "allCollections",
          "← All collections"
        );
    }



    /* ---------------------------------------------------------
       Photos
       --------------------------------------------------------- */

    renderPhotos();



    /* ---------------------------------------------------------
       Footer
       --------------------------------------------------------- */

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



  /* =========================================================
     RENDER ALL PHOTOS

     IMPORTANT:

     No hidden state.
     No lazy-loading dependency.
     No "first two only" behavior.
     ========================================================= */

  function renderPhotos() {

    const stories =
      get("photo-stories");


    if (!stories) {

      console.error(
        'Element with id="photo-stories" was not found.'
      );

      return;
    }


    /*
      Language switching rebuilds
      the photo text cleanly.
    */

    stories.innerHTML = "";


    failedPhotoIndices.clear();



    photos.forEach(
      (photo, index) => {


        if (!photo.src) {

          failedPhotoIndices.add(
            index
          );

          return;
        }



        const caption =
          localizedNonEmpty(
            photo.caption
          );


        const note =
          localizedNonEmpty(
            photo.note
          );



        /* -----------------------------------------------------
           ARTICLE

           Default to landscape initially.

           If the image loads and is
           portrait, we swap the class.

           The article itself is NEVER hidden.
           ----------------------------------------------------- */

        const article =
          document.createElement(
            "article"
          );


        article.className =
          "photo-story photo-story--landscape";


        article.dataset.photoIndex =
          String(index);



        if (
          !caption &&
          !note
        ) {

          article.classList.add(
            "photo-story--no-note"
          );
        }



        /* -----------------------------------------------------
           FIGURE
           ----------------------------------------------------- */

        const figure =
          document.createElement(
            "figure"
          );


        figure.className =
          "photo-story-figure";



        /* -----------------------------------------------------
           BUTTON
           ----------------------------------------------------- */

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



        /* -----------------------------------------------------
           IMAGE
           ----------------------------------------------------- */

        const img =
          document.createElement(
            "img"
          );


        /*
          Critical bug fix:

          ALL photographs are loaded.

          We do not use browser lazy-loading
          for the collection body because
          different desktop/mobile browsers
          handled the previous hidden/lazy
          combination differently.
        */

        img.loading =
          "eager";


        /*
          Browser may decode asynchronously,
          which keeps the page responsive.
        */

        img.decoding =
          "async";



        img.alt =

          localizedNonEmpty(
            photo.alt
          )

          ||

          caption

          ||

          `${collectionTitles().primary} photograph ${index + 1}`;



        /* -----------------------------------------------------
           ORIENTATION DETECTION
           ----------------------------------------------------- */

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

          },

          {
            once: true
          }
        );



        /* -----------------------------------------------------
           REAL IMAGE ERROR

           Only a genuinely invalid path
           removes a photo.

           Failure of one photo does not
           affect later photographs.
           ----------------------------------------------------- */

        img.addEventListener(
          "error",

          () => {

            failedPhotoIndices.add(
              index
            );


            article.remove();


            console.warn(
              "Could not load photograph:",
              photo.src
            );

          },

          {
            once: true
          }
        );



        /*
          Event handlers are registered
          BEFORE setting src.
        */

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



        /* -----------------------------------------------------
           PHOTO COMMENT

           Landscape:
           displayed below photo by CSS.

           Portrait desktop:
           displayed right of photo by CSS.

           Portrait mobile:
           displayed below photo by CSS.
           ----------------------------------------------------- */

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


          comment.innerHTML = `

            ${
              caption

                ? `
                  <p class="photo-caption">
                    ${escapeHTML(caption)}
                  </p>
                `

                : ""
            }


            ${
              note

                ? `
                  <p class="photo-tech">
                    ${escapeHTML(note)}
                  </p>
                `

                : ""
            }

          `;


          article.appendChild(
            comment
          );
        }



        /*
          Append immediately.

          We do NOT wait for the image
          load event before putting the
          photograph into the document.
        */

        stories.appendChild(
          article
        );

      }
    );
  }



  /* =========================================================
     VALID LIGHTBOX PHOTOS
     ========================================================= */

  function validPhotoIndices() {

    return photos

      .map(
        (_, index) =>
          index
      )

      .filter(
        (index) =>

          !failedPhotoIndices.has(
            index
          )

          &&

          Boolean(
            photos[index]?.src
          )
      );
  }



  /* =========================================================
     OPEN LIGHTBOX
     ========================================================= */

  function openLightbox(index) {

    if (
      !lightbox ||
      failedPhotoIndices.has(index)
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



  /* =========================================================
     CLOSE LIGHTBOX
     ========================================================= */

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



  /* =========================================================
     NEXT / PREVIOUS
     ========================================================= */

  function move(step) {

    const valid =
      validPhotoIndices();


    if (!valid.length) {

      return;
    }


    let position =
      valid.indexOf(
        currentIndex
      );


    if (
      position === -1
    ) {

      position = 0;
    }


    position =
      (
        position +
        step +
        valid.length
      )
      %
      valid.length;


    currentIndex =
      valid[position];


    renderLightbox();
  }



  /* =========================================================
     LIGHTBOX CONTENT
     ========================================================= */

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
      localizedNonEmpty(
        photo.caption
      );


    const note =
      localizedNonEmpty(
        photo.note
      );



    lightboxImage.src =
      photo.src;



    lightboxImage.alt =

      localizedNonEmpty(
        photo.alt
      )

      ||

      caption

      ||

      `${collectionTitles().primary} photograph ${currentIndex + 1}`;



    lightboxCaption.textContent =

      [
        caption,
        note
      ]

      .filter(Boolean)

      .join(" · ");
  }



  /* =========================================================
     LIGHTBOX EVENTS
     ========================================================= */

  get("lightbox-close")
    ?.addEventListener(
      "click",
      closeLightbox
    );


  get("lightbox-prev")
    ?.addEventListener(
      "click",
      () => move(-1)
    );


  get("lightbox-next")
    ?.addEventListener(
      "click",
      () => move(1)
    );



  lightbox
    ?.addEventListener(
      "click",

      (event) => {

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

    (event) => {

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


      else if (
        event.key ===
        "ArrowLeft"
      ) {

        move(-1);
      }


      else if (
        event.key ===
        "ArrowRight"
      ) {

        move(1);
      }
    }
  );



  /* =========================================================
     LANGUAGE SWITCH
     ========================================================= */

  window.addEventListener(
    "languagechange",

    () => {

      closeLightbox();


      /*
        Rebuild both intro and photo
        text in the newly selected
        language.
      */

      renderPage();
    }
  );



  /* =========================================================
     START
     ========================================================= */

  renderPage();

})();
