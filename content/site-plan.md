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
- The hero gate: our own gate silhouette (side posts, S-curved rising rail, centre finials), opening with light.
- Leaf corners on photos and cards (RWJF).
- The letterhead wave lives on as the Dell-style scroll ribbon. The hero swoosh was removed.

## Motion
- Apple-style fade-up as elements enter the screen, on every section, kept slow and calm (about 2 seconds per reveal; hero lines rise one after another).
- Text links show a small arrow on hover.
- Higher contrast: near-black indigo text, bolder coloured highlights (Dell-style).
- Buttons: light sky blue with indigo text, turning white on hover; outline buttons take a sky-blue outline.

## Colours (matched by eye from the logo and letterhead; replace with exact brand values when available)
| Role | Hex |
|---|---|
| Midnight Indigo (base dark) | `#1F2340` |
| Sky Blue (logo; the accent on indigo: buttons, hero highlights, menu panel, quote card, links and hovers) | `#9DCFE0` |
| S3 Blue (sky for text on light backgrounds) | `#2F7FA0` |
| Gold (FOUNDATION wordmark only) | `#E3B23C` |
| Forest (letterhead gradient) | `#2E4A2E` |
| Background, mist | `#F3F6F7` |
| Accent, Social Impact: Coral | `#E2704F` |
| Accent, Sustainability: Leaf | `#5A9E5F` |
| Accent, Livelihoods: Rose | `#D4588A` |
| Accent, Water and kunds | `#3E9BC0` |
| Ink (text) | `#13162C` |
| Accent, Self Transformation: Saffron (also used for saffron text; the darker mustard is retired) | `#E3A21A` |

## Fonts (Google Fonts)
- **Chosen:** Fraunces (headings, big numbers, italic accent words) + Figtree (body, menus, small caps labels)
- For Hindi or Marathi later: Tiro Devanagari + Mukta

## Site map
**Header:** always midnight indigo; it slides away as you scroll down and returns the moment you scroll up (and stays while a menu is open).

**Navigation:** dropdown panels with an intro card (Rockefeller, Gates). On phones, a full-screen menu with expandable sections.

1. **Home:** gate hero (near full width like Gates; gate silhouette with posts, rising rail and centre finials, edged in gold; wrought-iron doors open on a seam of warm light; three vibrant high-resolution photo slides chosen so faces stay clear of the gate top (village children with their meal, schoolgirls holding their food kits, the spire's kalash being fixed); headline all white with italic emphasis, no eyebrow on the first slide with dots, arrows and pause; one-line headline with gold highlights) · mission · "Our three commitments" title, then a colonnade: four pillars in the same bold line style as the number icons (slab top, bracket capital, lotus bud, banded shaft, stepped base), drawing themselves in, with the three passages in the bays between them (Social Impact: Nourishing *lives*; Sustainability: Caring for the *land*; Self Transformation: Awakening the *spirit*, last word in the bay colour); pillars in grey lines with a white fill at rest; hovering a passage tints its bay, turns the two pillars beside it to ink lines and blooms a brush wash of the bay colour behind them, like the icons; on phones each passage sits beside one pillar · impact journey with a Dell-style continuous ribbon (broad ribbon, up to about 230px across on desktop and about a third of the screen on phones, that runs through the centre of each photo, hidden behind it, with a smooth S-curve between photos; starts as a fine tip, twists once in each gap, tapers into the numbers; ends tapering to a single fine line pointing at the numbers; swings to the page edges behind each photo; draws at 68% of the screen and takes the colour of the last photo reached; text drifts up) · numbers straight after the ribbon on white, Dell-style (centred figures, labels and outline pill links; line-art icons above each figure (cooking pot, classroom, well, temple) with backgrounds recoloured to the figure colours, which use the bright mission colours; hover reveal and slow count-up) · Our Work tiles as consistent arches with colour on hover · parallax quote · Recognition cards with colour on hover, each linking to an inner page · closing band · footer in Rockefeller-style columns with contact details (no social, no newsletter)
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

**On phones:** hover effects play as items scroll into view; tap reveals details; the ribbon sweeps from side to side in an S through each open gap, twisting as it goes, and passes behind each photo and its text; it draws in at mid-screen so each gap visibly fills with colour; the slide arrows, dots and pause button sit centred as one group; reduced-motion settings are respected.

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
- Titles and headings: no full stops.
- Journey photos: leaf-shaped frames.
- Saffron text uses the bright mission saffron `#E3A21A` everywhere.
- Hero alternative on trial: a plain wall of midnight indigo bricks, flush with both page edges, with the photo glimpsed through the joints from the start; the courses slide apart, with no light effect, and leave stepped kund-like indigo sides that melt into the header. Compared side by side with the gate. (Earlier tries: textured Braj sandstone; white bricks with ink outlines; gold bricks.)
- Hero accents in light sky blue (`#9DCFE0`): the italic words including the comma after *service*, the main button, the active slide dot and hover states; no eyebrows on any slide. On phones each headline sits on two lines and only the main button shows (no "Our story").
- Mission on a white band, as in the earlier approved version: coloured italic phrases (*serve:* in S3 blue including its colon, *nourish people* coral, *care for the land* leaf, *grow in spirit* and *strength.* saffron including the full stop). No link under it. It reads itself out: "Our mission is to serve:" first, a pause, then the rest word by word with a rest at each comma (words fade in place so line breaks never shift).
- Commitments section titled "Our Three Pillars", on the mist background so it stands apart from the white mission band.
- Commitments: three of the supplied temple pillars (white fill), each above its passage in a leaf-shaped box. Outlines rest in grey and take the commitment's colour on hover (or as it reaches mid-screen on phones). Pillars draw in one after another, each followed by its passage. Colour-inside and paint-swipe treatments were tried and dropped.
