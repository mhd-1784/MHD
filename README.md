# Mid Herts Divers Website

A simple, free-to-host website for Mid Herts Divers scuba diving club.

## Features

- **Homepage** with hero, feature cards, articles, membership info, and gallery
- **Contact form** → emails hello@midhertsdivers.com (via Netlify Forms)
- **Try Dive booking form** → emails hello@midhertsdivers.com (via Netlify Forms)
- **Article CMS** → authorised members can write articles via /admin/
- **Gallery CMS** → authorised members can upload images via /admin/
- **Fully responsive** → works on mobile, tablet, and desktop
- **Free hosting** on Netlify

## Admin Accounts

The following services are registered under the club email **website@midhertsdivers.com** (Google Group):

- **GitHub** — username `mhd-1784`, hosts the source code repository
- **Netlify** — logged in via the GitHub account above, hosts the live site, handles forms, identity, and deploys
- **Cloudinary** — logged in via GitLab, free image CDN for article and gallery images
- **Cloudflare** — logged in via GitHub, manages the domain and DNS for midhertsdivers.com (Account ID: `32007a9ecb927d6a20f07590cc96c576`)

This email is a shared group so access isn't tied to any single committee member. Add/remove members from the Google Group to manage who receives account notifications.

Form enquiries (try-dive bookings and contact form) go to the **hello@midhertsdivers.com** Google Group — the same destination the old site used, so no change for whoever currently receives them. To change recipients, either manage the Google Group membership or update the notification address in Netlify → Forms → Form notifications.

## Local Development

The site is built with [Eleventy](https://www.11ty.dev/) (a static site generator). To run it locally:

```bash
# Clone the repo
git clone https://github.com/mhd-1784/MHD.git
cd MHD

# Install dependencies
npm install

# Start the dev server (with live reload)
npm run dev
```

The site runs at `http://localhost:8080/`. Any edits to files in `src/` will auto-rebuild and refresh the browser.

Other commands:
- `npm run build` — build the site into `_site/` (what Netlify runs on deploy)
- `npm run clean` — delete the `_site/` build output

### Contributing

Every push to the `main` branch triggers an automatic Netlify deploy to the live site. To avoid pushing unfinished work live, use a branch and pull request:

```bash
# Create a branch for your work
git checkout -b my-change

# ... make edits, then commit ...
git add .
git commit -m "Describe your change"
git push -u origin my-change
```

Then open a Pull Request on GitHub. Once reviewed and merged into `main`, Netlify deploys it automatically.

Content (articles, events, gallery) is normally added via the CMS at `/admin/` rather than by editing markdown directly — but both work.

## Deployment to Netlify

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/mhd-1784/MHD
git push -u origin main
```

### 2. Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repo
4. Deploy settings are auto-configured via `netlify.toml`
5. Click "Deploy site"

### 3. Set up Form Notifications

1. In Netlify: Site settings → Forms → Form notifications
2. Add "Email notification"
3. Set email to: `hello@midhertsdivers.com`
4. This will email you for both the contact form AND try-dive bookings

### 4. Set up Netlify Identity (for CMS login)

1. In Netlify: Site settings → Identity → Enable Identity
2. Under "Registration preferences" → select "Invite only"
3. Under "External providers" → optionally add Google login
4. Under "Services" → Enable "Git Gateway"
5. Go to Identity tab → Invite users (add the committee members who'll write articles)

### 5. Set up Instagram Gallery

1. Ensure @midhertsdivers is a Business or Creator account (switch in Instagram settings)
2. Connect it to a Facebook Page
3. Go to [developers.facebook.com](https://developers.facebook.com) → Create App
4. Add "Instagram Graph API" product
5. Generate a User Token with `instagram_basic` and `pages_read_engagement` permissions
6. Exchange for a long-lived token (valid 60 days, auto-refreshed by our function)
7. In Netlify: Site settings → Environment variables → Add `INSTAGRAM_ACCESS_TOKEN`

The scheduled function (`refresh-token`) runs weekly to keep the token alive.

### 6. Custom Domain

1. In Netlify: Domain settings → Add custom domain
2. Point your DNS to Netlify (they provide instructions)
3. Free SSL certificate is automatic

## Project Structure

```
MHD/
├── src/
│   ├── index.njk           # Homepage
│   ├── about.njk           # About page
│   ├── articles.njk        # Articles listing page
│   ├── calendar.njk        # Calendar/events page
│   ├── contact.njk         # Contact form page
│   ├── gallery.njk         # Gallery page
│   ├── join.njk            # Join page
│   ├── try-dive.njk        # Try dive booking page
│   ├── styles.css          # All styling
│   ├── script.js           # JS: mobile menu, gallery grid, lightbox, animations
│   ├── _includes/          # Nunjucks layout templates
│   ├── _data/              # Global data files
│   ├── admin/              # Decap CMS admin panel + config
│   ├── articles/           # Markdown articles (managed by CMS)
│   ├── events/             # Markdown events/trips (managed by CMS)
│   ├── gallery-images/     # Markdown gallery items (managed by CMS)
│   ├── images/             # Static images
│   └── netlify/functions/  # Serverless functions (Instagram, token refresh)
├── .eleventy.js            # Eleventy configuration
├── netlify.toml            # Netlify config (build, redirects, headers)
└── package.json            # Dependencies
```

## Writing Articles

1. Go to `yoursite.com/admin/`
2. Log in with your invited identity
3. Click "Articles" → "New Article"
4. Write using the rich text editor, upload images
5. Click "Publish"

Note: After publishing, Netlify automatically rebuilds the site. The new article will appear on the homepage and articles page within about 30 seconds.

## Updating the Calendar (Trips & Events)

The Calendar page's "Upcoming Trips & Events" list is managed through the CMS — no code editing needed.

**To add a trip or event:**

1. Go to `yoursite.com/admin/` and log in.
2. Click **"Events & Trips"** → **"New Events & Trips"**.
3. Fill in the fields:
   - **Title** — e.g. "Farne Islands Weekend"
   - **Start Date** — the date (and time) the event begins.
   - **End Date** — the date it ends. For a single-day event, set it the same as the start date.
   - **Description** — a short summary shown on the card.
   - **Contact** *(optional)* — who to contact about the trip (e.g. "Howard Smith").
   - **Qualification Required** *(optional)* — e.g. "Ocean Diver+". Shown as a tag; leave blank if not applicable.
   - **Spaces Available** — toggle ON if there are spaces, OFF to show "Full (taking reserves)".
4. Click **"Publish"**.

**To edit or remove an event:** open it under "Events & Trips" in the CMS, make changes (or delete it), and publish.

**Good to know:**
- **Past events disappear automatically.** Once an event's End Date has passed, it drops off the Calendar page on the next site build (and is hidden immediately for visitors via JavaScript). No need to manually delete old events.
- Events are sorted automatically by start date (soonest first).
- Each change triggers an automatic rebuild — the Calendar updates within about 30 seconds.

**The Year Planner PDF** (the "Download Year Planner" button) is a separate file at `src/images/year-planner-2026.pdf`. To update it for a new year, upload the new PDF via the CMS media library (or replace the file in the repo) and update the link/filename in `src/calendar.njk` if the filename changes.

## Monthly Cost

**£0** — Everything runs on Netlify's free tier:
- Static hosting: Free
- Serverless functions: Free (125k requests/month)
- Forms: Free (100 submissions/month)
- Identity: Free (5 invited users)
- SSL: Free
- Build minutes: Free (300/month)

**Checking build-minute usage:** each production deploy (merge to `main`) and each PR deploy-preview build consumes build minutes. To see how many you've used and when the allowance resets, go to **Netlify → Usage & billing** (in the left sidebar). This is the authoritative figure. Batching changes onto a branch and merging once (rather than many small pushes to `main`) keeps usage low. Automatic branch deploys are disabled in `netlify.toml` to avoid unnecessary builds.

## Branch Workflow

To avoid breaking the live site, use feature branches for changes:

```bash
# Create a new branch for your changes
git checkout -b my-changes

# Make edits, then commit
git add -A
git commit -m "Description of changes"

# Push the branch (won't trigger a production deploy)
git push -u origin my-changes

# When ready to go live, merge to main
git checkout main
git pull
git merge my-changes
git push
```

Only pushes to `main` trigger a production deploy on Netlify. Feature branches are free to push without using credits.

To discard local changes and reset a file to the last committed version:
```bash
git checkout -- path/to/file
```

## Next Steps

- [ ] **Enable "Force HTTPS" in Netlify** — Domain settings → HTTPS; auto-redirects any http:// visitor to https:// (toggle appears once the cert is provisioned)
- [ ] **Redirect secondary domains to midhertsdivers.com** — set up Cloudflare Redirect Rules for `midhertsdivers.net`, `.co.uk`, `.org.uk`, `.uk` → `https://midhertsdivers.com` (301), so all owned domains funnel to the primary site
- [ ] **Set up Instagram gallery** (optional) — connect Instagram API when ready to replace static gallery

## SEO Improvement Checklist

### High Priority

- [x] Add self-referencing canonical tags to all indexable pages.
- [x] Implement homepage JSON-LD structured data (SportsClub or Organization + WebSite).
- [ ] Validate structured data using Google’s Rich Results Test or Schema Validator.

### Medium Priority

- [ ] Add width and height attributes to all images to reduce Cumulative Layout Shift (CLS).
- [ ] Implement Article schema on article pages.
- [ ] Implement BreadcrumbList schema on internal pages.

## Completed

- [x] Eleventy static site generator with automatic article page generation from markdown
- [x] Set up Netlify Identity + Git Gateway for CMS access
- [x] Set up form email notifications for contact/try-dive submissions
- [x] Favicon and Open Graph meta tags for browser tab icon and social sharing previews
- [x] Calendar/events page (manageable via CMS, auto-hides past events)
- [x] Migrated articles from old site (Maldives, Scapa Flow, Dunoon, Isle of Man, Lanzarote, Pembrokeshire, Littlehampton, Hyperbaric Chamber, SeaSearch, Madeira, Philippines, Farnes, Red Sea, Cyprus, Fuerteventura, Portland, Plymouth, and more)
- [x] Gallery page with images from trips
- [x] Article image gallery grid (consecutive images display in a responsive grid with lightbox)
- [x] Updated colour scheme and design (visual refresh PR merged)
- [x] Set up Cloudinary CDN — all images migrated from old site, CMS configured for future uploads
- [x] Join page improvements — skip-to links for new/qualified divers, separated DD buttons
- [x] SEO redirects — old year-based article URLs (`/articles/YYYY/slug`) 301-redirect to new slug URLs via `src/_redirects`
- [x] **Finalise home page card images** — `already-a-diver.jpeg` and `try-scuba.jpeg` still to be updated
- [x] **Calendar page polish** — light visual improvements to the top text (Regular Sessions / Year Planner)
- [x] **Hero H1 sizing** — decide whether to keep "Mid Herts Divers" on one line (discuss with Sergey)
- [x] **Went live** — pointed `midhertsdivers.com` + `www` at Netlify via Cloudflare (CNAME, DNS-only/grey cloud); Let's Encrypt SSL cert provisioned; article redirects verified working on the live domain
