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

## Signature shape
The sweeping wave from the S3 letterhead:
- Strands of the wave become the Dell-style scroll ribbon.
- Photo frames get one large wave-curved corner.

## Colours (matched by eye from the logo and letterhead; replace with exact brand values when available)
| Role | Hex |
|---|---|
| Midnight Indigo (base dark) | `#1F2340` |
| Sky Blue (logo, wave) | `#9DCFE0` |
| Gold (wordmark) | `#E3B23C` |
| Forest (letterhead gradient) | `#2E4A2E` |
| Background, warm cream | `#FAF6EE` |
| Accent, Social Impact: Coral | `#E2704F` |
| Accent, Sustainability: Leaf | `#5A9E5F` |
| Accent, Self Transformation: Saffron | `#E3A21A` |

## Fonts (Google Fonts)
- **Chosen:** Fraunces (headings, big numbers, italic accent words) + Figtree (body, menus, small caps labels)
- For Hindi or Marathi later: Tiro Devanagari + Mukta

## Site map
**Navigation:** dropdown panels with an intro card (Rockefeller, Gates). On phones, a full-screen menu with expandable sections.

1. **Home:** hero in wave frame · mission (Gates style) · three commitments · impact journey with scroll ribbon (Dell) · Our Work tiles with colour-on-hover (Hewlett) · partners · recognition & mentions · closing band
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
- Role: funder. Project tables say "Supported by" (changed from "Implemented by" on Priya Kund, Braj kunds revival and EV course).
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
