// Builds one Word profile per trustee, in Palatino, from the trustee text on the website
// (src/_data/pages.yml), with key facts, a timeline and a photo.
// Run:  node tools/trustee-docs.mjs   →   content/Trustee-Profile-<Name>.docx
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import sharp from "sharp";
import {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  ShadingType, AlignmentType, VerticalAlign, TableLayoutType, HeightRule, TableAnchorType, OverlapType,
} from "docx";

const root = path.resolve(import.meta.dirname, "..");
const load = (f) => yaml.load(fs.readFileSync(path.join(root, f), "utf8"));
const site = load("src/_data/site.yml");
const people = load("src/_data/pages.yml").about.trustees.people;

// ── look ─────────────────────────────────────────────────────
const C = { indigo: "1F2340", ink: "13162C", body: "2E3250", muted: "5A5F7E", s3: "2F7FA0", sky: "9DCFE0", skySoft: "E7F3F7", mist: "F3F6F7", line: "D6DEE3",
  coral: "B23F20", leaf: "2F6B36", saffron: "A86B00", water: "1F6A8A", rose: "A3315F", gold: "E3B23C" };
const FONT = "Palatino Linotype";
const PAGE_W = 11906, SIDE = 1134, W = PAGE_W - 2 * SIDE;

const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size ?? 20, color: o.color ?? C.body, bold: o.bold, italics: o.italics, characterSpacing: o.spacing, highlight: o.highlight });
const P = (children, o = {}) => new Paragraph({ spacing: { before: o.before ?? 0, after: o.after ?? 100, ...(o.line === null ? {} : { line: o.line ?? 290 }) }, alignment: o.align, keepNext: o.keepNext,
  children: Array.isArray(children) ? children : [children] });
// "**bold**" → bold ink, "*italic*" → italic in S3 blue
const rich = (s, o = {}) => String(s).split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).filter(Boolean).map((part) =>
  part.startsWith("**") ? run(part.slice(2, -2), { ...o, bold: true, color: o.strong ?? C.ink })
  : part.startsWith("*") ? run(part.slice(1, -1), { ...o, italics: true, color: o.accent ?? C.s3 })
  : run(part, o));
const label = (text, color = C.s3, before = 0) => P(run(text.toUpperCase(), { bold: true, size: 15, color, spacing: 40 }), { before, after: 80, keepNext: true });
const cell = (children, width, o = {}) => new TableCell({ width: { size: width, type: WidthType.DXA }, children, verticalAlign: o.v || VerticalAlign.TOP,
  shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
  margins: { top: o.pad ?? 120, bottom: o.pad ?? 120, left: o.padX ?? 160, right: o.padX ?? 160 },
  borders: { top: o.topColor ? { style: BorderStyle.SINGLE, size: 24, color: o.topColor } : none, bottom: none,
    left: o.leftColor ? { style: BorderStyle.SINGLE, size: 24, color: o.leftColor } : none, right: none } });
const table = (rows, widths, o = {}) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED, borders: noBorders, rows, ...o });
const split = (n, total = W) => Array(n).fill(Math.floor(total / n)).map((w, i, a) => (i === a.length - 1 ? total - w * (a.length - 1) : w));

// leaf shape, as on the website: small radius on two corners, large on the other two; `flip` mirrors it
const leafMask = (w, h, flip, big = 44 * 3, small = 5 * 3) => {
  const [tl, tr, br, bl] = flip ? [big, small, big, small] : [small, big, small, big];
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="M${tl},0 H${w - tr} A${tr},${tr} 0 0 1 ${w},${tr} V${h - br} A${br},${br} 0 0 1 ${w - br},${h} H${bl} A${bl},${bl} 0 0 1 0,${h - bl} V${tl} A${tl},${tl} 0 0 1 ${tl},0 Z"/></svg>`);
};
const leaf = (img, w, h, flip) => sharp(img).ensureAlpha().composite([{ input: leafMask(w, h, flip), blend: "dest-in" }]).png().toBuffer();

// shape: "leaf" for one photo; "pair" for a banner of two photos split by a white gap, shaped as mirror images
async function photo(file, width, height, shape, gap) {
  const img = sharp(path.join(root, file)).rotate().resize({ width: width * 3, height: height * 3, fit: "cover", position: "attention" });
  if (!shape) return new ImageRun({ type: "jpg", data: await img.jpeg({ quality: 86 }).toBuffer(), transformation: { width, height } });
  const raw = await img.clone().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = raw.info;
  let data;
  if (shape === "pair") {
    // gap: the white strip between the two photos, in the source file's pixels
    const src = await sharp(path.join(root, file)).metadata();
    const g0 = Math.round(gap[0] * w / src.width), g1 = Math.round(gap[1] * w / src.width);
    const half = async (left, cw, flip) => ({ input: await leaf(await sharp(raw.data, { raw: raw.info }).extract({ left, top: 0, width: cw, height: h }).png().toBuffer(), cw, h, flip), left, top: 0 });
    data = await sharp({ create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([await half(0, g0, false), await half(g1, w - g1, true)]).png().toBuffer();
  } else data = await leaf(await img.png().toBuffer(), w, h, false);
  return new ImageRun({ type: "png", data, transformation: { width, height } });
}
const logoPng = await sharp(path.join(root, "src/assets/logo/s3-logo-full.svg"), { density: 400 }).png().toBuffer();

const headerBand = () => new Table({ width: { size: PAGE_W, type: WidthType.DXA }, columnWidths: [PAGE_W / 2, PAGE_W / 2], layout: TableLayoutType.FIXED, borders: noBorders,
  float: { horizontalAnchor: TableAnchorType.PAGE, verticalAnchor: TableAnchorType.PAGE, absoluteHorizontalPosition: 0, absoluteVerticalPosition: 0, overlap: OverlapType.NEVER },
  rows: [new TableRow({ height: { value: 1400, rule: HeightRule.EXACT }, children: [
    new TableCell({ width: { size: PAGE_W / 2, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, shading: { type: ShadingType.CLEAR, color: "auto", fill: C.indigo },
      margins: { left: SIDE, top: 0, bottom: 0, right: 0 }, borders: noBorders,
      children: [P(new ImageRun({ type: "png", data: logoPng, transformation: { width: 180, height: 71 } }), { after: 0, line: null })] }),
    new TableCell({ width: { size: PAGE_W / 2, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, shading: { type: ShadingType.CLEAR, color: "auto", fill: C.indigo },
      margins: { right: SIDE, top: 0, bottom: 0, left: 0 }, borders: noBorders,
      children: [P(run("TRUSTEE PROFILE", { bold: true, size: 15, color: C.sky, spacing: 50 }), { align: AlignmentType.RIGHT, after: 30 }),
                 P(run(site.name, { size: 16, color: "C9CEE0" }), { align: AlignmentType.RIGHT, after: 0 })] }),
  ] })] });

const web = (site.url || "").replace(/^https?:\/\//, "");
const closingBand = () => table([new TableRow({ children: [cell([
  P([run("EMAIL   ", { bold: true, size: 14, color: C.sky, spacing: 30 }), run(site.contact.email || "", { size: 17, color: "FFFFFF" }),
     run("          "), run("WEB   ", { bold: true, size: 14, color: C.sky, spacing: 30 }), run(web, { size: 17, color: "FFFFFF" })], { align: AlignmentType.CENTER, after: 0 }),
], W, { fill: C.indigo, pad: 170 })] })], [W]);

// ── one profile ──────────────────────────────────────────────
async function build(p, d) {
  const tone = d.tone;
  const stat = (fig, text, col) => [
    P(run(fig, { size: 34, color: col }), { after: 0, line: 250 }),
    P(run(text, { size: 16, color: C.muted }), { after: 150, line: 240 }),
  ];
  const sidebar = [
    label("At a glance", tone),
    ...d.stats.flatMap(([f, t, c]) => stat(f, t, c)),
    label("Education", tone, 60),
    ...d.education.map((e) => P([run(e[0], { bold: true, size: 17, color: C.ink }), run(" " + e[1], { size: 16, color: C.muted })], { after: 80, line: 250 })),
    label("Areas of focus", tone, 100),
    ...d.focus.map(([t, c]) => P([run("■  ", { size: 15, color: c }), run(t, { size: 17, color: C.body })], { after: 40, line: 250 })),
  ];

  const PW = 3000; // portrait column
  const nameBlock = [table([new TableRow({ children: [
    cell([
      P(run(p.name, { size: 52, color: C.ink }), { after: 20, line: null }),
      ...(p.other_name ? [P(run(p.other_name, { italics: true, size: 26, color: C.s3 }), { after: 80 })] : []),
      table([new TableRow({ children: [cell([P(run(p.role.toUpperCase(), { bold: true, size: 16, color: "FFFFFF", spacing: 40 }), { after: 0, line: 240 })], 3000, { fill: tone, pad: 70, padX: 180 })] })], [3000]),
      P([], { after: 160 }),
      P(rich(d.lead, { size: 23, color: C.ink, strong: tone }), { after: 0, line: 320 }),
    ], W - PW - 300, { padX: 0, pad: 0 }),
    cell([P([], { after: 0 })], 300, { padX: 0, pad: 0 }),
    cell([P(await photo(d.portrait, 150, 200, "leaf"), { after: 0, line: null, align: AlignmentType.RIGHT })], PW, { padX: 0, pad: 0 }),
  ] })], [W - PW - 300, 300, PW]), P([], { after: 200 })];

  const banner = P(await photo(d.photo, 642, d.bannerH || 190, "pair", d.gap), { after: 60, line: null });
  const caption = P(run(d.caption, { italics: true, size: 15, color: C.muted }), { after: 220 });

  const main = d.paragraphs.map((t) => P(rich(t, { size: 20, color: C.body, strong: C.ink }), { after: 150, line: 300 }));
  const columns = table([new TableRow({ children: [
    cell(main, 6250, { padX: 0, pad: 0 }),
    cell([P([], { after: 0 })], 300, { padX: 0, pad: 0 }),
    cell(sidebar, W - 6550, { fill: C.mist, topColor: tone, pad: 220, padX: 240 }),
  ] })], [6250, 300, W - 6550]);

  const tlW = split(d.timeline.length);
  const timeline = [
    label("Milestones", tone, d.extra ? 220 : 300),
    table([new TableRow({ cantSplit: true, children: d.timeline.map(([year, text, col], i) => cell([
      P(run(year, { size: 30, color: col }), { after: 40, line: 260 }),
      P(rich(text, { size: 16, color: C.body, strong: C.ink }), { after: 0, line: 250 }),
    ], tlW[i], { topColor: col, pad: 130, padX: 140, fill: C.mist })) })], tlW),
  ];

  // optional photo with a short note (e.g. a recognition), on page 2
  const extra = d.extra ? [
    label(d.extra.label, tone, 200),
    table([new TableRow({ cantSplit: true, children: [
      cell([P(await photo(d.extra.photo, 120, 160), { after: 50, line: null }), ...(d.extra.caption ? [P(run(d.extra.caption, { italics: true, size: 14, color: C.muted }), { after: 0, line: 220 })] : [])], 2800, { padX: 0, pad: 0 }),
      cell([P([], { after: 0 })], 300, { padX: 0, pad: 0 }),
      cell([P(rich(d.extra.title, { size: 26, color: C.ink }), { after: 100, line: 280 }), P(rich(d.extra.text, { size: 19, color: C.body, strong: C.ink }), { after: 0, line: 300 })], W - 3100, { padX: 0, pad: 60, v: VerticalAlign.CENTER }),
    ] })], [2800, 300, W - 3100]),
  ] : [];

  // the closing paragraph, as normal text with its key phrases in bold
  const quote = [
    P(rich(d.quote, { size: 20, color: C.body, strong: C.ink, accent: tone }), { before: 260, after: 0, line: 300 }),
    P([], { after: 280 }),
    closingBand(),
  ];

  const doc = new Document({
    creator: site.name, title: `${p.name}: Trustee Profile`,
    styles: { default: { document: { run: { font: FONT, size: 20, color: C.body } } } },
    sections: [{ properties: { page: { margin: { top: 1800, bottom: 700, left: SIDE, right: SIDE } } },
      children: [headerBand(), ...nameBlock, banner, caption, columns, ...timeline, ...extra, ...quote] }],
  });
  const out = path.join(root, `content/Trustee-Profile-${p.name.replace(/\s+/g, "-")}.docx`);
  fs.writeFileSync(out, await Packer.toBuffer(doc));
  console.log("Wrote", path.relative(root, out));
}

// ── the two trustees ─────────────────────────────────────────
// The paragraphs are the website text, with key phrases in **bold** for the printed profile.
const harneet = people.find((x) => /Harneet/.test(x.name));
const aayushi = people.find((x) => /Aayushi/.test(x.name));
const bold = (text, phrases) => phrases.reduce((t, ph) => t.replace(ph, `**${ph}**`), text);

await build(harneet, {
  tone: C.coral,
  portrait: "content/design-assets/portrait-harneet.jpg",
  lead: bold(harneet.bio, ["sets the direction of S3 Impact Foundation", "three decades of building and leading a national business"]),
  photo: "content/design-assets/harneet-banner.jpg",
  gap: [1356, 1366],
  bannerH: 250,
  caption: "Left: on site with the project team, reviewing restoration plans. Right: with the Uttar Pradesh Braj Tirtha Vikas Parishad’s certificate for the eco-restoration of Priya Kund, alongside His Grace Gaurāṅga Dās and His Holiness Rādhānāth Swāmī Mahārāja.",
  paragraphs: [
    bold(harneet.more[0], ["MBA in International Marketing", "founded Pace Setters Business Solutions", "more than 5,000 people"]),
    bold(harneet.more[1], ["dedicating the profits of her company to service"]),
    bold(harneet.more[2], ["CEO of the Social Impact Initiatives of ISKCON Govardhan Ecovillage", "more than 7.18 million free meals", "Priya Kund and Prem Sarovar are complete", "Centre of Excellence for electric-vehicle skilling"]),
  ],
  quote: bold(harneet.more[3], ["decisive, hands-on leader", "boardroom discipline and on-ground compassion"]),
  stats: [["1993", "Founded Pace Setters Business Solutions", C.coral], ["5,000+", "People in the company she leads", C.saffron], ["7.18M", "Free meals served by Govardhan Annakshetra", C.leaf], ["2 + 5", "Kunds revived in Braj, with five more under way", C.water]],
  education: [["MBA,", "International Marketing, Faculty of Management Studies, M.S. University of Baroda"], ["B.Sc.,", "Physics, Chemistry and Mathematics"]],
  focus: [["Nutrition and food security", C.coral], ["Water and sacred ponds", C.water], ["Skills and livelihoods", C.leaf], ["Heritage and temples", C.saffron], ["Institution building", C.s3]],
  timeline: [["1990", "**MBA**, Faculty of Management Studies, Baroda", C.s3], ["1993", "**Founds Pace Setters** with a team of fifteen", C.saffron], ["2022", "Dedicates her **company’s profits to service**", C.leaf], ["2023", "**CEO**, Social Impact Initiatives, Govardhan Ecovillage", C.coral]],
});

await build(aayushi, {
  tone: C.s3,
  portrait: "content/design-assets/portrait-aayushi.jpg",
  lead: bold(aayushi.bio, ["shape its creative direction", "Central Saint Martins", "from large installations and print campaigns to websites and mobile apps"]),
  photo: "content/design-assets/aayushi-work-banner.jpg",
  gap: [958, 968],
  caption: "Aayushi’s work: infographic panels on the 17 SDGs for Govardhan Ecovillage, and the Manthan Shivir book.",
  paragraphs: [
    bold(aayushi.more[0], ["First Class Honours in Graphic Communication Design", "Central Saint Martins, University of the Arts London", "IBM Enterprise Design Thinking Practitioner"]),
    bold(aayushi.more[1], ["brand strategist", "Chief Creative Officer of Simple Vedas"]),
    bold(aayushi.more[2], ["Design Lead at Govardhan Ecovillage", "more than 17 initiatives", "website for Govardhan Annakshetra", "raised their traffic by 70%"]),
    bold(aayushi.more[3], ["Strategic Creative Lead at Healy World GmbH", "redesign of its website", "visual identity", "graphics and marketing teams"]),
  ],
  quote: bold(aayushi.more[4], ["human-centred design", "a global eye and a deep respect for the communities it serves"]),
  stats: [["1st", "First Class Honours, Central Saint Martins", C.s3], ["17+", "Initiatives aligned with the UN Sustainable Development Goals", C.leaf], ["70%", "Rise in traffic after the websites’ redesign", C.coral], ["IBM", "Certified Enterprise Design Thinking Practitioner", C.saffron]],
  education: [["BA (Hons),", "Graphic Communication Design, Central Saint Martins, UAL"], ["Foundation Diploma,", "Art and Design, with Distinction"]],
  focus: [["Brand strategy and identity", C.s3], ["Websites and mobile apps", C.water], ["Campaigns and social media", C.coral], ["Reports and infographics", C.leaf], ["Installations and placemaking", C.saffron]],
  timeline: [["2019", "**Brand strategist** for clients around the world", C.s3], ["2022", "**Chief Creative Officer**, Simple Vedas", C.saffron], ["2022", "**Design Lead**, Govardhan Ecovillage", C.leaf], ["2025", "**Strategic Creative Lead**, Healy World GmbH", C.coral]],
});
