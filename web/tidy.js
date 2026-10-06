// After a build: removes bundles from an earlier build that nothing references any more (Vite keeps public/ as it is otherwise).
// A file is current when a page links it, or when a linked script loads it later (the lazily loaded Motion feature chunk).
import { readdirSync, readFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";

const pub = fileURLToPath(new URL("../public/", import.meta.url));
const html = readdirSync(pub).filter(f => f.endsWith(".html")).map(f => readFileSync(pub + f, "utf8")).join("\n");
const linked = readdirSync(pub + "assets").filter(f => html.includes("assets/" + f));
const scripts = linked.map(f => readFileSync(pub + "assets/" + f, "utf8")).join("\n");
let removed = 0;
for (const f of readdirSync(pub + "assets")) if (!html.includes("assets/" + f) && !scripts.includes(f)) { unlinkSync(pub + "assets/" + f); removed++; }
console.log("old bundles removed:", removed);
