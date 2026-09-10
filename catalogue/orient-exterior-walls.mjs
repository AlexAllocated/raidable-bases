import {readFile, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

const wallNames = new Set(['wall', 'wall.doorway', 'wall.window', 'wall.half']);
const tileNames = new Set(['foundation', 'foundation.triangle', 'floor', 'floor.triangle', 'floor.frame', 'floor.triangle.frame']);
const turn = (x, z, angle) => ({x: Math.cos(angle) * x + Math.sin(angle) * z, z: -Math.sin(angle) * x + Math.cos(angle) * z});
const upright = angle => Math.abs(Math.sin(angle)) < .001 && Math.cos(angle) > .999;

export function exteriorWalls(entities) {
    const parts = entities.map((entity, index) => ({
        entity, index, name: entity.prefabname.split('/').at(-1).replace('.prefab', ''),
        p: Object.fromEntries(Object.entries(entity.pos).map(([k, v]) => [k, Number(v)])),
        yaw: Number(entity.rot.y), upright: upright(Number(entity.rot.x)) && upright(Number(entity.rot.z))
    }));
    const tiles = parts.filter(p => tileNames.has(p.name) && p.upright);
    const barriers = parts.filter(p => (wallNames.has(p.name) || p.name === 'wall.frame' || p.name === 'wall.low') && p.upright);
    function surrounded(point, height) {
        const cross = (a, b) => a.x * b.z - a.z * b.x;
        return Array.from({length: 8}, (_, i) => turn(1, 0, i * Math.PI / 4)).every(ray => barriers.some(wall => {
            const wallHeight = wall.name === 'wall.half' ? 1.5 : wall.name === 'wall.low' ? 1 : 3;
            if (height < wall.p.y + .05 || height > wall.p.y + wallHeight - .05) return false;
            const offset = turn(0, -1.5, wall.yaw), edge = turn(0, 3, wall.yaw);
            const delta = {x: wall.p.x + offset.x - point.x, z: wall.p.z + offset.z - point.z};
            const denominator = cross(ray, edge);
            if (Math.abs(denominator) < .00001) return false;
            const distance = cross(delta, edge) / denominator, fraction = cross(delta, ray) / denominator;
            return distance > .02 && fraction >= -.005 && fraction <= 1.005;
        }));
    }
    function occupied(point, height) {
        return tiles.some(tile => {
            if (Math.abs(tile.p.y - height) > .16) return false;
            const local = turn(point.x - tile.p.x, point.z - tile.p.z, -tile.yaw);
            // Native Rust triangle origin is the middle of its back edge, not its centroid.
            return tile.name.includes('triangle')
                ? local.z > .025 && local.z < 3 * Math.sqrt(3) / 2 - .025 && Math.abs(local.x) < 1.5 - local.z / Math.sqrt(3) - .025
                : Math.abs(local.x) < 1.475 && Math.abs(local.z) < 1.475;
        });
    }
    const side = counts => counts[0] === 3 && counts[1] === 0 ? -1 : counts[1] === 3 && counts[0] === 0 ? 1 : 0;
    return parts.filter(p => wallNames.has(p.name) && p.upright).map(wall => {
        const count = (sign, height) => [-.9, 0, .9].filter(z => {
            const offset = turn(sign * .45, z, wall.yaw);
            return occupied({x: wall.p.x + offset.x, z: wall.p.z + offset.z}, height);
        }).length;
        const bottom = [count(-1, wall.p.y), count(1, wall.p.y)];
        const top = [count(-1, wall.p.y + (wall.name === 'wall.half' ? 1.5 : 3)), count(1, wall.p.y + (wall.name === 'wall.half' ? 1.5 : 3))];
        const below = side(bottom), above = side(top);
        // Require a whole tile edge on just one side; conflicting levels and interior partitions are left alone.
        let interior = below && (!above || below === above) ? below : !below && above ? above : 0;
        if (interior) {
            const empty = turn(-interior * .45, 0, wall.yaw);
            // A floorless stairwell/shaft is not an exterior face. Conservatively leave surrounded gaps alone.
            if (surrounded({x: wall.p.x + empty.x, z: wall.p.z + empty.z}, wall.p.y + (wall.name === 'wall.half' ? .75 : 1.5))) interior = 0;
        }
        // DirectionProperties.IsWeakspot uses the side opposite worldForward: native wall local -X.
        return {index: wall.index, bottom, top, interior, flip: interior === 1};
    });
}

export function orientExteriorWalls(entities) {
    const changes = exteriorWalls(entities).filter(w => w.flip);
    for (const {index} of changes) {
        const rot = entities[index].rot;
        rot.y = String((Number(rot.y) + Math.PI) % (2 * Math.PI));
    }
    return changes;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const write = process.argv.includes('--write');
    for (const file of process.argv.slice(2).filter(arg => arg !== '--write')) {
        const data = JSON.parse(await readFile(file, 'utf8'));
        const changes = orientExteriorWalls(data.entities);
        if (write && changes.length) await writeFile(file, JSON.stringify(data, null, 2) + '\n');
        console.log(JSON.stringify({file, reversedExteriorWalls: changes.length, written: write && changes.length > 0}));
    }
}
