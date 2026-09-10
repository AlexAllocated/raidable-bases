# Creator Layouts: First Live Batch

Deployed 2026-09-10 on Always Rainy, Rust protocol 2633. These imports use the purchased FORTIFY native exporter with documented compatibility adjustments, not reconstructed AI floorplans.

## Available Layouts

Use `/rbe` for balanced random selection, or `/rbe TEMPLATE` for a specific layout.

| Template | Design | Creator / uploader | Saved entities | Stocked boxes | TC upkeep (hours) |
| --- | --- | --- | ---: | ---: | ---: |
| `meta_ew_2x2` | [2x2 Starter](https://www.corrosionhour.com/how-to-build-a-simple-2x2-starter-base-design/) | Evil Wurst | 157 | 18 | 128 |
| `meta_ew_thrifty_scot` | [Thrifty Scot 2](https://rustbasefinder.com/base_id/68) | Evil Wurst | 118 | 14 | 184 |
| `meta_rd_norseman` | [NorseMan](https://rustbasefinder.com/base_id/62) | Rust Daddy | 144 | 15 | 212 |
| `meta_ws_3571906373` | [Western Saloon - Roleplay Base](https://steamcommunity.com/sharedfiles/filedetails/?id=3571906373) | Bahamut | 423 | 3 | 41 |
| `meta_ws_2026082180` | [House for Three](https://steamcommunity.com/sharedfiles/filedetails/?id=2026082180) | SKIROW | 245 | 11 | 51 |
| `meta_ws_2850494914` | [Simple_Solo_1](https://steamcommunity.com/sharedfiles/filedetails/?id=2850494914) | Battle Grandma | 37 | 6 | 751 |
| `meta_ws_2843258636` | [RWPVP Easy#1](https://steamcommunity.com/sharedfiles/filedetails/?id=2843258636) | jlee2834 | 58 | 11 | 385 |
| `meta_ws_1192110102` | [Mega Starter](https://steamcommunity.com/sharedfiles/filedetails/?id=1192110102) | Itchy_Nuts | 41 | 5 | 636 |

## Behavior

- Random selection has 20 templates in 11 layout families: 8 new layouts plus twelve existing third-party variants in three families. A 1,300-selection runtime test verified family cycling, variant cycling, exclusions and explicit-name spawning.
- Stocked TCs, modest resource/component/tool/ammunition loot, furnace fuel/ore and food where the layout has suitable containers. Bundled vehicles and author lock codes are removed.
- Permanent, saved entities; no raid bubble or timed despawn. Decay protection until TC interaction/destruction and per-base uniform skin selection remain enabled.
- Normal stability, ground-footprint checks and protection against clearing surrounding trees/resources remain enabled.
- Low idle FPS no longer blocks empty-server profile initialization indefinitely. Actual square/triangle foundations determine placement, not entrance steps.

## Compatibility Adjustments

Floorplans were not redesigned. Unsupported lighting/loose props were omitted from Thrifty Scot and the saloon; two buried optional benches were omitted from Simple Solo. The saloon received more wood after its actual TC cost exceeded the initial stock. Exact omissions and resulting hashes are recorded in sources.json. Garrison remains excluded: its unsupported first-floor furnishings still failed after an attempted height correction.

## Verification and Limits

39 native exports were produced. Twenty-one candidates were checked in the actual current Rust runtime; 8 were selected and each then spawned on real ground through Raidable Bases, inspected and removed. Integration verified persistence flags, normal stability, stocked loot, TC building coverage and at least 24 hours of upkeep, consistent skins, no buried containers, and decay protection. Every test placement was removed without deleting pre-existing player/world bases.

Fixture checks covered missing prefabs, duplicate structure, structural collapse, and regular-furnace clearance from floors/foundations. Ground-door existence and nearby frames were checked; straight-line passage samples are diagnostics, not proof of a navigable route. These tests are **not a complete player walkthrough of every room, ladder, roof or electrical circuit**. The catalogue marks these as live trials rather than claiming exhaustive gameplay certification. Electrical automation, signs and vending offers are not guaranteed by a geometry import.

Eleven checked imports remain rejected, including Garrison and the shop/furnace-building exports that lost storage. Two others passed basic structure checks but remain held for access/mechanics review. Other rejected imports include Mini Fort (collapse/missing amenities), El Padre (missing grille/hatch pieces), and Workshop layouts with missing deployables or collapse. The 160 research records are not 160 playable bases.

All 32 retired AI-authored layouts remain removed from templates and random selection. Creator payloads and converted saves stay outside this public repository; attribution metadata is published here without assuming redistribution permission.
