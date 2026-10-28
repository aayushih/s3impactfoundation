// Builds the S3 Impact Foundation organisation profile (Word) from the website's own content,
// so the document and the site always say the same thing.
// Run:  node tools/profile-doc.mjs   →   content/S3-Impact-Foundation-Profile.docx
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import sharp from "sharp";
import {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  ShadingType, AlignmentType, HeadingLevel, Header, Footer, PageNumber, PageBreak, LevelFormat,
  TabStopType, VerticalAlign, TableLayoutType,
} from "docx";

const root = path.resolve(import.meta.dirname, "..");
const load = (f) => yaml.load(fs.readFileSync(path.join(root, f), "utf8"));
const site = load("src/_data/site.yml");
const pages = load("src/_data/pages.yml");
const home = load("src/_data/home.yml");
const projects = (await import(path.join(root, "src/_data/projects.js"))).default;
const sdgs = (await import(path.join(root, "src/_data/sdgs.js"))).default;

// ── look ─────────────────────────────────────────────────────
const C = { indigo: "1F2340", ink: "13162C", body: "2E3250", muted: "5A5F7E", s3: "2F7FA0", sky: "E7F3F7", line: "D6DEE3",
  coral: "B23F20", leaf: "2F6B36", saffron: "A86B00", water: "1F6A8A", rose: "A3315F", mist: "F3F6F7", pending: "FFF2B3" };
const tone = { coral: C.coral, leaf: C.leaf, saffron: C.saffron, water: C.water, rose: C.rose, s3: C.s3 };
const HEAD = "Georgia", BODY = "Calibri";
const W = 9026; // text width in DXA on A4 with 1" margins

const plain = (s = "") => String(s).replace(/\*([^*]+)\*(\{\w+\})?/g, "$1");
// "*word*" → italic run in a colour
const rich = (s, { size = 22, color = C.body, accent = C.s3, font = BODY } = {}) =>
  String(s).split(/(\*[^*]+\*(?:\{\w+\})?)/).filter(Boolean).map((part) => {
    const m = part.match(/^\*([^*]+)\*(?:\{(\w+)\})?$/);
    return m ? new TextRun({ text: m[1], italics: true, color: tone[m[2]] || accent, size, font })
             : new TextRun({ text: part, size, color, font });
  });
const P = (text, o = {}) => new Paragraph({ spacing: { after: o.after ?? 160, line: 300 }, alignment: o.align, children: rich(text, o) });
const pending = (text) => new TextRun({ text, italics: true, color: C.muted, highlight: "yellow", size: 22, font: BODY });

const eyebrow = (text, color = C.s3, o = {}) => new Paragraph({ spacing: { before: 120, after: 60 }, keepNext: true, pageBreakBefore: o.newPage,
  children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 17, color, characterSpacing: 40, font: BODY })] });
const H1 = (text, accent = C.s3) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 200 }, keepNext: true,
  children: rich(text, { size: 44, color: C.ink, accent, font: HEAD }) });
const H2 = (text, color = C.ink) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 100 }, keepNext: true,
  children: [new TextRun({ text: plain(text), size: 28, color, font: HEAD })] });
const rule = () => new Paragraph({ spacing: { before: 120, after: 240 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.line, space: 1 } }, children: [] });
const gap = () => new Paragraph({ spacing: { before: 360, after: 0 }, children: [] });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });
const bullet = (lead, text, color = C.ink, keep = false) => new Paragraph({ keepNext: keep, numbering: { reference: "dots", level: 0 }, spacing: { after: 100, line: 290 },
  children: [...(lead ? [new TextRun({ text: lead + " ", bold: true, color, size: 22, font: BODY })] : []), ...rich(text)] });

const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };
const cell = (children, width, o = {}) => new TableCell({ width: { size: width, type: WidthType.DXA }, children, verticalAlign: o.v || VerticalAlign.TOP,
  shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
  margins: { top: o.pad ?? 160, bottom: o.pad ?? 160, left: o.padX ?? 200, right: o.padX ?? 200 },
  borders: o.borders || { top: o.topColor ? { style: BorderStyle.SINGLE, size: 24, color: o.topColor } : none, bottom: o.bottomLine ? { style: BorderStyle.SINGLE, size: 4, color: C.line } : none, left: none, right: none } });
const table = (rows, widths) => new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED, borders: noBorders, rows });

async function img(file, width, height) {
  const buf = await sharp(path.join(root, file)).resize({ width: width * 2, height: height * 2, fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
  return new ImageRun({ type: "jpg", data: buf, transformation: { width, height } });
}

// ── content ──────────────────────────────────────────────────
const a = pages.about, bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
const keyFig = (p) => (p.glance.find((g) => /key fig/i.test(g.label)) || {}).value || "";
const logo = new ImageRun({ type: "png", data: fs.readFileSync(path.join(root, "src/assets/logo/s3-impact-logo-original.png")), transformation: { width: 300, height: 116 } });
const month = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

const cover = [
  new Paragraph({ spacing: { before: 600, after: 600 }, alignment: AlignmentType.CENTER, children: [logo] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "ORGANISATION PROFILE", bold: true, size: 20, color: C.s3, characterSpacing: 60, font: BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: rich("Rooted in *service*", { size: 60, color: C.ink, font: HEAD }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 }, children: rich(plain(home.mission), { size: 24, color: C.muted, font: HEAD }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 }, children: [await img("src/assets/projects/govardhan-annakshetra/01.jpg", 600, 300)] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: site.name, bold: true, size: 22, color: C.ink, font: BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: site.contact.address, size: 18, color: C.muted, font: BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: month, size: 18, color: C.muted, font: BODY })] }),
  pageBreak(),
];

const who = [
  eyebrow("Who we are"), H1(a.title),
  P(a.intro, { size: 24, color: C.ink }),
  ...a.why.paragraphs.map((t) => P(t)),
  table([new TableRow({ children: a.why.pillars.map((pl) => cell([
    new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: pl.name, size: 26, color: tone[pl.colour], font: HEAD })] }),
    new Paragraph({ children: [new TextRun({ text: pl.line, size: 20, color: C.muted, font: BODY })] }),
  ], W / 3, { fill: C.mist, topColor: tone[pl.colour] })) })], [W / 3, W / 3, W / 3]),
  new Paragraph({ spacing: { after: 200 }, children: [] }),
  table([new TableRow({ children: [
    cell([new Paragraph({ spacing: { after: 80 }, children: rich(a.vision.title, { size: 28, color: C.ink, font: HEAD }) }), P(a.vision.text, { font: HEAD, size: 23, after: 0 })], W / 2, { fill: C.sky, pad: 260, padX: 280 }),
    cell([new Paragraph({ spacing: { after: 80 }, children: rich(a.mission.title, { size: 28, color: "FFFFFF", accent: "9DCFE0", font: HEAD }) }), P(a.mission.text, { font: HEAD, size: 23, color: "FFFFFF", after: 0 })], W / 2, { fill: C.indigo, pad: 260, padX: 280 }),
  ] })], [W / 2, W / 2]),
  H2("How we serve"),
  ...a.how.items.map((i) => bullet(i.title + ".", i.text, tone[i.colour])),
  new Paragraph({ keepNext: true, heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 100 }, children: [new TextRun({ text: "What we stand for", size: 28, color: C.ink, font: HEAD })] }),
  ...a.values.items.map((v, i, all) => bullet(v.title + ".", v.text, tone[v.colour], i < all.length - 1)),
  gap(),
];

const w = pages.work;
const work = [
  eyebrow("Our work"), H1("Where we *serve*", C.leaf),
  P(w.intro),
  ...w.categories.flatMap((c) => [
    H2(c.title, tone[c.colour]),
    P(c.intro),
    ...(c.themes ? c.themes.map((t) => bullet(t.name + ".", t.text, tone[c.colour])) : []),
  ]),
  gap(),
];

const nums = pages.impact.numbers.items;
const impact = [
  eyebrow("Impact"), H1(pages.impact.title, C.coral),
  P(pages.impact.intro),
  table(nums.map((n, i) => new TableRow({ cantSplit: true, children: [
    cell([new Paragraph({ children: [new TextRun({ text: n.shows, size: 40, color: tone[n.colour] || C.s3, font: HEAD })] })], 2400, { bottomLine: i < nums.length - 1, v: VerticalAlign.CENTER }),
    cell([new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: n.label, bold: true, size: 22, color: C.ink, font: BODY })] }),
          new Paragraph({ children: [new TextRun({ text: n.detail, size: 20, color: C.muted, font: BODY })] })], W - 2400, { bottomLine: i < nums.length - 1 }),
  ] })), [2400, W - 2400]),
  H2("Lives behind the numbers"),
  ...pages.impact.stories.items.map((s) => bullet(s.title + ".", s.text, tone[s.colour])),
  gap(),
];

const featured = ["govardhan-annakshetra", "ashramshala-education", "safe-drinking-water", "womens-skills", "priya-kund-prem-sarovar", "vedic-education-cultural-centre"];
const selected = [eyebrow("Selected projects"), H1("Stories of *change*", C.saffron)];
for (const slug of featured) {
  const p = bySlug[slug]; if (!p) continue;
  const col = tone[pages.pillar_colours[p.pillar]] || C.s3;
  const photo = p.photos.cover ? await img(`src/assets/projects/${slug}/${p.photos.cover.file}`, 150, 112) : null;
  selected.push(table([new TableRow({ cantSplit: true, children: [
    cell(photo ? [new Paragraph({ children: [photo] })] : [new Paragraph("")], 2500, { padX: 0, bottomLine: true }),
    cell([
      new Paragraph({ spacing: { after: 40 }, keepNext: true, children: [new TextRun({ text: p.title, size: 25, color: C.ink, font: HEAD })] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: [p.status, p.place, p.when].filter(Boolean).join("  ·  "), size: 17, color: col, bold: true, font: BODY })] }),
      new Paragraph({ spacing: { after: 60, line: 280 }, children: [new TextRun({ text: p.summary, size: 20, color: C.body, font: BODY })] }),
      ...(keyFig(p) ? [new Paragraph({ children: [new TextRun({ text: "Key figure: ", bold: true, size: 19, color: col, font: BODY }), new TextRun({ text: keyFig(p), size: 19, color: C.muted, font: BODY })] })] : []),
    ], W - 2500, { bottomLine: true }),
  ] })], [2500, W - 2500]));
}
selected.push(
  H2("On wider stages"),
  ...home.recognition.cards.map((c) => bullet(c.title + ".", plain(c.text), tone[c.colour])),
  gap(),
);

const up = projects.filter((p) => p.upcoming);
const upcoming = [
  eyebrow("Partner with us"), H1("Projects waiting for *partners*", C.s3),
  P(w.upcoming.intro),
  table([
    new TableRow({ tableHeader: true, children: ["Project", "What it will do", "Key figure"].map((h, i) => cell([new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 18, color: "FFFFFF", font: BODY })] })], [2600, 3926, 2500][i], { fill: C.indigo, pad: 100 })) }),
    ...up.map((p, i) => new TableRow({ cantSplit: true, children: [
      cell([new Paragraph({ children: [new TextRun({ text: p.title.replace(/:.*/, ""), bold: true, size: 19, color: C.ink, font: BODY })] }),
            new Paragraph({ children: [new TextRun({ text: p.status, size: 16, color: C.s3, font: BODY })] })], 2600, { fill: i % 2 ? undefined : C.mist, pad: 110 }),
      cell([new Paragraph({ children: [new TextRun({ text: p.summary, size: 18, color: C.body, font: BODY })] })], 3926, { fill: i % 2 ? undefined : C.mist, pad: 110 }),
      cell([new Paragraph({ children: [new TextRun({ text: keyFig(p) || "To be shared on request", size: 18, color: C.muted, font: BODY })] })], 2500, { fill: i % 2 ? undefined : C.mist, pad: 110 }),
    ] })),
  ], [2600, 3926, 2500]),
  H2("Ways to work with us"),
  ...pages.involved.ways.map((x) => bullet(plain(x.title) + ".", x.text, tone[x.colour])),
  gap(),
];

const goals = sdgs.goals.filter((g) => g.on);
const goalsSec = [
  eyebrow(a.goals.label), H1(a.goals.title, C.s3),
  P(`Our work contributes to ${goals.length} of the 17 United Nations Sustainable Development Goals.`),
  table(goals.map((g, i) => new TableRow({ cantSplit: true, children: [
    cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: g.num, bold: true, size: 24, color: "FFFFFF", font: BODY })] })], 900, { fill: g.colour.replace("#", ""), v: VerticalAlign.CENTER, pad: 90, padX: 60 }),
    cell([new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: g.name, bold: true, size: 20, color: C.ink, font: BODY }), new TextRun({ text: "   " + g.pillars.map((x) => x.name).join(" · "), size: 16, color: C.muted, font: BODY })] }),
          new Paragraph({ children: [new TextRun({ text: g.note, size: 19, color: C.body, font: BODY })] })], W - 900, { bottomLine: i < goals.length - 1, pad: 90 }),
  ] })), [900, W - 900]),
  gap(),
];

const people = a.trustees.people.flatMap((t) => [
  new Paragraph({ spacing: { before: 200, after: 20 }, keepNext: true, children: [new TextRun({ text: t.name, size: 30, color: C.ink, font: HEAD })] }),
  ...(t.other_name ? [new Paragraph({ spacing: { after: 20 }, keepNext: true, children: [new TextRun({ text: t.other_name, italics: true, size: 22, color: C.s3, font: HEAD })] })] : []),
  new Paragraph({ spacing: { after: 120 }, keepNext: true, children: [new TextRun({ text: t.role.toUpperCase(), bold: true, size: 17, color: C.s3, characterSpacing: 30, font: BODY })] }),
  ...(t.more ? [P(t.bio), ...t.more.map((x) => P(x))]
             : [new Paragraph({ spacing: { after: 160 }, children: [...rich(t.bio.replace(/\s*\[[^\]]*\]/, "")), ...(/\[/.test(t.bio) ? [new TextRun({ text: " " }), pending(t.bio.match(/\[([^\]]*)\]/)[1])] : [])] })]),
  rule(),
]);
const tr = a.transparency;
const leadership = [
  eyebrow(a.trustees.label, C.s3, { newPage: true }), H1(a.trustees.title, C.s3), ...people,
  eyebrow(tr.label), H2(plain(tr.title)), P(tr.text),
  ...tr.items.map((x) => bullet(x.title + ".", x.text, tone[x.colour])),
];

const v = (val, label) => val ? new TextRun({ text: val, size: 22, color: C.ink, font: BODY }) : pending(`${label} to be added`);
const contact = [
  new Paragraph({ spacing: { before: 360 }, children: [] }),
  table([new TableRow({ children: [cell([
    new Paragraph({ spacing: { after: 100 }, children: rich("Walk this path *with us*", { size: 36, color: "FFFFFF", accent: "9DCFE0", font: HEAD }) }),
    new Paragraph({ spacing: { after: 220, line: 300 }, children: [new TextRun({ text: plain(home.closing.text), size: 22, color: "E3E6F0", font: BODY })] }),
    ...[["Visit", new TextRun({ text: site.contact.address, size: 21, color: "FFFFFF", font: BODY })], ["Email", v(site.contact.email, "Email")], ["Phone", v(site.contact.phone, "Phone")], ["Website", pending("Web address to be added")]].map(([k, val]) =>
      new Paragraph({ spacing: { after: 80 }, tabStops: [{ type: TabStopType.LEFT, position: 1300 }], children: [new TextRun({ text: k.toUpperCase(), bold: true, size: 16, color: "9DCFE0", characterSpacing: 30, font: BODY }), new TextRun({ text: "\t" }), val] })),
  ], W, { fill: C.indigo, pad: 400, padX: 440 })] })], [W]),
];

// ── document ─────────────────────────────────────────────────
const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${site.name}  ·  Organisation profile`, size: 16, color: C.muted, font: BODY })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.muted, font: BODY })] })] });

const doc = new Document({
  creator: site.name, title: `${site.name}: Organisation Profile`, description: site.description,
  styles: {
    default: { document: { run: { font: BODY, size: 22, color: C.body } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: HEAD, size: 44, color: C.ink }, paragraph: { outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: HEAD, size: 28, color: C.ink }, paragraph: { outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: "dots", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 260 } }, run: { color: C.s3 } } }] }] },
  sections: [
    { properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } }, titlePage: true },
      headers: { default: header, first: new Header({ children: [new Paragraph("")] }) },
      footers: { default: footer, first: new Footer({ children: [new Paragraph("")] }) },
      children: [...cover, ...who, ...work, ...impact, ...selected, ...upcoming, ...goalsSec, ...leadership, ...contact] },
  ],
});

const out = path.join(root, "content/S3-Impact-Foundation-Profile.docx");
fs.writeFileSync(out, await Packer.toBuffer(doc));
console.log("Wrote", path.relative(root, out));
