# Initi8Now website

Static site: plain HTML + CSS + JS. No build step, no framework. Upload the folder as-is.

## Files
```
index.html        Home (hero animation, live job ticker, mode switch, how-it-works rail,
                  "Real or scam?" game, badge collector, testimonials, FAQ)
students.html     For students
employers.html    For employers
about.html        About + brand intro video + timeline
team.html         Leadership: Kalyani Mishra (MD), Diksha Mishra (Director & Founder)
contact.html      Phone, email, WhatsApp, LinkedIn, Instagram + message form
css/style.css     All styles (brand tokens at the top of the file)
js/main.js        All interactions
assets/           Logos, team photos, favicon, intro video
.nojekyll         Tells GitHub Pages to serve files exactly as they are
```

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
