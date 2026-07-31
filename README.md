# Mid Herts Divers Website

A simple, free-to-host website for Mid Herts Divers scuba diving club.

## Features

- **Homepage** with hero, feature cards, articles, membership info, and Instagram gallery
- **Contact form** → emails hello@midhertsdivers.com (via Netlify Forms)
- **Try Dive booking form** → emails hello@midhertsdivers.com (via Netlify Forms)
- **Instagram gallery** → pulls latest posts from @midhertsdivers
- **Article CMS** → authorised members can write articles via /admin/
- **Fully responsive** → works on mobile, tablet, and desktop
- **Free hosting** on Netlify

## Admin Accounts

The following services are registered under the club email **website@midhertsdivers.com** (Google Group):

- **GitHub** — username `mhd-1784`, hosts the source code repository
- **Netlify** — logged in via the GitHub account above, hosts the live site, handles forms, identity, and deploys
- **Cloudinary** — logged in via GitLab, free image CDN for article and gallery images

This email is a shared group so access isn't tied to any single committee member. Add/remove members from the Google Group to manage who receives account notifications.

## Deployment to Netlify

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/midhertsdivers-website.git
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

## Monthly Cost

**£0** — Everything runs on Netlify's free tier:
- Static hosting: Free
- Serverless functions: Free (125k requests/month)
- Forms: Free (100 submissions/month)
- Identity: Free (5 invited users)
- SSL: Free

## Next Steps

- [ ] **Set up image CDN** — move all images currently hotlinked from old site to a CDN (e.g. Cloudinary, Netlify Large Media, or similar)
- [ ] **Configure Decap CMS with CDN** — so writers can upload images directly in the editor to the CDN
- [ ] **Point custom domain** — set midhertsdivers.com to the new Netlify site (coordinate with current host for DNS change)
- [ ] **Set up Instagram gallery** (optional) — connect Instagram API when ready to replace static gallery

## Completed

- [x] Eleventy static site generator with automatic article page generation from markdown
- [x] Set up Netlify Identity + Git Gateway for CMS access
- [x] Set up form email notifications for contact/try-dive submissions
- [x] Favicon and Open Graph meta tags for browser tab icon and social sharing previews
- [x] Calendar/events page (manageable via CMS)
- [x] Migrated articles from old site (Maldives, Scapa Flow, Dunoon, Isle of Man, Lanzarote, Pembrokeshire, Littlehampton, Hyperbaric Chamber, SeaSearch, Madeira, Philippines, Farnes, Red Sea, Cyprus, Fuerteventura, Portland, Plymouth, and more)
- [x] Gallery page with images from trips
- [x] Article image gallery grid (consecutive images display in a responsive grid with lightbox)
- [x] Updated colour scheme and design
