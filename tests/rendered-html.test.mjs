import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete Het Berkenbos experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>B&amp;B Het Berkenbos \| Overnachten in Hauwert<\/title>/i);
  assert.match(html, /Hier hoef je/);
  assert.match(html, /Vier seizoenen/);
  assert.match(html, /id="lente"/);
  assert.match(html, /id="zomer"/);
  assert.match(html, /id="herfst"/);
  assert.match(html, /id="winter"/);
  assert.match(html, /tree-spring\.png/);
  assert.match(html, /berkenbos-logo-white\.png/);
  assert.match(html, /Vraag je verblijf aan/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps the seasonal interaction responsive and accessible", async () => {
  const [page, css, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /IntersectionObserver/);
  assert.match(page, /pointermove/);
  assert.match(page, /cursor-orb/);
  assert.match(page, /className="ticker"/);
  assert.match(page, /aria-label="Kies een seizoen"/);
  assert.match(page, /aria-expanded=\{menuOpen\}/);
  assert.match(page, /tree-\$\{season\.asset\}\.png/);
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.season-tree-stack/);
  assert.match(css, /\.season-surfaces/);
  assert.match(css, /Bricolage Grotesque Variable/);
  assert.match(css, /Instrument Sans Variable/);
  assert.match(layout, /Vier seizoenen\. Eén plek\./);
  assert.match(layout, /og\.png/);
});
