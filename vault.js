// Delta Lektorat · Tresor – built 2026-11-09 from delta-lektorat-tools/vault. The only address it talks to: https://app.deltalektorat.ch
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};

// vault/src/shims/push-client.js
var push_client_exports = {};
__export(push_client_exports, {
  syncLang: () => syncLang
});
var syncLang;
var init_push_client = __esm({
  "vault/src/shims/push-client.js"() {
    syncLang = () => {
    };
  }
});

// src/shared/dates.js
var ZONE = typeof window === "undefined" ? "Europe/Skopje" : void 0;
var F = {
  day: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: ZONE }),
  time: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: ZONE })
};
var fmtIsoDay = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
};

// src/client/base.js
var nav = { scope: null, gen: 0 };
var LKEY = "portal-lang";
var lang = "de";
try {
  const saved = localStorage.getItem(LKEY);
  if (saved === "en" || saved === "de") lang = saved;
} catch {
}
var appLang = [];
function setLang(l) {
  lang = l === "en" ? "en" : "de";
  try {
    localStorage.setItem(LKEY, lang);
  } catch {
  }
  document.documentElement.lang = lang;
  appLang.concat(nav.scope ? nav.scope.lang : []).forEach((fn) => fn(lang));
  try {
    if (localStorage.getItem("dl_push")) Promise.resolve().then(() => (init_push_client(), push_client_exports)).then((m) => m.syncLang(lang)).catch(() => {
    });
  } catch {
  }
}
document.documentElement.lang = lang;
var THKEY = "portal-theme";
var theme = "auto";
try {
  const v = localStorage.getItem(THKEY);
  if (v === "light" || v === "dark") theme = v;
} catch {
}
var applyTheme = () => {
  if (theme === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = theme;
};
applyTheme();
var appTheme = [];
function setTheme(v) {
  theme = v === "light" || v === "dark" ? v : "auto";
  try {
    if (theme === "auto") localStorage.removeItem(THKEY);
    else localStorage.setItem(THKEY, theme);
  } catch {
  }
  applyTheme();
  appTheme.concat(nav.scope ? nav.scope.theme : []).forEach((fn) => fn(theme));
}
var $ = (id) => document.getElementById(id);
var esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var toastTimer;
function toast(msg, ms = 3200) {
  let el = $("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    el.hidden = true;
    document.body.appendChild(el);
    const box = el;
    setTimeout(() => {
      box.textContent = msg;
      box.hidden = false;
    }, 60);
  } else {
    el.textContent = msg;
    el.hidden = false;
  }
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
  }, ms);
}

// src/client/dialog.js
var dlgSeq = 0;
var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable]:not([contenteditable=false])';
function dialogA11y(box) {
  const name = () => {
    const h = box.querySelector("h2, h3");
    if (h) {
      if (!h.id) h.id = "dlg-h-" + ++dlgSeq;
      box.setAttribute("aria-labelledby", h.id);
    }
  };
  name();
  new MutationObserver(name).observe(box, { childList: true });
  box.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || e.defaultPrevented) return;
    const f = [...box.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === box)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}
function closeX(box, close) {
  const add = () => {
    if (box.querySelector(":scope > .dlg-x")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dlg-x";
    b.setAttribute("aria-label", lang === "en" ? "Close" : "Schliessen");
    b.title = b.getAttribute("aria-label");
    b.innerHTML = "&times;";
    b.onclick = () => close();
    box.appendChild(b);
  };
  add();
  new MutationObserver(add).observe(box, { childList: true });
}
function dialog(html, onMount, opts = {}) {
  if (typeof opts === "function") opts = { onClose: opts };
  const ov = document.createElement("div");
  ov.className = "ov" + (opts.side ? " ov-side" : "");
  ov.innerHTML = `<div class="dlg${opts.cls ? " " + esc(opts.cls) : ""}" role="dialog" aria-modal="true">${html}</div>`;
  const prev = document.activeElement;
  let open2 = true;
  const close = () => {
    if (!open2) return;
    open2 = false;
    ov.remove();
    document.removeEventListener("keydown", key2);
    if (prev && prev.isConnected && prev.focus) prev.focus();
    if (opts.onClose) opts.onClose();
  };
  const key2 = (e) => {
    if (e.key === "Escape" && !e.defaultPrevented && opts.closable !== false && [...document.querySelectorAll(".ov")].pop() === ov) {
      e.preventDefault();
      close();
    }
  };
  let downOnOv = false;
  ov.addEventListener("mousedown", (e) => {
    downOnOv = e.target === ov;
  });
  ov.addEventListener("click", (e) => {
    if (e.target === ov && downOnOv && opts.backdrop !== false && opts.closable !== false) close();
    downOnOv = false;
  });
  document.addEventListener("keydown", key2);
  document.body.appendChild(ov);
  const box = ov.firstElementChild;
  dialogA11y(box);
  if (opts.closable !== false) closeX(box, close);
  if (onMount) onMount(box, close, (h) => {
    box.innerHTML = h;
  });
  if (box.contains(document.activeElement)) return close;
  const f = (
    /** @type {HTMLElement[]} */
    [...box.querySelectorAll("input:not([type=hidden]):not([type=checkbox]),select,textarea,button.primary")].find((el) => el.getClientRects().length > 0 && !/** @type {any} */
    el.disabled)
  );
  if (f) f.focus();
  else {
    box.setAttribute("tabindex", "-1");
    box.focus();
  }
  return close;
}

// vault/src/api.js
var APP = (
  /** @type {string} */
  "https://app.deltalektorat.ch"
);
var LoginNeeded = class extends Error {
};
async function api(path, o = {}) {
  const r = await fetch(APP + path, {
    method: o.method || "GET",
    credentials: "include",
    cache: "no-store",
    referrerPolicy: "no-referrer",
    headers: Object.assign({ "X-DL-Req": "1", "X-DL-Lang": lang }, o.body !== void 0 ? { "Content-Type": "application/json" } : {}),
    body: o.body !== void 0 ? JSON.stringify(o.body) : void 0
  });
  const b = await r.json().catch(() => ({}));
  if (r.status === 401) throw new LoginNeeded(b.twofa ? "twofa" : "login");
  if (!r.ok) throw new Error(b.error || `HTTP ${r.status}`);
  return b;
}

// vault/src/crypto.js
var enc = new TextEncoder();
var dec = new TextDecoder();
var ROUNDS = 6e5;
var MAX_ROUNDS = 5e6;
var KEY_AAD = enc.encode("delta-tresor/key/v1");
var CHECK_AAD = enc.encode("delta-tresor/check/v1");
var CHECK = "delta-tresor-check-v1";
var rowAad = (year2, batch, n) => enc.encode(`delta-tresor/row/v2/${year2}/${batch}/${n}`);
var listAad = (year2, batch) => enc.encode(`delta-tresor/manifest/v1/${year2}/${batch}`);
function toB64(u8) {
  let s = "";
  for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode(...u8.subarray(i, i + 32768));
  return btoa(s);
}
var fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
var random = (n) => crypto.getRandomValues(new Uint8Array(n));
async function lockKey(pass, salt, rounds) {
  const base = await crypto.subtle.importKey("raw", enc.encode(String(pass).normalize("NFC")), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt, iterations: rounds }, base, { name: "AES-GCM", length: 256 }, false, ["wrapKey", "unwrapKey"]);
}
async function lock(dataKey, pass) {
  const salt = random(16), iv = random(12);
  const wrapped = new Uint8Array(await crypto.subtle.wrapKey("raw", dataKey, await lockKey(pass, salt, ROUNDS), { name: "AES-GCM", iv, additionalData: KEY_AAD }));
  return { v: 1, kdf: "PBKDF2-SHA256", iter: ROUNDS, salt: toB64(salt), iv: toB64(iv), wrapped: toB64(wrapped) };
}
async function unlockWith(envelope, pass, extractable) {
  const iter = Number(envelope && envelope.iter);
  if (!(iter >= ROUNDS && iter <= MAX_ROUNDS)) throw new Error("bad-envelope");
  const k = await lockKey(pass, fromB64(envelope.salt), iter);
  try {
    return await crypto.subtle.unwrapKey(
      "raw",
      fromB64(envelope.wrapped),
      k,
      { name: "AES-GCM", iv: fromB64(envelope.iv), additionalData: KEY_AAD },
      { name: "AES-GCM", length: 256 },
      extractable,
      ["encrypt", "decrypt"]
    );
  } catch {
    throw new Error("wrong-passphrase");
  }
}
async function sealBytes(key2, aad, text2) {
  const iv = random(12);
  return { iv: toB64(iv), ct: toB64(new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad }, key2, enc.encode(text2)))) };
}
var openBytes = async (key2, aad, x) => dec.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(x.iv), additionalData: aad }, key2, fromB64(x.ct)));
async function newVault(pass) {
  const temp = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const envelope = Object.assign(await lock(temp, pass), { check: await sealBytes(temp, CHECK_AAD, CHECK) });
  return { envelope, key: await openVault(envelope, pass) };
}
async function openVault(envelope, pass) {
  const key2 = await unlockWith(envelope, pass, false);
  let ok = false;
  try {
    ok = !!envelope.check && await openBytes(key2, CHECK_AAD, envelope.check) === CHECK;
  } catch {
    ok = false;
  }
  if (!ok) throw new Error("bad-envelope");
  return key2;
}
async function changePassphrase(envelope, oldPass, newPass) {
  await openVault(envelope, oldPass);
  const k = await unlockWith(envelope, oldPass, true);
  return Object.assign(await lock(k, newPass), { check: envelope.check });
}
async function seal(key2, year2, batch, n, value) {
  const json = JSON.stringify(value), size = enc.encode(json).length;
  return Object.assign({ n }, await sealBytes(key2, rowAad(year2, batch, n), json + " ".repeat(Math.ceil((size + 1) / 512) * 512 - size)));
}
var unseal = async (key2, year2, batch, row) => JSON.parse(await openBytes(key2, rowAad(year2, batch, row.n), row));
var sealManifest = (key2, year2, batch, ns) => sealBytes(key2, listAad(year2, batch), JSON.stringify({ year: year2, batch, ns }));
var openManifest = async (key2, year2, batch, m) => JSON.parse(await openBytes(key2, listAad(year2, batch), m)).ns;
function passphraseOk(p) {
  const s = String(p || "");
  return s.length >= 16 && new Set(s).size >= 8;
}

// src/shared/offer-basics.js
var LEVELS = (
  /** @type {Record<string, { calc: string, de: string, en: string, form: string[], add?: any }>} */
  {
    bach: { calc: "none", de: "Bachelorarbeit", en: "Bachelor's Thesis", form: ["Bachelorarbeit", "Bachelor's thesis"] },
    mast: { calc: "none", de: "Masterarbeit", en: "Master's Thesis", form: ["Masterarbeit", "Master's thesis"] },
    diss: { calc: "phd", de: "Dissertation", en: "Dissertation", form: ["Dissertation"] },
    proj: { calc: "none", de: "Projektarbeit", en: "Project Work", form: ["Projektarbeit", "Project work"] },
    dipl: { calc: "none", de: "Diplomarbeit", en: "Diploma Thesis", form: ["Diplomarbeit", "Diploma thesis"] },
    haus: { calc: "none", de: "Hausarbeit", en: "Term Paper", form: ["Hausarbeit", "Term paper"] },
    cas: { calc: "cas", de: "CAS-, DAS-, MAS-, MBA-Arbeit", en: "CAS, DAS, MAS, MBA Thesis", form: ["CAS-, DAS-, MAS-, MBA-Arbeit", "CAS, DAS, MAS, MBA thesis"] },
    matura: { calc: "none", de: "Maturaarbeit", en: "Matura Thesis", form: ["Maturaarbeit", "Matura thesis"] }
  }
);
var PROMO_FALLBACK = (
  /** @type {[string, number][]} */
  [
    ["DL-HWZ10", 10],
    ["DL-SEET25", 25],
    ["DL-Uniturm25", 25],
    ["DL-Ready25", 25],
    ["ZHAW-SimpleLearning10", 10],
    ["OST-SimpleLearning10", 10],
    ["DL-KulturLegi50", 50],
    ["DL-JES10", 10],
    ["DL-ISIC10", 10],
    ["Delta-LG", 10],
    ["DL-SBC10", 10],
    ["DL-GAMING10", 10],
    ["DL-HSGSYMP10", 10],
    ["DL-OV10", 10],
    ["DL-SGV10", 10],
    ["DL-AV10", 10],
    ["DL-BFS2026", 10],
    ["DL-BCUZH10", 10],
    ["DL-FFHSAL10", 10],
    ["DL-UNIBOARD10", 10]
  ].map(([label2, discount]) => ({ code: label2.toUpperCase(), label: label2, discount, status: "active" }))
);

// src/shared/offer-rules.js
var RANGE_TABLE = [
  { w: 2e3, pages: [5, 10], src: 10, stud: [250, 550], dl: [900, 1200] },
  { w: 4e3, pages: [10, 15], src: 10, stud: [300, 700], dl: [900, 1300] },
  { w: 7e3, pages: [20, 25], src: 10, stud: [400, 800], dl: [1050, 1450] },
  { w: 8500, pages: [25, 30], src: 10, stud: [400, 900], dl: [1050, 1550] },
  { w: 1e4, pages: [30, 35], src: 20, stud: [450, 950], dl: [1100, 1600] },
  { w: 11e3, pages: [35, 40], src: 20, stud: [500, 1e3], dl: [1200, 1700] },
  { w: 12500, pages: [40, 45], src: 20, stud: [600, 1100], dl: [1500, 2e3] },
  { w: 13750, pages: [45, 55], src: 20, stud: [700, 1200], dl: [1600, 2100] },
  { w: 15e3, pages: [50, 55], src: 30, stud: [800, 1300], dl: [1700, 2200] },
  { w: 16e3, pages: [55, 60], src: 35, stud: [850, 1350], dl: [1800, 2300] },
  { w: 17e3, pages: [60, 65], src: 40, stud: [900, 1400], dl: [1900, 2400] },
  { w: 2e4, pages: [65, 80], src: 40, stud: [1e3, 1500], dl: [2100, 2600] },
  { w: 22500, pages: [70, 90], src: 40, stud: [1200, 1700], dl: [2300, 2800] },
  { w: 25e3, pages: [75, 95], src: 60, stud: [1400, 1900], dl: [2500, 3e3] },
  { w: 3e4, pages: [85, 105], src: 60, stud: [1600, 2100], dl: [3e3, 3500] }
];
var ORIENT_TAGS = { 2e4: "Masterarbeit:", 17e3: "Bachelorarbeit:", 4e3: "ZHAW" };
var STUD_RATES = [
  [2e3, 0.1056],
  [4e3, 0.0906],
  [8e3, 0.0531],
  [1e4, 0.03872],
  [11e3, 0.04167],
  [12500, 0.04307],
  [15e3, 0.04346],
  [16e3, 0.04458],
  [17e3, 0.04555],
  [2e4, 0.04228],
  [22500, 0.04454],
  [25e3, 0.04547],
  [Infinity, 0.04294]
];
var BASE_RATE = 0.01991;
var PAGE_PRICE = 1.76;
var SOURCE_PRICE = 2;
var PLAGIAT_FIXED = 39;
var SERVICES = {
  base: { e: 0, de: "Sprachliches Lektorat & Korrektorat", en: "Language Editing & Proofreading" },
  schreib: { e: 9408e-6, de: "Wissenschaftliche Schreibweise", en: "Scientific Writing Style" },
  roter: { e: 9408e-6, de: "Roter-Faden-Check", en: "Red Thread Check" },
  verst: { e: 9408e-6, de: "Verst\xE4ndnis-Check", en: "Comprehension Check" },
  format: { e: 0, de: "Formatierungs- und Layout-Check", en: "Formatting and Layout Check" },
  gender: { e: 9408e-6, de: "Genderkorrektur", en: "Gender-Inclusive Editing" },
  zitier: { e: 0, de: "Zitierkorrektur", en: "Citation Editing" },
  ki: { e: 9408e-6, de: "KI-Texte umschreiben", en: "AI-Rewrite" },
  plagiat: { e: 0, de: "Plagiatspr\xFCfung", en: "Plagiarism Check" }
};
var CALC_GROUPS = {
  none: { add: 0, de: "ohne Zuschlag", en: "no surcharge", short: { de: "kein Zuschlag", en: "no surcharge" } },
  phd: { add: 0.054, de: "PhD / Dissertation / Doktorarbeit (+5.4 %)", en: "PhD / Dissertation / Doctoral Thesis (+5.4 %)", short: { de: "+5.4 % (PhD)", en: "+5.4 % (PhD)" } },
  cas: { add: 0.045, de: "CAS-, DAS-, MAS-, MBA-, EMBA-Arbeit (+4.5 %)", en: "CAS / DAS / MAS / MBA / EMBA Thesis (+4.5 %)", short: { de: "+4.5 % (CAS \u2026)", en: "+4.5 % (CAS \u2026)" } }
};
Object.values(LEVELS).forEach((l) => {
  l.add = CALC_GROUPS[l.calc].add;
});
var BASE_ROWS = RANGE_TABLE.map((r) => ({ w: r.w, pages: r.pages.slice(), src: r.src, tag: ORIENT_TAGS[r.w] || "" }));
RANGE_TABLE.forEach((r) => {
  r.tag = ORIENT_TAGS[r.w] || "";
});
var TODAY = {
  table: RANGE_TABLE.map((r) => [r.stud[0], r.stud[1], r.dl[0], r.dl[1]]),
  studRates: STUD_RATES.map((x) => x[1]),
  baseRate: BASE_RATE,
  svcRate: SERVICES.schreib.e,
  page: PAGE_PRICE,
  source: SOURCE_PRICE,
  plagiat: PLAGIAT_FIXED
};
var STUD_RATE_LIMITS = STUD_RATES.map((x) => x[0]);
var BANK_DEFAULT = {
  chf: { holder: "Fantrustic GmbH (Delta Lektorat)", iban: "CH58 8080 8004 3665 8210 0", bic: "" },
  eur: { holder: "Fantrustic GmbH (Delta Lektorat)", iban: "LT50 3250 0724 7696 9195", bic: "REVOLT21" }
};
var ibanCompact = (v) => String(v || "").replace(/\s+/g, "").toUpperCase();
var ibanPrint = (v) => ibanCompact(v).replace(/(.{4})(?=.)/g, "$1 ");
function ibanValid(v) {
  const s = ibanCompact(v);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{8,30}$/.test(s)) return false;
  let m = 0;
  for (const ch of s.slice(4) + s.slice(0, 4)) {
    const d = ch >= "A" ? String(ch.charCodeAt(0) - 55) : ch;
    for (const x of d) m = (m * 10 + Number(x)) % 97;
  }
  return m === 1;
}
function cleanBank(b) {
  const out = {};
  for (const k of ["chf", "eur"]) {
    const x = b && b[k] || {}, d = BANK_DEFAULT[k];
    const iban = ibanCompact(x.iban);
    out[k] = {
      holder: String(x.holder == null ? d.holder : x.holder).replace(/\s+/g, " ").trim().slice(0, 70) || d.holder,
      iban: ibanValid(iban) ? ibanPrint(iban) : d.iban,
      bic: String(x.bic == null ? d.bic : x.bic).replace(/\s+/g, "").toUpperCase().slice(0, 11)
    };
  }
  return out;
}
var BANK = cleanBank(BANK_DEFAULT);
var TEXT_FIELDS = [
  { key: "introPkg", type: "rich", de: "Einleitung \xB7 Komplettpaket", en: "Introduction \xB7 complete package" },
  { key: "introSel", type: "rich", de: "Einleitung \xB7 Einzelne Services", en: "Introduction \xB7 individual services" },
  { key: "introCoach", type: "rich", de: "Einleitung \xB7 Coaching", en: "Introduction \xB7 coaching", tokens: ["{coachFor}"] },
  { key: "kurzPkg", type: "rich", role: "title", de: "Titel Kurzbeschreibung \xB7 Komplettpaket", en: "Short description title \xB7 package" },
  { key: "kurzSel", type: "rich", role: "title", de: "Titel Kurzbeschreibung \xB7 Einzelne Services", en: "Short description title \xB7 individual services" },
  { key: "kurz", type: "rich", de: "Kurzbeschreibung (Text)", en: "Short description (text)" },
  { key: "next", type: "rich", de: "Weitere Vorgehensweise \xB7 Lektorat", en: "Further procedure \xB7 editing", tokens: ["{cur}"] },
  { key: "nextC", type: "rich", de: "Weitere Vorgehensweise \xB7 Coaching", en: "Further procedure \xB7 coaching" },
  { key: "ask", type: "rich", de: "Schlusssatz", en: "Closing sentence" },
  { key: "foot", type: "rich", role: "foot", de: "Fussnote (*) \xB7 Lektorat-Angebot", en: "Footnote (*) \xB7 editing offer" },
  { key: "footC", type: "rich", role: "foot", de: "Fussnote (*) \xB7 Coaching", en: "Footnote (*) \xB7 coaching" },
  { key: "payTerm", type: "rich", de: "Zahlungsfrist \xB7 Rechnung", en: "Payment term \xB7 invoice", tokens: ["{days}"] }
];
var FIELD = Object.fromEntries(TEXT_FIELDS.map((f) => [f.key, f]));

// src/shared/text.js
var money = (n, cur = "") => `${cur ? cur + " " : ""}${(Number(n) || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;

// src/shared/finance-book.js
var BOOK_FIELDS = (
  /** @type {[string, string, string, "day" | "text" | "money", number][]} */
  [
    ["status", "Status", "Status", "text", 30],
    ["submitted", "Eingang", "Submission date", "day", 10],
    ["start", "Start", "Start date", "day", 10],
    ["deadline", "Deadline", "Deadline", "day", 10],
    ["time", "Zeit", "Time", "text", 12],
    ["done", "Erledigt", "Done", "text", 12],
    ["words", "W\xF6rter", "Words", "text", 20],
    ["pages", "Seiten (Einleitung\u2013Fazit)", "Pages (introduction\u2013conclusion)", "text", 20],
    ["sources", "Quellen", "Sources", "text", 20],
    ["service", "Lektorat", "Service", "text", 80],
    ["implBy", "Kommentare umgesetzt durch", "Comments implemented by", "text", 40],
    ["lektor", "Lektor:in (Implementation)", "Editor (implementation)", "text", 60],
    ["university", "Hochschule", "University", "text", 120],
    ["level", "Stufe", "Level", "text", 60],
    ["subject", "Fachbereich", "Subject", "text", 120],
    ["country", "Land", "Country", "text", 60],
    ["promo", "Promo-Code", "Promo code", "text", 40],
    ["cost", "Kosten Lektor:in", "Cost editor", "money", 0]
  ]
);
var KEYS = new Set(BOOK_FIELDS.map((f) => f[0]));
var bookYear = (p) => p.book && p.book.importYear || Number(String(p.createdAt || "").slice(0, 4)) || 0;
var r2 = (n) => Math.round(n * 100) / 100;
function paymentsByMonth(p) {
  const total = Number(p.total) || 0, cost = p.book && Number(p.book.cost) > 0 ? Number(p.book.cost) : 0;
  const keep = total > 0 && cost > 0 ? Math.max(0, total - cost) / total : 1;
  return (p.pays || []).filter((x) => /^\d{4}-\d{2}/.test(String(x[0])) && Number(x[1]) > 0).map(([d, a]) => ({ month: String(d).slice(0, 7), sales: Number(a), profit: Number(a) * keep }));
}
function bookStats(plans, { currency = "CHF", goalFactor = 2.8, today = "" } = {}) {
  const years2 = collect(plans, currency);
  const nowY = Number(String(today).slice(0, 4)) || 0, nowM = Number(String(today).slice(5, 7)) || 12;
  const out = {};
  for (const y of [...years2.keys()].sort()) {
    const upTo = y === nowY ? nowM : y > nowY && nowY ? 0 : 12;
    out[y] = yearFigures(
      y,
      /** @type {any} */
      years2.get(y),
      years2.get(y - 1) || null,
      upTo,
      goalFactor
    );
  }
  return out;
}
function collect(plans, currency) {
  const years2 = /* @__PURE__ */ new Map();
  const yearOf = (y) => {
    let v = years2.get(y);
    if (!v) {
      v = { sales: Array(12).fill(0), profit: Array(12).fill(0) };
      years2.set(y, v);
    }
    return v;
  };
  for (const p of plans) {
    if ((p.currency || "CHF") !== currency) continue;
    for (const m of paymentsByMonth(p)) {
      const k = Number(m.month.slice(5, 7)) - 1;
      if (k < 0 || k > 11) continue;
      const y = yearOf(Number(m.month.slice(0, 4)));
      y.sales[k] += m.sales;
      y.profit[k] += m.profit;
    }
  }
  return years2;
}
var sum = (a) => r2(a.reduce((s, v) => s + v, 0));
var ratio = (a, b) => b ? r2(a / b) : null;
function yearFigures(y, d, prev, upTo, goalFactor) {
  const sales = d.sales.map(r2), profit = d.profit.map(r2);
  const avg = (a) => upTo ? r2(a.slice(0, upTo).reduce((s, v) => s + v, 0) / upTo) : 0;
  const prevProfit = prev ? sum(prev.profit) : 0, prevSales = prev ? sum(prev.sales) : 0;
  const months = monthRows(sales, profit, prev, prevProfit / 12);
  const totalSales = sum(sales), totalProfit = sum(profit), avgSales = avg(sales), avgProfit = avg(profit);
  return {
    year: y,
    months,
    totalSales,
    totalProfit,
    avgSales,
    avgProfit,
    predictSales: r2(avgSales * 12),
    predictProfit: r2(avgProfit * 12),
    margin: ratio(totalProfit, totalSales),
    growth: prevSales ? r2((totalSales - prevSales) / prevSales) : null,
    avgSalesChange: prevSales ? r2((avgSales - prevSales / 12) / (prevSales / 12)) : null,
    best: months.filter((m) => m.sales > 0).sort((a, b) => b.sales - a.sales || a.month - b.month).map((m) => ({ month: m.month, sales: m.sales })),
    goal: prev ? r2(prevProfit * goalFactor) : null,
    goalFactor,
    prevProfit: prev ? prevProfit : null,
    goalReached: prev && prevProfit ? r2(totalProfit / (prevProfit * goalFactor)) : null
  };
}
function monthRows(sales, profit, prev, prevAvgProfit) {
  let cum = 0;
  return sales.map((s, k) => {
    cum += profit[k];
    const pp = prev ? prev.profit[k] : 0, ps = prev ? prev.sales[k] : 0;
    return {
      month: k + 1,
      sales: s,
      profit: profit[k],
      vsPrevAvg: ratio(profit[k], prevAvgProfit),
      // Excel «Profit compared to ⌀ 2025»
      cumVsPrevAvg: ratio(cum, prevAvgProfit * (k + 1)),
      // «compared to average 2025», cumulated
      vsPrevMonth: ratio(profit[k], pp),
      // «compared to month 2025»
      prevSales: r2(ps),
      prevProfit: r2(pp),
      salesChange: ps ? r2((s - ps) / ps) : null
    };
  });
}

// vault/src/xlsx.js
async function inflate(bytes) {
  const s = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(s).arrayBuffer());
}
function unzip(buf) {
  const u8 = new Uint8Array(buf), dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  let end = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) if (dv.getUint32(i, true) === 101010256) {
    end = i;
    break;
  }
  if (end < 0) throw new Error("not-xlsx");
  const count = dv.getUint16(end + 10, true);
  let p = dv.getUint32(end + 16, true);
  const files = {};
  const name = (at, len) => new TextDecoder().decode(u8.subarray(at, at + len));
  for (let k = 0; k < count; k++) {
    if (dv.getUint32(p, true) !== 33639248) throw new Error("not-xlsx");
    const method = dv.getUint16(p + 10, true), size = dv.getUint32(p + 20, true);
    const nLen = dv.getUint16(p + 28, true), xLen = dv.getUint16(p + 30, true), cLen = dv.getUint16(p + 32, true), local = dv.getUint32(p + 42, true);
    const fname = name(p + 46, nLen);
    files[fname] = async () => {
      const start2 = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true), raw = u8.subarray(start2, start2 + size);
      if (method === 0) return raw;
      if (method === 8) return inflate(raw);
      throw new Error("not-xlsx");
    };
    p += 46 + nLen + xLen + cLen;
  }
  return files;
}
var xml = async (files, path) => files[path] ? new DOMParser().parseFromString(new TextDecoder().decode(await files[path]()), "application/xml") : null;
var kids = (el, tag) => el ? [...el.children].filter((c) => c.localName === tag) : [];
var kid = (el, tag) => kids(el, tag)[0] || null;
var all = (doc, tag) => doc ? [...doc.getElementsByTagNameNS("*", tag)] : [];
var attr = (el, a) => el ? el.getAttribute(a) : null;
function themeColours(doc) {
  const scheme = all(doc, "clrScheme")[0];
  if (!scheme) return [];
  const hex = (el) => {
    const s = kid(el, "srgbClr"), sys = kid(el, "sysClr");
    return (attr(s, "val") || attr(sys, "lastClr") || "").toUpperCase();
  };
  const by = Object.fromEntries([...scheme.children].map((c) => [c.localName, hex(c)]));
  return [by.lt1, by.dk1, by.lt2, by.dk2, by.accent1, by.accent2, by.accent3, by.accent4, by.accent5, by.accent6, by.hlink, by.folHlink];
}
var INDEXED = { 2: "FF0000", 3: "00FF00", 10: "FF0000", 11: "00FF00", 17: "008000", 50: "99CC00", 57: "339966", 53: "FF6600", 52: "FF9900", 60: "993300", 16: "800000" };
function colour(el, theme2) {
  if (!el) return "";
  const rgb = attr(el, "rgb");
  let hex = rgb ? rgb.slice(-6).toUpperCase() : attr(el, "theme") != null ? theme2[Number(attr(el, "theme"))] || "" : attr(el, "indexed") != null ? INDEXED[Number(attr(el, "indexed"))] || "" : "";
  const tint = Number(attr(el, "tint") || 0);
  if (hex && tint) hex = tinted(hex, tint);
  return hex;
}
function tinted(hex, t2) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return c.map((v) => Math.round(t2 < 0 ? v * (1 + t2) : v + (255 - v) * t2).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function hue(hex) {
  if (!/^[0-9A-F]{6}$/i.test(hex || "")) return "";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  if (r > 140 && r > g * 1.6 && r > b * 1.6) return "red";
  if (g > 90 && g > r * 1.25 && g > b * 1.1) return "green";
  return "other";
}
function runsOf(si, theme2) {
  const rs = kids(si, "r");
  if (!rs.length) return [{ text: (kid(si, "t") || { textContent: "" }).textContent || "", colour: "" }];
  return rs.map((r) => ({ text: (kid(r, "t") || { textContent: "" }).textContent || "", colour: colour(kid(kid(r, "rPr"), "color"), theme2) }));
}
var DATE_IDS = /* @__PURE__ */ new Set([14, 15, 16, 17, 22, 27, 30, 36, 45, 46, 47, 50, 57]);
var isDateFormat = (code) => /[dmy]/i.test(String(code || "").replace(/\[[^\]]*\]|"[^"]*"|\\./g, "")) && !/[hs]/i.test(String(code || "").replace(/\[[^\]]*\]|"[^"]*"/g, "").replace(/m+(?=[^dy]*$)/, ""));
function excelDay(n, date1904 = false) {
  const ms = Math.round((Number(n) - (date1904 ? -1462 : 0) - 25569) * 864e5);
  const d = new Date(ms);
  return isNaN(+d) ? "" : d.toISOString().slice(0, 10);
}
var colIndex = (ref) => {
  let n = 0;
  for (const ch of String(ref).replace(/\d+$/, "")) n = n * 26 + ch.charCodeAt(0) - 64;
  return n - 1;
};
var colName = (i) => {
  let s = "";
  for (i++; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + (i - 1) % 26) + s;
  return s;
};
async function readWorkbook(buf) {
  const files = unzip(buf);
  if (!files["xl/workbook.xml"]) throw new Error("not-xlsx");
  const [wb, rels, shared, styles, themeDoc] = await Promise.all(["xl/workbook.xml", "xl/_rels/workbook.xml.rels", "xl/sharedStrings.xml", "xl/styles.xml", "xl/theme/theme1.xml"].map((p) => xml(files, p)));
  const theme2 = themeColours(themeDoc);
  const date1904 = all(wb, "workbookPr").some((e) => /^(1|true)$/.test(attr(e, "date1904") || ""));
  const strings = all(shared, "si").filter((si) => si.parentElement && si.parentElement.localName === "sst").map((si) => runsOf(si, theme2));
  const fmts = Object.fromEntries(all(styles, "numFmt").map((n) => [Number(attr(n, "numFmtId")), attr(n, "formatCode")]));
  const fonts = kids(all(styles, "fonts")[0], "font").map((f) => colour(kid(f, "color"), theme2));
  const fills = kids(all(styles, "fills")[0], "fill").map((f) => {
    const pf = kid(f, "patternFill");
    return pf && attr(pf, "patternType") === "solid" ? colour(kid(pf, "fgColor"), theme2) : "";
  });
  const xfs = kids(all(styles, "cellXfs")[0], "xf").map((x) => {
    const id = Number(attr(x, "numFmtId") || 0);
    return { font: fonts[Number(attr(x, "fontId") || 0)] || "", fill: fills[Number(attr(x, "fillId") || 0)] || "", date: DATE_IDS.has(id) || id >= 164 && isDateFormat(fmts[id]) };
  });
  const target = Object.fromEntries(all(rels, "Relationship").map((r) => [attr(r, "Id"), attr(r, "Target")]));
  const sheets = [];
  for (const s of all(wb, "sheet")) {
    const rid = s.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id") || attr(s, "r:id");
    let path = String(target[rid] || "");
    path = path.startsWith("/") ? path.slice(1) : "xl/" + path.replace(/^\.\//, "");
    const doc = await xml(files, path);
    if (doc) sheets.push({ name: attr(s, "name") || "", rows: cellsOf(doc, strings, xfs, date1904, theme2) });
  }
  return { sheets };
}
function valueOf(c, strings, theme2) {
  const t2 = attr(c, "t"), v = (kid(c, "v") || { textContent: "" }).textContent || "", plain = (x) => [{ text: x, colour: "" }];
  if (t2 === "s" || t2 === "inlineStr") {
    const runs = t2 === "s" ? strings[Number(v)] || plain("") : runsOf(kid(c, "is"), theme2);
    return { runs, val: runs.map((x) => x.text).join("") };
  }
  if (t2 === "str" || t2 === "e") return { val: v, runs: plain(v) };
  if (t2 === "b") return { val: v === "1" ? "WAHR" : "FALSCH", runs: plain(v) };
  return { val: v === "" ? "" : Number(v), runs: plain(v) };
}
function cellsOf(doc, strings, xfs, date1904, theme2) {
  const rows = [];
  for (const r of all(doc, "row")) {
    const ri = Number(attr(r, "r")) - 1;
    if (!(ri >= 0) || ri > 5e4) continue;
    const line2 = rows[ri] = rows[ri] || [];
    let next = 0;
    for (const c of kids(r, "c")) {
      const ci = attr(c, "r") ? colIndex(attr(c, "r")) : next;
      next = ci + 1;
      if (ci > 200) continue;
      const st2 = xfs[Number(attr(c, "s") || 0)] || { font: "", fill: "", date: false };
      const { runs, val } = valueOf(c, strings, theme2);
      const cell2 = { v: val, runs, colour: st2.font, fill: st2.fill };
      if (typeof val === "number" && st2.date) cell2.day = excelDay(val, date1904);
      line2[ci] = cell2;
    }
  }
  return rows;
}

// vault/src/parse.js
var norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
var TARGETS = (
  /** @type {[string, string, string][]} */
  [
    ["skip", "\u2013 nicht \xFCbernehmen \u2013", "\u2013 leave out \u2013"],
    ["keep", "nur anzeigen", "show only"],
    ["name", "Kund:in", "Client"],
    ["first", "Vorname", "First name"],
    ["last", "Nachname", "Last name"],
    ["email", "E-Mail", "E-mail"],
    ["no", "Auftrags-Nr.", "Order no."],
    ["price", "Preis", "Price"],
    ["currency", "W\xE4hrung", "Currency"],
    ["paid", "Bezahlt (Betrag)", "Paid (amount)"],
    ["receivedAt", "Erhalten am", "Received on"],
    ["account", "Bank-Konto", "Bank account"],
    ["payNotes", "Zahlungen (Text, Spalte X)", "Payments (text, column X)"],
    ["instalments", "Raten (Zeilen, Spalte Z)", "Instalments (lines, column Z)"],
    ...BOOK_FIELDS.map((f) => (
      /** @type {[string, string, string]} */
      [f[0], f[1], f[2]]
    ))
  ]
);
var GUESS = (
  /** @type {[RegExp, string][]} */
  [
    [/price.*cost|gewinn|profit|marge/, "skip"],
    [/kosten|cost/, "cost"],
    [/umgesetzt|implemented|implementiert/, "implBy"],
    [/^lektorat\b|service|dienstleistung|leistung/, "service"],
    [/lektor|editor/, "lektor"],
    [/vorname|first name/, "first"],
    [/nachname|familienname|last name|surname/, "last"],
    [/mail/, "email"],
    [/auftrag.*n(r|ummer)|order.*n(o|r)|^nr$|^no$|^id$/, "no"],
    [/waehrung|wahrung|currency/, "currency"],
    [/^bezahlt|^paid|bereits bezahlt/, "paid"],
    [/erhalten|received/, "receivedAt"],
    [/bank|konto|account/, "account"],
    [/raten|instal|teilzahlung|abzahlung/, "instalments"],
    [/zahlung|anzahlung|reservation|payment/, "payNotes"],
    [/preis|betrag|honorar|total|price|amount/, "price"],
    [/^(kunde|kundin|kund in|name|student|studentin|auftraggeber|client|customer)/, "name"],
    [/status/, "status"],
    [/eingereicht|^eingang|submission|anfrage/, "submitted"],
    [/^start/, "start"],
    [/deadline|abgabe/, "deadline"],
    [/^zeit|^time/, "time"],
    [/erledigt|^done/, "done"],
    [/woerter|worter|words/, "words"],
    [/seiten|pages/, "pages"],
    [/quellen|sources/, "sources"],
    [/hochschule|universit|^uni|school/, "university"],
    [/stufe|level|niveau|arbeit/, "level"],
    [/fach|subject|studiengang/, "subject"],
    [/^land|country/, "country"],
    [/promo|rabatt|gutschein|code/, "promo"]
  ]
);
var guess = (header) => {
  const h = norm(header);
  if (!h) return "";
  const g = GUESS.find(([re]) => re.test(h));
  return g ? g[1] : "keep";
};
var text = (c) => c == null ? "" : typeof c.v === "number" ? String(c.v) : String(c.v || "").trim();
function headerRow(rows) {
  let best = -1, most = 3;
  for (let i = 0; i < Math.min(15, rows.length); i++) {
    const n = (rows[i] || []).filter((c) => c && typeof c.v === "string" && /[a-zäöü]/i.test(c.v)).length;
    if (n > most) {
      most = n;
      best = i;
    }
  }
  return best;
}
function columnsOf(rows, h) {
  const head = rows[h] || [];
  let width = head.length;
  for (let r = h + 1; r < Math.min(rows.length, h + 60); r++) width = Math.max(width, rows[r] ? rows[r].length : 0);
  const cols = [];
  for (let i = 0; i < width; i++) {
    const header = text(head[i]);
    let to = guess(header);
    if ((!to || to === "keep" || to === "payNotes" || to === "instalments") && colName(i) === "Z") to = "instalments";
    else if ((!to || to === "keep") && colName(i) === "X") to = "payNotes";
    if (!header && !to) continue;
    cols.push({ i, letter: colName(i), header, to: to || "keep" });
  }
  const seen = /* @__PURE__ */ new Set();
  for (const c of cols) {
    if (!["keep", "skip"].includes(c.to)) {
      if (seen.has(c.to)) c.to = "keep";
      else seen.add(c.to);
    }
  }
  return cols;
}
var FIGURES = /^(total|totals|summe|sales|umsatz|profit|gewinn|januar|january|monat|month|durchschnitt|average|ø|prognose|ziel)\b/i;
function orderRows(rows, h, cols, until = 0) {
  const at = (k) => (cols.find((c) => c.to === k) || { i: -1 }).i;
  const nameCols = [at("name"), at("first"), at("last")].filter((i) => i >= 0), priceCol = at("price");
  const out = [];
  for (let r = h + 1; r < rows.length; r++) {
    if (until && r + 1 > until) break;
    const row = rows[r] || [];
    const first = row.slice(0, 3).map(text).find(Boolean) || "";
    if (FIGURES.test(first) && !nameCols.some((i) => text(row[i]) && !FIGURES.test(text(row[i])))) break;
    const hasName = nameCols.some((i) => text(row[i])), hasPrice = priceCol >= 0 && amountOf(row[priceCol]) != null;
    if (hasName || hasPrice) out.push(r);
  }
  return out;
}
function amountOf(c) {
  if (c == null || c.v === "") return null;
  if (typeof c.v === "number") return Number.isFinite(c.v) ? Math.round(c.v * 100) / 100 : null;
  return moneyIn(String(c.v));
}
function moneyIn(s) {
  const nums = [...String(s).matchAll(/(\d{1,3}(?:['’]\d{3})+|\d+)(?:[.,](\d{1,2}))?(?!\d)/g)].map((m) => Number(m[1].replace(/['’]/g, "") + (m[2] ? "." + m[2] : "")));
  if (!nums.length) return null;
  return Math.max(...nums);
}
var pad = (n) => String(n).padStart(2, "0");
function dayIn(c, year2) {
  if (c && c.day) return c.day;
  const s = typeof c === "string" ? c : text(c);
  let m = /(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /(\d{1,2})\.(\d{1,2})\.(\d{2,4})?/.exec(s);
  if (!m) return "";
  const d = Number(m[1]), mo = Number(m[2]);
  if (!(d >= 1 && d <= 31 && mo >= 1 && mo <= 12)) return "";
  const y = m[3] ? m[3].length === 2 ? 2e3 + Number(m[3]) : Number(m[3]) : year2;
  return `${y}-${pad(mo)}-${pad(d)}`;
}
var DATES = /\d{4}-\d{2}-\d{2}|\d{1,2}\.\d{1,2}\.(\d{2,4})?/g;
function instalments(c, year2) {
  if (!c || c.v === "") return [];
  if (typeof c.v === "number") return [{ label: "Rate 1", amount: Math.round(c.v * 100) / 100, day: "", state: stateOf(c.colour || c.fill), text: String(c.v) }];
  const lines = [[]];
  for (const r of c.runs || []) {
    const bits = String(r.text).split(/\r?\n/);
    bits.forEach((b, k) => {
      if (k) lines.push([]);
      if (b) lines[lines.length - 1].push({ text: b, colour: r.colour || c.colour || "" });
    });
  }
  const out = [];
  for (const parts of lines) {
    const t2 = parts.map((p) => p.text).join("").trim();
    if (!t2) continue;
    const day = dayIn(t2, year2), amount = moneyIn(t2.replace(DATES, " "));
    if (amount == null || amount <= 0) continue;
    const coloured = parts.map((p) => hue(p.colour)).filter((h) => h === "red" || h === "green");
    const own = coloured.length ? coloured[0] : hue(c.fill);
    const label2 = t2.replace(DATES, "").replace(/(CHF|EUR|Fr\.?)?\s*(\d{1,3}(?:['’]\d{3})+|\d+)([.,]\d{1,2})?\s*(\.-|-|CHF|EUR)?/g, " ").replace(/[\s:–-]+$/g, "").replace(/\s+/g, " ").trim();
    out.push({ label: label2 || `Rate ${out.length + 1}`, amount, day, state: own === "green" ? "paid" : own === "red" ? "open" : "unsure", text: t2 });
  }
  return out;
}
var stateOf = (hex) => {
  const h = hue(hex);
  return h === "green" ? "paid" : h === "red" ? "open" : "unsure";
};
function orderOf(row, r, cols, year2) {
  const val = (k) => {
    const c = cols.find((x) => x.to === k);
    return c ? row[c.i] : null;
  };
  const name = text(val("name")) || [text(val("first")), text(val("last"))].filter(Boolean).join(" ");
  const total = amountOf(val("price")), cur = /eur|€/i.test(text(val("currency")) + " " + text(val("price"))) ? "EUR" : "CHF";
  const z = instalments(val("instalments"), year2), items = itemsOf(z, val, total, year2);
  const flags = [];
  if (total != null && z.length && Math.abs(items.reduce((s, i) => s + i.amount, 0) - total) > 1) flags.push("sum");
  if (items.some((i) => i.unsure)) flags.push("unsure");
  if (total == null) flags.push("price");
  const extra = {};
  for (const c of cols) if (c.to === "keep" && text(row[c.i])) extra[c.header || c.letter] = text(row[c.i]).slice(0, 300);
  const notes = {};
  if (text(val("payNotes"))) notes.x = text(val("payNotes")).slice(0, 2e3);
  if (text(val("instalments"))) notes.z = text(val("instalments")).slice(0, 2e3);
  return {
    v: 1,
    row: r + 1,
    name: name.slice(0, 120),
    email: text(val("email")).slice(0, 120),
    no: text(val("no")).slice(0, 40),
    currency: cur,
    total,
    items,
    book: bookOf(val, year2),
    notes,
    extra,
    flags
  };
}
function bookOf(val, year2) {
  const book = {};
  for (const [k, , , kind] of BOOK_FIELDS) {
    const c = val(k);
    if (c == null || c.v === "") continue;
    book[k] = kind === "day" ? dayIn(c, year2) || text(c) : kind === "money" ? amountOf(c) : text(c);
  }
  return book;
}
function itemsOf(z, val, total, year2) {
  const account = text(val("account")), received = dayIn(val("receivedAt"), year2), paidCol = amountOf(val("paid"));
  const one = (x) => x.state === "paid" ? { paidAt: x.day || received || "" } : x.state === "open" ? { due: x.day } : { day: x.day, unsure: true };
  const items = z.map((x) => Object.assign({ label: x.label, amount: x.amount }, one(x)));
  if (items.length) {
    if (account) items.filter((i) => i.paidAt !== void 0).forEach((i) => {
      i.account = account;
    });
    return items;
  }
  if (paidCol && paidCol > 0) items.push({ label: "Zahlung", amount: paidCol, paidAt: received, account });
  if (total != null && total - (paidCol || 0) > 4e-3) items.push({ label: "Rest", amount: Math.round((total - (paidCol || 0)) * 100) / 100, due: "" });
  return items;
}
function moneyOf(o) {
  const paid = o.items.filter((i) => i.paidAt !== void 0).reduce((s, i) => s + i.amount, 0);
  const open2 = o.total != null ? Math.max(0, o.total - paid) : o.items.filter((i) => i.paidAt === void 0).reduce((s, i) => s + i.amount, 0);
  return { paid: Math.round(paid * 100) / 100, open: Math.round(open2 * 100) / 100 };
}

// vault/src/source.js
var tr = (de, en) => lang === "en" ? en : de;
var imported = /* @__PURE__ */ new Map();
var problems = [];
function lineOf(rec, year2, n) {
  const m = moneyOf(rec);
  const pays = rec.items.filter((i) => i.paidAt !== void 0 && !i.unsure).map((i) => [i.paidAt || "", i.amount, i.account || ""]);
  const dues = rec.items.filter((i) => i.paidAt === void 0).map((i) => [i.due || "", i.amount]);
  return {
    id: `v${year2}-${n}`,
    name: rec.name,
    no: rec.no,
    email: rec.email,
    currency: rec.currency || "CHF",
    total: rec.total == null ? 0 : rec.total,
    priceOpen: rec.total == null,
    paid: m.paid,
    open: m.open,
    pays,
    dues,
    book: Object.assign({}, rec.book, { source: "import", importYear: year2, row: n }),
    createdAt: `${year2}-01-01T00:00:00Z`
  };
}
async function openRow(key2, y, batch, r) {
  try {
    return await unseal(key2, y, batch, r);
  } catch (e) {
    if (!r.prev) throw e;
    return Object.assign(await unseal(key2, y, batch, Object.assign({ n: r.n }, r.prev)), { older: true });
  }
}
async function unsealAll(key2, years2) {
  imported.clear();
  problems = [];
  const lines = [];
  for (const y of Object.keys(years2).map(Number).filter(Number.isInteger).sort()) {
    const { rows, batch, manifest } = await api(`/api/vault/rows/${y}`);
    let expected = null;
    try {
      expected = manifest ? await openManifest(key2, y, batch, manifest) : null;
    } catch {
      expected = null;
    }
    if (!expected) problems.push(tr(`${y}: die Liste der Zeilen ist nicht lesbar.`, `${y}: the list of rows can't be read.`));
    const bad = [], older = [];
    for (let i = 0; i < rows.length; i += 40) {
      const part = await Promise.all(rows.slice(i, i + 40).map(async (r) => ({ r, rec: await openRow(key2, y, batch, r).catch(() => null) })));
      for (const { r, rec } of part) {
        if (!rec) {
          bad.push(r.n);
          continue;
        }
        if (rec.older) older.push(r.n);
        imported.set(`v${y}-${r.n}`, { year: y, batch, n: r.n, rec });
        lines.push(lineOf(rec, y, r.n));
      }
    }
    const got = new Set(rows.map((r) => r.n)), missing = (expected || []).filter((n) => !got.has(n));
    if (bad.length) problems.push(tr(`${y}: Zeile(n) ${bad.join(", ")} nicht lesbar und ausgelassen.`, `${y}: row(s) ${bad.join(", ")} unreadable and left out.`));
    if (older.length) problems.push(tr(`${y}: Zeile(n) ${older.join(", ")} im Stand vor der letzten \xC4nderung.`, `${y}: row(s) ${older.join(", ")} as before their last change.`));
    if (missing.length || expected && rows.length > expected.length) problems.push(tr(`${y}: Zeilen fehlen oder sind zu viel \u2013 bitte das Jahr neu importieren.`, `${y}: rows are missing or too many \u2013 please import the year again.`));
  }
  return lines;
}
var UUID = /^[0-9a-f-]{36}$/i;
var platformRows = (rows) => (Array.isArray(rows) ? rows : []).filter((p) => p && UUID.test(String(p.id))).map((p) => {
  const book = Object.assign({}, p.book);
  delete book.source;
  delete book.importYear;
  delete book.row;
  return Object.assign({}, p, { book });
});
function vaultSource(key2) {
  return {
    async load() {
      const [plat, v] = await Promise.all([api("/api/finance/book"), api("/api/vault")]);
      const rows = [...await unsealAll(key2, v.years || {}), ...platformRows(plat.rows)];
      const stats = Object.fromEntries(["CHF", "EUR"].map((c) => [c, bookStats(rows, { currency: c, goalFactor: plat.goalFactor, today: plat.today })]));
      return { rows, stats, goalFactor: plat.goalFactor, today: plat.today, admin: plat.admin, warn: problems.join(" ") };
    },
    async plan(id) {
      const hit = imported.get(id);
      if (!hit) {
        if (!UUID.test(id)) throw new Error("?");
        return (await api("/api/finance/" + encodeURIComponent(id))).plan;
      }
      const { rec } = hit, notes = [rec.notes && rec.notes.x, ...Object.entries(rec.extra || {}).map(([k, v]) => `${k}: ${v}`)].filter(Boolean);
      return {
        id,
        name: rec.name,
        no: rec.no,
        currency: rec.currency || "CHF",
        book: Object.assign({}, rec.book),
        items: rec.items.map((i) => ({ label: i.label + (i.unsure ? " (?)" : ""), amount: i.amount, paidAt: i.paidAt || (i.paidAt === "" ? "\u2013" : void 0), due: i.due, account: i.account })),
        note: notes.join("\n")
      };
    },
    async saveBook(plan, book) {
      const hit = imported.get(plan.id);
      if (!hit) {
        if (!UUID.test(plan.id)) throw new Error("?");
        await api(`/api/finance/${plan.id}/book`, { method: "PUT", body: { book } });
        return;
      }
      const keep = {};
      for (const [k, , , kind] of BOOK_FIELDS) {
        const v = book[k];
        if (v == null || v === "") continue;
        keep[k] = kind === "money" ? Math.round(Number(v) * 100) / 100 : String(v).slice(0, 200);
      }
      const rec = Object.assign({}, hit.rec, { book: keep });
      delete rec.older;
      const sealed = await seal(key2, hit.year, hit.batch, hit.n, rec);
      await api(`/api/vault/rows/${hit.year}/${hit.n}`, { method: "PUT", body: { batch: hit.batch, iv: sealed.iv, ct: sealed.ct } });
      hit.rec = rec;
    },
    async saveGoal(goalFactor) {
      await api("/api/finance/book/settings", { method: "PUT", body: { goalFactor } });
    },
    openPayments: null,
    note: (plan) => imported.has(plan.id) ? tr(`Aus Excel ${imported.get(plan.id).year}, Zeile ${imported.get(plan.id).n} \xB7 verschl\xFCsselt im Tresor`, `From Excel ${imported.get(plan.id).year}, row ${imported.get(plan.id).n} \xB7 encrypted in the vault`) : tr("Zahlungen dieses Auftrags \xE4nderst du im Portal.", "This order's payments are changed in the portal.")
  };
}

// vault/src/importer.js
var tr2 = (de, en) => lang === "en" ? en : de;
var norm2 = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
var st = null;
var wrappedRef = "";
function showImport(box, key2, done, wrapped) {
  wrappedRef = wrapped;
  st = null;
  box.innerHTML = `<section class="panel vt-step">
    <h2>${tr2("Excel-Jahr importieren", "Import an Excel year")}</h2>
    <p class="muted">${tr2(
    "Die Datei wird nur hier in diesem Browser gelesen und nirgends hochgeladen. Zum Platform-Server gehen nur die verschl\xFCsselten Zeilen.",
    "The file is read only here in this browser and is uploaded nowhere. Only the encrypted rows go to the platform's server."
  )}</p>
    <div class="fin-grid vt-pick">
      <label class="fld">${tr2("Excel-Datei (.xlsx)", "Excel file (.xlsx)")}<input type="file" id="vtFile" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></label>
      <label class="fld">${tr2("Jahr", "Year")}<input type="number" id="vtYear" min="2000" max="2100" value="${(/* @__PURE__ */ new Date()).getFullYear()}"></label>
    </div>
    <p class="fin-err" id="vtErr" role="alert" hidden></p>
  </section><div id="vtMap"></div><div id="vtPrev"></div>`;
  $("vtFile").onchange = async (e) => {
    const f = (
      /** @type {HTMLInputElement} */
      e.target.files?.[0]
    );
    if (!f) return;
    const y = /20\d\d/.exec(f.name);
    if (y) $("vtYear").value = y[0];
    try {
      const [book, platform] = await Promise.all([readWorkbook(await f.arrayBuffer()), api("/api/finance/book").then((b) => b.rows).catch(() => [])]);
      if (!book.sheets.length) throw new Error("not-xlsx");
      const sheet = Math.max(0, book.sheets.findIndex((s) => y && s.name.includes(y[0])));
      st = { book, sheets: book.sheets, sheet, header: 0, cols: [], until: 0, year: Number(
        /** @type {HTMLInputElement} */
        $("vtYear").value
      ), orders: [], take: /* @__PURE__ */ new Set(), platform };
      fromSheet();
      drawMap();
      drawPreview(key2, done);
    } catch (err) {
      const el = $("vtErr");
      el.hidden = false;
      el.textContent = err.message === "not-xlsx" ? tr2("Das ist keine Excel-Datei (.xlsx).", "This is not an Excel file (.xlsx).") : tr2("Die Datei konnte nicht gelesen werden.", "The file could not be read.");
    }
  };
  $("vtYear").onchange = () => {
    if (st) {
      st.year = Number(
        /** @type {HTMLInputElement} */
        $("vtYear").value
      );
      build();
      drawPreview(key2, done);
    }
  };
}
function fromSheet() {
  const rows = st.sheets[st.sheet].rows;
  st.header = Math.max(0, headerRow(rows));
  st.cols = columnsOf(rows, st.header);
  st.until = 0;
  build();
}
function build() {
  const rows = st.sheets[st.sheet].rows, list = orderRows(rows, st.header, st.cols, st.until);
  st.orders = list.map((r) => orderOf(rows[r] || [], r, st.cols, st.year));
  const plat = new Set(st.platform.map((p) => norm2(p.name) + "|" + Number(p.total || 0).toFixed(2)));
  st.take = /* @__PURE__ */ new Set();
  st.orders.forEach((o, i) => {
    o.dupe = plat.has(norm2(o.name) + "|" + Number(o.total || 0).toFixed(2));
    if (!o.dupe) st.take.add(i);
  });
}
function drawMap() {
  const opts = (to) => TARGETS.map(([k, de, en]) => `<option value="${k}"${k === to ? " selected" : ""}>${esc(lang === "en" ? en : de)}</option>`).join("");
  $("vtMap").innerHTML = `<section class="panel vt-step">
    <h2>${tr2("Spalten", "Columns")}</h2>
    <div class="fin-grid">
      ${st.sheets.length > 1 ? `<label class="fld">${tr2("Blatt", "Sheet")}<select id="vtSheet">${st.sheets.map((s, i) => `<option value="${i}"${i === st.sheet ? " selected" : ""}>${esc(s.name)}</option>`).join("")}</select></label>` : ""}
      <label class="fld">${tr2("\xDCberschriften in Zeile", "Headers in row")}<input type="number" id="vtHead" min="1" value="${st.header + 1}"></label>
      <label class="fld">${tr2("Auftr\xE4ge bis Zeile (leer = automatisch)", "Orders up to row (empty = automatic)")}<input type="number" id="vtUntil" min="1" value="${st.until || ""}"></label>
    </div>
    <div class="vt-cols">${st.cols.map((c, k) => `<label class="vt-col"><span class="vt-letter">${c.letter}</span><span class="vt-head">${esc(c.header || "\u2013")}</span>
      <select data-col="${k}" aria-label="${esc(tr2(`Spalte ${c.letter}`, `Column ${c.letter}`))}">${opts(c.to)}</select></label>`).join("")}</div>
  </section>`;
  const again = () => {
    build();
    drawPreview();
  };
  if ($("vtSheet")) $("vtSheet").onchange = (e) => {
    st.sheet = Number(
      /** @type {HTMLSelectElement} */
      e.target.value
    );
    fromSheet();
    drawMap();
    drawPreview();
  };
  $("vtHead").onchange = (e) => {
    st.header = Math.max(0, Number(
      /** @type {HTMLInputElement} */
      e.target.value
    ) - 1);
    st.cols = columnsOf(st.sheets[st.sheet].rows, st.header);
    drawMap();
    again();
  };
  $("vtUntil").onchange = (e) => {
    st.until = Number(
      /** @type {HTMLInputElement} */
      e.target.value
    ) || 0;
    again();
  };
  $("vtMap").querySelectorAll("select[data-col]").forEach((s) => s.addEventListener("change", (e) => {
    const el = (
      /** @type {HTMLSelectElement} */
      e.target
    ), c = st.cols[Number(el.dataset.col)];
    if (!["keep", "skip"].includes(el.value)) {
      for (const o of st.cols) if (o !== c && o.to === el.value) o.to = "keep";
    }
    c.to = el.value;
    drawMap();
    again();
  }));
}
var keyRef = null;
var doneRef = null;
function drawPreview(key2, done) {
  if (key2) keyRef = key2;
  if (done) doneRef = done;
  const o = st.orders, chosen2 = o.filter((_, i) => st.take.has(i));
  const unsure = chosen2.reduce((s, x) => s + x.items.filter((i) => i.unsure).length, 0);
  const cur = (x) => esc(money(x, "CHF"));
  const chip = (it, oi, ii) => it.unsure ? `<span class="vt-chip q">? ${cur(it.amount)}${it.day ? " \xB7 " + esc(it.day) : ""}<select data-fix="${oi}:${ii}" aria-label="${esc(tr2("Rate zuordnen", "Assign instalment"))}">
        <option value="">${tr2("unklar", "unsure")}</option><option value="paid">${tr2("bezahlt", "paid")}</option><option value="open">${tr2("offen", "open")}</option><option value="drop">${tr2("weglassen", "leave out")}</option></select></span>` : `<span class="vt-chip ${it.paidAt !== void 0 ? "ok" : "open"}">${it.paidAt !== void 0 ? "\u2713" : "\u25CB"} ${cur(it.amount)}${it.paidAt || it.due ? " \xB7 " + esc(it.paidAt || it.due) : ""}</span>`;
  const flag = (x) => [
    x.dupe ? tr2("schon im Portal", "already in the portal") : "",
    x.flags.includes("sum") ? tr2("Raten \u2260 Preis", "instalments \u2260 price") : "",
    x.flags.includes("price") ? tr2("ohne Preis", "no price") : ""
  ].filter(Boolean).map((t2) => `<span class="vt-flag">${esc(t2)}</span>`).join(" ");
  const last = o.length ? o[o.length - 1].row : 0;
  $("vtPrev").innerHTML = `<section class="panel vt-step">
    <h2>${tr2("Vorschau \u2013 nur hier sichtbar", "Preview \u2013 visible only here")}</h2>
    <p class="vt-sum"><b>${chosen2.length}</b> ${tr2("Auftr\xE4ge werden importiert", "orders will be imported")} \xB7 ${tr2("Excel-Zeilen", "Excel rows")} ${o.length ? o[0].row : 0}\u2013${last}
      \xB7 <span class="${unsure ? "warn" : ""}">${unsure} ${tr2("unklare Raten", "unsure instalments")}</span>
      \xB7 ${o.filter((x) => x.dupe).length} ${tr2("schon im Portal (nicht angehakt)", "already in the portal (not ticked)")}</p>
    <div class="vt-table" role="region" aria-label="${esc(tr2("Vorschau", "Preview"))}" tabindex="0"><table>
      <thead><tr><th><span class="sr">${tr2("\xDCbernehmen", "Take")}</span></th><th>${tr2("Zeile", "Row")}</th><th>${tr2("Kund:in", "Client")}</th><th class="num">${tr2("Preis", "Price")}</th>
        <th class="num">${tr2("bezahlt", "paid")}</th><th class="num">${tr2("offen", "open")}</th><th>${tr2("Raten", "Instalments")}</th><th>${tr2("Hinweise", "Notes")}</th></tr></thead>
      <tbody>${o.map((x, i) => {
    const m = moneyOf(x);
    return `<tr class="${st.take.has(i) ? "" : "off"}">
        <td><input type="checkbox" data-take="${i}" ${st.take.has(i) ? "checked" : ""} aria-label="${esc(tr2(`Zeile ${x.row} \xFCbernehmen`, `Take row ${x.row}`))}"></td>
        <td>${x.row}</td><td>${esc(x.name || "\u2013")}</td><td class="num">${x.total == null ? "\u2013" : cur(x.total)}</td><td class="num">${cur(m.paid)}</td><td class="num">${cur(m.open)}</td>
        <td>${x.items.map((it, ii) => chip(it, i, ii)).join(" ") || "\u2013"}</td><td>${flag(x)}</td></tr>`;
  }).join("")}</tbody></table></div>
    <p class="vt-go"><button type="button" class="primary" id="vtSave" ${chosen2.length ? "" : "disabled"}>\u{1F512} ${tr2(`${chosen2.length} Auftr\xE4ge verschl\xFCsseln und speichern`, `Encrypt and save ${chosen2.length} orders`)}</button></p>
  </section>`;
  $("vtPrev").querySelectorAll("[data-take]").forEach((c) => (
    /** @type {HTMLInputElement} */
    c.onchange = (e) => {
      const i = Number(
        /** @type {HTMLInputElement} */
        e.target.dataset.take
      );
      if (
        /** @type {HTMLInputElement} */
        e.target.checked
      ) st.take.add(i);
      else st.take.delete(i);
      drawPreview();
    }
  ));
  $("vtPrev").querySelectorAll("[data-fix]").forEach((s) => (
    /** @type {HTMLSelectElement} */
    s.onchange = (e) => {
      const el = (
        /** @type {HTMLSelectElement} */
        e.target
      ), [oi, ii] = String(el.dataset.fix).split(":").map(Number), it = st.orders[oi].items[ii];
      if (el.value === "drop") st.orders[oi].items.splice(ii, 1);
      else if (el.value === "paid") {
        delete it.unsure;
        it.paidAt = it.day || "";
        delete it.day;
      } else if (el.value === "open") {
        delete it.unsure;
        it.due = it.day || "";
        delete it.day;
      }
      drawPreview();
    }
  ));
  $("vtSave").onclick = () => save();
}
async function save() {
  const chosen2 = st.orders.filter((_, i) => st.take.has(i)), year2 = st.year;
  if (!(year2 >= 2e3 && year2 <= 2100)) {
    toast(tr2("Bitte ein Jahr angeben.", "Please enter a year."));
    return;
  }
  const v = await api("/api/vault");
  if (!v.key || v.key.wrapped !== wrappedRef) {
    toast(tr2("Der Schl\xFCssel des Tresors hat sich ge\xE4ndert \u2013 bitte den Tresor neu \xF6ffnen.", "The vault's key has changed \u2013 please open the vault again."), 8e3);
    return;
  }
  const had = v.years && v.years[year2];
  if (had && !await new Promise((res) => dialog(
    `<h2>${tr2(`${year2} ersetzen?`, `Replace ${year2}?`)}</h2>
      <p>${tr2(
      `Im Tresor sind schon ${had.count} Zeilen f\xFCr ${year2}. Sie werden durch diese ${chosen2.length} ersetzt (auch Kosten, die du im Tresor eingetragen hast).`,
      `The vault already has ${had.count} rows for ${year2}. They will be replaced by these ${chosen2.length} (also costs you entered in the vault).`
    )}</p>
      <div class="dlg-foot"><button type="button" data-no>${tr2("Abbrechen", "Cancel")}</button><button type="button" class="primary" data-ok>${tr2("Ersetzen", "Replace")}</button></div>`,
    (box, close) => {
      box.querySelector("[data-no]").onclick = () => {
        close();
        res(false);
      };
      box.querySelector("[data-ok]").onclick = () => {
        close();
        res(true);
      };
    }
  ))) return;
  const btn = (
    /** @type {HTMLButtonElement} */
    $("vtSave")
  );
  btn.disabled = true;
  try {
    const batch = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
    const sealed = [], tooLong = [];
    for (const o of chosen2) {
      const rec = Object.assign({}, o);
      delete rec.dupe;
      delete rec.flags;
      const row = await seal(keyRef, year2, batch, o.row, rec);
      if (row.ct.length > 2e4) tooLong.push(o.row);
      else sealed.push(row);
    }
    if (tooLong.length) throw new Error(tr2(
      `Zeile(n) ${tooLong.join(", ")} sind zu lang (Notizen k\xFCrzen oder diese Spalten auf \xABnicht \xFCbernehmen\xBB).`,
      `Row(s) ${tooLong.join(", ")} are too long (shorten the notes or set those columns to \xABleave out\xBB).`
    ));
    let part = 0;
    for (let i = 0; i < sealed.length; ) {
      const rows = [];
      let size = 0;
      while (i < sealed.length && rows.length < 50 && size + sealed[i].ct.length < 2e5) {
        size += sealed[i].ct.length + 40;
        rows.push(sealed[i++]);
      }
      if (!rows.length) rows.push(sealed[i++]);
      btn.textContent = tr2(`Speichert \u2026 ${Math.min(i, sealed.length)}/${sealed.length}`, `Saving \u2026 ${Math.min(i, sealed.length)}/${sealed.length}`);
      await api("/api/vault/upload", { method: "POST", body: { batch, year: year2, part: part++, rows } });
    }
    const manifest = await sealManifest(keyRef, year2, batch, sealed.map((r) => r.n));
    await api("/api/vault/upload/finish", { method: "POST", body: { batch, year: year2, count: sealed.length, manifest } });
    toast(tr2(`${sealed.length} Auftr\xE4ge von ${year2} sind verschl\xFCsselt im Tresor.`, `${sealed.length} orders of ${year2} are encrypted in the vault.`), 6e3);
    st = null;
    if (doneRef) doneRef();
  } catch (e) {
    btn.disabled = false;
    btn.textContent = tr2("Nochmals versuchen", "Try again");
    toast(e.message, 6e3);
  }
}

// src/shared/day.js
var FMT = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" });

// src/shared/fin-states.js
var RANK = { overdue: 0, accepted: 1, nothing: 1, deposit: 2, due: 3, paid: 4 };
var STATES = Object.keys(RANK);
var VIEW_STATES = {
  todo: ["accepted", "overdue", "nothing", "deposit"],
  open: ["overdue", "accepted", "nothing", "deposit", "due"],
  overdue: ["overdue"],
  unpaid: ["accepted", "nothing"],
  // «Nicht bezahlt» (owner 25.10.2026)
  deposit: ["deposit"],
  // «Nur Anzahlung»
  part: ["due"],
  // «Teilweise bezahlt»
  paid: ["paid"]
};
var VIEWS = ["all", ...Object.keys(VIEW_STATES)];

// src/client/fin-state.js
var tr3 = (de, en) => lang === "en" ? en : de;
var fmtDue = (d) => fmtIsoDay(d) || "\u2013";
var priceOpen = (p) => !!(p && p.priceOpen) && !(Number(p.total) > 0);
var moneySpan = (a, b, cur) => Math.abs((Number(a) || 0) - (Number(b) || 0)) < 5e-3 ? money(a, cur) : `${money(a, cur)}\u2013${money(b)}`;
var priceOf = (p) => !priceOpen(p) ? money(p.total, p.currency) : p.range ? tr3("Preisrahmen ", "Price range ") + moneySpan(p.range[0], p.range[1], p.currency) : tr3("Preis offen", "Price open");

// src/client/day-input.js
var tr4 = (de, en) => lang === "en" ? en : de;
var ISO = /^\d{4}-\d{2}-\d{2}$/;
var native = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
var toText = (iso) => ISO.test(String(iso || "")) ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : "";
var real = (y, m, d) => {
  if (y < 1900 || y > 2199) return null;
  const x = new Date(Date.UTC(y, m - 1, d));
  return x.getUTCFullYear() === y && x.getUTCMonth() === m - 1 && x.getUTCDate() === d ? x.toISOString().slice(0, 10) : null;
};
function fromText(t2) {
  const v = String(t2 == null ? "" : t2).trim();
  if (!v) return "";
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (m) return real(+m[1], +m[2], +m[3]);
  m = /^(\d{1,2})[./\-\s](\d{1,2})[./\-\s](\d{2}|\d{4})$/.exec(v) || /^(\d{2})(\d{2})(\d{4}|\d{2})$/.exec(v);
  if (!m) return null;
  return real(m[3].length === 2 ? 2e3 + +m[3] : +m[3], +m[2], +m[1]);
}
var badDate = (root = document) => (
  /** @type {HTMLInputElement | null} */
  root.querySelector(".dd-text.bad")
);
var badDateText = () => tr4("Dieses Datum gibt es nicht. Bitte als TT/MM/JJJJ eingeben, z. B. 23/10/2026.", "This date doesn't exist. Please enter it as DD/MM/YYYY, e.g. 23/10/2026.");
var CAL = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`;
function enhance(el) {
  if (el.dataset.dd || el.classList.contains("dt-native")) return;
  el.dataset.dd = "1";
  const box = document.createElement("span");
  box.className = "dd";
  if (el.style.width) {
    box.style.width = el.style.width === "auto" ? "150px" : el.style.width;
    el.style.width = "";
  }
  const txt = document.createElement("input");
  txt.type = "text";
  txt.className = "dd-text";
  txt.inputMode = "numeric";
  txt.autocomplete = "off";
  txt.placeholder = tr4("TT/MM/JJJJ", "DD/MM/YYYY");
  const label2 = el.getAttribute("aria-label");
  if (label2) txt.setAttribute("aria-label", label2);
  txt.disabled = el.disabled;
  txt.required = el.required;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "dd-cal";
  btn.innerHTML = CAL;
  btn.disabled = el.disabled;
  btn.setAttribute("aria-label", tr4("Kalender \xF6ffnen", "Open calendar"));
  btn.title = tr4("Kalender", "Calendar");
  el.parentNode.insertBefore(box, el);
  box.append(txt, btn, el);
  el.classList.add("dd-native");
  el.tabIndex = -1;
  el.setAttribute("aria-hidden", "true");
  const show = () => {
    txt.value = toText(native.get.call(el));
    txt.classList.remove("bad");
    txt.title = "";
    txt.removeAttribute("aria-invalid");
  };
  const fire = () => {
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };
  Object.defineProperty(el, "value", { configurable: true, get() {
    return native.get.call(el);
  }, set(v) {
    native.set.call(el, v);
    show();
  } });
  show();
  el.addEventListener("change", show);
  el.addEventListener("input", show);
  const apply = () => {
    const iso = fromText(txt.value), was = native.get.call(el);
    if (iso === null) {
      txt.classList.add("bad");
      txt.title = badDateText();
      txt.setAttribute("aria-invalid", "true");
      if (was !== "") native.set.call(el, "");
      return;
    }
    txt.classList.remove("bad");
    txt.title = "";
    txt.removeAttribute("aria-invalid");
    if (iso === was) {
      show();
      return;
    }
    native.set.call(el, iso);
    show();
    fire();
  };
  txt.addEventListener("change", apply);
  txt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      apply();
    }
  });
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (el.disabled) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
      el.click();
    }
  });
}

// src/client/fin-book.js
var tr5 = (de, en) => lang === "en" ? en : de;
var MONTHS = () => lang === "en" ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] : ["Januar", "Februar", "M\xE4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
var label = (k) => {
  const f = BOOK_FIELDS.find((x) => x[0] === k);
  return f ? lang === "en" ? f[2] : f[1] : k;
};
var pct = (v) => v == null || !isFinite(v) ? "\u2013" : `${Math.round(v * 100)} %`;
var change = (v) => v == null || !isFinite(v) ? "\u2013" : `${v > 0 ? "+" : v < 0 ? "\u2212" : "\xB1"}${Math.abs(Math.round(v * 100))} %`;
var rel = (a, b) => b ? change((a - b) / b) : "\u2013";
var num = (v) => v == null || v === "" ? "\u2013" : esc(String(v));
var chf = (n) => esc(money(n));
var dayCell = (d) => d ? esc(fmtDue(d)) : "\u2013";
var data = null;
var year = 0;
var allCols = false;
var q = "";
var fig = "sum";
var scrolledFor = "";
var picked = null;
var open = /* @__PURE__ */ new Set();
var costOf = (p) => p.book && Number(p.book.cost) > 0 ? Number(p.book.cost) : 0;
var profitOf = (p) => priceOpen(p) || !(Number(p.total) > 0) || !costOf(p) ? null : Number(p.total) - costOf(p);
var monthOf = (p) => Number(String((p.book && p.book.source === "import" ? p.book.submitted || p.pays && p.pays[0] && p.pays[0][0] : p.createdAt) || "").slice(5, 7)) - 1;
var src;
async function showBook(box, source) {
  src = source;
  box.innerHTML = `<div class="panel empty">${tr5("Wird geladen\u2026", "Loading\u2026")}</div>`;
  try {
    data = await src.load();
  } catch (e) {
    box.innerHTML = `<div class="panel empty">${esc(e.message)}</div>`;
    return;
  }
  if (!year) year = Number(data.today.slice(0, 4));
  draw(box);
}
var years = () => [...new Set([
  Number(data ? data.today.slice(0, 4) : 0),
  ...data ? data.rows.map(bookYear) : [],
  ...Object.keys(data && data.stats.CHF || {}),
  ...Object.keys(data && data.stats.EUR || {})
].map(Number).filter((y) => Number.isInteger(y) && y > 1900 && y < 3e3))].sort();
function yearNav() {
  const ys = years(), i = ys.indexOf(year), prev = i > 0 ? ys[i - 1] : 0, next = i >= 0 && i < ys.length - 1 ? ys[i + 1] : 0;
  const btn = (y, dir, l) => `<button type="button" class="bk-ynav" data-y="${y}" ${y ? "" : "disabled"} aria-label="${esc(l)}">${dir}</button>`;
  return `<div class="bk-years-nav" role="group" aria-label="${tr5("Jahr", "Year")}">
    ${btn(prev, "\u2039", prev ? tr5(`Zum Jahr ${prev}`, `To ${prev}`) : tr5("Kein fr\xFCheres Jahr", "No earlier year"))}
    <h2 class="bk-year" aria-live="polite">${tr5(`Auftr\xE4ge ${year}`, `Orders ${year}`)}</h2>
    ${btn(next, "\u203A", next ? tr5(`Zum Jahr ${next}`, `To ${next}`) : tr5("Kein sp\xE4teres Jahr", "No later year"))}</div>`;
}
var vaultNote = () => !data.vault ? "" : `<p class="bk-vault"><span aria-hidden="true">\u{1F512}</span>
  ${tr5("Die importierten Excel-Jahre sind verschl\xFCsselt und nur im Tresor lesbar:", "The imported Excel years are encrypted and readable only in the vault:")}
  <a href="${esc(data.vault)}/" target="_blank" rel="noopener">${esc(data.vault.replace(/^https?:\/\//, ""))}</a></p>`;
function draw(box) {
  if (!data) return;
  box.innerHTML = `
    <div class="bk-bar">
      ${yearNav()}
      <input type="search" id="bkQ" placeholder="${tr5("Suchen\u2026", "Search\u2026")}" value="${esc(q)}" aria-label="${tr5("Suchen", "Search")}">
      <span class="bk-jump"><button type="button" id="bkTop">\u2191 ${tr5("Anfang", "Start")}</button><button type="button" id="bkEnd">\u2193 ${tr5("Neueste", "Newest")}</button></span>
      <button type="button" id="bkCols" aria-pressed="${allCols}">${allCols ? tr5("Kompakt", "Compact") : tr5("Alle Spalten", "All columns")}</button>
    </div>
    ${vaultNote()}${data.warn ? `<p class="bk-vault bk-warn-note" role="alert">${esc(data.warn)}</p>` : ""}
    <div id="bkList"></div>
    <div id="bkFigs"></div>`;
  $("bkQ").oninput = (e) => {
    q = /** @type {HTMLInputElement} */
    e.target.value;
    drawList();
  };
  $("bkCols").onclick = () => {
    allCols = !allCols;
    draw(box);
  };
  const scroller = () => (
    /** @type {HTMLElement | null} */
    document.querySelector("#bkList .bk-scroll")
  );
  $("bkTop").onclick = () => {
    const s = scroller();
    if (s) s.scrollTop = 0;
  };
  $("bkEnd").onclick = () => {
    const s = scroller();
    if (s) s.scrollTop = s.scrollHeight;
  };
  box.querySelectorAll(".bk-ynav[data-y]").forEach((b) => b.onclick = () => {
    const to = Number(
      /** @type {HTMLElement} */
      b.dataset.y
    );
    if (!to) return;
    const dir = b.textContent;
    year = to;
    picked = null;
    open.clear();
    draw(box);
    const again = [...box.querySelectorAll(".bk-ynav")].find((x) => x.textContent === dir && !/** @type {HTMLButtonElement} */
    x.disabled);
    (again || box.querySelector(".bk-year")).focus();
  });
  drawList();
  drawFigures();
}
var COMPACT = () => [
  ["nr", "#"],
  ["name", tr5("Kund:in", "Client")],
  ["service", label("service")],
  ["when", tr5("Start \u2013 Deadline", "Start \u2013 deadline")],
  ["lektor", tr5("Lektor:in", "Editor")],
  ["price", tr5("Preis \xB7 Stand", "Price \xB7 status")],
  ["profit", tr5("Gewinn \xB7 Kosten", "Profit \xB7 cost")]
];
var ALL = () => [
  ["nr", "#"],
  ["name", tr5("Kund:in", "Client")],
  ["status", label("status")],
  ["submitted", label("submitted")],
  ["start", label("start")],
  ["deadline", label("deadline")],
  ["time", label("time")],
  ["done", label("done")],
  ["words", label("words")],
  ["pages", label("pages")],
  ["sources", label("sources")],
  ["service", label("service")],
  ["implBy", label("implBy")],
  ["lektor", label("lektor")],
  ["university", label("university")],
  ["level", label("level")],
  ["subject", label("subject")],
  ["country", label("country")],
  ["price", tr5("Preis", "Price")],
  ["promo", label("promo")],
  ["cost", label("cost")],
  ["profit", tr5("Gewinn", "Profit")],
  ["paid", tr5("Bezahlt", "Paid")],
  ["receivedAt", tr5("Erhalten am", "Received on")]
];
var NUMERIC = /* @__PURE__ */ new Set(["price", "paid", "cost", "profit"]);
function payState(p) {
  if (priceOpen(p)) return ["violet", tr5("Preis offen", "Price open") + (p.paid > 0 ? ` \xB7 ${tr5("bezahlt", "paid")} ${money(p.paid)}` : "")];
  if (!(p.open > 4e-3)) return ["green", "\u2713 " + tr5("Bezahlt", "Paid")];
  if (!(p.paid > 0)) return ["amber", tr5("Nicht bezahlt", "Not paid")];
  return ["blue", `${tr5("Offen", "Open")} ${money(p.open)}`];
}
var sub = (t2, cls = "") => t2 ? `<small class="${cls}">${t2}</small>` : "";
var CELLS = {
  name: (p) => `<b>${esc(p.name || "\u2013")}</b>${allCols ? "" : sub(esc(p.no || ""))}`,
  service: (p, b) => allCols ? num(b.service) : `${num(b.service)}${sub(esc([b.level, b.university].filter(Boolean).join(" \xB7 ")))}`,
  when: (p, b) => `${dayCell(b.start)}${sub(b.deadline ? "\u2192 " + dayCell(b.deadline) : "")}`,
  submitted: (p, b) => dayCell(b.submitted),
  start: (p, b) => dayCell(b.start),
  deadline: (p, b) => dayCell(b.deadline),
  price: (p) => {
    if (allCols) return esc(priceOf(p));
    const [c, t2] = payState(p);
    return `<b>${esc(priceOf(p))}</b><span class="bk-pill ${c}">${esc(t2)}</span>`;
  },
  paid: (p) => chf(p.paid || 0),
  cost: (p, b) => b.cost > 0 ? chf(b.cost) : "\u2013",
  profit: (p) => {
    const v = profitOf(p);
    if (allCols) return v == null ? "\u2013" : chf(v);
    return `<b>${v == null ? "\u2013" : chf(v)}</b>${costOf(p) ? sub(`${tr5("Lektor:in", "editor")} \u2212 ${chf(costOf(p))}`) : sub(tr5("Lektor-Kosten fehlen", "editor cost missing"), "warn")}`;
  },
  receivedAt: (p) => esc((p.pays || []).map((x) => fmtDue(x[0])).join(", ")) || "\u2013"
};
var cell = (p, k, n) => k === "nr" ? String(n) : CELLS[k] ? CELLS[k](p, p.book || {}) : num((p.book || {})[k]);
var colCls = (k) => `bk-c-${k}${NUMERIC.has(k) ? " num" : ""}`;
function drawList() {
  const box = $("bkList");
  if (!box || !data) return;
  const needle = q.trim().toLowerCase();
  const rows = data.rows.filter((p) => bookYear(p) === year && (!needle || [p.name, p.no, p.email, ...Object.values(p.book || {})].some((v) => String(v || "").toLowerCase().includes(needle))));
  const cols = allCols ? ALL() : COMPACT(), grid = `bk-grid${allCols ? " all" : ""}`;
  const counts = {};
  rows.forEach((p) => {
    counts[monthOf(p)] = (counts[monthOf(p)] || 0) + 1;
  });
  const M = MONTHS();
  const lines = rows.map((p, i) => {
    const m = monthOf(p), head = !allCols && m >= 0 && (i === 0 || monthOf(rows[i - 1]) !== m) ? `<div class="bk-month">${M[m]} <span>\xB7 ${tr5(`${counts[m]} Auftr\xE4ge`, `${counts[m]} orders`)}</span></div>` : "";
    return head + line(p, i, cols, grid);
  }).join("");
  box.innerHTML = `<div class="bk-box${allCols ? " wide" : ""}"><div class="bk-inner">
    <div class="${grid} bk-head">${cols.map(([k, l]) => `<div class="${colCls(k)}">${esc(l)}</div>`).join("")}<div class="bk-x"></div></div>
    <div class="bk-scroll">${rows.length ? lines : `<p class="bk-none">${tr5("Keine Auftr\xE4ge gefunden.", "No orders found.")}</p>`}</div>
    <div class="${grid} bk-foot">${cols.map(([k]) => `<div class="${colCls(k)}">${foot(k, rows)}</div>`).join("")}<div class="bk-x"></div></div>
  </div></div>`;
  box.querySelectorAll("button.bk-row").forEach((b) => {
    const id = (
      /** @type {HTMLElement} */
      b.dataset.id || ""
    );
    b.onclick = () => {
      if (String(getSelection() || "")) return;
      if (open.has(id)) open.delete(id);
      else open.add(id);
      const sc2 = (
        /** @type {HTMLElement | null} */
        box.querySelector(".bk-scroll")
      ), top = sc2 ? sc2.scrollTop : 0;
      drawList();
      const sc22 = (
        /** @type {HTMLElement | null} */
        box.querySelector(".bk-scroll")
      );
      if (sc22) sc22.scrollTop = top;
      const r = (
        /** @type {HTMLElement | null} */
        box.querySelector(`button.bk-row[data-id="${CSS.escape(id)}"]`)
      );
      if (r) r.focus();
    };
    if (open.has(id)) more(id);
  });
  const sc = (
    /** @type {HTMLElement | null} */
    box.querySelector(".bk-scroll")
  ), key2 = year + (allCols ? "a" : "");
  if (sc && scrolledFor !== key2) {
    scrolledFor = key2;
    sc.scrollTop = sc.scrollHeight;
  }
}
function line(p, i, cols, grid) {
  const on = open.has(p.id);
  return `<div class="bk-line${i % 2 ? " alt" : ""}${on ? " on" : ""}">
    <button type="button" class="bk-row ${grid}" data-id="${esc(p.id)}" aria-expanded="${on}">
      ${cols.map(([k]) => `<span class="${colCls(k)}">${cell(p, k, i + 1)}</span>`).join("")}<span class="bk-x" aria-hidden="true">\u203A</span></button>
    ${on ? `<div class="bk-more" id="bkm-${esc(p.id)}">${tr5("L\xE4dt \u2026", "Loading \u2026")}</div>` : ""}</div>`;
}
function foot(k, rows) {
  const sum2 = (f) => rows.reduce((s, p) => s + (p.currency === "EUR" ? 0 : Number(f(p)) || 0), 0);
  if (k === "name") return `<b>${tr5(`${rows.length} Auftr\xE4ge`, `${rows.length} orders`)}</b><small>CHF</small>`;
  if (k === "price") return `${chf(sum2((p) => priceOpen(p) ? 0 : p.total))}${allCols ? "" : sub(`${tr5("bezahlt", "paid")} ${chf(sum2((p) => p.paid))}`)}`;
  if (k === "profit") return `${chf(sum2(profitOf))}${allCols ? "" : sub(`${tr5("Lektor:in", "editor")} \u2212 ${chf(sum2(costOf))}`)}`;
  if (k === "paid") return chf(sum2((p) => p.paid));
  if (k === "cost") return chf(sum2(costOf));
  return "";
}
async function more(id) {
  let plan;
  try {
    plan = await src.plan(id);
  } catch (e) {
    const el2 = document.getElementById("bkm-" + id);
    if (el2) el2.textContent = e.message;
    return;
  }
  const el = document.getElementById("bkm-" + id);
  if (!el) return;
  const b = plan.book || {};
  const when = (i) => i.paidAt ? "\u2713 " + tr5("erhalten am ", "received on ") + dayCell(i.paidAt) : i.due ? tr5("f\xE4llig ", "due ") + dayCell(i.due) : tr5("nach der Lieferung", "after delivery");
  const pays = (plan.items || []).map((i) => `<li><span>${esc(i.label)}</span><b>${esc(money(i.amount, plan.currency))}</b>
    <small>${when(i)}${i.account ? " \xB7 " + esc(i.account) : ""}</small></li>`).join("");
  const val = (k, kind) => kind === "money" ? b[k] > 0 ? esc(money(b[k], plan.currency)) : "\u2013" : kind === "day" ? dayCell(b[k]) : num(b[k]);
  const kv = ([k, , , kind]) => `<dt>${esc(label(k))}</dt><dd>${val(k, kind)}</dd>`;
  el.innerHTML = `<div class="bk-detail">
      <div><h3>${tr5("Zahlungen", "Payments")}</h3>
        ${pays ? `<ul class="bk-pays">${pays}</ul>` : `<p class="muted">${tr5("Noch keine Zahlung erfasst.", "No payment recorded yet.")}</p>`}
        ${plan.note ? `<h3>${tr5("Notiz", "Note")}</h3><p class="bk-note">${esc(plan.note)}</p>` : ""}</div>
      <div><h3>${tr5("Angaben", "Details")}</h3><dl class="bk-kv">${BOOK_FIELDS.map(kv).join("")}</dl></div>
    </div>
    <p class="bk-acts"><button type="button" data-edit>\u270E ${tr5("Angaben bearbeiten", "Edit details")}</button>
      ${payable(plan) ? `<button type="button" class="ghost" data-pay>${tr5("Zahlungen \xF6ffnen", "Open payments")}</button>` : ""}
      ${src.note && src.note(plan) ? `<small class="muted">${esc(src.note(plan))}</small>` : ""}</p>`;
  el.querySelector("[data-edit]").onclick = () => edit(plan);
  const pay = (
    /** @type {HTMLElement | null} */
    el.querySelector("[data-pay]")
  );
  if (pay) pay.onclick = async () => {
    if (src.openPayments && await src.openPayments(plan, !!(data && data.admin))) reload();
  };
}
var payable = (plan) => !!src.openPayments && (!src.canPay || src.canPay(plan));
function edit(plan) {
  const b = plan.book || {}, v = (k) => esc(b[k] != null ? String(b[k]) : "");
  const input = (k, kind) => kind === "day" ? `<input type="date" data-k="${k}" value="${v(k)}">` : kind === "money" ? `<span class="fin-money"><span class="cur">${esc(plan.currency)}</span><input type="number" min="0" step="0.05" data-k="${k}" value="${v(k)}"></span>` : `<input type="text" data-k="${k}" value="${v(k)}">`;
  const field = ([k, , , kind]) => `<label class="fld">${esc(label(k))}${input(k, kind)}</label>`;
  dialog(
    `<div class="fin-dlg"><h2>${tr5("Angaben bearbeiten", "Edit details")}</h2><p class="fin-who"><b>${esc(plan.name)}</b>${plan.no ? " \xB7 " + esc(plan.no) : ""}</p>
      <div class="fin-grid bk-fields">${BOOK_FIELDS.map(field).join("")}</div>
      <p class="fin-err" data-err role="alert" hidden></p>
      <div class="dlg-foot"><button type="button" data-no>${tr5("Abbrechen", "Cancel")}</button><button type="button" class="primary" data-ok>${tr5("Speichern", "Save")}</button></div></div>`,
    (box, close) => {
      box.style.maxWidth = "760px";
      box.style.width = "100%";
      box.querySelectorAll('input[type="date"]').forEach((n) => enhance(
        /** @type {HTMLInputElement} */
        n
      ));
      const err = (
        /** @type {HTMLElement} */
        box.querySelector("[data-err]")
      );
      box.querySelector("[data-no]").onclick = () => close();
      const ok = box.querySelector("[data-ok]");
      ok.onclick = async () => {
        if (badDate(box)) {
          err.hidden = false;
          err.textContent = badDateText();
          return;
        }
        const out = {};
        box.querySelectorAll("[data-k]").forEach((n) => {
          const i = (
            /** @type {HTMLInputElement} */
            n
          );
          out[i.dataset.k || ""] = i.type === "number" ? i.value === "" ? null : Number(i.value) : i.value;
        });
        ok.disabled = true;
        try {
          await src.saveBook(plan, out);
          close();
          toast(tr5("Gespeichert.", "Saved."));
          reload();
        } catch (e) {
          ok.disabled = false;
          err.hidden = false;
          err.textContent = e.message;
        }
      };
    }
  );
}
async function reload() {
  try {
    data = await src.load();
  } catch (e) {
    toast(e.message, 5e3);
    return;
  }
  drawList();
  drawFigures();
}
function table(title, heads, body, footRows = [], { wide = false, after = "" } = {}) {
  const cols = `grid-template-columns:${wide ? "minmax(96px,1.1fr)" : "minmax(0,1.4fr)"} repeat(${heads.length},minmax(0,1fr))`;
  const cells = [`<div class="h"></div>`, ...heads.map((h) => `<div class="h v">${h}</div>`)];
  for (const r of body) cells.push(`<div class="l">${r[0]}</div>`, ...r.slice(1).map((v) => `<div class="v">${v}</div>`));
  for (const r of footRows) cells.push(`<div class="t">${r[0]}</div>`, ...r.slice(1).map((v) => `<div class="t v">${v}</div>`));
  return `<section class="bk-block"><h3>${title}</h3><div class="${wide ? "bk-tbox wide" : "bk-tbox"}"><div class="bk-t" style="${cols}">${cells.join("")}</div></div>${after}</section>`;
}
var EMPTY = { months: Array.from({ length: 12 }, (_, k) => ({ month: k + 1, sales: 0, profit: 0 })), totalSales: 0, totalProfit: 0, avgSales: 0, avgProfit: 0, predictSales: 0, best: [] };
function chosen() {
  const ys = years(), list = (picked || [year, year - 1]).filter((k, i, a) => ys.includes(k) && a.indexOf(k) === i);
  return list.length ? list : [year];
}
function compareBar() {
  const ys = years().slice().sort((a, b) => b - a), sel = chosen();
  const opt = (z, k) => `<option value="${z}"${z === k ? " selected" : ""}${z !== k && sel.includes(z) ? " disabled" : ""}>${z}</option>`;
  const slot = (k, n) => `<span class="bk-slot">${n ? `<span class="muted">${tr5("gg\xFC.", "vs.")}</span>` : ""}
    <select data-slot="${n}" aria-label="${tr5(`Jahr ${n + 1}`, `Year ${n + 1}`)}">${ys.map((z) => opt(z, k)).join("")}</select>
    ${sel.length > 1 ? `<button type="button" class="bk-rm" data-rm="${n}" aria-label="${tr5(`${k} entfernen`, `Remove ${k}`)}">\xD7</button>` : ""}</span>`;
  return `<div class="bk-compare" role="group" aria-label="${tr5("Vergleich", "Compare")}"><b>${tr5("Vergleich:", "Compare:")}</b>${sel.map(slot).join("")}
    ${sel.length < 3 && sel.length < ys.length ? `<button type="button" class="bk-add" id="bkAdd">+ ${tr5("Jahr", "Year")}</button>` : ""}</div>`;
}
function goalTable(st2) {
  const s = st2[year] || EMPTY, last = st2[year - 1], goal = last ? last.totalProfit * data.goalFactor : null, w = goal ? Math.round(Math.min(1, s.totalProfit / goal) * 100) : 0;
  const bar = goal == null ? "" : `<div class="bk-reach">
    <span class="bk-bar-out" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${w}" aria-label="${tr5("Ziel erreicht", "Goal reached")}">
    <span style="width:${w}%"></span></span><span>${tr5("Ziel erreicht: ", "Goal reached: ")}${pct(s.totalProfit / goal)}</span></div>`;
  return table(tr5(`Ziel ${year}`, `Goal ${year}`), [tr5("Jahr", "Year"), tr5("pro Monat", "per month")], [
    [tr5(`Gewinn ${year - 1}`, `Profit ${year - 1}`), last ? chf(last.totalProfit) : "\u2013", last ? chf(last.totalProfit / 12) : "\u2013"],
    [`${tr5("Ziel", "Goal")} ${year} <small>(\xD7 ${esc(String(data.goalFactor))})</small>`, goal != null ? chf(goal) : "\u2013", goal != null ? chf(goal / 12) : "\u2013"],
    [tr5("Live-Gewinn", "Live profit"), chf(s.totalProfit), chf(s.avgProfit)]
  ], [], { after: bar });
}
function glance(D, st2) {
  const M = MONTHS(), [first, ...others] = D;
  const best = (v) => v.best && v.best[0] ? `${M[v.best[0].month - 1]}<small>${chf(v.best[0].sales)}</small>` : "\u2013";
  const rows = [
    [tr5("Umsatz", "Sales"), ...D.map((x) => chf(x.v.totalSales))],
    [tr5("Gewinn", "Profit"), ...D.map((x) => chf(x.v.totalProfit))],
    [tr5("Marge", "Margin"), ...D.map((x) => x.v.totalSales ? pct(x.v.totalProfit / x.v.totalSales) : "\u2013")],
    [tr5("\xD8 pro Monat \xB7 Umsatz", "Monthly average \xB7 sales"), ...D.map((x) => chf(x.v.avgSales))],
    [tr5("\xD8 pro Monat \xB7 Gewinn", "Monthly average \xB7 profit"), ...D.map((x) => chf(x.v.avgProfit))],
    [tr5("Prognose 12 Monate", "12-month prediction"), ...D.map((x) => chf(x.v.avgSales * 12))],
    [tr5("Bester Monat", "Best month"), ...D.map((x) => best(x.v))],
    ...others.map((o) => [tr5(`Umsatz ${first.y} gg\xFC. ${o.y}`, `Sales ${first.y} vs. ${o.y}`), ...D.map((x) => x.y === o.y ? rel(first.v.totalSales, o.v.totalSales) : "")])
  ];
  return `<div class="bk-glance">${table(tr5("Vergleich", "Comparison"), D.map((x) => String(x.y)), rows)}${goalTable(st2)}</div>`;
}
function monthsTable(D) {
  const M = MONTHS(), [first, ...others] = D, older = D.length === 2 ? D[1] : null, oAvg = older ? older.v.totalProfit / 12 : 0;
  const extra = older ? [
    tr5(`Gewinn gg\xFC. \xD8 ${older.y}`, `Profit vs. \u2300 ${older.y}`),
    tr5(`kumuliert gg\xFC. \xD8 ${older.y}`, `cumulated vs. \u2300 ${older.y}`),
    tr5(`Gewinn gg\xFC. Monat ${older.y}`, `Profit vs. month ${older.y}`)
  ] : [];
  const heads = [
    ...D.map((x) => tr5(`Umsatz ${x.y}`, `Sales ${x.y}`)),
    ...D.map((x) => tr5(`Gewinn ${x.y}`, `Profit ${x.y}`)),
    ...others.map((o) => tr5(`Umsatz \u0394 ${first.y} gg\xFC. ${o.y}`, `Sales \u0394 ${first.y} vs. ${o.y}`)),
    ...extra
  ];
  let cum = 0;
  const vsOlder = (k, fp) => older ? [oAvg ? pct(fp / oAvg) : "\u2013", oAvg ? pct(cum / (oAvg * (k + 1))) : "\u2013", older.v.months[k].profit ? pct(fp / older.v.months[k].profit) : "\u2013"] : [];
  const body = M.map((m, k) => {
    const fp = first.v.months[k].profit;
    cum += fp;
    return [m, ...D.map((x) => chf(x.v.months[k].sales)), ...D.map((x) => chf(x.v.months[k].profit)), ...others.map((o) => rel(first.v.months[k].sales, o.v.months[k].sales)), ...vsOlder(k, fp)];
  });
  const total = [tr5("Total", "Total"), ...D.map((x) => chf(x.v.totalSales)), ...D.map((x) => chf(x.v.totalProfit)), ...others.map((o) => rel(first.v.totalSales, o.v.totalSales)), ...extra.map(() => "")];
  return table(tr5("Monate", "Months"), heads, body, [total], { wide: true });
}
var yearsTable = (st2, ys) => table(
  tr5("Jahre", "Years"),
  [tr5("Umsatz", "Revenue"), tr5("Gewinn", "Profit"), tr5("Marge", "Margin"), tr5("Wachstum", "Growth")],
  ys.map((k) => [String(k), chf(st2[k].totalSales), chf(st2[k].totalProfit), pct(st2[k].margin), change(st2[k].growth)])
);
var tabBtn = ([k, l]) => `<button type="button" role="tab" data-fig="${k}" aria-selected="${fig === k}">${l}</button>`;
function drawFigures() {
  const box = $("bkFigs");
  if (!box || !data) return;
  const st2 = data.stats.CHF || {}, ys = Object.keys(st2).map(Number).sort();
  const D = chosen().sort((a, b) => b - a).map((k) => ({ y: k, v: st2[k] || EMPTY }));
  const missing = data.rows.filter((p) => bookYear(p) === year && Number(p.total) > 0 && !costOf(p)).length;
  const eur = data.stats.EUR && data.stats.EUR[year];
  const tabs = [["sum", tr5("Auf einen Blick", "At a glance")], ["months", tr5("Monate", "Months")], ["years", tr5("Jahre", "Years")]];
  const body = fig === "months" ? monthsTable(D) : fig === "years" ? ys.length ? yearsTable(st2, ys) : "" : glance(D, st2);
  const warn = missing ? `<p class="bk-warn">${tr5(
    `${missing} Auftr\xE4ge ohne Lektor-Kosten: ihr Gewinn ist hier noch nicht abgezogen.`,
    `${missing} orders without editor cost: their profit is not reduced here yet.`
  )}</p>` : "";
  const eurLine = eur ? `<p class="muted bk-eur">${tr5("Dazu in EUR", "Plus in EUR")} ${year}: ${tr5("Umsatz", "revenue")} ${esc(money(eur.totalSales, "EUR"))}
    \xB7 ${tr5("Gewinn", "profit")} ${esc(money(eur.totalProfit, "EUR"))}</p>` : "";
  box.innerHTML = `<section class="panel bk-figs" aria-labelledby="bkFigH">
    <div class="bk-fighead">
      <h2 id="bkFigH">${tr5(`Zahlen ${year}`, `Figures ${year}`)}</h2>
      <div class="seg" role="tablist" aria-label="${tr5("Zahlen", "Figures")}">${tabs.map(tabBtn).join("")}</div>
      ${compareBar()}
      <p class="bk-rule">${tr5("Geld z\xE4hlt im Monat, in dem es eingegangen ist \xB7 CHF", "Money counts in the month it arrived \xB7 CHF")}</p>${warn}
    </div>
    ${body}${eurLine}${data.admin && fig === "sum" ? goalSet() : ""}
  </section>`;
  figureClicks(box);
}
var goalSet = () => `<p class="bk-goalset"><label>${tr5("Ziel = Gewinn des Vorjahres \xD7", "Goal = last year's profit \xD7")}
  <input type="number" id="bkFactor" min="0.1" max="100" step="0.1" value="${esc(String(data ? data.goalFactor : 2.8))}"></label>
  <button type="button" id="bkFactorSave">${tr5("Speichern", "Save")}</button></p>`;
function figureClicks(box) {
  box.querySelectorAll("[data-fig]").forEach((b) => b.onclick = () => {
    fig = /** @type {HTMLElement} */
    b.dataset.fig || "sum";
    drawFigures();
    const now = (
      /** @type {HTMLElement | null} */
      document.querySelector(`#bkFigs [data-fig="${fig}"]`)
    );
    if (now) now.focus();
  });
  box.querySelectorAll("select[data-slot]").forEach((s) => s.onchange = () => {
    const sel = chosen().slice(), n = Number(
      /** @type {HTMLElement} */
      s.dataset.slot
    );
    sel[n] = Number(
      /** @type {HTMLSelectElement} */
      s.value
    );
    picked = sel;
    drawFigures();
  });
  box.querySelectorAll("[data-rm]").forEach((b) => b.onclick = () => {
    const n = Number(
      /** @type {HTMLElement} */
      b.dataset.rm
    );
    picked = chosen().filter((_, i) => i !== n);
    drawFigures();
  });
  const add = document.getElementById("bkAdd");
  if (add) add.onclick = () => {
    const sel = chosen(), free = years().slice().sort((a, b) => b - a).find((z) => !sel.includes(z));
    if (free) {
      picked = sel.concat([free]);
      drawFigures();
    }
  };
  const save2 = (
    /** @type {HTMLButtonElement | null} */
    document.getElementById("bkFactorSave")
  );
  if (save2) save2.onclick = async () => {
    save2.disabled = true;
    const goalFactor = Number(
      /** @type {HTMLInputElement} */
      $("bkFactor").value
    );
    try {
      await src.saveGoal(goalFactor);
      toast(tr5("Gespeichert.", "Saved."));
      await reload();
    } catch (e) {
      toast(e.message, 5e3);
      save2.disabled = false;
    }
  };
}

// vault/src/main.js
var tr6 = (de, en) => lang === "en" ? en : de;
var key = null;
var info = { key: null, years: {}, admin: false };
var tab = "book";
var main = () => $("vtMain");
function frame() {
  document.body.innerHTML = `<header class="vt-top">
      <span class="vt-brand"><span aria-hidden="true">\u{1F512}</span> Delta Lektorat \xB7 ${tr6("Tresor", "Vault")}</span>
      <span class="vt-acts">
        <span class="seg" role="group" aria-label="${tr6("Sprache", "Language")}"><button type="button" data-lang="de" aria-pressed="${lang === "de"}">DE</button><button type="button" data-lang="en" aria-pressed="${lang === "en"}">EN</button></span>
        <button type="button" id="vtTheme">${theme === "dark" ? tr6("Dunkel", "Dark") : theme === "light" ? tr6("Hell", "Light") : tr6("Automatisch", "Automatic")}</button>
        ${key ? `<button type="button" id="vtLock">\u{1F512} ${tr6("Sperren", "Lock")}</button>` : ""}
      </span></header>
    <main id="vtMain" class="vt-main" tabindex="-1"></main>
    <footer class="vt-foot">${tr6("Entschl\xFCsselt wird nur in diesem Browser. Die Plattform speichert nur verschl\xFCsselten Text.", "Decryption happens only in this browser. The platform stores only encrypted text.")}
      \xB7 <a href="${esc(APP)}/" target="_blank" rel="noopener">${esc(APP.replace(/^https?:\/\//, ""))}</a></footer>`;
  document.querySelectorAll("[data-lang]").forEach((b) => (
    /** @type {HTMLElement} */
    b.onclick = () => {
      setLang(
        /** @type {HTMLElement} */
        b.dataset.lang
      );
      start();
    }
  ));
  $("vtTheme").onclick = () => {
    setTheme(theme === "dark" ? "light" : theme === "light" ? "auto" : "dark");
    start();
  };
  if ($("vtLock")) $("vtLock").onclick = lockNow;
}
function lockNow() {
  key = null;
  location.reload();
}
addEventListener("pagehide", () => {
  key = null;
  document.body.textContent = "";
});
addEventListener("pageshow", (e) => {
  if (e.persisted) location.reload();
});
var idle = 0;
var touch = () => {
  clearTimeout(idle);
  if (key) idle = setTimeout(lockNow, 20 * 60 * 1e3);
};
["pointerdown", "keydown", "scroll"].forEach((e) => addEventListener(e, touch, { passive: true }));
async function start() {
  frame();
  main().innerHTML = `<div class="panel empty">${tr6("Wird geladen\u2026", "Loading\u2026")}</div>`;
  try {
    info = await api("/api/vault");
  } catch (e) {
    return e instanceof LoginNeeded ? loginFirst(e.message) : failed(e);
  }
  if (key) return opened();
  if (!info.key) return info.admin ? setup() : notYet();
  unlock();
}
var failed = (e) => {
  main().innerHTML = `<div class="panel empty">${esc(e.message)}</div>`;
};
function loginFirst(why) {
  const code = why === "twofa";
  main().innerHTML = `<section class="panel vt-gate"><h1>${code ? tr6("Bitte zuerst den Anmeldecode im Portal eingeben", "Please enter your login code in the portal first") : tr6("Bitte zuerst im Portal anmelden", "Please log in to the portal first")}</h1>
    <p>${code ? tr6(
    "Dieser Browser hat im Portal noch keinen Anmeldecode eingegeben. \xD6ffne das Portal, gib den Code ein und komm dann hierher zur\xFCck.",
    "This browser hasn't entered a login code in the portal yet. Open the portal, enter the code, then come back here."
  ) : tr6(
    "Der Tresor nutzt deine Anmeldung im Portal. Sie fehlt oder ist abgelaufen \u2013 sie erneuert sich, sobald eine Portal-Seite l\xE4dt. \xD6ffne das Portal (oder lade seinen Tab neu) und komm dann hierher zur\xFCck.",
    "The vault uses your portal login. It is missing or has expired \u2013 it renews whenever a portal page loads. Open the portal (or reload its tab), then come back here."
  )}</p>
    <p class="vt-row"><a class="btn primary" href="${esc(APP)}/" target="_blank" rel="noopener">${tr6("Portal \xF6ffnen", "Open the portal")}</a>
      <button type="button" id="vtRetry">${tr6("Erneut versuchen", "Try again")}</button></p></section>`;
  $("vtRetry").onclick = start;
}
function notYet() {
  main().innerHTML = `<section class="panel vt-gate"><h1>${tr6("Der Tresor ist noch nicht eingerichtet", "The vault is not set up yet")}</h1>
    <p>${tr6("Ein Admin richtet ihn einmal mit einer Passphrase ein.", "An admin sets it up once with a passphrase.")}</p></section>`;
}
var passField = (id, label2, auto) => `<label class="fld">${label2}<input type="password" id="${id}" autocomplete="${auto}" spellcheck="false"></label>`;
function setup() {
  main().innerHTML = `<section class="panel vt-gate"><h1>${tr6("Tresor einrichten", "Set up the vault")}</h1>
    <p>${tr6(
    "W\xE4hle eine lange Passphrase, z. B. f\xFCnf zuf\xE4llige W\xF6rter. Sie wird nirgends gespeichert und nie gesendet. <b>Ohne sie sind die importierten Daten f\xFCr immer verloren \u2013 niemand kann sie wiederherstellen.</b>",
    "Choose a long passphrase, e.g. five random words. It is stored nowhere and never sent. <b>Without it the imported data is lost for good \u2013 nobody can recover it.</b>"
  )}</p>
    ${passField("vtP1", tr6("Passphrase (mind. 16 Zeichen)", "Passphrase (at least 16 characters)"), "new-password")}
    ${passField("vtP2", tr6("Passphrase wiederholen", "Repeat the passphrase"), "new-password")}
    <label class="vt-check"><input type="checkbox" id="vtKept"> ${tr6("Ich habe die Passphrase sicher aufbewahrt (z. B. im Passwort-Manager).", "I have stored the passphrase safely (e.g. in a password manager).")}</label>
    <p class="fin-err" id="vtErr" role="alert" hidden></p>
    <p class="vt-row"><button type="button" class="primary" id="vtGo">${tr6("Tresor einrichten", "Set up the vault")}</button></p></section>`;
  $("vtGo").onclick = async () => {
    const p1 = (
      /** @type {HTMLInputElement} */
      $("vtP1").value
    ), p2 = (
      /** @type {HTMLInputElement} */
      $("vtP2").value
    ), err = $("vtErr");
    const say = (t2) => {
      err.hidden = false;
      err.textContent = t2;
    };
    if (!passphraseOk(p1)) return say(tr6("Bitte mindestens 16 Zeichen, nicht nur ein Zeichen wiederholt.", "Please at least 16 characters, not one character repeated."));
    if (p1 !== p2) return say(tr6("Die beiden Eingaben stimmen nicht \xFCberein.", "The two entries don't match."));
    if (!/** @type {HTMLInputElement} */
    $("vtKept").checked) return say(tr6("Bitte best\xE4tige, dass du die Passphrase aufbewahrt hast.", "Please confirm that you stored the passphrase."));
    $("vtGo").disabled = true;
    try {
      const v = await newVault(p1);
      await api("/api/vault/key", { method: "PUT", body: { key: v.envelope } });
      info = await api("/api/vault");
      key = await openVault(info.key, p1);
      toast(tr6("Tresor eingerichtet.", "Vault set up."));
      start();
    } catch (e) {
      $("vtGo").disabled = false;
      say(e.message === "bad-envelope" ? tr6("Der Tresor wurde gleichzeitig anders eingerichtet \u2013 bitte neu laden.", "The vault was set up differently at the same time \u2013 please reload.") : e.message);
    }
  };
}
function unlock() {
  main().innerHTML = `<section class="panel vt-gate"><h1>${tr6("Tresor \xF6ffnen", "Open the vault")}</h1>
    <p class="muted">${tr6("Pr\xFCfe oben in der Adresszeile, dass hier die Adresse des Tresors steht, bevor du die Passphrase eingibst.", "Check the address bar shows the vault's address before you type the passphrase.")}</p>
    <form id="vtForm">${passField("vtPass", tr6("Passphrase", "Passphrase"), "current-password")}
    <p class="fin-err" id="vtErr" role="alert" hidden></p>
    <p class="vt-row"><button type="submit" class="primary" id="vtGo">${tr6("\xD6ffnen", "Open")}</button></p></form></section>`;
  $("vtPass").focus();
  $("vtForm").onsubmit = async (ev) => {
    ev.preventDefault();
    const btn = (
      /** @type {HTMLButtonElement} */
      $("vtGo")
    ), err = $("vtErr"), inp = (
      /** @type {HTMLInputElement} */
      $("vtPass")
    );
    btn.disabled = true;
    btn.textContent = tr6("Pr\xFCft \u2026", "Checking \u2026");
    try {
      key = await openVault(info.key, inp.value);
      inp.value = "";
      touch();
      start();
    } catch (e) {
      btn.disabled = false;
      btn.textContent = tr6("\xD6ffnen", "Open");
      err.hidden = false;
      inp.select();
      err.textContent = e.message === "bad-envelope" ? tr6("Der gespeicherte Schl\xFCssel ist nicht der des Tresors. Bitte nichts importieren und Donat Bescheid geben.", "The stored key is not the vault's. Please import nothing and tell Donat.") : tr6("Diese Passphrase stimmt nicht.", "This passphrase is not right.");
    }
  };
}
function opened() {
  const tabs = [["book", tr6("\xDCbersicht", "Overview")], ...info.admin ? [["import", tr6("Import", "Import")], ["settings", tr6("Einstellungen", "Settings")]] : []];
  main().innerHTML = `<div class="seg fin-modes" role="group" aria-label="${tr6("Ansicht", "View")}">${tabs.map(([k, l]) => `<button type="button" data-tab="${k}" aria-pressed="${tab === k}">${l}</button>`).join("")}</div>
    <div id="vtBox"></div>`;
  main().querySelectorAll("[data-tab]").forEach((b) => (
    /** @type {HTMLElement} */
    b.onclick = () => {
      tab = /** @type {HTMLElement} */
      b.dataset.tab || "book";
      opened();
    }
  ));
  const box = $("vtBox");
  if (tab === "import") return showImport(
    box,
    /** @type {CryptoKey} */
    key,
    () => {
      tab = "book";
      start();
    },
    info.key.wrapped
  );
  if (tab === "settings") return settings(box);
  showBook(box, vaultSource(
    /** @type {CryptoKey} */
    key
  ));
}
function settings(box) {
  const years2 = Object.entries(info.years || {}).sort();
  box.innerHTML = `<section class="panel vt-step"><h2>${tr6("Jahre im Tresor", "Years in the vault")}</h2>
      ${years2.length ? `<ul class="vt-years">${years2.map(([y, v]) => `<li><b>${esc(y)}</b> \xB7 ${esc(String(v.count))} ${tr6("Zeilen", "rows")} \xB7 ${tr6("importiert", "imported")} ${esc(String(v.at).slice(0, 10))}
        <button type="button" class="ghost danger" data-del="${esc(y)}">${tr6("Entfernen", "Remove")}</button></li>`).join("")}</ul>` : `<p class="muted">${tr6("Noch kein Jahr importiert.", "No year imported yet.")}</p>`}
    </section>
    <section class="panel vt-step"><h2>${tr6("Passphrase \xE4ndern", "Change the passphrase")}</h2>
      <p class="muted">${tr6("Die Zeilen bleiben, wie sie sind; nur der Schl\xFCssel wird neu verschlossen.", "The rows stay as they are; only the key is locked anew.")}</p>
      <div class="fin-grid">${passField("vtOld", tr6("Bisherige Passphrase", "Current passphrase"), "current-password")}${passField("vtN1", tr6("Neue Passphrase", "New passphrase"), "new-password")}${passField("vtN2", tr6("Neue wiederholen", "Repeat the new one"), "new-password")}</div>
      <p class="fin-err" id="vtErr" role="alert" hidden></p>
      <p class="vt-row"><button type="button" class="primary" id="vtChange">${tr6("Passphrase \xE4ndern", "Change the passphrase")}</button></p></section>`;
  box.querySelectorAll("[data-del]").forEach((b) => (
    /** @type {HTMLElement} */
    b.onclick = () => removeYear(
      /** @type {HTMLElement} */
      b.dataset.del || ""
    )
  ));
  $("vtChange").onclick = async () => {
    const v = (id) => (
      /** @type {HTMLInputElement} */
      $(id).value
    ), err = $("vtErr"), say = (t2) => {
      err.hidden = false;
      err.textContent = t2;
    };
    if (!passphraseOk(v("vtN1"))) return say(tr6("Bitte mindestens 16 Zeichen.", "Please at least 16 characters."));
    if (v("vtN1") !== v("vtN2")) return say(tr6("Die beiden neuen Eingaben stimmen nicht \xFCberein.", "The two new entries don't match."));
    try {
      const envelope = await changePassphrase(info.key, v("vtOld"), v("vtN1"));
      await api("/api/vault/key", { method: "PUT", body: { key: envelope, replace: true, prevWrapped: info.key.wrapped } });
      info = await api("/api/vault");
      await openVault(info.key, v("vtN1"));
      toast(tr6("Passphrase ge\xE4ndert.", "Passphrase changed."));
      start();
    } catch (e) {
      say(e.message === "wrong-passphrase" ? tr6("Die bisherige Passphrase stimmt nicht.", "The current passphrase is not right.") : e.message);
    }
  };
}
function removeYear(y) {
  dialog(
    `<h2>${tr6(`${esc(y)} aus dem Tresor entfernen?`, `Remove ${esc(y)} from the vault?`)}</h2>
    <p>${tr6("Die Zeilen dieses Jahres werden gel\xF6scht. Zur Best\xE4tigung das Jahr eintippen:", "This year's rows are deleted. Type the year to confirm:")}</p>
    <label class="fld">${tr6("Jahr", "Year")}<input type="text" inputmode="numeric" data-y></label>
    <div class="dlg-foot"><button type="button" data-no>${tr6("Abbrechen", "Cancel")}</button><button type="button" class="primary danger" data-ok>${tr6("Entfernen", "Remove")}</button></div>`,
    (box, close) => {
      box.querySelector("[data-no]").onclick = () => close();
      box.querySelector("[data-ok]").onclick = async () => {
        const typed = (
          /** @type {HTMLInputElement} */
          box.querySelector("[data-y]").value.trim()
        );
        try {
          await api(`/api/vault/years/${encodeURIComponent(y)}`, { method: "DELETE", body: { confirm: Number(typed) } });
          close();
          toast(tr6("Entfernt.", "Removed."));
          start();
        } catch (e) {
          toast(e.message, 5e3);
        }
      };
    }
  );
}
if (window.top !== window.self) document.body.textContent = "";
else start();
