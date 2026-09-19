# Initi8Now website

Static site: plain HTML + CSS + JS. No build step, no framework. Upload the folder as-is.

## Files
```
index.html            Home
students/index.html   For students      -> initi8now.com/students/
employers/index.html  For employers     -> initi8now.com/employers/
about/index.html      About             -> initi8now.com/about/
team/index.html       Team              -> initi8now.com/team/
contact/index.html    Contact           -> initi8now.com/contact/
students.html etc.    One-line redirects so any old .html link still works
404.html              Shown for any URL that doesn't exist
sitemap.xml           For Google
robots.txt            For Google
css/style.css         All styles (brand tokens at the top of the file)
js/main.js            All interactions
assets/               Logos, team photos, favicon, three videos
.nojekyll             Tells GitHub Pages to serve files exactly as they are
```

Pages live in folders so the address bar shows `initi8now.com/team/` rather than
`team.html`. To edit a page, open the `index.html` inside that folder.
Links inside a subfolder page use `../` (e.g. `../css/style.css`, `../about/`).

## Edit the basics
- Phone / email / socials: they appear in the footer of every page and on contact.html. Search-and-replace
  `6378048013`, `info@initi8now.com`, `in.linkedin.com/company/initi8now`, `instagram.com/initi8now`.
- Early-access form link: search for `tally.so/r/5Blg4E`.
- Ticker jobs: edit the `<span>` items inside `<div class="ticker">` in index.html.
- Team bios: team.html, inside each `<div class="member">`.
- Colours / fonts: `:root` block at the top of css/style.css.

## Contact form
It opens the visitor's email app addressed to info@initi8now.com (no backend needed).
For a real inbox form, create a free form at https://formspree.io, then in contact.html
change `<form id="contact-form">` to `<form action="https://formspree.io/f/YOUR_ID" method="POST">`
and delete the `#contact-form` block in js/main.js.

## Deploy — Option A: GitHub Pages (free)
1. Go to https://github.com/new → name it `initi8now-website` → Public → Create.
2. On the empty repo page click **uploading an existing file**, drag ALL files and folders
   from this zip (including `.nojekyll`, `css`, `js`, `assets`) → **Commit changes**.
   (Or with git: `git init && git add . && git commit -m "site" && git branch -M main &&
   git remote add origin https://github.com/YOUR_USER/initi8now-website.git && git push -u origin main`)
3. Repo → **Settings** → **Pages** → Source: *Deploy from a branch* → Branch: `main` / `/ (root)` → Save.
4. Wait ~1 minute. Your site is live at `https://YOUR_USER.github.io/initi8now-website/`.

### Connect the domain initi8now.com
5. Settings → Pages → **Custom domain**: type `initi8now.com` → Save. GitHub creates a `CNAME` file.
6. In your domain registrar's DNS panel (GoDaddy / Hostinger / Namecheap…) add:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `YOUR_USER.github.io`
7. Back in Settings → Pages, tick **Enforce HTTPS** once the DNS check passes (can take up to 24 h).

## Deploy — Option B: Netlify / Vercel / Cloudflare Pages (free, auto-updates from GitHub)
1. Push to GitHub as in steps 1–2 above.
2. Sign in to Netlify (or Vercel / Cloudflare Pages) with GitHub → *Add new site* → *Import from Git* →
   choose the repo → Build command: *(leave empty)* → Publish directory: `/` → Deploy.
3. *Domain settings* → add `initi8now.com` → follow the DNS instructions shown (usually one CNAME).
Every future push to GitHub redeploys automatically.

## Deploy — Option C: any cPanel / shared hosting
Upload the contents of this folder into `public_html/` via File Manager or FTP. Done.

## Updating later
Edit the file → commit/upload again → the site updates within a minute.

## Updating the site on GitHub later
1. Open your repo on github.com.
2. To replace a file: click the file → pencil icon → paste new content → Commit changes.
3. To replace many files at once: click **Add file → Upload files**, drag the new versions in,
   and commit. Same-named files are overwritten.
4. GitHub Pages redeploys automatically within about a minute. Hard-refresh with Ctrl+F5 to see it.

## Videos included
- `assets/app-walkthrough.mp4` — 28s app walkthrough (16:9) on the HOME page, click-to-play.
  Four scenes: find a verified gig, apply in one tap, clear KYC once, withdraw to UPI.
  Poster frame: `assets/app-walkthrough-poster.jpg`.
- `assets/how-it-works.mp4` — 17s explainer (16:9), spare. Swap it onto the home page by
  changing the `src` and `poster` in the `#watch` section of index.html.
- `assets/initi8now-intro.mp4` — 6s logo intro (16:9), used on the About page.
- `assets/app-preview.mp4` — 13s app preview (4:5), used on the For students page and
  sized for Instagram / LinkedIn posts.

To swap any video, replace the file in `assets/` keeping the same filename.
