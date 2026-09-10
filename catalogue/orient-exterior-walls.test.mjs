import test from 'node:test';
import assert from 'node:assert/strict';
import {exteriorWalls, orientExteriorWalls} from './orient-exterior-walls.mjs';

const part = (name, x, y, z, yaw = 0) => ({prefabname: `assets/prefabs/building core/${name}/${name}.prefab`, pos: {x, y, z}, rot: {x: 0, y: yaw, z: 0}});
test('square perimeter uses local -X as soft side; correction is idempotent', () => {
    const entities = [part('foundation', 0, 0, 0), part('wall', 1.5, 0, 0), part('wall', -1.5, 0, 0)];
    assert.deepEqual(exteriorWalls(entities).map(w => w.flip), [false, true]);
    const positions = entities.map(e => structuredClone(e.pos));
    assert.equal(orientExteriorWalls(entities).length, 1);
    assert.equal(orientExteriorWalls(entities).length, 0);
    assert.deepEqual(entities.map(e => e.pos), positions);
});
test('triangle back edge and arbitrary whole-base rotation', () => {
    for (const angle of [0, .3, Math.PI / 3, Math.PI, 5.9]) {
        const entities = [part('foundation.triangle', 12, 0, -7, angle), part('wall', 12, 0, -7, angle - Math.PI / 2)];
        assert.equal(exteriorWalls(entities)[0].flip, true);
        orientExteriorWalls(entities);
        assert.equal(exteriorWalls(entities)[0].flip, false);
    }
});
test('interior partitions, unsupported walls and conflicting stories stay unchanged', () => {
    const interior = [part('foundation', -1.5, 0, 0), part('foundation', 1.5, 0, 0), part('wall', 0, 0, 0)];
    assert.equal(orientExteriorWalls(interior).length, 0);
    assert.equal(orientExteriorWalls([part('wall', 0, 0, 0)]).length, 0);
    assert.equal(orientExteriorWalls([part('foundation', 1.5, 0, 0), part('floor', -1.5, 3, 0), part('wall', 0, 0, 0)]).length, 0);
});
test('half-wall height, nonstructural entities and tilted walls', () => {
    const entities = [part('floor', 1.5, 1.5, 0), part('wall.half', 0, 0, 0), part('wall.low', 0, 0, 0)];
    assert.deepEqual(orientExteriorWalls(entities).map(w => w.index), [1]);
    const tilted = part('wall', 0, 0, 0); tilted.rot.z = Math.PI;
    assert.equal(orientExteriorWalls([part('foundation', 1.5, 0, 0), tilted]).length, 0);
});
test('floorless enclosed shaft is not mistaken for outdoors', () => {
    const entities = [part('foundation', 1.5, 0, 0), part('wall', 0, 0, 0), part('wall', -3, 0, 0), part('wall', -1.5, 0, 1.5, Math.PI / 2), part('wall', -1.5, 0, -1.5, Math.PI / 2)];
    assert.equal(exteriorWalls(entities)[0].interior, 0);
    assert.equal(orientExteriorWalls(entities).length, 0);
});
