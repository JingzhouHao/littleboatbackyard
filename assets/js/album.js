(() => {

  const site =
    window.SITE;


  if (
    !site ||
    !Array.isArray(
      site.collections
    )
  ) {
    return;
  }


  const get =
    id =>
      document.getElementById(
        id
      );


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
    (
      collection.photos || []
    ).map(photo =>

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
     Bilingual collection title
     ====================================================== */

  function collectionTitles() {

    if (
      window.getLang() === "zh"
    ) {

      return {

        primary:
          collection.titleZh ||
          collection.title,

        secondary:
          collection.title ||
          ""
      };
    }


    return {

      primary:
        collection.title ||
        collection.titleZh,

      secondary:
        collection.titleZh ||
        ""
    };
  }


  function localizedPhotoText(
    value
  ) {

    return window.localized(
      value
    );
  }


  /* ======================================================
     Main render
     ====================================================== */

  function renderPage() {

    const t =
      collectionTitles();


    document.title =
      `${t.primary} — ` +
      `${window.siteTitle()}`;


    get(
      "album-brand"
    ).textContent =
      window.siteTitle();


    /*
      Other-language title:
      small, above.

      Current-language title:
      large, below.
    */

    get(
      "album-title"
    ).textContent =
      t.primary;


    get(
      "album-meta"
    ).textContent =
      t.secondary;


    get(
      "album-meta"
    ).hidden =
      !t.secondary;


    /* Cover */

    const cover =
      get("album-cover");


    cover.src =
      collection.cover;


    cover.alt =
      `${t.primary} collection cover`;


    cover.style.objectPosition =
      collection
        .coverPosition ||
      "50% 50%";


    /* Intro */

    const intro =
      get("album-intro");


    const reflection =
      get("album-reflection");


    intro.textContent =
      window.localized(
        collection.intro
      );


    reflection.textContent =
      window.localized(
        collection.reflection
      );


    intro.hidden =
      !intro
        .textContent
        .trim();


    reflection.hidden =
      !reflection
        .textContent
        .trim();


    document.querySelector(
      ".back-link"
    ).textContent =
      window.uiText(
        "allCollections"
      );


    document.querySelector(
      ".album-intro-copy .kicker"
    ).textContent =
      window.uiText(
        "aboutCollection"
      );


    renderPhotos();


    window.renderFooter(
      "album-social-links",
      "album-copyright"
    );
  }


  /* ======================================================
     Photos
     ====================================================== */

  function renderPhotos() {

    const stories =
      get("photo-stories");


    stories.innerHTML =
      "";


    photos.forEach(
      (photo, index) => {

        const article =
          document.createElement(
            "article"
          );


        article.className =
          "photo-story";


        article.dataset.photoIndex =
          String(index);


        /*
          Wait for photo to load
          before displaying it.

          That lets us identify
          portrait vs landscape.
        */



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
          localizedPhotoText(
            photo.caption || ""
          );


        const note =
          localizedPhotoText(
            photo.note || ""
          );


        img.alt =
          localizedPhotoText(
            photo.alt || ""
          )

          ||

          caption

          ||

          `${collectionTitles().primary} photograph ${index + 1}`;


        img.loading =
          index < 2
            ? "eager"
            : "lazy";


        /* Orientation detection */

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
          Wrong path:
          remove the broken item.

          No broken-image icon.
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
          () =>
            openLightbox(
              index
            )
        );


        figure.appendChild(
          button
        );


        article.appendChild(
          figure
        );


        /*
          Caption + film/camera note
          live in ONE comment block.

          Landscape:
          block sits underneath.

          Portrait desktop:
          block sits to the right.

          Portrait mobile:
          block returns underneath.
        */

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
                    ${window.escapeHTML(caption)}
                  </p>
                `

                : ""
            }


            ${
              note

                ? `
                  <p class="photo-tech">
                    ${window.escapeHTML(note)}
                  </p>
                `

                : ""
            }

          `;


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
     Lightbox
     ====================================================== */

  function availableIndices() {

    return Array.from(

      get(
        "photo-stories"
      )
      .querySelectorAll(
        ".photo-story:not([hidden])"
      )

    )

      .map(
        el =>
          Number(
            el.dataset
              .photoIndex
          )
      )

      .filter(
        Number.isFinite
      );
  }


  function openLightbox(
    index
  ) {

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


    if (
      !available.length
    ) {
      return;
    }


    let position =
      available.indexOf(
        currentIndex
      );


    if (
      position < 0
    ) {
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
      localizedPhotoText(
        photo.caption || ""
      );


    const note =
      localizedPhotoText(
        photo.note || ""
      );


    lightboxImage.src =
      photo.src;


    lightboxImage.alt =

      localizedPhotoText(
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
    () =>
      move(-1)
  );


  get(
    "lightbox-next"
  )
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


  /*
    Language switch can happen
    without reloading the page.
  */

  window.addEventListener(
    "languagechange",
    () => {

      closeLightbox();

      renderPage();
    }
  );


  renderPage();

})();
