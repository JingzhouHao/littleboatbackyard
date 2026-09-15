(() => {
  const site = window.SITE;

  if (!site || !Array.isArray(site.collections)) {
    console.error("SITE data or collections are missing.");
    return;
  }


  /* =========================================================
     BASIC HELPERS
     ========================================================= */

  const get = (id) => document.getElementById(id);


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
    console.error("No collection found.");
    return;
  }


  /* =========================================================
     NORMALIZE PHOTO DATA
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
          src: photo.src || "",
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
    Keep track of genuinely broken
    image paths.

    A broken path is skipped in the
    lightbox, but valid photos are
    never hidden.
  */

  const failedPhotoIndices =
    new Set();


  let currentIndex = 0;



  /* =========================================================
     SAFE SHARED FUNCTIONS
     ========================================================= */

  function safeLocalized(value) {

    if (
      typeof window.localized ===
      "function"
    ) {

      return window.localized(
        value
      );
    }


    if (
      typeof value === "string"
    ) {

      return value;
    }


    if (
      value &&
      typeof value === "object"
    ) {

      return (
        value.en ||
        value.zh ||
        ""
      );
    }


    return "";
  }



  function safeSiteTitle() {

    if (
      typeof window.siteTitle ===
      "function"
    ) {

      return window.siteTitle();
    }


    return (
      safeLocalized(
        site.siteTitle
      )
      ||
      "Little Boat's Backyard"
    );
  }



  function safeUIText(
    key,
    fallback
  ) {

    if (
      typeof window.uiText ===
      "function"
    ) {

      return window.uiText(
        key
      );
    }


    return fallback;
  }



  function safeEscapeHTML(value) {

    if (
      typeof window.escapeHTML ===
      "function"
    ) {

      return window.escapeHTML(
        value
      );
    }


    const div =
      document.createElement(
        "div"
      );


    div.textContent =
      value ?? "";


    return div.innerHTML;
  }



  function currentLanguage() {

    if (
      typeof window.getLang ===
      "function"
    ) {

      return window.getLang();
    }


    return (
      site.defaultLang === "zh"
        ? "zh"
        : "en"
    );
  }



  /* =========================================================
     BILINGUAL COLLECTION TITLES
     ========================================================= */

  function collectionTitles() {

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
     PAGE
     ========================================================= */

  function renderPage() {

    const titles =
      collectionTitles();


    document.title =
      `${titles.primary} — ${safeSiteTitle()}`;


    /*
      Header brand
    */

    const brand =
      get("album-brand");


    if (brand) {

      brand.textContent =
        safeSiteTitle();
    }



    /*
      Main collection title
    */

    const albumTitle =
      get("album-title");


    if (albumTitle) {

      albumTitle.textContent =
        titles.primary;
    }



    /*
      Secondary language title
    */

    const albumMeta =
      get("album-meta");


    if (albumMeta) {

      albumMeta.textContent =
        titles.secondary;


      albumMeta.hidden =
        !titles.secondary;
    }



    /* =====================================================
       COLLECTION COVER
       ===================================================== */

    const cover =
      get("album-cover");


    if (cover) {

      cover.src =
        collection.cover ||
        "";


      cover.alt =
        titles.primary

          ? `${titles.primary} collection cover`

          : "Collection cover";


      cover.style.objectPosition =
        collection.coverPosition ||
        "50% 50%";
    }



    /* =====================================================
       INTRO
       ===================================================== */

    const intro =
      get("album-intro");


    if (intro) {

      intro.textContent =
        safeLocalized(
          collection.intro
        );


      intro.hidden =
        !intro.textContent.trim();
    }



    /* =====================================================
       REFLECTION
       ===================================================== */

    const reflection =
      get("album-reflection");


    if (reflection) {

      reflection.textContent =
        safeLocalized(
          collection.reflection
        );


      reflection.hidden =
        !reflection.textContent.trim();
    }



    /* =====================================================
       BACK LINK
       ===================================================== */

    const backLink =
      document.querySelector(
        ".back-link"
      );


    if (backLink) {

      backLink.textContent =
        safeUIText(
          "allCollections",
          "← All collections"
        );
    }



    /* =====================================================
       ABOUT COLLECTION LABEL
       ===================================================== */

    const introKicker =
      document.querySelector(
        ".album-intro-copy .kicker"
      );


    if (introKicker) {

      introKicker.textContent =
        safeUIText(
          "aboutCollection",
          "About this collection"
        );
    }



    /* =====================================================
       PHOTOS
       ===================================================== */

    renderPhotos();



    /* =====================================================
       FOOTER
       ===================================================== */

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
     RENDER EVERY PHOTO
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
      Rebuild the collection cleanly.
    */

    stories.innerHTML = "";


    failedPhotoIndices.clear();



    photos.forEach(
      (photo, index) => {


        /*
          Missing src:
          genuinely invalid entry.
        */

        if (!photo.src) {

          failedPhotoIndices.add(
            index
          );

          return;
        }



        const caption =
          safeLocalized(
            photo.caption || ""
          );


        const note =
          safeLocalized(
            photo.note || ""
          );



        /* =================================================
           ARTICLE
           ================================================= */

        const article =
          document.createElement(
            "article"
          );


        /*
          IMPORTANT:

          The article is NEVER hidden.

          We give it a landscape layout
          initially, then switch it to
          portrait after the image loads
          if necessary.

          Therefore no browser can get
          stuck waiting for a hidden
          lazy-loaded element.
        */

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



        /* =================================================
           FIGURE
           ================================================= */

        const figure =
          document.createElement(
            "figure"
          );


        figure.className =
          "photo-story-figure";



        /* =================================================
           IMAGE BUTTON
           ================================================= */

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



        /* =================================================
           IMAGE
           ================================================= */

        const img =
          document.createElement(
            "img"
          );


        /*
          THIS IS THE MAIN BUG FIX.

          Do NOT lazy-load photo 3 onward.

          Every photo is explicitly
          requested on desktop, tablet
          and mobile.
        */

        img.loading =
          "eager";


        /*
          Decode asynchronously so loading
          all images doesn't block layout
          more than necessary.
        */

        img.decoding =
          "async";



        img.alt =
          safeLocalized(
            photo.alt || ""
          )
          ||
          caption
          ||
          `${collectionTitles().primary} photograph ${index + 1}`;



        /* =================================================
           DETECT LANDSCAPE / PORTRAIT
           ================================================= */

        img.addEventListener(
          "load",
          () => {

            const isPortrait =
              img.naturalHeight >
              img.naturalWidth;


            /*
              Remove provisional class.
            */

            article.classList.remove(
              "photo-story--portrait",
              "photo-story--landscape"
            );


            /*
              Add real orientation.
            */

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



        /* =================================================
           BROKEN IMAGE
           ================================================= */

        img.addEventListener(
          "error",
          () => {

            /*
              Only remove this entry if
              the actual URL failed.

              Valid photos are unaffected.
            */

            failedPhotoIndices.add(
              index
            );


            article.remove();


            console.warn(
              `Could not load photograph: ${photo.src}`
            );

          },

          {
            once: true
          }
        );



        /*
          Set src AFTER event handlers.
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



        /* =================================================
           CAPTION / SHORT COMMENT
           ================================================= */

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
                    ${safeEscapeHTML(caption)}
                  </p>
                `

                : ""
            }


            ${
              note

                ? `
                  <p class="photo-tech">
                    ${safeEscapeHTML(note)}
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
          Add immediately.

          We DO NOT wait for img.load
          before adding it to the page.
        */

        stories.appendChild(
          article
        );

      }
    );
  }



  /* =========================================================
     LIGHTBOX
     ========================================================= */

  const lightbox =
    get("lightbox");


  const lightboxImage =
    get("lightbox-image");


  const lightboxCaption =
    get("lightbox-caption");



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
      safeLocalized(
        photo.caption || ""
      );


    const note =
      safeLocalized(
        photo.note || ""
      );


    lightboxImage.src =
      photo.src;


    lightboxImage.alt =
      safeLocalized(
        photo.alt || ""
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
     LIGHTBOX CONTROLS
     ========================================================= */

  get(
    "lightbox-close"
  )
  ?.addEventListener(
    "click",
    closeLightbox
  );


  get(
    "lightbox-prev"
  )
  ?.addEventListener(
    "click",
    () => move(-1)
  );


  get(
    "lightbox-next"
  )
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

      renderPage();
    }
  );



  /* =========================================================
     START
     ========================================================= */

  renderPage();

})();
