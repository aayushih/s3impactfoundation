// Builds the two-page S3 Impact Foundation profile (Word) from the website's own content,
// so the document and the site always say the same thing.
// Run:  node tools/profile-doc.mjs   →   content/S3-Impact-Foundation-Profile.docx
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import sharp from "sharp";
import {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  ShadingType, AlignmentType, VerticalAlign, TableLayoutType, HeightRule, TableAnchorType, OverlapType, SectionType,
} from "docx";

const root = path.resolve(import.meta.dirname, "..");
const load = (f) => yaml.load(fs.readFileSync(path.join(root, f), "utf8"));
const site = load("src/_data/site.yml");
const pages = load("src/_data/pages.yml");
const home = load("src/_data/home.yml");
const projects = (await import(path.join(root, "src/_data/projects.js"))).default;
const sdgs = (await import(path.join(root, "src/_data/sdgs.js"))).default;

// ── look ─────────────────────────────────────────────────────
const C = { indigo: "1F2340", ink: "13162C", body: "2E3250", muted: "5A5F7E", s3: "2F7FA0", sky: "9DCFE0", mist: "F3F6F7", line: "D6DEE3",
  coral: "B23F20", leaf: "2F6B36", saffron: "A86B00", water: "1F6A8A", rose: "A3315F" };
const tone = { coral: C.coral, leaf: C.leaf, saffron: C.saffron, water: C.water, rose: C.rose, s3: C.s3 };
const HEAD = "Georgia", BODY = "Calibri";
const W = 9638; // text width in DXA: A4 with 0.79" side margins

const plain = (s = "") => String(s).replace(/\*([^*]+)\*(\{\w+\})?/g, "$1");
const rich = (s, { size = 20, color = C.body, accent = C.s3, font = BODY } = {}) =>
  String(s).split(/(\*[^*]+\*(?:\{\w+\})?)/).filter(Boolean).map((part) => {
    const m = part.match(/^\*([^*]+)\*(?:\{(\w+)\})?$/);
    return m ? new TextRun({ text: m[1], italics: true, color: tone[m[2]] || accent, size, font })
             : new TextRun({ text: part, size, color, font });
  });
const run = (text, o = {}) => new TextRun({ text, size: o.size ?? 20, color: o.color ?? C.body, bold: o.bold, italics: o.italics, font: o.font ?? BODY, characterSpacing: o.spacing });
const P = (children, o = {}) => new Paragraph({ spacing: { before: o.before ?? 0, after: o.after ?? 100, ...(o.line === null ? {} : { line: o.line ?? 276 }) }, alignment: o.align,
  keepNext: o.keepNext, pageBreakBefore: o.newPage, children: Array.isArray(children) ? children : [children] });
const eyebrow = (text, color = C.s3, before = 200, newPage = false) => P(run(text.toUpperCase(), { bold: true, size: 15, color, spacing: 40 }), { before, after: 60, keepNext: true, newPage });
const pending = (text) => new TextRun({ text, italics: true, highlight: "yellow", size: 18, color: C.ink, font: BODY });

const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };
const cell = (children, width, o = {}) => new TableCell({ width: { size: width, type: WidthType.DXA }, children, verticalAlign: o.v || VerticalAlign.TOP,
  shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
  margins: { top: o.pad ?? 120, bottom: o.pad ?? 120, left: o.padX ?? 160, right: o.padX ?? 160 },
  borders: { top: o.topColor ? { style: BorderStyle.SINGLE, size: 18, color: o.topColor } : none, bottom: o.bottomLine ? { style: BorderStyle.SINGLE, size: 4, color: C.line } : none, left: none, right: none } });
const table = (rows, widths) => new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED, borders: noBorders, rows });
const split = (n) => Array(n).fill(Math.floor(W / n)).map((w, i, a) => (i === a.length - 1 ? W - w * (a.length - 1) : w));

async function img(file, width, height) {
  const buf = await sharp(path.join(root, file)).resize({ width: width * 2, height: height * 2, fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
  return new ImageRun({ type: "jpg", data: buf, transformation: { width, height } });
}

// ── page 1: who we are and what we do ───────────────────────
const a = pages.about;
const logoPng = await sharp(path.join(root, "src/assets/logo/s3-logo-full.svg"), { density: 400 }).png().toBuffer();
const logo = new ImageRun({ type: "png", data: logoPng, transformation: { width: 196, height: 77 } });
const month = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

// Dark blue bands run edge to edge: across the top of page 1 and the bottom of page 2.
// They sit on the page itself (not in Word's header and footer), so Word shows them at full colour.
const PAGE_W = 11906, PAGE_H = 16838, SIDE = 1134;
const band = (cells, widths, height, y) => new Table({ width: { size: PAGE_W, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
  float: { horizontalAnchor: TableAnchorType.PAGE, verticalAnchor: TableAnchorType.PAGE, absoluteHorizontalPosition: 0, absoluteVerticalPosition: y, overlap: OverlapType.NEVER },
  borders: noBorders,
  rows: [new TableRow({ height: { value: height, rule: HeightRule.EXACT }, children: cells })] });
const bandCell = (children, width, o = {}) => new TableCell({ width: { size: width, type: WidthType.DXA }, children, verticalAlign: VerticalAlign.CENTER,
  shading: { type: ShadingType.CLEAR, color: "auto", fill: C.indigo }, margins: { top: 0, bottom: 0, left: o.left ?? 0, right: o.right ?? 0 },
  borders: { top: none, bottom: none, left: none, right: none } });
const headerBand = band([
  bandCell([P(logo, { after: 0, line: null })], PAGE_W / 2, { left: SIDE }),
  bandCell([P(run("ORGANISATION PROFILE", { bold: true, size: 15, color: C.sky, spacing: 50 }), { align: AlignmentType.RIGHT, after: 30 }),
            P(run(month, { size: 16, color: "C9CEE0" }), { align: AlignmentType.RIGHT, after: 0 })], PAGE_W / 2, { right: SIDE }),
], [PAGE_W / 2, PAGE_W / 2], 1500, 0);

const hero = table([new TableRow({ children: [
  cell([
    P(rich("Rooted in *service*", { size: 46, color: C.ink, font: HEAD }), { after: 120 }),
    P(rich(a.intro, { size: 21, color: C.ink }), { after: 120, line: 290 }),
    P(rich(plain(home.mission), { size: 20, color: C.muted, font: HEAD }), { after: 0, line: 290 }),
  ], 5800, { padX: 0, pad: 0 }),
  cell([P(await img("src/assets/projects/govardhan-annakshetra/01.jpg", 225, 170), { align: AlignmentType.RIGHT, after: 0, line: null })], W - 5800, { padX: 0, pad: 0 }),
] })], [5800, W - 5800]);

const pillars = table([new TableRow({ children: a.why.pillars.map((pl, i) => cell([
  P(run(pl.name, { size: 23, color: tone[pl.colour], font: HEAD }), { after: 30 }),
  P(run(pl.line, { size: 17, color: C.muted }), { after: 0 }),
], split(3)[i], { fill: C.mist, topColor: tone[pl.colour], pad: 110 })) })], split(3));

// one line per work area (the same lines as the home page tiles)
const oneLine = {
  rural: "Farming, water, schools, skills and care in the tribal villages of Palghar.",
  annakshetra: "A community kitchen that served 2.4 million free meals in a single year.",
  spiritual: "Restoring sacred places and passing timeless values to the next generation.",
  kunds: "Reviving the sacred ponds of Braj with natural methods and local hands.",
  beyond: "A school campus in Pune and a charitable hospital in Vrindavan.",
  policy: "Carrying grassroots experience to national and global conversations on food and governance.",
};
const cats = pages.work.categories;
const areaCell = (c, i) => cell([
  P(run(plain(c.title), { size: 21, color: C.ink, font: HEAD }), { after: 20 }),
  P(run(oneLine[c.id] || "", { size: 17, color: C.body }), { after: 0, line: 260 }),
], split(3)[i], { pad: 90, bottomLine: true });
const areas = table([0, 3].map((s) => new TableRow({ cantSplit: true, children: cats.slice(s, s + 3).map(areaCell) })), split(3));

const how = a.how.items.map((i) => P([run(i.title + ". ", { bold: true, size: 19, color: C.ink }), run(i.text, { size: 19 })], { after: 60 }));

// ── page 2: impact, leadership, partnership, contact ────────
const nums = pages.impact.numbers.items;
const numCell = (n, w) => cell([
  P(run(n.shows, { size: 34, color: C.s3, font: HEAD }), { after: 10 }),
  P(run(n.label, { size: 16, color: C.body }), { after: 0, line: 250 }),
], w, { pad: 100, padX: 120, fill: C.mist });
const impact = table([0, 4].map((s) => new TableRow({ cantSplit: true, children: nums.slice(s, s + 4).map((n, i) => numCell(n, split(4)[i])) })), split(4));

const goals = sdgs.goals.filter((g) => g.on);
const goalStrip = table([new TableRow({ children: goals.map((g, i) => cell([P(run(g.num, { bold: true, size: 17, color: "FFFFFF" }), { align: AlignmentType.CENTER, after: 0 })],
  split(goals.length)[i], { fill: g.colour.replace("#", ""), pad: 50, padX: 20, v: VerticalAlign.CENTER })) })], split(goals.length));

const trustee = (t) => [
  P([run(t.name, { size: 22, color: C.ink, font: HEAD }), ...(t.other_name ? [run("   " + t.other_name, { italics: true, size: 18, color: C.s3, font: HEAD })] : []),
     run("   " + t.role.toUpperCase(), { bold: true, size: 14, color: C.s3, spacing: 30 })], { after: 30, keepNext: true }),
  P([...rich(t.bio.replace(/\s*\[[^\]]*\]/, ""), { size: 18 }), ...(/\[/.test(t.bio) ? [new TextRun({ text: " " }), pending(t.bio.match(/\[([^\]]*)\]/)[1])] : [])], { after: 110, line: 270 }),
];

const up = projects.filter((p) => p.upcoming);
const shortName = (t) => t.replace(/:.*/, "").replace(/^Reviving Sacred Ponds of Braj/, "Braj kunds: Jal Vihar, Kamal and Vihval Kund");

const v = (val, label) => (val ? run(val, { size: 16, color: "FFFFFF" }) : pending(`${label} to be added`));
const web = site.url && !/example\.org/.test(site.url) ? site.url.replace(/^https?:\/\//, "") : "";
const item = (k, val) => [run(k.toUpperCase() + "   ", { bold: true, size: 14, color: C.sky, spacing: 30 }), val];
const FOOT_H = 760;
const footerBand = band([
  bandCell([P([...item("Email", v(site.contact.email, "Email")), run("        "), ...item("Phone", v(site.contact.phone, "Phone")), run("        "), ...item("Web", v(web, "Web address"))],
    { align: AlignmentType.CENTER, after: 0, line: 240 })], PAGE_W, { left: SIDE, right: SIDE }),
], [PAGE_W], FOOT_H, PAGE_H - FOOT_H);
const closing = [
  P(rich("Walk this path *with us*", { size: 30, color: C.ink, accent: C.s3, font: HEAD }), { before: 260, after: 60, keepNext: true }),
  P(run(plain(pages.involved.ways[0].text), { size: 19, color: C.body }), { after: 0, line: 280 }),
];

const page1 = [
  headerBand,
  hero, P([], { after: 160 }), pillars,
  eyebrow("What we do", C.s3, 260),
  P(run(plain(pages.work.intro), { size: 18, color: C.muted }), { after: 100, line: 270 }),
  areas,
  eyebrow("How we serve", C.s3, 220),
  ...how,
  eyebrow("What we stand for", C.s3, 220),
  ...a.values.items.map((x) => P([run(x.title + ". ", { bold: true, size: 19, color: C.ink }), run(x.text, { size: 19 })], { after: 50 })),
];
const page2 = [
  eyebrow("Impact at a glance", C.s3, 0),
  impact,
  eyebrow("Part of a wider promise", C.s3, 220),
  P(run(`Our work contributes to ${goals.length} of the 17 United Nations Sustainable Development Goals.`, { size: 18, color: C.muted }), { after: 80 }),
  goalStrip,
  eyebrow("On wider stages", C.s3, 240),
  ...home.recognition.cards.map((c) => P([run(c.title + ". ", { bold: true, size: 18, color: C.ink }), run(plain(c.text), { size: 18 })], { after: 50, line: 270 })),
  eyebrow("Leadership", C.s3, 200),
  ...a.trustees.people.flatMap(trustee),
  eyebrow("Looking ahead", C.s3, 160),
  P(run(plain(pages.work.upcoming.intro), { size: 18, color: C.muted }), { after: 60 }),
  P(run(up.map((p) => shortName(p.title)).join("  ·  "), { size: 18, color: C.ink }), { after: 200, line: 280 }),
  ...closing,
  footerBand,
];

const doc = new Document({
  creator: site.name, title: `${site.name}: Profile`, description: site.description,
  styles: { default: { document: { run: { font: BODY, size: 20, color: C.body } } } },
  sections: [
    { properties: { page: { margin: { top: 1900, bottom: 900, left: SIDE, right: SIDE } } }, children: page1 },
    { properties: { type: SectionType.NEXT_PAGE, page: { margin: { top: 900, bottom: 0, left: SIDE, right: SIDE, footer: 0 } } }, children: page2 },
  ],
});

const out = path.join(root, "content/S3-Impact-Foundation-Profile.docx");
fs.writeFileSync(out, await Packer.toBuffer(doc));
console.log("Wrote", path.relative(root, out));
