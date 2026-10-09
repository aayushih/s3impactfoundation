# S3 Impact Foundation: site plan

Working record of the agreed site map and design direction. Copy lives in `site-copy.md` (new sections) and `projects.md` (Drive project copy, the source of truth).

## Goals
Really nice, clean, sophisticated, with a "wow" factor. Phones first, and fast on mobile data.

## Reference sites (OVO and Kellogg dropped)
| Site | What we take from it |
|---|---|
| Gates | Panels with curved "shoulder" corners; mission in large serif with key words in coloured italics; dropdown menu panel with intro + columns |
| Rockefeller | Dropdown menu with an intro card beside grouped links; numbered priorities; results band |
| Hewlett | Programme rows alternating left and right; blue-grey photos turn full colour on hover, text turns green |
| RWJF | Photos with two large rounded corners; bright text cards overlapping photos |
| Open Society | Large figures with small caps labels; on hover the figure slides aside to reveal what it means |
| MacArthur | Values wheel: centre circle, ring text, icons around it |
| Dell | Ribbon of fine lines that draws itself on scroll and changes colour with each figure |

Mobile weight measured (homepage, iPhone size): Rockefeller 0.5 MB, RWJF 0.8 MB, Open Society 1.2 MB, Dell 2.4 MB, Hewlett 5.9 MB, Gates 15.6 MB. Target for S3: under 1.5 MB per page, using CSS and SVG effects, lazy-loaded responsive images and few scripts.

## Signature shapes
- The hero gate: a narrow column with a wide body and soft shoulders, opening on arrival (Gates).
- Leaf corners on photos and cards (RWJF).
- The letterhead wave lives on as the Dell-style scroll ribbon. The hero swoosh was removed.

## Motion
- Apple-style fade-up as elements enter the screen, on every section.
- Text links show a small arrow on hover.
- Higher contrast: near-black indigo text, bolder coloured highlights (Dell-style).
- Buttons: gold turns sky blue on hover; outline buttons take a sky-blue outline.

## Colours (matched by eye from the logo and letterhead; replace with exact brand values when available)
| Role | Hex |
|---|---|
| Midnight Indigo (base dark) | `#1F2340` |
| Sky Blue (logo, wave) | `#9DCFE0` |
| S3 Blue (sky for text on light backgrounds) | `#2F7FA0` |
| Gold (wordmark) | `#E3B23C` |
| Forest (letterhead gradient) | `#2E4A2E` |
| Background, mist | `#F3F6F7` |
| Accent, Social Impact: Coral | `#E2704F` |
| Accent, Sustainability: Leaf | `#5A9E5F` |
| Accent, Livelihoods: Rose | `#D4588A` |
| Accent, Water and kunds | `#3E9BC0` |
| Ink (text) | `#13162C` |
| Accent, Self Transformation: Saffron | `#E3A21A` |

## Fonts (Google Fonts)
- **Chosen:** Fraunces (headings, big numbers, italic accent words) + Figtree (body, menus, small caps labels)
- For Hindi or Marathi later: Tiro Devanagari + Mukta

## Site map
**Navigation:** dropdown panels with an intro card (Rockefeller, Gates). On phones, a full-screen menu with expandable sections.

1. **Home:** temple-door hero (indigo header and hero as one band; arched portal with a thin gold line; two carved door leaves open on arrival; three vibrant photo slides with dots, arrows and pause; highlights in gold) · mission · three commitments as ionic pillars on a stepped base (lift, shadow and turning scrolls on hover) · impact journey with a Dell-style continuous ribbon (draws at 68% of the screen, takes the colour of the last photo reached; text drifts up) · numbers on a light sky band with wave separators, icons and slow count-up · Our Work tiles as consistent arches with colour on hover · parallax quote · Recognition cards with colour on hover, each linking to an inner page · closing band · footer in Rockefeller-style columns with contact details (no social, no newsletter)
2. **About Us:** why S3 (inspiration) · mission & vision · how we work · values wheel (MacArthur) · commitments and the SDGs · trustees · leadership (hidden until confirmed) · accountability (legal details)
3. **Our Work:** categories in alternating rows (Hewlett)
   - Rural Development at GEV: Farmers & Agriculture · Water Resource Development · Women Empowerment · Skill Development · Rural Education · Healthcare & Elder Care · Animal Welfare
   - Govardhan Annakshetra
   - Spiritual & Culture
   - Braj Kunds (6 kunds)
   - Beyond GEV
   - Policy & Advocacy
   - Upcoming projects
   - **Project pages:** hero in wave frame · at a glance · progress line along the timeline (Dell) · overlapping key-figure card (RWJF) · gallery
4. **Impact:** reveal-on-tap number cards (Open Society) · stories · testimonials · partners · in the press · awards and videos (hidden until content)
5. **Get Involved:** partner with us · back an upcoming project · values education for schools · donate (added later)
6. **Contact Us**

**On phones:** hover effects play as items scroll into view; tap reveals details; the ribbon becomes a single line; reduced-motion settings are respected.

## Excluded for now
Only the projects in the Drive copy are listed. Not listed: Mira Road water proposal, MSDE skilling proposal, Srinath ji Cafe, IOCL, other donation projects, Goshala, Livelihood for Landless.

## Decisions log
- Role: funder. Drive wording kept as is, including "Implemented by" on Priya Kund, the Braj kunds revival and the EV course.
- Pond spelling: Vihval. School name: Govardhan English Medium School.
- Budgets: shown where they appear in the Drive copy.
- Trustees: Harneet Hariharan (Rādhikā Līlā DD), Managing Trustee; Aayushi Hariharan, Trustee. Placeholder bios and photos for now.
- Inspiration: no person or tradition named for now.
- Legal details, email, phone and contact inbox: placeholders until supplied.
- Partner logos: shown (logo files needed). Braj Breaking press clipping: shown.
- Photo consent for children: confirmed.
- Colours: matched by eye from the logo and letterhead.
- Tone: warm, grounded and service-led, following the Govardhan Annakshetra examples. Emphasis words in Fraunces italic, in pillar colours.
- Donate: added later by a developer.
- Hosting: on the foundation's existing domain, once the site is approved.
- Maintenance: Aayushi for visual and content changes; a developer for donations and integrations.
- Analytics: a privacy-friendly option with no cookie banner.
- Language: English only for now.
