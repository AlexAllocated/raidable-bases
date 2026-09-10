# Original Always Rainy Base Catalogue

32 distinct floorplans, four in each of eight families. Combined with the
server's existing 22 templates, this gives 54 stored templates. Ten old large
raid-oriented templates are temporarily excluded from random selection pending
review of reported entrance and furnace-clearance problems. The active pool has
44 templates across 11 families. Existing world bases and explicit named spawns
are retained; see `quarantine.json`.

Open `dist/index.html` in a browser for filterable floorplans, amenities and
named spawn commands. These are technical plans, not in-game screenshots.

## Design Scope

- Six to thirty ground foundations, with four two-floor designs.
- Locked entry paths, a stocked TC, size-appropriate workbench, storage,
  sleeping bags and one to five fueled ordinary furnaces.
- Purposeful utility spaces: research, repair, cooking, mixing, open growing
  plots, garage bays and courtyards where the floorplan has room for them.
- Larger group homes have tier-three workbenches and multiple sleeping spaces.
- Furnishings use measured native prefab bounds; entrances and walking routes
  take priority over cramming extra storage into a room.
- No fake powered equipment, NPCs, decorative vehicles or exploit bunkers.

TC supplies scale with footprint and tier. Storage contains basic supplies,
with additional randomized loot controlled by the generated profile. These are
finite inventories, not replenishing loot farms. Fuel is supplied but ovens
are not automatically left running. Growing plots are outdoor and unplanted.

The existing permanent-base, per-base skin and TC-triggered decay behavior is
unchanged. Garage bays vary in depth; a one-cell bay is a utility/bike space,
not a claim that every garage fits a long car.

Permanent-mode placement preserves the surrounding environment. Tree trunks,
resource nodes and world obstructions inside the footprint block placement
instead of being removed or moved; overhanging branches alone do not.
The building can lift up to 1.5m to fit uneven ground while retaining foundation
support. The permanent check uses monument bounds, not raid-event buffer circles.
This applies to legacy templates too, even if their optional profile check is off.

## Build

Run with Bun or a current Node.js release; no third-party packages are needed:

```sh
bun catalogue/generate.mjs
bun catalogue/validate.mjs
bun catalogue/preview.mjs
bun catalogue/package.mjs /path/to/backed-up/oxide /path/to/staging
```

`designs.mjs` is the authored layout source. Each character denotes a 3 m
foundation cell and room purpose. The exporter constructs walls, selected
connections, native L-stairs, furnishings and supplies deterministically.
`prefab-bounds.json` and `item-definitions.json` record the native definitions
used for validation, not bundled game assets.

The packaging step derives new profiles from the backed-up `RaidBases` profile
and preserves existing configuration while adding the eight family groups.
Review the generated configuration before deployment. It does not write the
permanent-base registry, old profiles or the world save. Install the fork's
updated `RaidableBases.cs` as well; stock upstream lacks its selection and
footprint-validation changes.

## Validation

Static checks cover unique plans, connected rooms, furnishings with clear
paths, supported upper floors, valid native prefabs and stocked inventories.
Live validation pastes one temporary fixture at a time and checks entity
counts, furnishing support and sampled routes with door colliders opened.
This is not a human walkthrough or proof of every door swing and client-side
interaction. The temporary server diagnostics are not production dependencies.

Use `/rbe ar_dogleg`, `/rbe ar_foundry`, `/rbe ar_grange` or
`/rbe ar_gatehouse` to request a particular design at your aim. `/rbe` includes
them in balanced random selection once the profiles and family configuration
are installed. A refused footprint leaves no partial base.
