(() => {

  const site = window.SITE;

  if (!site) {
    console.error("SITE data is missing.");
    return;
  }


  function getLang() {
    return typeof window.getLang === "function"
      ? window.getLang()
      : "en";
  }


  function safeEscape(value) {
    if (typeof window.escapeHTML === "function") {
      return window.escapeHTML(value);
    }

    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
  }


  function renderName() {
    const target = document.getElementById("bio-name");

    if (!target) {
      return;
    }

    const englishName =
      site.ownerName ||
      "Jingzhou Hao";

    const chineseName =
      site.ownerNameZh ||
      "郝泾舟";


    /*
      English:
      Jingzhou Hao (郝泾舟)

      Chinese:
      郝泾舟 (Jingzhou Hao)
    */

    if (getLang() === "zh") {

      target.innerHTML = `
        <span class="bio-name-primary">
          ${safeEscape(chineseName)}
        </span>

        <span class="bio-name-secondary">
          (${safeEscape(englishName)})
        </span>
      `;

    } else {

      target.innerHTML = `
        <span class="bio-name-primary">
          ${safeEscape(englishName)}
        </span>

        <span class="bio-name-secondary">
          (${safeEscape(chineseName)})
        </span>
      `;
    }
  }


  /* =========================================================
     SELFIE / PHOTO GALLERY
     ========================================================= */

  function renderGallery() {

    const gallery =
      document.getElementById(
        "bio-gallery"
      );

    const section =
      document.querySelector(
        ".bio-gallery-section"
      );


    if (
      !gallery ||
      !section
    ) {
      return;
    }


    gallery.innerHTML = "";


    const photos =
      Array.isArray(
        site.bio?.gallery
      )
        ? site.bio.gallery
        : [];


    photos.forEach(
      (item, index) => {

        /*
          Supports either:

          "assets/images/xxx.jpg"

          OR

          {
            src: "assets/images/xxx.jpg"
          }
        */

        const src =
          typeof item === "string"
            ? item
            : item?.src;


        if (!src) {
          return;
        }


        const wrapper =
          document.createElement(
            "div"
          );


        wrapper.className =
          "bio-gallery-item";


        const img =
          document.createElement(
            "img"
          );


        img.src =
          src;


        img.loading =
          index < 3
            ? "eager"
            : "lazy";


        img.decoding =
          "async";


        /*
          Decorative gallery:
          no captions / text.
        */

        img.alt =
          "";


        /*
          If one path is wrong,
          remove only that photo.
        */

        img.addEventListener(
          "error",
          () => {

            wrapper.remove();

          },
          {
            once: true
          }
        );


        wrapper.appendChild(
          img
        );


        gallery.appendChild(
          wrapper
        );
      }
    );


    /*
      If no photos are configured,
      hide the whole gallery section.
    */

    section.hidden =
      gallery.children.length === 0;
  }


  /* =========================================================
     MAIN RENDER
     ========================================================= */

  function render() {

    const lang =
      getLang();


    /* ---------------------------------------------------------
       Browser title
       --------------------------------------------------------- */

    document.title =
      `${window.uiText("bio")} — ${window.siteTitle()}`;


    /* ---------------------------------------------------------
       Header brand
       --------------------------------------------------------- */

    const brand =
      document.getElementById(
        "bio-brand"
      );


    if (brand) {
      brand.textContent =
        window.siteTitle();
    }


    /* ---------------------------------------------------------
       Hero title
       --------------------------------------------------------- */

    const heroTitle =
      document.querySelector(
        ".bio-hero h1"
      );


    if (heroTitle) {
      heroTitle.textContent =
        window.uiText(
          "bio"
        );
    }


    /* ---------------------------------------------------------
       Hero cover
       --------------------------------------------------------- */

    const cover =
      document.getElementById(
        "bio-cover"
      );


    if (cover) {

      cover.src =
        site.bio?.cover ||
        site.homeCoverDesktop ||
        "assets/images/cover.jpeg";


      cover.style.objectPosition =
        site.bio?.coverPosition ||
        "50% 50%";
    }


    /* ---------------------------------------------------------
       Portrait
       --------------------------------------------------------- */

    const portrait =
      document.getElementById(
        "bio-portrait"
      );


    if (portrait) {

      portrait.src =
        site.bio?.portrait ||
        site.homeCoverMobile ||
        "assets/images/cover.jpeg";


      portrait.alt =
        window.localized(
          site.bio?.portraitAlt
        )
        ||
        `Portrait of ${
          site.ownerName ||
          "the photographer"
        }`;


      portrait.style.objectPosition =
        site.bio?.portraitPosition ||
        "50% 50%";
    }


    /* ---------------------------------------------------------
       Bilingual name
       --------------------------------------------------------- */

    renderName();


    /* ---------------------------------------------------------
       Bio paragraphs
       --------------------------------------------------------- */

    const text =
      document.getElementById(
        "bio-text"
      );


    if (text) {

      text.innerHTML = "";


      const paragraphs =

        site.bio
          ?.paragraphs
          ?.[lang]

        ||

        site.bio
          ?.paragraphs
          ?.en

        ||

        [];


      paragraphs.forEach(
        (paragraph) => {

          const p =
            document.createElement(
              "p"
            );


          p.textContent =
            paragraph;


          text.appendChild(
            p
          );
        }
      );
    }


    /* ---------------------------------------------------------
       Selfie / photo gallery
       --------------------------------------------------------- */

    renderGallery();


    /* ---------------------------------------------------------
       CV heading

       English:
       Curriculum Vitae

       Chinese:
       简历
       --------------------------------------------------------- */

    const cvHeading =
      document.getElementById(
        "cv-heading"
      );


    if (cvHeading) {

      cvHeading.textContent =

        lang === "zh"

          ? "简历"

          : "Curriculum Vitae";
    }


    /* ---------------------------------------------------------
       CV description
       --------------------------------------------------------- */

    const description =
      document.getElementById(
        "cv-description"
      );


    if (description) {

      description.textContent =
        window.localized(
          site.bio?.cvDescription
        );
    }


    /* ---------------------------------------------------------
       CV download
       --------------------------------------------------------- */

    const link =
      document.getElementById(
        "cv-link"
      );


    const missing =
      document.getElementById(
        "cv-missing"
      );


    if (link) {

      link.innerHTML =
        `${window.uiText("downloadCV")} ` +
        `<span aria-hidden="true">↓</span>`;
    }


    if (
      site.bio?.cvFile
    ) {

      if (link) {

        link.href =
          site.bio.cvFile;

        link.hidden =
          false;
      }


      if (missing) {

        missing.hidden =
          true;
      }

    } else {

      if (link) {

        link.hidden =
          true;
      }


      if (missing) {

        missing.hidden =
          false;


        missing.textContent =
          window.uiText(
            "cvMissing"
          );
      }
    }


    /* ---------------------------------------------------------
       Footer
       --------------------------------------------------------- */

    if (
      typeof window.renderFooter ===
      "function"
    ) {

      window.renderFooter(
        "bio-social-links",
        "bio-copyright"
      );
    }
  }


  /* =========================================================
     LANGUAGE SWITCH
     ========================================================= */

  window.addEventListener(
    "languagechange",
    render
  );


  /* =========================================================
     START
     ========================================================= */

  render();

})();
