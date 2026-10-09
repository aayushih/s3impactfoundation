import yaml from "js-yaml";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const COLOURS = ["coral", "leaf", "saffron", "water", "rose", "s3"];

const escape = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default function (eleventyConfig) {
  // Text lives in YAML files under src/_data
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  // Styles, scripts, logo and favicons are copied as they are
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/logo");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Every photo is resized for phones and desktops when the site is built,
  // so only one copy of each photo needs to be uploaded
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp"],
    widths: [480, 900, 1400, 2000],
    urlPath: "/assets/img/sized/",
    outputDir: "./_site/assets/img/sized/",
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
    },
  });

  // *word* → italic, *word*{coral} → italic in a colour.
  // "k" gives the heading style; "mission" uses the bright mission colours.
  eleventyConfig.addFilter("em", (text, style = "") => {
    let s = escape(text);
    s = s.replace(/\*([^*]+)\*\{(\w+)\}/g, (_, words, colour) => {
      if (!COLOURS.includes(colour)) return `<em class="k">${words}</em>`;
      const cls = colour === "s3" ? "c-s3" : style === "mission" ? `m-${colour}` : `c-${colour}`;
      return `<em class="k ${cls}">${words}</em>`;
    });
    s = s.replace(/\*([^*]+)\*/g, (_, words) => (style === "k" ? `<em class="k">${words}</em>` : `<em>${words}</em>`));
    return s;
  });

  // The quote settles in one word at a time
  eleventyConfig.addFilter("words", (text) =>
    String(text ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w, i) => `<span class="w" style="--i:${i}">${escape(w)}</span>`)
      .join(" ")
  );

  // Phone numbers become tap-to-call links
  eleventyConfig.addFilter("tel", (n) => "tel:" + String(n ?? "").replace(/[^\d+]/g, ""));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
  };
}
