// After a build: removes bundles from an earlier build that no page references any more (Vite keeps public/ as it is otherwise).
import { readdirSync, readFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";

const pub = fileURLToPath(new URL("../public/", import.meta.url));
const html = readdirSync(pub).filter(f => f.endsWith(".html")).map(f => readFileSync(pub + f, "utf8")).join("\n");
let removed = 0;
for (const f of readdirSync(pub + "assets")) if (!html.includes("assets/" + f)) { unlinkSync(pub + "assets/" + f); removed++; }
console.log("old bundles removed:", removed);
