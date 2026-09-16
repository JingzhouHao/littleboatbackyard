(() => {

  const site = window.SITE;

  if (!site) return;


  const KEY = "littleboat-language";


  /* =========================================================
     UI TEXT
     ========================================================= */

  const copy = {

    en: {

      photography:
        "Photography",

      bio:
        "Bio",

      collections:
        "Collections",

      aboutCollection:
        "About this collection",

      allCollections:
        "← All collections",

      about:
        "About",

      cvKicker:
        "Curriculum Vitae",

      cvTitle:
        "CV",

      downloadCV:
        "Download CV",

      cvMissing:
        "Add your PDF path in site-data.js to enable this button.",

      switchTo:
        "中文",

      switchAria:
        "Switch to Chinese"
    },


    zh: {

      photography:
        "摄影集",

      bio:
        "关于我",

      collections:
        "摄影合集",

      aboutCollection:
        "关于这个合集",

      allCollections:
        "← 返回全部合集",

      about:
        "关于我",

      cvKicker:
        "个人简历",

      cvTitle:
        "简历",

      downloadCV:
        "下载 CV",

      cvMissing:
        "在 site-data.js 中填写 PDF 路径后即可启用下载。",

      switchTo:
        "EN",

      switchAria:
        "Switch to English"
    }
  };



  /* =========================================================
     LANGUAGE
     ========================================================= */

  function normalizeLang(lang) {

    return lang === "zh"
      ? "zh"
      : "en";
  }



  window.getLang =
    function () {

      return normalizeLang(

        localStorage.getItem(KEY)

        ||

        site.defaultLang

        ||

        "en"
      );
    };



  window.setLang =
    function (lang) {

      const next =
        normalizeLang(lang);


      localStorage.setItem(
        KEY,
        next
      );


      applyChrome();


      window.dispatchEvent(

        new CustomEvent(
          "languagechange",

          {
            detail: {
              lang: next
            }
          }
        )
      );
    };



  window.toggleLang =
    function () {

      window.setLang(

        window.getLang() === "en"
          ? "zh"
          : "en"
      );
    };



  window.uiText =
    function (key) {

      const lang =
        window.getLang();


      return (

        copy[lang]?.[key]

        ??

        copy.en[key]

        ??

        key
      );
    };



  /* =========================================================
     LOCALIZED CONTENT
     =========================================================

     Supports:

     "plain text"

     OR

     {
       en: "...",
       zh: "..."
     }
     ========================================================= */

  window.localized =
    function (value) {

      if (value == null) {
        return "";
      }


      if (
        typeof value === "string"
      ) {

        return value;
      }


      const lang =
        window.getLang();


      return (

        value[lang]

        ??

        value.en

        ??

        value.zh

        ??

        ""
      );
    };



  /* =========================================================
     SITE TITLE
     ========================================================= */

  window.siteTitle =
    function () {

      return window.localized(
        site.siteTitle
      );
    };



  /* =========================================================
     HTML ESCAPING
     ========================================================= */

  window.escapeHTML =
    function (value) {

      const div =
        document.createElement(
          "div"
        );


      div.textContent =
        value ?? "";


      return div.innerHTML;
    };



  /* =========================================================
     ATTRIBUTE ESCAPING
     ========================================================= */

  function escapeAttribute(value) {

    return String(
      value ?? ""
    )

      .replaceAll(
        "&",
        "&amp;"
      )

      .replaceAll(
        '"',
        "&quot;"
      )

      .replaceAll(
        "<",
        "&lt;"
      )

      .replaceAll(
        ">",
        "&gt;"
      );
  }



  /* =========================================================
     FOOTER

     Instagram + LinkedIn use
     monochrome line icons.

     Their color comes from CSS
     through currentColor.
     ========================================================= */

  window.renderFooter =
    function (
      socialTargetId,
      copyrightTargetId
    ) {

      const linksTarget =
        document.getElementById(
          socialTargetId
        );


      const copyrightTarget =
        document.getElementById(
          copyrightTargetId
        );



      /* -----------------------------------------------------
         SOCIAL LINKS
         ----------------------------------------------------- */

      if (linksTarget) {

        const links = [];



        /* =================================================
           INSTAGRAM
           ================================================= */

        if (
          site.social?.instagram
        ) {

          links.push(`
            <a
              class="social-icon-link"
              href="${escapeAttribute(site.social.instagram)}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >

              <svg
                class="social-icon social-icon--instagram"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >

                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  ry="5"
                ></rect>

                <circle
                  cx="12"
                  cy="12"
                  r="4.1"
                ></circle>

                <circle
                  class="social-icon-fill"
                  cx="17.35"
                  cy="6.75"
                  r="1.05"
                ></circle>

              </svg>

            </a>
          `);
        }



        /* =================================================
           LINKEDIN
           ================================================= */

        if (
          site.social?.linkedin
        ) {

          links.push(`
            <a
              class="social-icon-link"
              href="${escapeAttribute(site.social.linkedin)}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >

              <svg
                class="social-icon social-icon--linkedin"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >

                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                  ry="3"
                ></rect>


                <circle
                  class="social-icon-fill"
                  cx="8"
                  cy="8"
                  r="1.05"
                ></circle>


                <path
                  d="M8 11v6"
                ></path>


                <path
                  d="M12 17v-6"
                ></path>


                <path
                  d="
                    M12 13.5
                    C12.8 11.8
                    16.5 10.8
                    16.5 14.1
                    V17
                  "
                ></path>

              </svg>

            </a>
          `);
        }



        linksTarget.innerHTML =
          links.join("");


        linksTarget.hidden =
          links.length === 0;
      }



      /* -----------------------------------------------------
         COPYRIGHT
         ----------------------------------------------------- */

      if (copyrightTarget) {

        const year =
          new Date()
            .getFullYear();


        const rights =
          window.localized(
            site.copyright
          )

          ||

          "All rights reserved.";


        copyrightTarget.textContent =

          `© ${year} ` +

          `${site.ownerName || window.siteTitle()}. ` +

          `${rights}`;
      }
    };



  /* =========================================================
     LANGUAGE SWITCH

     Automatically inserts the
     中文 / EN button.

     No HTML modification needed.
     ========================================================= */

  function installToggle() {

    /*
      Avoid inserting another one
      if it already exists.
    */

    if (
      document.querySelector(
        ".lang-toggle"
      )
    ) {

      return;
    }



    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.className =
      "lang-toggle";


    button.addEventListener(
      "click",
      window.toggleLang
    );



    /* -----------------------------------------------------
       INNER PAGES
       ----------------------------------------------------- */

    const topnav =
      document.querySelector(
        ".topnav"
      );


    if (topnav) {

      topnav.appendChild(
        button
      );


      return;
    }



    /* -----------------------------------------------------
       HOMEPAGE
       ----------------------------------------------------- */

    const homeHero =
      document.querySelector(
        ".home-hero"
      );


    if (homeHero) {

      button.classList.add(
        "lang-toggle--home"
      );


      homeHero.appendChild(
        button
      );
    }
  }



  /* =========================================================
     APPLY CURRENT LANGUAGE TO PAGE
     ========================================================= */

  function applyChrome() {

    const lang =
      window.getLang();



    /* -----------------------------------------------------
       HTML LANGUAGE
       ----------------------------------------------------- */

    document.documentElement.lang =

      lang === "zh"

        ? "zh-CN"

        : "en";



    /* -----------------------------------------------------
       BODY LANGUAGE CLASS
       ----------------------------------------------------- */

    document.body?.classList.toggle(
      "lang-zh",
      lang === "zh"
    );



    /* -----------------------------------------------------
       SITE BRAND TEXT

       The text remains in the DOM
       even though CSS replaces it
       visually with the handwritten
       logo image.
       ----------------------------------------------------- */

    document
      .querySelectorAll(
        ".brand"
      )
      .forEach(
        (el) => {

          el.textContent =
            window.siteTitle();
        }
      );



    /* -----------------------------------------------------
       PHOTOGRAPHY LINKS
       ----------------------------------------------------- */

    document
      .querySelectorAll(
        'a[href="photography.html"]'
      )
      .forEach(
        (el) => {

          /*
            Do not overwrite the album
            "back to all collections" link.
          */

          if (
            !el.classList.contains(
              "back-link"
            )
          ) {

            el.textContent =
              window.uiText(
                "photography"
              );
          }
        }
      );



    /* -----------------------------------------------------
       BIO LINKS
       ----------------------------------------------------- */

    document
      .querySelectorAll(
        'a[href="bio.html"]'
      )
      .forEach(
        (el) => {

          el.textContent =
            window.uiText(
              "bio"
            );
        }
      );



    /* -----------------------------------------------------
       LANGUAGE BUTTON
       ----------------------------------------------------- */

    document
      .querySelectorAll(
        ".lang-toggle"
      )
      .forEach(
        (button) => {

          button.textContent =
            window.uiText(
              "switchTo"
            );


          button.setAttribute(
            "aria-label",
            window.uiText(
              "switchAria"
            )
          );
        }
      );
  }



  /* =========================================================
     START
     ========================================================= */

  installToggle();

  applyChrome();

})();
