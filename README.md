# S3 Impact Foundation website

The live site is built automatically from this repository. The site is hosted on Cloudflare Pages. When a change is saved to the `main` branch on GitHub, Cloudflare rebuilds the live site within a minute or two. Changes saved to any other branch appear on a separate preview link instead (shown in Cloudflare under **Deployments**).

## How to make small changes (on GitHub, no tools needed)

1. Open the file you want to change (see the list below) and click the pencil icon (**Edit this file**).
2. Change the words between the quotation marks. Keep the quotation marks and the spacing at the start of each line exactly as they are.
3. Click **Commit changes** at the top right, write a few words about what you changed, and confirm.
4. Wait a minute or two, then refresh the website.

If something goes wrong, Cloudflare keeps the last working version online and shows the error under **Deployments**, so a mistake will not take the site down.

### Where the words live

| What you want to change | File |
|---|---|
| Email, phone, address, menu, footer links, tagline | `src/_data/site.yml` |
| Everything on the home page (hero slides, mission, pillars, journey, numbers, work tiles, quote, recognition, closing band) | `src/_data/home.yml` |
| About Us, Our Work, Impact, Get Involved and Contact pages (trustees, registration numbers, partners, press) | `src/_data/pages.yml` |
| The words on each project page | `content/projects.md` |
| Which group a project sits in, and its pillar | `content/projects-meta.json` |
| The photos on each project page | `src/_data/projectphotos.yml` (photos in `src/assets/projects/<project>/`) |
| Privacy Policy and Terms of Use (drafts) | `src/privacy.md`, `src/terms.md` |

Little codes you can use inside the text:

- `*word*` makes a word italic (in headings it also takes the accent colour)
- `*word*{coral}` makes it italic in a colour: `coral`, `leaf`, `saffron`, `water`, `rose` or `s3`

### Changing a photo

1. Go to `src/assets/img/` and click **Add file → Upload files**. Upload the photo (JPG, PNG or WebP; the larger and sharper the better, the site makes the smaller phone and desktop sizes itself).
2. In `src/_data/home.yml`, replace the old file name with the new one, for example `image: "my-new-photo.jpg"`.
3. For the hero photos, `image_focus` decides which part of the photo stays in view when it is cropped: `"50% 30%"` means centred left to right and 30% from the top. Lower the second number to show more of the top of the photo.

Use file names without spaces (for example `kund-revival-2026.jpg`).

### The logo

The logo files are in `src/assets/logo/`: `s3-logo-mark.svg` (header), `s3-logo-full.svg` (footer) and `s3-impact-logo-source.svg` (the original from the designer).

## Contact form

Messages sent through the contact form are emailed to you by [Web3Forms](https://web3forms.com) (free). To switch the form on: go to web3forms.com, enter the inbox that should receive messages, copy the access key they email you, and paste it into `form_key` in `src/_data/site.yml`. Until then the form shows a short note and its button is disabled.

## Before launch (one-time)

1. In `src/_data/site.yml` set `preview: false` and set `url` to the real web address.
2. In `src/robots.txt` replace the two lines at the bottom with `User-agent: *` and `Allow: /`.
3. Have the Privacy Policy and Terms of Use checked, then remove the "Draft for review" note in `src/_includes/legal.njk`.
4. In `src/_headers` delete the two lines under "While the site is a preview".
5. Connect the domain in Cloudflare Pages (**Custom domains**).

## For developers

- Built with [Eleventy](https://www.11ty.dev/) 3. `npm install`, then `npm start` to preview locally or `npm run build` to build into `_site/`.
- Page templates are in `src/` (`index.njk`) and `src/_includes/` (`base.njk` holds the header, menu and footer).
- Styles: `src/assets/css/site.css`. Scripts: `src/assets/js/site.js`.
- Photos referenced in templates are resized at build time by `@11ty/eleventy-img` (see `eleventy.config.js`).
- Content planning notes live in `content/` (Drive copy of every project, drafted site copy and the site plan).
