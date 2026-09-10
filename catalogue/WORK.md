# Always Rainy Catalogue Expansion

## Requirements
- 32 original layouts, grouped by architectural family rather than cosmetics.
- Reachable TC, secure entrance, sleeping space, workbench, furnaces and storage.
- Furnishings and loot sized to purpose; no vehicles, NPCs or powered devices pretending to work.
- Consistent existing per-base skins; permanent bases and TC-triggered decay unchanged.
- Preserve all existing player-placed bases and legacy templates.

## Progress
- [x] Existing Copy Paste schema and selection code inspected.
- [x] Construction and furnishing primitives checked against server prefabs.
- [x] Original floorplans and deterministic export implemented.
- [x] Static geometry, room connectivity and furnishing checks pass.
- [x] Initial six layouts pass server-side checks (including a two-floor home).
- [x] All 32 layouts pass native entity counts, furnishing support and sampled room routes.
- [x] Profiles and family rotation deployed; isolated test area verified empty.
- [x] Permanent-mode environment clearing disabled; legacy large families quarantined after player feedback.
- [x] v3.2.2 relaxes permanent placement: uniform height fit, actual monument bounds,
  and trunk-aware checks. Live read-only sampling accepted 74/100 nearby layout/site
  combinations, including 52 above the old 1m variation limit and 36 using a lift.
  Verified uniform whole-base movement, unchanged data on rejection, and continued
  outside-map, unsupported, water and tree-trunk rejection. No test bases spawned.
- [x] Documentation and desktop/mobile-checked floorplan previews complete.

The full world-location integration spawn was not run: the first request was
refused during grid initialization, then further spawns were paused after player
feedback. Native fixture validation and installed selection/obstruction tests
passed; no player walkthrough or door-swing acceptance test is claimed.

No full player walkthrough is claimed by automated validation.
