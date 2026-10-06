// Mytekkstore storefront (React). Products, accounts and orders come from the server (see ../../server.js).
import "./style.css";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { StoreProvider } from "./store.jsx";
import App from "./App.jsx";

// `ready` resolves once the page is drawn; the browser tests wait for it
window.ready = new Promise(r => { window.__resolveReady = r; });
createRoot(document.getElementById("root")).render(<MotionConfig reducedMotion="user"><StoreProvider><App /></StoreProvider></MotionConfig>);
