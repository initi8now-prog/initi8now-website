# Initi8Now website

Static site: HTML + CSS + JS. No build step, no framework. Upload the folder as-is.
Dark theme throughout. Fonts are self-hosted, so nothing loads from Google.

## Pages (clean URLs)
```
index.html             initi8now.com/
students/index.html    /students/
employers/index.html   /employers/
safety/index.html      /safety/
pricing/index.html     /pricing/
faq/index.html         /faq/
about/index.html       /about/
team/index.html        /team/
contact/index.html     /contact/
privacy/index.html     /privacy/
terms/index.html       /terms/
refunds/index.html     /refunds/
404.html               shown for any URL that doesn't exist
sitemap.xml, robots.txt
css/style.css          all styles — brand tokens in the :root block at the top
js/main.js             all interactions
assets/                logos, team photos (WebP), favicons, OG images, fonts, videos
.nojekyll              tells GitHub Pages to serve files exactly as they are
```

## THREE THINGS STILL NEED YOU

**1. Connect the contact form (audit BUG-02).**
Open contact/index.html and find `action="https://formspree.io/f/YOUR_FORM_ID"`.
Sign up free at formspree.io, create a form, paste its ID over `YOUR_FORM_ID`.
Until you do, the form falls back to opening the visitor's email app so nothing is lost.

**2. Add your registered office address (audit BUG-09).**
Open build-time value `ADDR` — or simpler, search all files for
`Initi8Now Private Limited<br>New Delhi, India` and replace with the full address
exactly as it appears on MCA records. It appears in the footer of every page and on Contact.

**3. Check the commitments on the new pages before promoting them.**
safety/, pricing/, terms/ and refunds/ carry promises from your old site: escrow funding,
0% then 8% employer fee, Priority Access at Rs 99/month, UPI payout within 24 hours,
five-working-day dispute windows and a replacement guarantee. Confirm each is what you
actually intend to offer.

**4. Delete the old redirect files from GitHub (audit SEO-01).**
In your repo, delete `about.html`, `team.html`, `students.html`, `employers.html`
and `contact.html` from the ROOT (keep the folders of the same name).
GitHub Pages will then redirect /about to /about/ properly, and WhatsApp/LinkedIn
previews will stop showing "Redirecting...".

Optional: add privacy-friendly analytics (audit TEC-01), then name the provider in
privacy/index.html. After the fixes go live, request re-indexing in Google Search Console
and submit sitemap.xml (audit SEO-03).

## Edit the basics
- Phone / email / socials: change them in the build or search-and-replace
  `6378048013`, `info@initi8now.com`.
- Early-access form link: search for `tally.so/r/5Blg4E`.
- Ticker roles: the `<span>` items inside `<div class="ticker">` in index.html.
- Earnings calculator rates: the `KINDS` object near the top of js/main.js.
- Team bios: team/index.html.
- Pricing plans and fees: pricing/index.html.
- Verification checks and scam signs: safety/index.html.
- Colours, fonts, spacing: the `:root` block at the top of css/style.css.

## Videos
- `assets/app-walkthrough.mp4` — 25s app walkthrough on the home page, click to play.
- `assets/app-preview.mp4` — 13s app preview (4:5) on For students; sized for Instagram.
- `assets/initi8now-intro.mp4` — 6s logo intro on About.
Replace any of them by overwriting the file with the same name.

## Deploy
Upload everything to your GitHub repo (Add file -> Upload files -> drag -> Commit).
GitHub Pages redeploys in about a minute. Hard-refresh with Ctrl+F5.
