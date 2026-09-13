/*
  This is the main file you edit when you update the site.
  Most text, links, covers, collections, photo comments, and bio content live here.

  Paths are relative to the repository root, for example:
    assets/images/maine/001.jpg
    assets/cv/Jingzhou_Hao_CV.pdf
*/

window.SITE = {
  siteTitle: "Little Boat's Backyard",
  ownerName: "Jingzhou Hao",
  tagline: "A personal archive of photographs, walks, and things I wanted to keep.",

  // Homepage. The same file is used as a blurred backdrop and a sharp foreground image,
  // which preserves a vertical image on wide desktop screens without awkward cropping.
  homeCover: "assets/images/cover.jpeg",
  homeCoverAlt: "Website cover",

  photography: {
    cover: "assets/images/cover.jpeg",
    coverPosition: "50% 48%",
    intro: "A growing set of small photo stories. Some are organized by place, some by time, and some simply by the feeling that made them belong together."
  },

  bio: {
    cover: "assets/images/cover.jpeg",
    coverPosition: "50% 48%",

    // Replace with your own portrait when ready, e.g. assets/images/bio/portrait.jpg
    portrait: "assets/images/cover.jpeg",
    portraitAlt: "Portrait of Jingzhou Hao",
    portraitPosition: "50% 46%",

    // Each string becomes its own paragraph.
    paragraphs: [
      "Write a short self-introduction here: who you are, what you photograph, and what you want this site to hold together.",
      "A second paragraph is optional. You can use it for a little more context about your photography, work, or anything else you want visitors to know."
    ],

    // Leave cvFile empty until you upload a PDF. Example:
    // cvFile: "assets/cv/Jingzhou_Hao_CV.pdf",
    cvFile: "",
    cvDescription: "A PDF copy of my CV is available here."
  },

  social: {
    // Paste the full URLs when ready. Empty links are automatically hidden.
    instagram: "",
    linkedin: ""
  },

  copyright: "All rights reserved.",

  collections: [
    {
      id: "chronicle",
      title: "Chronicle",
      meta: "2026",
      cover: "assets/images/cover.jpeg",
      coverPosition: "50% 42%",
      intro: "A short overall introduction to this collection goes here. It can explain where the photographs came from, what held the series together, or simply what you were paying attention to at the time.",
      reflection: "This second paragraph is optional. Use it for a more personal afterthought, or delete it if the photographs do not need one.",
      photos: [
        {
          src: "assets/images/cover.jpeg",
          alt: "Example photograph",
          caption: "Example photograph",
          note: "A short comment can sit beside a photograph. It can be factual, personal, or left completely blank."
        },
        {
          src: "assets/images/cover.jpeg",
          alt: "Example photograph",
          caption: "",
          note: ""
        }
      ]
    },
    {
      id: "back-to-human",
      title: "Back to Human",
      meta: "2026",
      cover: "assets/images/cover.jpeg",
      coverPosition: "50% 58%",
      intro: "Replace this with the introduction to your second collection.",
      reflection: "",
      photos: [
        { src: "assets/images/cover.jpeg", alt: "Example photograph", caption: "", note: "" }
      ]
    },
    {
      id: "moment-of-summer",
      title: "Moment of Summer",
      meta: "2026",
      cover: "assets/images/cover.jpeg",
      coverPosition: "50% 72%",
      intro: "Replace this with the introduction to your third collection.",
      reflection: "",
      photos: [
        { src: "assets/images/cover.jpeg", alt: "Example photograph", caption: "", note: "" }
      ]
    }
  ]
};
