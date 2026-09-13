# Little Boat's Backyard — v3

This version uses a true landing page. The homepage contains **only** the cover image, site title, one-line introduction, two choices — **Photography** and **Bio** — plus the footer. There is no collection grid below the homepage and the homepage is intentionally non-scrollable.

## Page structure

- `index.html` — landing page only: cover + title + tagline + Photography / Bio
- `photography.html` — photography index with 3 collections per row on desktop, 2 on tablet, 1 on mobile
- `album.html` — one collection, overall introduction, photos and optional notes
- `bio.html` — portrait + bio + downloadable PDF CV
- `assets/js/site-data.js` — main content file you edit

## Important: replace the old GitHub version completely

Your repository must contain all four HTML files at the repository root:

```
index.html
photography.html
album.html
bio.html
```

If the repository still contains the older site's `index.html`, GitHub Pages will keep showing the old scrolling collection page. The easiest update is:

1. Delete the old root files/folders from the repo (or replace them).
2. Upload **the contents of this folder**, not the zip itself.
3. Confirm `photography.html` and `bio.html` appear next to `index.html` in GitHub.
4. Commit the change and wait for Pages to redeploy.
5. Hard-refresh the site (`Cmd + Shift + R` on Mac / `Ctrl + Shift + R` on Windows) if the browser still shows the old cached page.

## Main content edits

Edit `assets/js/site-data.js` for:

- site title and one-line tagline
- homepage / Photography / Bio cover images
- social links
- portrait and bio paragraphs
- CV PDF path
- collection titles, covers, introductions, photos and optional notes

## CV

Place the PDF somewhere such as:

```
assets/cv/Jingzhou_Hao_CV.pdf
```

and set:

```js
cvFile: "assets/cv/Jingzhou_Hao_CV.pdf"
```

## Photo notes

A photo with a note:

```js
{
  src: "assets/images/maine/001.jpg",
  caption: "Old Orchard Beach, 2026",
  note: "A short comment beside the photograph."
}
```

A photo without a note:

```js
{
  src: "assets/images/maine/002.jpg",
  caption: "",
  note: ""
}
```

Photos without notes automatically use a wider centered layout.
