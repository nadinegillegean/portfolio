# Sofia's Portfolio 🐱

White + baby pink creative portfolio with a 3D cat mascot. Plain HTML/CSS/JS, no build step.

## Pages
- `index.html` — home: hero + cat, intro, work grid with filters, highlights, contact
- `about.html` — bio + CV (education, experience, skills, organisations)
- `project.html?id=...` — one template that renders every project

## Editing content
Everything lives in **`js/data.js`**:
- **Your details:** `profile` (email, LinkedIn, Instagram, bio). Set `linkedin` to your real profile URL. The LinkedIn link stays hidden until you do.
- **Projects:** each item in `projects`. Copy one, change `id`, `category` (`modelling` / `brand` / `research`), title and text.
- **Coming soon:** add `status: "coming-soon"` and a `plan: [...]` list.
- **CV:** the `cv` section feeds the About page.

The modelling shoots and the two mock brands (Mochi & Milk, Petal Lab) have **placeholder copy**. Replace it with your real details.

## Adding photos
1. Put images in `assets/img/`. Use JPG or WebP, about 1600px on the long side, under 500 KB each.
2. In `data.js`:
   - cover image: `cover: "assets/img/denim-cover.jpg"`
   - gallery: `gallery: [{ src: "assets/img/denim-01.jpg", caption: "Look 01" }]`
   - About portrait: add `portrait: "assets/img/portrait.jpg"` inside `profile`

Anything without an image shows a pink placeholder frame.

## Previewing locally
Double-clicking `index.html` works. A local server is closer to the real site:
```
python -m http.server 8000      # then open http://localhost:8000
```

## Publishing (free)
- **Netlify:** go to app.netlify.com/drop and drag this whole folder in.
- **GitHub Pages:** push the folder to a repo, then Settings → Pages → deploy from the `main` branch.

## The cat
`js/cat.js` builds the cat from 3D shapes with Three.js.
- Colours are in the `M` (materials) block.
- Speech-bubble lines are in `lines`.
- If WebGL isn't available, an SVG cat is shown instead.
