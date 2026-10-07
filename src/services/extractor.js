const cheerio = require("cheerio");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

const REMOVE = [
  "script", "style", "noscript", "iframe", "svg", "canvas", "img", "video",
  "audio", "form", "button", "input", "select", "nav", "footer", "header",
  "aside", "[aria-hidden='true']", "[class*='ad-']", "[id*='google_ads']",
];

function cleanHtml(html) {
  const $ = cheerio.load(html);
  $(REMOVE.join(",")).remove();

  // turn block elements into line breaks so paragraphs stay separate
  $("br").replaceWith("\n");
  $("p, div, li, h1, h2, h3, h4, h5, h6, tr, blockquote, section, article")
    .each((_, el) => { $(el).append("\n"); });

  return $("body").text()
    .replace(/[ \t]+/g, " ")        // collapse spaces
    .replace(/ *\n */g, "\n")       // trim around newlines
    .replace(/\n{3,}/g, "\n\n")     // max one blank line
    .trim();
}

function readableText(html, url = "https://example.com") {
  const dom = new JSDOM(html, { url });
  const article = new Readability(dom.window.document).parse();
  return article ? { title: article.title, text: article.textContent.trim() } : null;
}

function embeddedJson(html) {
  const $ = cheerio.load(html);
  const out = [];
  $("script[type='application/ld+json'], script#__NEXT_DATA__").each((_, el) => {
    try { out.push(JSON.parse($(el).text())); } catch {}
  });
  return out;
}

module.exports = {
  cleanHtml,
  readableText,
  embeddedJson
};
