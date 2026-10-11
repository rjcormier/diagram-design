// Builds Canvas-LMS-safe page HTML (no <script>/<style>; inline styles only) from the app's data.
const fs = require("fs"), path = require("path"), vm = require("vm");
const [,, appFile, outDir, appUrl = "APP_URL_HERE"] = process.argv;
const src = fs.readFileSync(appFile, "utf8");
const block = src.slice(src.indexOf("const EM = {"), src.indexOf("const OBJ_BY_ID"));
const ctx = {}; vm.createContext(ctx);
vm.runInContext(block.replace(/^const (EM|EM_URL|STRANDS|OBJ) =/gm, "this.$1 ="), ctx);
const {EM, EM_URL, STRANDS, OBJ} = ctx;
const LAB_TITLES = {mass:"Mass Lab",newsub:"Sort it: new substance or not?",cooling:"Cooling Cups Lab",forces:"Push Test: friction & mass",motion:"Distance–Time Graph Lab",levels:"Build the body ladder",systems:"Which system is it part of?",biotic:"Sort it: biotic or abiotic?",foodchain:"Food chain builder",populations:"Population Patterns",instinct:"Sort it: instinct or learned?",traits:"Sort it: inherited or acquired?",weather:"NC Weather Data Lab",pressure:"Barometer Forecast Lab",breeze:"Sea Breeze / Land Breeze Model",particles:"Particle Model",watercycle:"Sort it: heat added or removed?"};
const e = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const C = {pine:"#1d5a42", pineSoft:"#e1efe7", sky:"#2f7fb8", skySoft:"#e3f0fa", sun:"#8a5c00", sunSoft:"#fbf0d6", line:"#d5e0d8", ink:"#15241d", ink2:"#4a5c53"};
const box = (bg, extra="") => `style="background-color:${bg};border:1px solid ${C.line};border-radius:8px;padding:14px 16px;margin:0 0 16px 0;${extra}"`;
const h2 = t => `<h2 style="color:${C.pine};border-bottom:2px solid ${C.ink};padding-bottom:4px;margin-top:28px;">${t}</h2>`;
const url = id => `${appUrl}#${id}~embed`;

function page(o){
  const s = STRANDS.find(x => x.id === o.strand);
  let x = "";
  x += `<p style="font-size:0.85em;color:${C.ink2};letter-spacing:0.05em;text-transform:uppercase;margin:0;">${e(s.code)} · ${e(s.name)} · ${e(o.id)}</p>\n`;
  x += `<h2 style="color:${C.ink};margin-top:4px;">${e(o.big.split(". ")[0])}.</h2>\n`;
  x += `<p><strong>NC objective ${e(o.id)}:</strong> ${e(o.official)}</p>\n`;
  x += `<div style="background-color:${C.pine};color:#ffffff;border-radius:8px;padding:14px 16px;margin:0 0 16px 0;font-size:1.1em;"><strong>I can</strong> ${e(o.ican.replace(/^I can /,""))}</div>\n`;

  x += h2("Big idea") + `\n<p style="font-size:1.05em;">${e(o.big)}</p>\n<div ${box(C.pineSoft)}><strong>Key ideas</strong><ul>${o.keys.map(k => `<li>${e(k)}</li>`).join("")}</ul></div>\n`;

  x += h2("Interactive lab") + `\n<p>${o.labs.map(l => `<strong>${e(LAB_TITLES[l])}</strong>`).join(" and ")}. Complete the lab below, then come back to this page.</p>\n`;
  x += `<p><iframe style="width:100%;height:900px;border:1px solid ${C.line};border-radius:8px;" title="${e(o.id)} interactive lab" src="${url(o.id)}" width="100%" height="900" loading="lazy" allowfullscreen="allowfullscreen"></iframe></p>\n`;
  x += `<p style="font-size:0.9em;">Lab not showing? <a href="${url(o.id)}" target="_blank" rel="noopener">Open the lab in a new tab</a>.</p>\n`;

  x += h2("Read &amp; explore") + `\n<p>Read with a purpose. Write your answer to the <strong>Read for</strong> question in your science notebook.</p>\n`;
  x += o.reads.map(r => `<div ${box(C.skySoft)}><p style="margin:0;font-size:0.8em;text-transform:uppercase;letter-spacing:0.06em;color:${C.sky};">${e(r.kind)}</p><h3 style="margin:4px 0;"><a href="${e(r.url)}" target="_blank" rel="noopener">${e(r.title)}</a></h3><p style="margin:0 0 6px 0;font-size:0.9em;color:${C.ink2};">${e(r.src)}</p><p style="margin:0 0 6px 0;font-size:0.95em;">${e(r.find)}</p><p style="margin:0;border-left:4px solid #b97c0e;padding-left:10px;"><strong>Read for:</strong> ${e(r.purpose)}</p></div>`).join("\n") + "\n";

  if(o.math){
    x += h2("Math connection: Eureka Math²") + `\n<div ${box(C.sunSoft)}><p>${e(o.math.why)}</p><ul>${o.math.mods.map(m => `<li><strong>${e(EM[m].split(" · ")[0])}:</strong> ${e(EM[m].split(" · ")[1])}</li>`).join("")}</ul><p style="font-size:0.9em;">${o.math.nc.map(e).join("<br>")}</p><div style="background-color:#ffffff;border:1px dashed #b97c0e;border-radius:6px;padding:10px 12px;"><strong>Worked example:</strong> ${o.math.example}</div><p style="font-size:0.9em;margin-bottom:0;"><a href="${EM_URL}" target="_blank" rel="noopener">Eureka Math² (Great Minds)</a>: your teacher will assign the matching lesson.</p></div>\n`;
  }

  x += h2("Science words") + `\n<p>Click a word to see what it means.</p>\n` + o.words.map(w => `<details style="border:1px solid ${C.line};border-radius:6px;padding:8px 12px;margin:0 0 6px 0;"><summary style="font-weight:bold;cursor:pointer;">${e(w[0])}</summary><p style="margin:6px 0 0 0;">${e(w[1])}</p></details>`).join("\n") + "\n";

  x += h2("Talk like a scientist") + `\n<p>Use these with a partner or in your notebook.</p>\n<ul>${o.stems.map(t => `<li style="margin-bottom:6px;">${e(t).replace(/___/g,"________")}</li>`).join("")}</ul>\n`;

  x += h2("Quick check") + `\n<p>Answer each question in your head or notebook, then click <strong>Check answer</strong>.</p>\n`;
  x += o.quiz.map((q,i) => `<div ${box("#ffffff")}><p style="margin-top:0;"><strong>${i+1}.</strong> ${e(q.q)}</p><ol type="A">${q.o.map(t => `<li>${e(t)}</li>`).join("")}</ol><details><summary style="cursor:pointer;color:${C.sky};">Check answer</summary><p style="margin:6px 0 0 0;"><strong>${String.fromCharCode(65+q.a)}. ${e(q.o[q.a])}</strong>: ${e(q.why)}</p></details></div>`).join("\n") + "\n";

  x += `<p style="font-size:0.8em;color:${C.ink2};margin-top:24px;">Aligned to the NC DPI Grade 5 Science 2023 Support Document (Aug 2025).</p>\n`;
  return `<div style="max-width:900px;color:${C.ink};line-height:1.5;">\n${x}</div>\n`;
}

function home(){
  let x = `<div style="max-width:900px;color:${C.ink};line-height:1.5;">\n<h2 style="color:${C.pine};">Tar Heel Science Lab: Grade 5 Science</h2>\n<p>Each objective has a big idea, readings, an interactive lab, science words, sentence starters, and a quick check. Objectives marked <strong>MATH</strong> connect to Eureka Math².</p>\n`;
  x += `<p><iframe style="width:100%;height:900px;border:1px solid ${C.line};border-radius:8px;" title="Tar Heel Science Lab" src="${appUrl}#home~embed" width="100%" height="900" loading="lazy"></iframe></p>\n`;
  STRANDS.forEach(s => { x += `<h3 style="color:${C.pine};margin-bottom:4px;">${e(s.code)} ${e(s.name)}</h3><ul>${OBJ.filter(o => o.strand===s.id).map(o => `<li><strong>${o.id}</strong> ${e(o.official)}${o.math?' <strong style="color:#8a5c00;">MATH</strong>':''}</li>`).join("")}</ul>\n`; });
  return x + `</div>\n`;
}

fs.mkdirSync(outDir, {recursive:true});
fs.writeFileSync(path.join(outDir, "00-course-home.html"), home());
OBJ.forEach(o => fs.writeFileSync(path.join(outDir, `${o.id}.html`), page(o)));
// browser preview of every Canvas page in one file (teacher review only)
const prev = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Canvas pages preview</title></head><body style="font-family:Verdana,sans-serif;background:#ffffff;margin:0;padding:16px;">` +
  [home(), ...OBJ.map(page)].map((p,i) => `<section style="border-bottom:6px solid #1d5a42;padding-bottom:24px;margin-bottom:24px;">${p}</section>`).join("") + `</body></html>`;
fs.writeFileSync(path.join(outDir, "_preview-all-pages.html"), prev);
console.log("wrote", OBJ.length + 2, "files to", outDir);
