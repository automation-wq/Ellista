// Vercel entry: the same server.js, run as one serverless function. See README, "Put it on Vercel".
// ponytail: /tmp is wiped whenever Vercel starts a fresh instance, so orders, accounts, admin edits and uploaded photos reset. Use a database before taking real orders.
process.env.DATA_DIR = process.env.DATA_DIR || "/tmp/mytekkstore-data";
process.env.TRUST_PROXY = process.env.TRUST_PROXY || "1";
const server = require("../server.js");
module.exports = (req, res) => {
  // Vercel's request helpers may have read the body already (req.body); replay it so the server's own reader still gets it
  if (req.readableEnded && req.body !== undefined) {
    const raw = Buffer.isBuffer(req.body) || typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    process.nextTick(() => { req.emit("data", raw); req.emit("end"); });
  }
  server.emit("request", req, res);
};
