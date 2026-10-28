# The Cliffside Estate: landing page

A static site (HTML, CSS, vanilla JavaScript). No build step, no dependencies besides Google Fonts (with serif/sans fallbacks).

**Status:** not deployed. Follow the steps below to publish it yourself.

## 1. Run locally
Open `index.html` in a browser, or from this folder run `python3 -m http.server 8000` and visit http://localhost:8000.

## 2. Replace placeholder images
All images are in `assets/images/` and are **concept drawings** supplied with the project brief (not photographs of a built property):

| File | Used for |
|---|---|
| `front-view.png` | Hero, gallery (exterior) |
| `elevations.png` | Introduction, gallery |
| `plans.png` | Levels section, gallery |
| `site-plan.png` | Grounds, signature feature, gallery |

To swap one, save your approved render with the same file name, or edit the `src` in `index.html`. Gallery tiles also carry `data-src`, `data-alt` and `data-cap` attributes; update those too, and write real alt text. The hero image is colour-inverted in CSS (`.hero-img`) because it is a dark-on-white sketch; remove the `filter` line when using a photograph.

## 3. Update content
All copy is in `index.html`; colours and fonts are variables at the top of `css/style.css`. Do not add addresses, prices or specifications until verified.

## 4. Create and upload the GitHub repository
1. Create an account at github.com, then **New repository** (name e.g. `cliffside-estate`, public).
2. In this folder run:
```
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/cliffside-estate.git
git push -u origin main
```
(Or use **Add file > Upload files** on GitHub and drag in the contents of this folder.)

## 5. Configure GitHub Pages
Repository **Settings > Pages > Build and deployment**: Source "Deploy from a branch", Branch `main`, folder `/ (root)`, Save.

## 6. Verify the published site
After a minute or two it appears at `https://YOUR-USERNAME.github.io/cliffside-estate/`. Check that images load, the menu and gallery lightbox work, and the browser console is clean. Update `og:image` in `index.html` to the full public URL so link previews work.

## 7. Make the enquiry form work
The form is a **front-end demonstration**: it validates input but sends nothing. To receive enquiries, use a form service (e.g. Formspree or Web3Forms): create a form there, then in `js/script.js` replace the comment block in the submit handler with a `fetch()` POST of `new FormData(form)` to the endpoint they give you, and show the success message only when the response is OK. Review privacy and consent wording for your jurisdiction.

## Update team members
The team cards are in the "The Team" section of `index.html` (six blocks, each marked `MEMBER n`). For each person: save their photo (square works best) in `assets/images/team/`, change the `src` and `alt` to match, then retype the name, course, level and role. Add or remove a block to change the number of cards.
