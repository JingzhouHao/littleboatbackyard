# Little Boat's Backyard — GitHub Pages v2

This version follows the new three-page sketch:

- **Home:** one large image + “Little Boat's Backyard” + one-line introduction + Photography / Bio.
- **Photography:** large cover + collection index, **3 collections per row on desktop**, 2 on tablet, 1 on mobile.
- **Collection page:** large collection cover + short overall introduction + photographs with optional notes beside them.
- **Bio:** large cover + portrait next to bio + downloadable PDF CV.
- **Footer:** Instagram / LinkedIn links (when supplied) + copyright notice.

The site is plain HTML/CSS/JavaScript, so it works directly on GitHub Pages without a build step.

## 1. Replace your current repository files

Upload everything in this folder to the **root** of `JingzhouHao/littleboatbackyard`, replacing the old site files.

Keep the structure exactly like this:

```text
index.html
photography.html
album.html
bio.html
.nojekyll
assets/
  css/styles.css
  js/site-data.js
  js/shared.js
  js/home.js
  js/photography.js
  js/album.js
  js/bio.js
  images/cover.jpeg
  cv/
```

After committing, GitHub Pages should redeploy automatically. Your URL remains:

`https://jingzhouhao.github.io/littleboatbackyard/`

## 2. The one file you normally edit

Open:

`assets/js/site-data.js`

That file controls:

- site title
- your name
- one-sentence homepage introduction
- homepage / Photography / Bio cover images
- portrait
- bio text
- CV path
- Instagram and LinkedIn links
- collection titles, covers, introductions, photographs and comments

## 3. Add Instagram and LinkedIn

In `site-data.js`:

```js
social: {
  instagram: "https://www.instagram.com/YOUR_HANDLE/",
  linkedin: "https://www.linkedin.com/in/YOUR_PROFILE/"
}
```

If either field is empty, that footer link is automatically hidden.

## 4. Add your portrait

Put the image somewhere like:

`assets/images/bio/portrait.jpg`

Then change:

```js
portrait: "assets/images/bio/portrait.jpg"
```

## 5. Add your CV

Put the PDF at, for example:

`assets/cv/Jingzhou_Hao_CV.pdf`

Then change:

```js
cvFile: "assets/cv/Jingzhou_Hao_CV.pdf"
```

Until a path is supplied, the Download CV button stays hidden so the live site never contains a broken link.

## 6. Add a collection

Copy one collection object inside `collections`:

```js
{
  id: "maine-2026",
  title: "Maine",
  meta: "2026 · Maine",
  cover: "assets/images/maine/cover.jpg",
  coverPosition: "50% 50%",
  intro: "A short introduction to the collection.",
  reflection: "Optional second paragraph.",
  photos: [
    {
      src: "assets/images/maine/001.jpg",
      alt: "A descriptive accessibility caption",
      caption: "Old Orchard Beach, 2026",
      note: "A short comment beside this photograph."
    },
    {
      src: "assets/images/maine/002.jpg",
      alt: "Street in morning light",
      caption: "",
      note: ""
    }
  ]
}
```

If `note` is empty, that photograph automatically becomes a larger centered image instead of reserving an empty text column.

## 7. Recommended web image sizes

For full-size portfolio images, a good starting point is:

- long edge: roughly 3000–3500 px
- JPEG quality: roughly 88–92, or comparable WebP quality
- sRGB
- do not force every photograph under the same file-size limit

Collection thumbnails can be smaller (roughly 1600–2200 px long edge) if you want the Photography page to load faster.

## Responsive behavior

- Desktop: 3 collection cards per row; photo comments sit beside images.
- Tablet: 2 collection cards per row.
- Phone: 1 collection per row; photo comments move below images; navigation and footer compress cleanly.
