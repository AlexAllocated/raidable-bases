import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { designs, roles } from './designs.mjs';
import { paths } from './primitives.mjs';

const root = fileURLToPath(new URL('./', import.meta.url));
const measured = JSON.parse(await readFile(`${root}prefab-bounds.json`, 'utf8'));
const bounds = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, measured.find(b => b.path === path)]));
const itemDefinitions = JSON.parse(await readFile(`${root}item-definitions.json`, 'utf8'));
const output = process.argv[2] ?? `${root}dist`;
await mkdir(`${output}/copypaste`, { recursive: true });
const directions = [[1, 0, 0], [0, 1, -90], [-1, 0, 180], [0, -1, 90]];
const openRoles = new Set(['C', 'D', 'P']);
const round = n => Number(n.toFixed(5));
const coord = (x, y, z) => ({ x: String(round(x)), y: String(round(y)), z: String(round(z)) });
const cellKey = (x, z, level = 0) => `${level}:${x}:${z}`;
const edgeKey = (a, b) => [a.key, b.key].sort().join('|');
const hash = text => [...text].reduce((n, c) => Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
const intersects = (a, b, margin = 0) => a.maxX + margin > b.minX && b.maxX + margin > a.minX && a.maxZ + margin > b.minZ && b.maxZ + margin > a.minZ;
const manifest = [];
const templates = new Map();

for (const design of designs) {
  const errors = [], entities = [], furniture = [], edges = [], doors = [], waypoints = [];
  const cells = new Map();
  design.floors.forEach((rows, level) => rows.forEach((row, z) => [...row].forEach((role, x) => {
    if (role !== '.') {
      if (!roles[role]) throw Error(`${design.id}: unknown room ${role}`);
      cells.set(cellKey(x, z, level), { x, z, level, role, key: cellKey(x, z, level), exits: [], walls: [] });
    }
  })));
  const ground = [...cells.values()].filter(c => c.level === 0);
  const centerX = ground.reduce((n, c) => n + c.x * 3, 0) / ground.length;
  const centerZ = ground.reduce((n, c) => n + c.z * 3, 0) / ground.length;
  const xz = c => [c.x * 3 - centerX, c.z * 3 - centerZ];
  const parents = new Map([...cells.keys()].map(k => [k, k]));
  const find = key => parents.get(key) === key ? key : find(parents.get(key));
  const union = (a, b) => { parents.set(find(a), find(b)); };
  const adjacencies = [];
  for (const c of cells.values()) {
    for (const [dx, dz, yaw] of directions.slice(0, 2)) {
      const other = cells.get(cellKey(c.x + dx, c.z + dz, c.level));
      if (!other) continue;
      const e = { a: c, b: other, dx, dz, yaw, key: edgeKey(c, other), open: c.role === other.role || openRoles.has(c.role) && openRoles.has(other.role) };
      if (c.role === 'U' || other.role === 'U') {
        const stair = c.role === 'U' ? c : other, neighbor = stair === c ? other : c;
        const hasAbove = cells.has(cellKey(stair.x, stair.z, stair.level + 1));
        e.open = hasAbove ? neighbor.x === stair.x && neighbor.z === stair.z + 1 : neighbor.x === stair.x - 1 && neighbor.z === stair.z;
        e.stairBlocked = !e.open;
      }
      if (e.open) union(c.key, other.key);
      adjacencies.push(e);
    }
    if (c.level > 0 && c.role === 'U') {
      const below = cells.get(cellKey(c.x, c.z, c.level - 1));
      if (below?.role !== 'U') errors.push(`Unsupported staircase ${c.key}`);
      else union(c.key, below.key);
    }
  }
  // Connect room groups through passages first; remaining adjacencies stay solid.
  adjacencies.sort((a, b) => {
    const weight = e => ['H', 'A', 'U', 'C'].includes(e.a.role) || ['H', 'A', 'U', 'C'].includes(e.b.role) ? 0 : ['T', 'S', 'B'].includes(e.a.role) && ['T', 'S', 'B'].includes(e.b.role) ? 1 : 5;
    return weight(a) - weight(b) || hash(design.id + a.key) - hash(design.id + b.key);
  });
  for (const e of adjacencies) if (!e.stairBlocked && find(e.a.key) !== find(e.b.key)) { e.door = true; union(e.a.key, e.b.key); }
  if (new Set([...cells.keys()].map(find)).size !== 1) errors.push('Disconnected floorplan');
  const entryChoices = [];
  for (const c of ground.filter(c => c.role === 'A')) for (const [dx, dz, yaw] of directions)
    if (!cells.has(cellKey(c.x + dx, c.z + dz))) entryChoices.push({ c, dx, dz, yaw });
  entryChoices.sort((a, b) => b.dz - a.dz || b.c.z - a.c.z || a.c.x - b.c.x);
  const entry = entryChoices[0];
  if (!entry) errors.push('No exterior airlock entrance');

  function add(kind, x, y, z, yaw = 0, grade, extra = {}) {
    if (!bounds[kind]?.valid) throw Error(`Unknown native prefab: ${kind}`);
    const e = { prefabname: paths[kind], pos: coord(x, y, z), rot: coord(0, yaw * Math.PI / 180, 0), skinid: 0, ...extra };
    if (grade != null) e.grade = grade;
    entities.push(e);
    return e;
  }
  const cellGrade = c => {
    if (design.tier === 3 && ['T', 'S'].includes(c.role)) return c.role === 'T' ? 4 : 3;
    if (design.tier >= 2 && c.role === 'T') return 3;
    if (design.tier === 1 && ['K', 'F', 'B'].includes(c.role)) return 1;
    return 2;
  };
  for (const c of cells.values()) {
    const [x, z] = xz(c), y = c.level * 3;
    if (c.level === 0) add('foundation', x, y, z, 0, cellGrade(c));
    else if (c.role !== 'U') add('floor', x, y, z, 0, cellGrade(c));
    if (!openRoles.has(c.role) && !cells.has(cellKey(c.x, c.z, c.level + 1))) add('floor', x, y + 3, z, 0, cellGrade(c));
    if (c.role === 'U' && cells.has(cellKey(c.x, c.z, c.level + 1))) add('stairs', x, y, z, 0, 2);
    if (c.role !== 'U') waypoints.push({ x: round(x), y: round(y + .15), z: round(z), role: c.role, key: c.key });
  }
  if (entry) {
    const [x, z] = xz(entry.c);
    add('ramp', x + entry.dx * 4.5, -.8, z + entry.dz * 4.5, Math.atan2(entry.dz, -entry.dx) * 180 / Math.PI, 2);
  }
  function wall(c, dx, dz, yaw, type, other = null) {
    const [cx, cz] = xz(c), x = cx + dx * 1.5, z = cz + dz * 1.5, y = c.level * 3;
    const grade = Math.max(cellGrade(c), other ? cellGrade(other) : 0);
    const structural = type === 'door' ? 'doorway' : type === 'garage' || type === 'doubleDoor' ? 'frame' : type;
    add(structural, x, y, z, yaw, grade);
    edges.push({ x, z, y, yaw, type });
    if (['door', 'doubleDoor', 'garage'].includes(type)) {
      const doorType = type === 'door' && c.role === 'T' && design.tier === 3 ? 'armoredDoor' : type;
      add(doorType, x, y, z, yaw, null, { items: [], lock: { code: '', prefabname: 'assets/prefabs/locks/keypad/lock.code.prefab' } });
      doors.push({ x, y, z, yaw, type: doorType });
    }
    if (type === 'window') add(design.tier >= 2 ? 'glass' : 'bars', x, y + 1, z, yaw);
  }
  for (const e of adjacencies) {
    if (e.open || e.door) {
      e.a.exits.push([e.dx, e.dz, e.open]); e.b.exits.push([-e.dx, -e.dz, e.open]);
      if (e.door) {
        const type = ['G', 'F'].includes(e.a.role) || ['G', 'F'].includes(e.b.role) ? 'garage' : 'door';
        wall(e.a, e.dx, e.dz, e.yaw, type, e.b);
      }
    } else {
      e.a.walls.push([e.dx, e.dz]); e.b.walls.push([-e.dx, -e.dz]);
      wall(e.a, e.dx, e.dz, e.yaw, 'wall', e.b);
    }
  }
  for (const c of cells.values()) for (const [dx, dz, yaw] of directions) {
    if (cells.has(cellKey(c.x + dx, c.z + dz, c.level))) continue;
    const isEntry = entry?.c === c && entry.dx === dx && entry.dz === dz;
    const garageGate = c.role === 'G' && dz === 1;
    if (isEntry || garageGate) {
      c.exits.push([dx, dz]); wall(c, dx, dz, yaw, garageGate ? 'garage' : 'door');
      if (garageGate) { const [x, z] = xz(c); add('ramp', x, c.level * 3 - .8, z + 4.5, 90, 2); }
    }
    else {
      c.walls.push([dx, dz]);
      if (openRoles.has(c.role)) {
        // Low parapets keep upper decks safe without enclosing gardens in a roof.
        if (c.level > 0) wall(c, dx, dz, yaw, 'half');
      } else {
        const window = ['B', 'K', 'L', 'R'].includes(c.role) && hash(c.key + yaw + design.id) % 3 === 0;
        wall(c, dx, dz, yaw, window ? 'window' : 'wall');
      }
    }
  }

  const counts = {};
  function walkable(c, obstacles) {
    const [cx, cz] = xz(c), points = [];
    for (let ix = 0; ix < 11; ix++) for (let iz = 0; iz < 11; iz++) {
      const x = cx - 1 + ix * .2, z = cz - 1 + iz * .2;
      const standing = { minX: x - .45, maxX: x + .45, minZ: z - .45, maxZ: z + .45 };
      if (!obstacles.some(box => intersects(standing, box))) points.push({ x, z, ix, iz });
    }
    if (!points.length) return null;
    const allowed = new Map(points.map(p => [`${p.ix},${p.iz}`, p]));
    const atExit = (p, [dx, dz, wide]) => Math.abs(p.x - cx - dx) < (wide && !dx ? 1.01 : .21) && Math.abs(p.z - cz - dz) < (wide && !dz ? 1.01 : .21);
    const starts = points.filter(p => c.exits.length === 0 || atExit(p, c.exits[0]));
    if (!starts.length) return null;
    const seen = new Set(), queue = [starts[0]];
    while (queue.length) {
      const p = queue.shift(), key = `${p.ix},${p.iz}`;
      if (seen.has(key)) continue;
      seen.add(key);
      for (const [dx, dz] of directions) { const next = allowed.get(`${p.ix + dx},${p.iz + dz}`); if (next && !seen.has(`${next.ix},${next.iz}`)) queue.push(next); }
    }
    if (!c.exits.every(exit => points.some(p => seen.has(`${p.ix},${p.iz}`) && atExit(p, exit)))) return null;
    return points.filter(p => seen.has(`${p.ix},${p.iz}`)).sort((a, b) => (a.x - cx) ** 2 + (a.z - cz) ** 2 - (b.x - cx) ** 2 - (b.z - cz) ** 2)[0];
  }
  function footprint(kind, x, z, yaw) {
    const b = bounds[kind];
    const angle = yaw * Math.PI / 180, cos = Math.cos(angle), sin = Math.sin(angle);
    const cx = x + b.center.x * cos + b.center.z * sin;
    const cz = z - b.center.x * sin + b.center.z * cos;
    const sx = Math.abs(b.size.x * cos) + Math.abs(b.size.z * sin);
    const sz = Math.abs(b.size.x * sin) + Math.abs(b.size.z * cos);
    return { minX: cx - sx / 2, maxX: cx + sx / 2, minZ: cz - sz / 2, maxZ: cz + sz / 2 };
  }
  function place(c, kind, required = false, items = []) {
    const [cx, cz] = xz(c), b = bounds[kind];
    if (!b?.valid) throw Error(`Invalid furnishing ${kind}`);
    // Leave the doorway threshold clear; the path can bend around furnishings.
    const corridors = c.exits.filter(e => !e[2]).map(([dx, dz]) => ({ minX: cx + dx * 1.25 - (dx ? .3 : .45), maxX: cx + dx * 1.25 + (dx ? .3 : .45), minZ: cz + dz * 1.25 - (dz ? .3 : .45), maxZ: cz + dz * 1.25 + (dz ? .3 : .45) }));
    const options = [];
    for (const yaw of [0, 90, 180, 270]) {
      const base = footprint(kind, 0, 0, yaw);
      for (const x of [cx - 1.36 - base.minX, cx + 1.36 - base.maxX, cx - (base.minX + base.maxX) / 2])
        for (const z of [cz - 1.36 - base.minZ, cz + 1.36 - base.maxZ, cz - (base.minZ + base.maxZ) / 2]) {
          const box = footprint(kind, x, z, yaw);
          if (box.minX < cx - 1.361 || box.maxX > cx + 1.361 || box.minZ < cz - 1.361 || box.maxZ > cz + 1.361) continue;
          if (corridors.some(path => intersects(box, path))) continue;
          if (furniture.some(f => f.level === c.level && intersects(box, f.box, .06))) continue;
          const obstacles = furniture.filter(f => f.cell === c.key && f.kind !== 'bag').map(f => f.box);
          if (kind !== 'bag') obstacles.push(box);
          if (!walkable(c, obstacles)) continue;
          // Local +Z is the usable front for these deployables. Face into the room.
          const dx = Math.sin(yaw * Math.PI / 180), dz = Math.cos(yaw * Math.PI / 180);
          const facing = (cx - x) * dx + (cz - z) * dz;
          options.push({ x, z, yaw, box, score: facing + (hash(`${design.id}:${c.key}:${kind}:${yaw}`) % 10) / 100 });
        }
    }
    options.sort((a, b) => b.score - a.score);
    const chosen = options[0];
    if (!chosen) { if (required) errors.push(`Cannot fit ${kind} in ${c.key} (${c.role}) with clear exits`); return false; }
    add(kind, chosen.x, c.level * 3 + .12, chosen.z, chosen.yaw, null, { items });
    furniture.push({ kind, level: c.level, cell: c.key, x: chosen.x, z: chosen.z, yaw: chosen.yaw, box: chosen.box });
    counts[kind] = (counts[kind] ?? 0) + 1;
    return true;
  }
  let benchPlaced = false;
  for (const c of cells.values()) {
    switch (c.role) {
      case 'T': place(c, 'tc', true); place(c, 'smallBox'); break;
      case 'W': place(c, benchPlaced ? 'repair' : `bench${design.tier}`, !benchPlaced); benchPlaced = true; break;
      case 'F': for (let n = 0; n < 3; n++) place(c, 'furnace', n < 1); break;
      case 'S': place(c, 'box', true); place(c, 'box'); break;
      case 'B': place(c, 'bag', true); if (c.exits.length <= 1) place(c, 'smallBox'); break;
      case 'K': place(c, 'bbq', true); place(c, 'smallBox'); break;
      case 'R': place(c, 'research'); break;
      case 'E': place(c, 'repair'); break;
      case 'M': break;
      case 'L': place(c, 'chair'); place(c, 'chair'); place(c, 'smallBox'); break;
      case 'G': break;
    }
  }
  // A garage gets one shared locker, not one per foundation in its parking bay.
  const garageCells = new Set();
  for (const c of cells.values()) if (c.role === 'G' && !garageCells.has(c.key)) {
    const bay = [], queue = [c];
    while (queue.length) {
      const room = queue.shift();
      if (garageCells.has(room.key)) continue;
      garageCells.add(room.key); bay.push(room);
      for (const [dx, dz] of directions) {
        const next = cells.get(cellKey(room.x + dx, room.z + dz, room.level));
        if (next?.role === 'G' && !garageCells.has(next.key)) queue.push(next);
      }
    }
    bay.sort((a, b) => a.exits.length - b.exits.length || a.z - b.z);
    bay.some(room => place(room, 'locker'));
  }
  // The native mixing table is wider than one clear room; use the shared lab wall.
  const laboratories = new Set();
  for (const c of cells.values()) if (c.role === 'M' && !laboratories.has(c.key)) {
    const other = cells.get(cellKey(c.x + 1, c.z, c.level));
    if (other?.role !== 'M') { errors.push(`Mixing room needs a two-cell work wall: ${c.key}`); continue; }
    const [x1, z] = xz(c), [x2] = xz(other);
    const x = (x1 + x2) / 2, tableZ = z + .8;
    const box = footprint('mixing', x, tableZ, 0);
    if (![c, other].every(room => walkable(room, [box]))) errors.push('Mixing table blocks laboratory exits');
    add('mixing', x, c.level * 3 + .12, tableZ);
    furniture.push({ kind: 'mixing', level: c.level, cell: c.key, x, z: tableZ, yaw: 0, box });
    counts.mixing = (counts.mixing ?? 0) + 1;
    laboratories.add(c.key); laboratories.add(other.key);
  }
  // Planters span an adjacent pair of open growing cells; keep their outer walkways.
  const planted = new Set();
  for (const c of cells.values()) if (c.role === 'P' && !planted.has(c.key)) {
    const other = cells.get(cellKey(c.x + 1, c.z, c.level)) ?? cells.get(cellKey(c.x, c.z + 1, c.level));
    if (other?.role !== 'P' || planted.has(other.key)) continue;
    const [x1, z1] = xz(c), [x2, z2] = xz(other), yaw = c.x === other.x ? 90 : 0;
    const x = (x1 + x2) / 2, z = (z1 + z2) / 2;
    add('planter', x, c.level * 3 + .12, z, yaw);
    furniture.push({ kind: 'planter', level: c.level, cell: c.key, x, z, yaw, box: footprint('planter', x, z, yaw) });
    counts.planter = (counts.planter ?? 0) + 1;
    planted.add(c.key); planted.add(other.key);
  }
  // Small lights sit on actual storage surfaces, not suspended in space.
  for (const f of furniture.filter(f => ['box', 'smallBox'].includes(f.kind)).slice(0, Math.max(1, Math.floor(ground.length / 8)))) {
    add('lantern', f.x, f.level * 3 + .12 + bounds[f.kind].center.y + bounds[f.kind].size.y / 2, f.z);
    counts.lantern = (counts.lantern ?? 0) + 1;
  }
  if (counts.tc !== 1) errors.push('Must have exactly one TC');
  if ([...cells.values()].some(c => c.role === 'E') && !counts.repair) errors.push('Repair room has no usable repair bench');
  if ([...cells.values()].some(c => c.role === 'R') && !counts.research) errors.push('Research room has no usable research table');
  for (const c of cells.values()) if (!openRoles.has(c.role) && c.role !== 'U') {
    const point = walkable(c, furniture.filter(f => f.level === c.level && f.kind !== 'bag').map(f => f.box));
    if (!point) errors.push(`No navigable path through ${c.key}`);
    else { const waypoint = waypoints.find(p => p.key === c.key); waypoint.x = round(point.x); waypoint.z = round(point.z); }
  }
  if (!counts.furnace || !counts.bag || !benchPlaced) errors.push('Missing essential amenities');
  const unique = new Set();
  const supplies = Math.min(4, Math.ceil(ground.length / 6));
  const upkeep = { wood: supplies * 1000, stones: supplies * 2000, 'metal.fragments': supplies * design.tier * 500 };
  if (design.tier > 1) upkeep['metal.refined'] = supplies * (design.tier === 3 ? 20 : 10);
  function inventory(entries) {
    const result = [];
    for (const [name, total] of Object.entries(entries)) {
      const def = itemDefinitions[name];
      if (!def) throw Error(`Unknown item ${name}`);
      let left = total;
      // Export vanilla-sized stacks even when the test server allows bigger ones.
      const max = Math.min(def.stack, name === 'metal.refined' ? 100 : 1000);
      while (left > 0) { const amount = Math.min(left, max); result.push({ id: def.id, amount, position: result.length, skinid: 0 }); left -= amount; }
    }
    return result;
  }
  let boxIndex = 0;
  for (const e of entities) {
    if (e.prefabname === paths.tc) { e.items = inventory(upkeep); if (e.items.length > 24) errors.push('TC inventory exceeds capacity'); }
    if (e.prefabname === paths.furnace) e.items = inventory({ wood: 100 * design.tier });
    if (e.prefabname === paths.lantern) e.items = inventory({ lowgradefuel: 15 });
    if (e.prefabname === paths.box || e.prefabname === paths.smallBox) {
      const staples = design.family === 'Farm homes' ? ['seed.hemp', 'seed.corn', 'seed.pumpkin', 'cloth'] : ['cloth', 'scrap', 'wood', 'metal.ore'];
      const name = staples[boxIndex++ % staples.length];
      e.items = inventory({ [name]: (name.startsWith('seed.') ? 5 : name === 'scrap' ? 10 : 30) * design.tier });
    }
    if (e.prefabname === paths.bbq) e.items = inventory({ wood: 40 });
  }
  for (const e of entities) {
    const key = `${e.prefabname}:${JSON.stringify(e.pos)}:${JSON.stringify(e.rot)}`;
    if (unique.has(key)) errors.push(`Duplicate entity ${key}`);
    unique.add(key);
  }
  if (errors.length) { console.error(`${design.id}:\n${errors.join('\n')}`); continue; }
  const template = { default: { position: coord(0, 0, 0), rotationdiff: 0, rotationy: 0 }, entities };
  const entryPos = entry ? { x: xz(entry.c)[0] + entry.dx * 1.5, y: 0, z: xz(entry.c)[1] + entry.dz * 1.5, dx: entry.dx, dz: entry.dz } : null;
  const record = { ...design, foundations: ground.length, entities: entities.length, amenities: counts, upkeep, center: { x: centerX, z: centerZ }, entry: entryPos, edges, doors, furniture, waypoints };
  templates.set(design.id, template);
  manifest.push(record);
}
if (manifest.length !== designs.length) throw Error('Catalogue validation failed; no exports updated.');
for (const [id, template] of templates) await writeFile(`${output}/copypaste/${id}.json`, JSON.stringify(template, null, 2) + '\n');
await writeFile(`${output}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Generated ${manifest.length} original plans / ${manifest.reduce((n, d) => n + d.entities, 0)} entities. Static checks passed.`);
