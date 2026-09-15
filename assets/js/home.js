(() => {
  const site = window.SITE;

  if (!site) {
    console.error("SITE data is missing.");
    return;
  }

  /*
    Desktop uses the horizontal cover.
    Tablet / phone uses the vertical cover.
  */

  const media = window.matchMedia("(max-width: 1024px)");

  function setCover() {
    const image = document.getElementById("home-image");
    const backdrop = document.getElementById("home-backdrop");

    const src = media.matches
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

    if (image) {
      image.src = src;

      image.alt =
        typeof window.localized === "function"
          ? window.localized(site.homeCoverAlt)
          : "Website cover";
    }

    if (backdrop) {
      backdrop.src = src;
    }
  }


  function renderHome() {
    const title =
      typeof window.siteTitle === "function"
        ? window.siteTitle()
        : "Little Boat's Backyard";

    document.title = title;


    const titleElement =
      document.getElementById("site-title");

    if (titleElement) {
      titleElement.textContent = title;
    }


    const taglineElement =
      document.getElementById("tagline");

    if (taglineElement) {
      taglineElement.textContent =
        typeof window.localized === "function"
          ? window.localized(site.tagline)
          : "";
    }


    /*
      Home navigation:
      Photography / Bio
      or
      摄影集 / 关于我
    */

    const photographyLink =
      document.querySelector(
        '.home-nav a[href="photography.html"]'
      );

    const bioLink =
      document.querySelector(
        '.home-nav a[href="bio.html"]'
      );


    if (photographyLink) {
      photographyLink.textContent =
        typeof window.uiText === "function"
          ? window.uiText("photography")
          : "Photography";
    }


    if (bioLink) {
      bioLink.textContent =
        typeof window.uiText === "function"
          ? window.uiText("bio")
          : "Bio";
    }


    setCover();


    if (
      typeof window.renderFooter === "function"
    ) {
      window.renderFooter(
        "home-social-links",
        "home-copyright"
      );
    }
  }


  /*
    Automatically switch cover
    when resizing between desktop
    and tablet/mobile.
  */

  if (typeof media.addEventListener === "function") {
    media.addEventListener(
      "change",
      setCover
    );
  } else if (typeof media.addListener === "function") {
    media.addListener(
      setCover
    );
  }


  /*
    Re-render when language changes.
  */

  window.addEventListener(
    "languagechange",
    renderHome
  );


  renderHome();
})();
