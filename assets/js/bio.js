(() => {

  const site =
    window.SITE;

  if (!site) return;


  function render() {

    document.title =
      `${window.uiText("bio")} — ` +
      `${window.siteTitle()}`;


    document.getElementById(
      "bio-brand"
    ).textContent =
      window.siteTitle();


    document.querySelector(
      ".bio-hero .kicker"
    ).textContent =
      window.siteTitle();


    document.querySelector(
      ".bio-hero h1"
    ).textContent =
      window.uiText(
        "bio"
      );


    document.querySelector(
      ".bio-copy .kicker"
    ).textContent =
      window.uiText(
        "about"
      );


    document.getElementById(
      "bio-name"
    ).textContent =
      site.ownerName ||
      window.uiText(
        "bio"
      );


    /* Hero */

    const cover =
      document.getElementById(
        "bio-cover"
      );


    cover.src =
      site.bio?.cover ||
      site.homeCoverDesktop ||
      "assets/images/cover.jpeg";


    cover.style.objectPosition =
      site.bio
        ?.coverPosition ||
      "50% 50%";


    /* Portrait */

    const portrait =
      document.getElementById(
        "bio-portrait"
      );


    portrait.src =
      site.bio?.portrait ||
      site.homeCoverMobile ||
      "assets/images/cover.jpeg";


    portrait.alt =
      window.localized(
        site.bio
          ?.portraitAlt
      )

      ||

      `Portrait of ${
        site.ownerName ||
        "the photographer"
      }`;


    portrait.style.objectPosition =
      site.bio
        ?.portraitPosition ||
      "50% 50%";


    /* Bio paragraphs */

    const text =
      document.getElementById(
        "bio-text"
      );


    text.innerHTML =
      "";


    const lang =
      window.getLang();


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


    /* CV */

    const cvSection =
      document.getElementById(
        "cv-section"
      );


    cvSection.querySelector(
      ".kicker"
    ).textContent =
      window.uiText(
        "cvKicker"
      );


    cvSection.querySelector(
      "h2"
    ).textContent =
      window.uiText(
        "cvTitle"
      );


    document.getElementById(
      "cv-description"
    ).textContent =
      window.localized(
        site.bio
          ?.cvDescription
      );


    const link =
      document.getElementById(
        "cv-link"
      );


    const missing =
      document.getElementById(
        "cv-missing"
      );


    link.innerHTML =
      `${window.uiText("downloadCV")} ` +
      `<span aria-hidden="true">↓</span>`;


    missing.textContent =
      window.uiText(
        "cvMissing"
      );


    if (
      site.bio?.cvFile
    ) {

      link.href =
        site.bio.cvFile;

      link.hidden =
        false;

      missing.hidden =
        true;
    }

    else {

      link.hidden =
        true;

      missing.hidden =
        false;
    }


    window.renderFooter(
      "bio-social-links",
      "bio-copyright"
    );
  }


  window.addEventListener(
    "languagechange",
    render
  );


  render();

})();
