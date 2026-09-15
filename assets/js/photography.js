(() => {

  const site =
    window.SITE;


  if (!site) {
    return;
  }



  /* =========================================================
     COLLECTION TITLES
     ========================================================= */

  function titles(collection) {

    const lang =
      typeof window.getLang === "function"
        ? window.getLang()
        : "en";


    /*
      Chinese mode:

      Ce jour-là        small
      那一天             large

      English mode:

      那一天             small
      Ce jour-là        large
    */

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



  /* =========================================================
     RENDER PAGE
     ========================================================= */

  function render() {

    const lang =
      typeof window.getLang === "function"
        ? window.getLang()
        : "en";


    const siteTitle =
      typeof window.siteTitle === "function"
        ? window.siteTitle()
        : "Little Boat's Backyard";


    const pageTitle =
      typeof window.uiText === "function"
        ? window.uiText("photography")
        : "Photography";


    document.title =
      `${pageTitle} — ${siteTitle}`;



    /* ---------------------------------------------------------
       Brand
       --------------------------------------------------------- */

    const brand =
      document.getElementById(
        "photo-brand"
      );


    if (brand) {

      brand.textContent =
        siteTitle;
    }



    /* ---------------------------------------------------------
       Hero title
       --------------------------------------------------------- */

    const heroTitle =
      document.querySelector(
        ".page-hero--photography h1"
      );


    if (heroTitle) {

      heroTitle.textContent =
        pageTitle;
    }



    /* ---------------------------------------------------------
       Hero image
       --------------------------------------------------------- */

    const cover =
      document.getElementById(
        "photography-cover"
      );


    if (cover) {

      cover.src =
        site.photography?.cover ||
        site.homeCoverDesktop ||
        "assets/images/cover.jpeg";


      cover.style.objectPosition =
        site.photography
          ?.coverPosition ||
        "50% 50%";
    }



    /* =========================================================
       COLLECTION GRID
       ========================================================= */

    const grid =
      document.getElementById(
        "collection-grid"
      );


    if (!grid) {
      return;
    }


    grid.innerHTML =
      "";



    (
      site.collections || []
    ).forEach(
      (collection, index) => {

        const card =
          document.createElement(
            "a"
          );


        card.className =
          "collection-card";


        card.href =
          `album.html?id=` +
          encodeURIComponent(
            collection.id
          );


        card.style.setProperty(
          "--delay",
          `${Math.min(index, 8) * 55}ms`
        );



        /* -----------------------------------------------------
           Image
           ----------------------------------------------------- */

        const imageWrap =
          document.createElement(
            "div"
          );


        imageWrap.className =
          "collection-image-wrap";


        const img =
          document.createElement(
            "img"
          );


        img.src =
          collection.cover;


        img.loading =
          index < 3
            ? "eager"
            : "lazy";


        img.decoding =
          "async";


        img.style.objectPosition =
          collection.coverPosition ||
          "50% 50%";


        const t =
          titles(
            collection
          );


        img.alt =
          `${t.primary} collection cover`;


        imageWrap.appendChild(
          img
        );



        /* -----------------------------------------------------
           Titles
           ----------------------------------------------------- */

        const copy =
          document.createElement(
            "div"
          );


        copy.className =
          "collection-card-copy";


        copy.innerHTML = `

          ${
            t.secondary

              ? `
                <div
                  class="collection-secondary-title"
                >
                  ${window.escapeHTML(t.secondary)}
                </div>
              `

              : ""
          }

          <h3>
            ${window.escapeHTML(t.primary)}
          </h3>

        `;



        card.append(
          imageWrap,
          copy
        );


        grid.appendChild(
          card
        );
      }
    );



    /* ---------------------------------------------------------
       Language class
       --------------------------------------------------------- */

    document.body
      .classList.toggle(
        "lang-zh",
        lang === "zh"
      );



    /* ---------------------------------------------------------
       Footer
       --------------------------------------------------------- */

    if (
      typeof window.renderFooter ===
      "function"
    ) {

      window.renderFooter(
        "photo-social-links",
        "photo-copyright"
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
