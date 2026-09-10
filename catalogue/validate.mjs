import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { designs } from './designs.mjs';
import { paths } from './primitives.mjs';
const dir = fileURLToPath(new URL('./dist/', import.meta.url));
const manifest = JSON.parse(await readFile(`${dir}manifest.json`, 'utf8'));
assert.equal(manifest.length, 32);
assert.equal(new Set(manifest.map(d => d.id)).size, 32);
assert.equal(new Set(manifest.map(d => JSON.stringify(d.floors))).size, 32);
assert.equal(new Set(manifest.map(d => d.family)).size, 8);
for (const d of manifest) {
  assert.deepEqual(d.floors, designs.find(source => source.id === d.id).floors);
  assert.equal(manifest.filter(other => other.family === d.family).length, 4);
  const copy = JSON.parse(await readFile(`${dir}copypaste/${d.id}.json`, 'utf8'));
  assert.equal(copy.entities.length, d.entities);
  assert.equal(copy.entities.filter(e => e.prefabname === paths.tc).length, 1);
  const tc = copy.entities.find(e => e.prefabname === paths.tc);
  assert(tc.items.length > 0 && tc.items.length <= 24);
  assert(copy.entities.some(e => e.prefabname === paths[`bench${d.tier}`]));
  assert(d.amenities.furnace >= 1 && d.amenities.bag >= 1);
  for (const e of copy.entities) {
    assert(Object.values(paths).includes(e.prefabname));
    for (const axis of ['x', 'y', 'z']) assert(Number.isFinite(Number(e.pos[axis])) && Number.isFinite(Number(e.rot[axis])));
    if (e.items) { assert.equal(new Set(e.items.map(i => i.position)).size, e.items.length); for (const item of e.items) assert(item.amount > 0 && item.id !== 0); }
  }
  if (d.floors.length > 1) d.floors[1].forEach((row, z) => [...row].forEach((role, x) => {
    if (role !== '.') assert(d.floors[0][z]?.[x] && d.floors[0][z][x] !== '.', `${d.id}: unsupported upper floor`);
  }));
}
console.log('PASS: 32 unique plans, 8 balanced families, native prefabs, supported upper floors, essential amenities, valid stocked inventories.');
