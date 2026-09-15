(() => {

  const site =
    window.SITE;

  if (!site) return;


  /*
    <= 1024 px uses the
    phone/tablet cover.
  */

  const media =
    window.matchMedia(
      "(max-width: 1024px)"
    );


  function setCover() {

    const src =
      media.matches

        ? (
          site.homeCoverMobile ||
          site.homeCoverDesktop ||
          "assets/images/cover.jpeg"
        )

        : (
          site.homeCoverDesktop ||
          site.homeCoverMobile ||
          "assets/images/cover.jpeg"
        );


    const image =
      document.getElementById(
        "home-image"
      );

    const backdrop =
      document.getElementById(
        "home-backdrop"
      );


    if (image) {
      image.src = src;
    }


    if (backdrop) {
      backdrop.src = src;
    }


    if (image) {

      image.alt =
        window.localized(
          site.homeCoverAlt
        ) ||
        "Website cover";
    }
  }


  function render() {

    const title =
      window.siteTitle();


    document.title =
      title;


    document.getElementById(
      "site-title"
    ).textContent =
      title;


    document.getElementById(
      "tagline"
    ).textContent =
      window.localized(
        site.tagline
      );


    const links =
      document.querySelectorAll(
        ".home-nav a"
      );


    if (links[0]) {

      links[0].textContent =
        window.uiText(
          "photography"
        );
    }


    if (links[1]) {

      links[1].textContent =
        window.uiText(
          "bio"
        );
    }


    setCover();


    window.renderFooter(
      "home-social-links",
      "home-copyright"
    );
  }


  media.addEventListener?.(
    "change",
    setCover
  );


  window.addEventListener(
    "languagechange",
    render
  );


  render();

})();
