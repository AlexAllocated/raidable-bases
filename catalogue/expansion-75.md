# 75-Family Catalogue

Deployed on Always Rainy on 2026-09-10: **75 distinct layout families, 84 selectable templates**. The nine extra files are variants in existing families, not nine additional designs. This release adds 64 creator-sourced families to the prior 11-family catalogue.

## Selection and Compatibility

Use `/rbe` for a random base at your aim, or `/rbe TEMPLATE` for an explicit choice. Families cycle without repeats until exhausted, then reshuffle. The live selection check exercised 600 choices across all 75 families and verified every explicit template name. It restored the pre-test selection history afterward.

These are native exports of creator FORTIFY saves, not reconstructed AI floorplans. A source inventory of 1,349 Workshop listings produced 363 native exports. Geometry and content screening left 278 staged candidates; 214 received current-server runtime checks and 94 ground-test attempts are recorded. Repeated uploads, named revisions and closely matching structures were grouped before choosing the 64 additions. The remaining candidates were not enabled.

Every addition passed checks for existing prefabs, retained structure, furnace clearance, ground doors and sampled passages, support recalculation, post-registration upgrades, saved entities, retained furnishings, stocked boxes, TC coverage/upkeep, uniform skins, and decay protection. Final TC quantities were checked against the native ground-test upkeep cost and provide at least 24 hours. Skin selection, TC interaction rules, permanent persistence and tree/terrain protections are unchanged. Existing world bases were not replaced.

These remain **live-trial layouts**: automated passage checks are not complete player walkthroughs of every room, ladder, roof or electrical circuit. Electrical automation is not certified. Imported vehicles and their associated fixtures were omitted; the floorplans were not redesigned. Exact source checksums, final template checksums, uploader IDs and omission records are in [expansion-sources.json](expansion-sources.json). Source files and private validation helpers are not redistributed in this repository.

All 97 recorded ground-test removals were checked for zero surviving registered entities. Temporary diagnostics and rejected staging files were removed from the live server.

## Exterior Wall Correction

The subsequent wall audit found reversed exposed walls in the exported templates. On 2026-09-10, 941 wall rotations across 50 active templates were corrected, along with 169 matching walls in 14 existing protected bases. The catalogue still contains 75 families / 84 templates. No layout positions, grades, skins, loot or TC stock were changed in the templates.

The audit uses native Rust wall soft-side direction (local -X), square/triangle tile footprints, floor and ceiling heights, and checks for enclosed floorless gaps. Interior partitions, conflicting levels and ambiguous cases are deliberately left unchanged. This is not an exhaustive certification of every wall or room.

`orient-exterior-walls.mjs` is the repeatable post-export check. Without `--write` it reports proposed corrections; with `--write` it updates only the affected wall yaw values. The import preparation process runs this before staging new candidates. [wall-orientation-corrections.json](wall-orientation-corrections.json) records entity indices and before/after checksums; the original creator-source checksums are retained separately.

Five focused geometry tests pass. Three native fixture repair tests and two corrected-template spawn tests passed; a native file audit verified all 941 corrected rotations. Final live verification accounted for 5,275 original entities and all 169 saved wall rotations, with no test fixtures left. One ceiling light lost its attachment during the live refresh and was restored from the pre-repair save, including its wire, with a 1 cm mounting adjustment. All other entity identities, transforms, health, grades and skins were preserved; affected-base inventory snapshots matched.

## Added Layouts

| Template | Creator save | Saved entities | Stocked boxes | TC hours |
| --- | --- | ---: | ---: | ---: |
| `meta_exp_2182221736` | [STARTER BASE 2 x 2](https://steamcommunity.com/sharedfiles/filedetails/?id=2182221736) | 54 | 11 | 371 |
| `meta_exp_2684811749` | [Improved 2x2](https://steamcommunity.com/sharedfiles/filedetails/?id=2684811749) | 124 | 18 | 108 |
| `meta_exp_2302929610` | [Solo base by Kesha_F1](https://steamcommunity.com/sharedfiles/filedetails/?id=2302929610) | 272 | 20 | 57 |
| `meta_exp_2789732802` | [Barricaded Base](https://steamcommunity.com/sharedfiles/filedetails/?id=2789732802) | 352 | 7 | 30 |
| `meta_exp_1240864670` | [PVP Base Building 3.0](https://steamcommunity.com/sharedfiles/filedetails/?id=1240864670) | 435 | 20 | 30 |
| `meta_exp_1749984150` | [The Pill Box](https://steamcommunity.com/sharedfiles/filedetails/?id=1749984150) | 256 | 29 | 56 |
| `meta_exp_2352780716` | [Starter Base Vanilla TRIO](https://steamcommunity.com/sharedfiles/filedetails/?id=2352780716) | 77 | 10 | 242 |
| `meta_exp_2166299203` | [MID TIER - Starter Base](https://steamcommunity.com/sharedfiles/filedetails/?id=2166299203) | 167 | 8 | 72 |
| `meta_exp_1900997980` | [OP Starter - Main Solo Base](https://steamcommunity.com/sharedfiles/filedetails/?id=1900997980) | 349 | 24 | 30 |
| `meta_exp_2014588675` | [Evil Wurst Raptor - my way](https://steamcommunity.com/sharedfiles/filedetails/?id=2014588675) | 444 | 28 | 34 |
| `meta_exp_2165748865` | [STARTER BASE 1 X 2](https://steamcommunity.com/sharedfiles/filedetails/?id=2165748865) | 43 | 7 | 615 |
| `meta_exp_2351199686` | [Trapper's Shack](https://steamcommunity.com/sharedfiles/filedetails/?id=2351199686) | 74 | 4 | 99 |
| `meta_exp_2866185032` | [Easybase-1](https://steamcommunity.com/sharedfiles/filedetails/?id=2866185032) | 96 | 4 | 184 |
| `meta_exp_2439389320` | [Solo Meta](https://steamcommunity.com/sharedfiles/filedetails/?id=2439389320) | 490 | 41 | 55 |
| `meta_exp_2413416773` | [2x2 Heavy Storage Starter](https://steamcommunity.com/sharedfiles/filedetails/?id=2413416773) | 81 | 11 | 198 |
| `meta_exp_1813418959` | [GOOD HOUSE](https://steamcommunity.com/sharedfiles/filedetails/?id=1813418959) | 133 | 18 | 107 |
| `meta_exp_1970351961` | [spicy teepee](https://steamcommunity.com/sharedfiles/filedetails/?id=1970351961) | 603 | 22 | 30 |
| `meta_exp_1911085546` | [Duo late start base](https://steamcommunity.com/sharedfiles/filedetails/?id=1911085546) | 92 | 17 | 264 |
| `meta_exp_1575717402` | [The Dunce](https://steamcommunity.com/sharedfiles/filedetails/?id=1575717402) | 147 | 9 | 90 |
| `meta_exp_2275238630` | [Lotus](https://steamcommunity.com/sharedfiles/filedetails/?id=2275238630) | 313 | 33 | 43 |
| `meta_exp_1595719325` | [Solo Starter Base](https://steamcommunity.com/sharedfiles/filedetails/?id=1595719325) | 42 | 3 | 481 |
| `meta_exp_1789930153` | [2by2 inside 23to29 rocket raid](https://steamcommunity.com/sharedfiles/filedetails/?id=1789930153) | 262 | 34 | 69 |
| `meta_exp_1670162221` | [Hazard Solo Base](https://steamcommunity.com/sharedfiles/filedetails/?id=1670162221) | 197 | 15 | 88 |
| `meta_exp_1813577892` | [star house](https://steamcommunity.com/sharedfiles/filedetails/?id=1813577892) | 158 | 12 | 84 |
| `meta_exp_2449689775` | [AntiRaid Base For Small Clan](https://steamcommunity.com/sharedfiles/filedetails/?id=2449689775) | 577 | 19 | 30 |
| `meta_exp_2885307473` | [Cozy and comfy Yurt Base](https://steamcommunity.com/sharedfiles/filedetails/?id=2885307473) | 139 | 16 | 166 |
| `meta_exp_1910566606` | [Duo starter base](https://steamcommunity.com/sharedfiles/filedetails/?id=1910566606) | 65 | 17 | 386 |
| `meta_exp_2854178943` | [Tlennka smart furnase](https://steamcommunity.com/sharedfiles/filedetails/?id=2854178943) | 157 | 15 | 212 |
| `meta_exp_1789925295` | [circle 34 to 47 rocket raid](https://steamcommunity.com/sharedfiles/filedetails/?id=1789925295) | 471 | 46 | 38 |
| `meta_exp_1905015091` | [Solo / duo base](https://steamcommunity.com/sharedfiles/filedetails/?id=1905015091) | 46 | 9 | 852 |
| `meta_exp_1764893110` | [solo base](https://steamcommunity.com/sharedfiles/filedetails/?id=1764893110) | 418 | 31 | 30 |
| `meta_exp_2001884784` | [4 gah house](https://steamcommunity.com/sharedfiles/filedetails/?id=2001884784) | 538 | 20 | 30 |
| `meta_exp_2408606065` | [Willjum Starter Base Feb 2021](https://steamcommunity.com/sharedfiles/filedetails/?id=2408606065) | 133 | 12 | 99 |
| `meta_exp_1976034372` | [VanilaBig](https://steamcommunity.com/sharedfiles/filedetails/?id=1976034372) | 168 | 8 | 102 |
| `meta_exp_1625189886` | [Scorpin Small](https://steamcommunity.com/sharedfiles/filedetails/?id=1625189886) | 85 | 8 | 239 |
| `meta_exp_2399380261` | [Fortified Oval Small Clan](https://steamcommunity.com/sharedfiles/filedetails/?id=2399380261) | 601 | 16 | 30 |
| `meta_exp_1838476429` | [Simple 2x1 v2](https://steamcommunity.com/sharedfiles/filedetails/?id=1838476429) | 44 | 7 | 782 |
| `meta_exp_2379819882` | [дом для соло или 2 игроков](https://steamcommunity.com/sharedfiles/filedetails/?id=2379819882) | 70 | 8 | 254 |
| `meta_exp_3056550964` | [Solo Sanction V1](https://steamcommunity.com/sharedfiles/filedetails/?id=3056550964) | 103 | 9 | 308 |
| `meta_exp_1635088943` | [Stong Clan Base](https://steamcommunity.com/sharedfiles/filedetails/?id=1635088943) | 397 | 9 | 30 |
| `meta_exp_2843259621` | [RWPVP Easy#2](https://steamcommunity.com/sharedfiles/filedetails/?id=2843259621) | 29 | 4 | 860 |
| `meta_exp_1886032360` | [secret loot solo base 2.0](https://steamcommunity.com/sharedfiles/filedetails/?id=1886032360) | 110 | 18 | 160 |
| `meta_exp_1909984094` | [Complex Starter (Expanded, Heavily HoneyCombed)](https://steamcommunity.com/sharedfiles/filedetails/?id=1909984094) | 373 | 14 | 30 |
| `meta_exp_1834850395` | [Efficient 2x1](https://steamcommunity.com/sharedfiles/filedetails/?id=1834850395) | 161 | 27 | 298 |
| `meta_exp_2843261629` | [RWPVP Medium#1](https://steamcommunity.com/sharedfiles/filedetails/?id=2843261629) | 111 | 11 | 154 |
| `meta_exp_2246970231` | [4 Turret+4 Sensors Duo base](https://steamcommunity.com/sharedfiles/filedetails/?id=2246970231) | 241 | 8 | 112 |
| `meta_exp_2102068765` | [Duo base Daz007](https://steamcommunity.com/sharedfiles/filedetails/?id=2102068765) | 300 | 3 | 77 |
| `meta_exp_2871199060` | [Exeter Small Boy(a1)](https://steamcommunity.com/sharedfiles/filedetails/?id=2871199060) | 46 | 1 | 441 |
| `meta_exp_3146806805` | [STARTER SOLO.DUO NEW 2024](https://steamcommunity.com/sharedfiles/filedetails/?id=3146806805) | 177 | 16 | 76 |
| `meta_exp_2023153229` | [HIVE BASE](https://steamcommunity.com/sharedfiles/filedetails/?id=2023153229) | 118 | 4 | 134 |
| `meta_exp_1901282259` | [Starter to main base for 2](https://steamcommunity.com/sharedfiles/filedetails/?id=1901282259) | 116 | 4 | 124 |
| `meta_exp_2671091187` | [Duo+ 3x3,hidden tc](https://steamcommunity.com/sharedfiles/filedetails/?id=2671091187) | 298 | 44 | 44 |
| `meta_exp_1760006485` | [Solo compact 2x2](https://steamcommunity.com/sharedfiles/filedetails/?id=1760006485) | 80 | 21 | 371 |
| `meta_exp_2138546492` | [base for 4](https://steamcommunity.com/sharedfiles/filedetails/?id=2138546492) | 213 | 16 | 99 |
| `meta_exp_3029587736` | [group building design](https://steamcommunity.com/sharedfiles/filedetails/?id=3029587736) | 400 | 14 | 30 |
| `meta_exp_1878433914` | [2X2 SUCKS (STARTER)](https://steamcommunity.com/sharedfiles/filedetails/?id=1878433914) | 160 | 7 | 73 |
| `meta_exp_1691900330` | [The Core](https://steamcommunity.com/sharedfiles/filedetails/?id=1691900330) | 229 | 19 | 30 |
| `meta_exp_1613124190` | [10 box starter solo duo](https://steamcommunity.com/sharedfiles/filedetails/?id=1613124190) | 61 | 11 | 292 |
| `meta_exp_1759485681` | [oval hatch core](https://steamcommunity.com/sharedfiles/filedetails/?id=1759485681) | 259 | 23 | 68 |
| `meta_exp_1834826134` | [Modular Starter - Updated.](https://steamcommunity.com/sharedfiles/filedetails/?id=1834826134) | 128 | 19 | 145 |
| `meta_exp_2550067483` | [base](https://steamcommunity.com/sharedfiles/filedetails/?id=2550067483) | 534 | 4 | 30 |
| `meta_exp_1775955438` | [The Citadel](https://steamcommunity.com/sharedfiles/filedetails/?id=1775955438) | 815 | 64 | 30 |
| `meta_exp_1878386554` | [Starbase vanilla. Med. upkeep](https://steamcommunity.com/sharedfiles/filedetails/?id=1878386554) | 414 | 14 | 30 |
| `meta_exp_3771614370` | [dust](https://steamcommunity.com/sharedfiles/filedetails/?id=3771614370) | 612 | 24 | 30 |

The original layouts and their separate verification history remain documented in [the first release](creator-release.md).
