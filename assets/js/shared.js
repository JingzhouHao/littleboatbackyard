(() => {

  const site = window.SITE;

  if (!site) return;


  const KEY = "littleboat-language";


  const copy = {

    en: {
      photography: "Photography",
      bio: "Bio",

      collections: "Collections",

      aboutCollection:
        "About this collection",

      allCollections:
        "← All collections",

      about: "About",

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


  function normalizeLang(lang) {

    return lang === "zh"
      ? "zh"
      : "en";
  }


  window.getLang = function () {

    return normalizeLang(

      localStorage.getItem(KEY) ||

      site.defaultLang ||

      "en"
    );
  };


  window.setLang = function (lang) {

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


  window.toggleLang = function () {

    window.setLang(

      window.getLang() === "en"
        ? "zh"
        : "en"
    );
  };


  window.uiText = function (key) {

    const lang =
      window.getLang();

    return (
      copy[lang]?.[key] ??
      copy.en[key] ??
      key
    );
  };


  /*
    Allows values in site-data.js to be:

    "plain text"

    or

    {
      en: "...",
      zh: "..."
    }
  */

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
        value[lang] ??
        value.en ??
        value.zh ??
        ""
      );
    };


  window.siteTitle =
    function () {

      return window.localized(
        site.siteTitle
      );
    };


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


      if (linksTarget) {

        const links = [];


        if (
          site.social?.instagram
        ) {

          links.push(
            `<a
              href="${escapeAttribute(site.social.instagram)}"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>`
          );
        }


        if (
          site.social?.linkedin
        ) {

          links.push(
            `<a
              href="${escapeAttribute(site.social.linkedin)}"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>`
          );
        }


        linksTarget.innerHTML =
          links.join("");


        linksTarget.hidden =
          links.length === 0;
      }


      if (copyrightTarget) {

        const year =
          new Date()
            .getFullYear();

        const rights =
          window.localized(
            site.copyright
          ) ||
          "All rights reserved.";


        copyrightTarget.textContent =
          `© ${year} ` +
          `${site.ownerName || window.siteTitle()}. ` +
          `${rights}`;
      }
    };


  /*
    Language switch is inserted
    automatically.

    No HTML modification needed.
  */

  function installToggle() {

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


  function applyChrome() {

    const lang =
      window.getLang();


    document.documentElement.lang =
      lang === "zh"
        ? "zh-CN"
        : "en";


    document.body?.classList.toggle(
      "lang-zh",
      lang === "zh"
    );


    document
      .querySelectorAll(
        ".brand"
      )
      .forEach(el => {

        el.textContent =
          window.siteTitle();
      });


    document
      .querySelectorAll(
        'a[href="photography.html"]'
      )
      .forEach(el => {

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
      });


    document
      .querySelectorAll(
        'a[href="bio.html"]'
      )
      .forEach(el => {

        el.textContent =
          window.uiText(
            "bio"
          );
      });


    document
      .querySelectorAll(
        ".lang-toggle"
      )
      .forEach(button => {

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
      });
  }


  function escapeAttribute(
    value
  ) {

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


  installToggle();

  applyChrome();

})();
