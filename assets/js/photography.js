(() => {

  const site =
    window.SITE;

  if (!site) return;


  function titles(
    collection
  ) {

    const lang =
      window.getLang();


    if (lang === "zh") {

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


  function render() {

    const lang =
      window.getLang();


    document.title =
      `${window.uiText("photography")} — ` +
      `${window.siteTitle()}`;


    document.getElementById(
      "photo-brand"
    ).textContent =
      window.siteTitle();


    document.querySelector(
      ".page-hero--photography .kicker"
    ).textContent =
      window.siteTitle();


    document.querySelector(
      ".page-hero--photography h1"
    ).textContent =
      window.uiText(
        "photography"
      );


    document.querySelector(
      ".collections-heading .kicker"
    ).textContent =
      window.uiText(
        "collections"
      );


    document.getElementById(
      "collections-heading"
    ).textContent =
      window.localized(
        site.photography?.heading
      );


    document.getElementById(
      "photography-intro"
    ).textContent =
      window.localized(
        site.photography?.intro
      );


    const cover =
      document.getElementById(
        "photography-cover"
      );


    cover.src =
      site.photography?.cover ||
      site.homeCoverDesktop ||
      "assets/images/cover.jpeg";


    cover.style.objectPosition =
      site.photography
        ?.coverPosition ||
      "50% 50%";


    const grid =
      document.getElementById(
        "collection-grid"
      );


    /*
      Important when changing
      languages:
      clear cards and rebuild.
    */

    grid.innerHTML = "";


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


        img.style.objectPosition =
          collection
            .coverPosition ||
          "50% 50%";


        const t =
          titles(collection);


        img.alt =
          `${t.primary} collection cover`;


        const copy =
          document.createElement(
            "div"
          );


        copy.className =
          "collection-card-copy";


        /*
          Current language:
          large title.

          Other language:
          smaller title above.
        */

        copy.innerHTML = `

          <div
            class="collection-secondary-title"
          >
            ${window.escapeHTML(t.secondary)}
          </div>

          <h3>
            ${window.escapeHTML(t.primary)}
          </h3>

        `;


        imageWrap.appendChild(
          img
        );


        card.append(
          imageWrap,
          copy
        );


        grid.appendChild(
          card
        );
      }
    );


    document.body
      .classList.toggle(
        "lang-zh",
        lang === "zh"
      );


    window.renderFooter(
      "photo-social-links",
      "photo-copyright"
    );
  }


  window.addEventListener(
    "languagechange",
    render
  );


  render();

})();
