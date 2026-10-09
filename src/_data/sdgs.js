// The 17 Global Goals drawn as a wheel on the About page.
// Which goals light up comes from "goals" in src/_data/pages.yml.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const root = path.resolve(import.meta.dirname, "../..");
const pages = yaml.load(fs.readFileSync(path.join(root, "src/_data/pages.yml"), "utf8"));
const g = pages.about.goals;

const GOALS = [
  ["No Poverty", "#E5243B"], ["Zero Hunger", "#DDA63A"], ["Good Health and Well-being", "#4C9F38"],
  ["Quality Education", "#C5192D"], ["Gender Equality", "#FF3A21"], ["Clean Water and Sanitation", "#26BDE2"],
  ["Affordable and Clean Energy", "#FCC30B"], ["Decent Work and Economic Growth", "#A21942"],
  ["Industry, Innovation and Infrastructure", "#FD6925"], ["Reduced Inequalities", "#DD1367"],
  ["Sustainable Cities and Communities", "#FD9D24"], ["Responsible Consumption and Production", "#BF8B2E"],
  ["Climate Action", "#3F7E44"], ["Life Below Water", "#0A97D9"], ["Life on Land", "#56C02B"],
  ["Peace, Justice and Strong Institutions", "#00689D"], ["Partnerships for the Goals", "#19486A"],
];

// which pillar(s) each goal belongs to
const pillars = {};
for (const grp of g.groups) for (const item of grp.goals) {
  const n = parseInt(item, 10);
  (pillars[n] = pillars[n] || []).push({ name: grp.name, colour: grp.colour });
}

// white pictograms from the official UN goal icons, one file per goal in src/_includes/sdg/
const boxes = JSON.parse(fs.readFileSync(path.join(root, "src/_includes/sdg/boxes.json"), "utf8"));
// show icons only once all 17 are in place, otherwise the wheel keeps its numbers
const iconBoxes = Object.keys(boxes).length === 17 ? boxes : {};

const C = 300, R = 288, r = 202, GAP = 1.4; // viewBox 600 × 600
const pt = (rad, deg) => { const a = (deg - 90) * Math.PI / 180; return [C + rad * Math.cos(a), C + rad * Math.sin(a)]; };
const f = (n) => n.toFixed(2);

const goals = GOALS.map(([name, colour], i) => {
  const n = i + 1, step = 360 / 17, a0 = i * step + GAP / 2, a1 = (i + 1) * step - GAP / 2, am = (a0 + a1) / 2;
  const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1), [x2, y2] = pt(r, a1), [x3, y3] = pt(r, a0);
  const [lx, ly] = pt((R + r) / 2, am);
  const [dx, dy] = pt(16, am).map((v) => v - C);
  return {
    n, num: String(n).padStart(2, "0"), name, colour,
    on: Boolean(pillars[n]), pillars: pillars[n] || [], note: (g.notes || {})[n] || "",
    d: `M${f(x0)} ${f(y0)}A${R} ${R} 0 0 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r} ${r} 0 0 0 ${f(x3)} ${f(y3)}Z`,
    lx: f(lx), ly: f(ly), dx: f(dx), dy: f(dy),
    icon: iconBoxes[n] ? { vb: iconBoxes[n], file: `sdg/${String(n).padStart(2, "0")}.svg`, x: f(lx - 27), y: f(ly - 27) } : null,
  };
});

export default { goals, count: goals.filter((x) => x.on).length };
