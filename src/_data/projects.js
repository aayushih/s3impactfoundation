// Turns the Drive project copy (content/projects.md) into one record per project.
// Edit the words in content/projects.md; edit groups and order in content/projects-meta.json;
// edit project photos in src/_data/projectphotos.yml.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const root = path.resolve(import.meta.dirname, "../..");
const md = fs.readFileSync(path.join(root, "content/projects.md"), "utf8");
const meta = JSON.parse(fs.readFileSync(path.join(root, "content/projects-meta.json"), "utf8"));
const photos = yaml.load(fs.readFileSync(path.join(root, "src/_data/projectphotos.yml"), "utf8")) || {};

const STATUS = {
  "Completed": "done",
  "Supported": "done",
  "In progress": "live",
  "Under way": "live",
  "Upcoming": "next",
};
const RESULT_SECTIONS = ["Progress so far", "The difference it made", "What it will achieve"];

// A paragraph may hold an inline list: "Lead text: - one - two - three"
function splitList(p) {
  const i = p.indexOf(": - ");
  if (i === -1 && !p.startsWith("- ")) return null;
  const lead = i === -1 ? "" : p.slice(0, i + 1);
  const items = (i === -1 ? p.slice(2) : p.slice(i + 4)).split(/ - (?=[^\s])/).map((s) => s.trim()).filter(Boolean);
  return items.length > 1 ? { lead, items } : null;
}

// "Built for safety. The home is…" → a short bold lead-in
function leadIn(p) {
  const m = p.match(/^([^.]{3,60}?(?:\([^)]*\))?)\.\s+(.+)$/);
  if (!m) return null;
  const words = m[1].split(/\s+/).length;
  if (words > 7) return null;
  return { lead: m[1] + ".", rest: m[2] };
}

function parseBlocks(lines, sectionTitle) {
  const paras = lines.join("\n").split(/\n\s*\n/).map((s) => s.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
  const isResult = RESULT_SECTIONS.includes(sectionTitle);
  const blocks = [];
  let figures = [];
  const flush = () => { if (figures.length) { blocks.push({ type: "figures", items: figures }); figures = []; } };
  for (const p of paras) {
    const list = splitList(p);
    if (list) {
      flush();
      if (list.lead && /^(Progress so far|Planned outcomes)/.test(list.lead) && isResult) {
        blocks.push({ type: "figures", items: list.items, lead: list.lead });
      } else {
        blocks.push({ type: "list", lead: list.lead, items: list.items });
      }
      continue;
    }
    // Short lines with no closing full stop in a results section are headline figures
    if (isResult && p.length < 170 && !/[.!?]$/.test(p)) { figures.push(p); continue; }
    flush();
    const li = leadIn(p);
    blocks.push(li ? { type: "p", lead: li.lead, text: li.rest } : { type: "p", text: p });
  }
  flush();
  return blocks;
}

function parse() {
  const titles = Object.keys(meta).filter((k) => !k.startsWith("_"));
  const lines = md.split("\n");
  const projects = [];
  let cur = null, sec = null, mode = "intro", upcoming = false;

  const closeSection = () => {
    if (cur && sec) { cur.sections.push({ title: sec.title, blocks: parseBlocks(sec.lines, sec.title) }); }
    sec = null;
  };
  const closeProject = () => { closeSection(); if (cur) projects.push(cur); cur = null; };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^# /.test(line)) { closeProject(); upcoming = /UPCOMING/i.test(line); continue; }
    const h = line.match(/^## (.+)$/);
    if (h) {
      const t = h[1].trim();
      if (titles.includes(t)) {
        closeProject();
        cur = { title: t, ...meta[t], upcoming, summary: "", statusLine: "", glance: [], sections: [] };
        mode = "intro";
      } else if (cur) {
        closeSection();
        sec = { title: t, lines: [] };
        mode = "section";
      }
      continue;
    }
    if (!cur) continue;
    if (mode === "intro") {
      if (!line.trim()) continue;
      if (line.startsWith("|")) {
        const cells = line.split("|").slice(1, -1).map((c) => c.trim());
        if (cells.length >= 2 && cells[0] && !/^:?-+:?$/.test(cells[0]) && cells[0] !== "At a glance") cur.glance.push({ label: cells[0], value: cells[1] });
        continue;
      }
      if (/ · /.test(line) && Object.keys(STATUS).some((s) => line.startsWith(s))) { cur.statusLine = line; continue; }
      if (!cur.summary) { cur.summary = line.trim(); continue; }
    } else if (sec) {
      sec.lines.push(line);
    }
  }
  closeProject();

  for (const p of projects) {
    const parts = p.statusLine.split(" · ");
    p.status = parts[0] || (p.upcoming ? "Upcoming" : "");
    p.statusClass = STATUS[p.status] || "done";
    p.field = parts[1] || "";
    p.place = parts[2] || "";
    p.when = parts[3] || "";
    p.url = `/projects/${p.slug}/`;
    p.photos = photos[p.slug] || {};
  }
  return projects;
}

export default parse();
