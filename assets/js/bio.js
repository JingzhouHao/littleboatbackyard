(() => {

  const site = window.SITE;

  if (!site) {
    return;
  }


  function getLang() {

    if (
      typeof window.getLang === "function"
    ) {
      return window.getLang();
    }

    return "en";
  }


  function renderName() {

    const name =
      document.getElementById(
        "bio-name"
      );

    if (!name) {
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

    if (
      getLang() === "zh"
    ) {

      name.innerHTML = `
        <span class="bio-name-primary">
          ${window.escapeHTML(chineseName)}
        </span>

        <span class="bio-name-secondary">
          (${window.escapeHTML(englishName)})
        </span>
      `;

    } else {

      name.innerHTML = `
        <span class="bio-name-primary">
          ${window.escapeHTML(englishName)}
        </span>

        <span class="bio-name-secondary">
          (${window.escapeHTML(chineseName)})
        </span>
      `;
    }
  }



  function render() {

    const lang =
      getLang();


    document.title =
      `${window.uiText("bio")} — ${window.siteTitle()}`;



    /* =====================================================
       BRAND
       ===================================================== */

    const brand =
      document.getElementById(
        "bio-brand"
      );


    if (brand) {

      brand.textContent =
        window.siteTitle();
    }



    /* =====================================================
       HERO
       ===================================================== */

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



    /* =====================================================
       PORTRAIT
       ===================================================== */

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



    /* =====================================================
       NAME
       ===================================================== */

    renderName();



    /* =====================================================
       BIO PARAGRAPHS
       ===================================================== */

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
        paragraph => {

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



    /* =====================================================
       CV
       ===================================================== */

    const cvSection =
      document.getElementById(
        "cv-section"
      );


    if (cvSection) {

      const kicker =
        cvSection.querySelector(
          ".kicker"
        );


      const heading =
        cvSection.querySelector(
          "h2"
        );


      if (kicker) {

        kicker.textContent =
          window.uiText(
            "cvKicker"
          );
      }


      if (heading) {

        heading.textContent =
          window.uiText(
            "cvTitle"
          );
      }
    }



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


    if (missing) {

      missing.textContent =
        window.uiText(
          "cvMissing"
        );
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
      }
    }



    /* =====================================================
       FOOTER
       ===================================================== */

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



  window.addEventListener(
    "languagechange",
    render
  );


  render();

})();
