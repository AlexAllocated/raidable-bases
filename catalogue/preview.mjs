import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { roles } from './designs.mjs';
const dir = fileURLToPath(new URL('./dist/', import.meta.url));
const designs = JSON.parse(await readFile(`${dir}manifest.json`, 'utf8'));
const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const colors = { A: '#e7bd65', H: '#eff2f3', T: '#d08791', W: '#91b5d4', F: '#dfa18a', S: '#b4a2cc', B: '#a4c7b5', K: '#c0ce94', R: '#91b5d4', E: '#91b5d4', M: '#91b5d4', L: '#cedad6', P: '#9cbd80', G: '#c6cbd2', C: '#dce9de', D: '#dce9de', U: '#bcc8cf' };
function plan(d, level) {
  const rows = d.floors[level], width = Math.max(...rows.map(r => r.length));
  const scale = 30, pad = 16;
  const X = x => (x + d.center.x + 1.5) * scale + pad;
  const Z = z => (z + d.center.z + 1.5) * scale + pad;
  let svg = `<svg viewBox="0 0 ${width * 90 + pad * 2} ${rows.length * 90 + pad * 2}" role="img" aria-label="${escape(d.name)} floor ${level + 1}">`;
  rows.forEach((row, z) => [...row].forEach((role, x) => {
    if (role === '.') return;
    svg += `<rect x="${x * 90 + pad}" y="${z * 90 + pad}" width="90" height="90" fill="${colors[role]}" stroke="#fff" stroke-width=".7"/>`;
    svg += `<text x="${x * 90 + pad + 8}" y="${z * 90 + pad + 17}" fill="#26363e" font-size="13" font-weight="700">${role}</text>`;
    if (role === 'U') for (let i = 0; i < 7; i++) svg += `<path d="M${x * 90 + pad + 12 + i * 9} ${z * 90 + pad + 34}v40" stroke="#526773" stroke-width="2"/>`;
  }));
  for (const f of d.furniture.filter(f => f.level === level)) {
    const b = f.box;
    svg += `<rect x="${X(b.minX)}" y="${Z(b.minZ)}" width="${(b.maxX - b.minX) * scale}" height="${(b.maxZ - b.minZ) * scale}" rx="2" fill="#ffffffaa" stroke="#4c5b65" stroke-width="1.4"><title>${escape(f.kind)}</title></rect>`;
    const cx = X(f.x), cz = Z(f.z), dx = Math.sin(f.yaw * Math.PI / 180), dz = Math.cos(f.yaw * Math.PI / 180);
    svg += `<path d="M${cx} ${cz}l${dx * 9} ${dz * 9}" stroke="#4c5b65" stroke-width="1.2"/>`;
  }
  for (const e of d.edges.filter(e => e.y === level * 3)) {
    const x = X(e.x), z = Z(e.z), horizontal = Math.abs(e.yaw) === 90;
    const segment = (a, b, color, thick) => `<path d="M${horizontal ? x + a : x} ${horizontal ? z : z + a}L${horizontal ? x + b : x} ${horizontal ? z : z + b}" stroke="${color}" stroke-width="${thick}"/>`;
    if (['door', 'garage', 'doubleDoor'].includes(e.type)) {
      const gap = e.type === 'door' ? 17 : 37;
      svg += segment(-45, -gap, '#24333b', 4) + segment(gap, 45, '#24333b', 4) + segment(-gap, gap, '#ba6940', 1.5);
    } else svg += segment(-45, 45, e.type === 'window' ? '#2b8493' : '#24333b', e.type === 'half' ? 2 : 4);
  }
  return svg + '</svg>';
}
const families = [...new Set(designs.map(d => d.family))];
const cards = designs.map(d => `<article data-family="${escape(d.family)}"><header><div><h2>${escape(d.name)}</h2><code>/rbe ${d.id}</code></div><span class="tier">T${d.tier}</span></header><p>${escape(d.story)}</p><div class="plans">${d.floors.map((_, i) => `<figure>${plan(d, i)}<figcaption>${i === 0 ? 'Ground floor' : 'Upper floor'}</figcaption></figure>`).join('')}</div><footer>${d.foundations} foundations · ${d.entities} entities before locks · ${d.amenities.furnace} furnaces · ${d.amenities.bag} sleeping bags</footer></article>`).join('');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Always Rainy | Base Catalogue</title><style>
*{box-sizing:border-box}body{margin:0;background:#f2f4f5;color:#1e2a32;font:15px system-ui,sans-serif;letter-spacing:0}main{max-width:1540px;margin:auto;padding:28px}h1{font-size:30px;margin:0 0 6px}h2{font-size:20px;margin:0 0 5px}p{line-height:1.5}nav{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0}button{font:inherit;background:white;border:1px solid #abb8be;padding:8px 12px;cursor:pointer;border-radius:4px}button[aria-pressed=true]{background:#1e5e64;color:white;border-color:#1e5e64}.legend{display:flex;gap:10px 18px;flex-wrap:wrap;margin:18px 0 24px;font-size:12px}.legend b{display:inline-block;padding:3px 6px;margin-right:4px;color:#26363e}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,430px),1fr));gap:20px}article{border:1px solid #cbd4d8;background:white;border-radius:5px;padding:20px;min-width:0}article[hidden]{display:none}header{display:flex;justify-content:space-between;gap:8px}code{font-size:12px;overflow-wrap:anywhere;color:#506673}.tier{font-size:13px;border-top:3px solid #26826b;padding:5px}.plans{display:grid;gap:15px;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));min-height:210px}figure{margin:0;align-self:start}svg{display:block;width:100%;height:auto;max-height:400px}figcaption{font-size:12px;color:#56656f;text-align:center;margin:8px}footer{font-size:12px;line-height:1.6;border-top:1px solid #e0e5e7;padding-top:14px;margin-top:14px}article p{font-size:14px;min-height:42px;color:#53616a}@media(max-width:600px){main{padding:16px}article{padding:15px}.plans{grid-template-columns:1fr}}@media print{nav{display:none}article{break-inside:avoid}.grid{display:block}article{margin-bottom:20px}}
</style><main><h1>Always Rainy</h1><p>32 original base layouts · 8 architectural families</p><nav aria-label="Base families"><button aria-pressed="true" data-filter="all">All bases</button>${families.map(f => `<button aria-pressed="false" data-filter="${escape(f)}">${escape(f)}</button>`).join('')}</nav><div class="legend">${Object.entries(roles).map(([key, name]) => `<span><b style="background:${colors[key]}">${key}</b>${name}</span>`).join('')}</div><div class="grid">${cards}</div></main><script>document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('article').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.family!==button.dataset.filter)}));</script></html>`;
await writeFile(`${dir}/index.html`, html);
console.log(`${dir}index.html`);
