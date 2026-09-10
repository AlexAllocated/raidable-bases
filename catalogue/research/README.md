# Creator-Sourced Base Research

## Current Inventory

This source library replaces the retired authored layouts. The first eight
creator imports are listed separately in the [live batch](../creator-release.md).
The remainder is research or quarantine, not a pack of playable bases.

| Stage | Count | Meaning |
| --- | ---: | --- |
| Source records | 160 | Guides, versions and Workshop listings, not distinct approved bases |
| Downloaded blueprint payloads | 39 | 24 Pastebin saves and 15 Workshop files |
| Native FORTIFY exports | 39 | Converted with the purchased current exporter |
| Current-game candidates checked | 21 | Includes rejects and held layouts, not just successes |
| Live-trial additions | 8 | Final adjusted files tested on real ground with stock/upkeep checks |
| Tested but rejected | 11 | Missing pieces, collapse, inadequate amenities or buried/lost furnishings |
| Tested but still held | 2 | Basic structure passes; access/mechanics review incomplete |
| Workshop listings | 20 | Fifteen payloads acquired; the remainder are still leads |
| Verified video metadata | 95 | Confirms video/title/channel, not current mechanics |

These live trials have not received exhaustive in-player walkthroughs or
electrical-system certification. Current per-record review categories, including
the broader mechanics/site holds, are in the structured inventory.

Eleven junk submissions were removed from the discovery index. Known versions
are grouped rather than counted as independent variety: Garrison/Garrison 2.0,
Javelin variants, the Dugout reconstruction/remaster, Raptor lineage, Bank,
Hoarder and Original Frustrator variants. Other geometric duplicates may remain;
Research family counts are provisional, not a claim that each is a usable import.

## Browse

- [Full inventory, grouped by review status](INVENTORY.md): every source link,
  acquisition status, creator or uploader, and review note.
- [Structured inventory](sources.json): source provenance, video checks, download
  URLs/hashes, local file paths, family IDs and exclusion evidence.
- [Acceptance criteria](../README.md) and [work checklist](../WORK.md).

The saved source files live in
`/home/alx/server-ops/physgun/creator-blueprints/` and the private FORTIFY staging
directory, outside this public repository. Converted release files and test
evidence are under `/home/alx/server-ops/physgun/creator-release/` and
`/home/alx/server-ops/physgun/creator-integration/`.
Public availability alone does not establish redistribution rights. Keep author
credit and check the applicable permissions before publishing converted saves.

## Initial Shortlist

These six downloaded layouts formed the initial shortlist. Mini Fort, El Padre
and Garrison failed runtime or ground-integration checks; the other three are
in the live batch after documented import adjustments. The table retains their
source references.

| Design | Creator | Save | Initial check |
| --- | --- | --- | --- |
| 2x2 Starter | Evil Wurst | [KL0scXkg](https://pastebin.com/KL0scXkg) | Door swings, current deployable bounds |
| Mini Fort 2 | Evil Wurst | [FFDKsB55](https://pastebin.com/FFDKsB55) | Shooting-floor access and small-room clearance |
| Thrifty Scot 2 | Evil Wurst | [BS6hnzQN](https://pastebin.com/BS6hnzQN) | TC and storage access |
| Norseman | Rust Daddy | [0YznBD6x](https://pastebin.com/0YznBD6x) | Furnishings, roof access, wiring |
| Garrison | Cosmonatic Films | [2KeyrH7C](https://pastebin.com/2KeyrH7C) | Corridors, chutes, entrances and furnace clearance |
| El Padre | Rust Daddy | [fKidiS93](https://pastebin.com/fKidiS93) | Multi-TC links, actual upkeep coverage and entity budget |

Garrison is especially relevant: its creator's guide describes a single-TC,
livability-focused group base, with accessible corridors and ordinary amenities.
The multi-TC 2.0 revision is tracked separately but belongs to the same family.
[Creator-partner guide](https://www.corrosionhour.com/the-garrison-trio-base-design-2020/).

## Broader Variety

The next review set includes Willjum's Hannibal, Kingsman, Origin and Witcher;
Spinky's Hold and Halo; Dust's Saber and Dugout; Zypic's Dugout remaster; and
older conventional expansion guides. These are source leads, not automatically
compatible because the title omits the word bunker. All are linked individually
in the inventory.

The Workshop and utility section adds different uses and silhouettes: saloon,
shop, garage, furnace buildings and helicopter outposts. These are deliberately
distinguished from competitive main-base designs. Boat houses stay held until
placement supports their water requirements. Community reconstructions such as
the Workshop Dugout must be compared with the original creator's layout.

## Compatibility Rules

- Do not import a build that requires patched mechanics. Chadsaw's closed roof,
  the original Trinity, old roof-seal versions of Raptor/Phoenix/Leech/Valkyrie,
  Ocean Vault and the quadruple stability concept have explicit creator warnings.
  [Group warnings](https://sites.google.com/view/evilwurstsbases/home/group-bases),
  [small-base warnings](https://sites.google.com/view/evilwurstsbases/home/soloduotrio-bases),
  [utility warnings](https://sites.google.com/view/evilwurstsbases/home/utility-bases).
- Alamo is eligible only as an explicitly non-bunker version. Retaliator needs
  the creator's roof-ramp update instead of removed foundation steps. Neither is
  approved as an unchanged old save.
- An old bunker is not assumed patched merely because it is old. It stays on
  hold until its exact mechanics are checked. Do not use paste-time stability
  overrides to conceal an impossible or inaccessible layout.
- Fortify text is not native CopyPaste JSON. Open/convert it through a supported
  path and validate against the original design. A downloaded file does not prove
  that the current game will accept its pieces or furnishings.
- Test exterior entry, every floor, roof access, door operation, loot and TC
  reachability, furnace height, independent upkeep sections and persistence.
  Preserve the established skins, decay-on-TC-interaction and no-clutter-clearing
  behavior of the server fork.

## Research Method

The broad index was used only for discovery. Creator video metadata, creator
catalogue warnings, partner guides and original Workshop listings supply the
linked evidence. Historical raid-cost claims were not copied into scoring.
Automatic keyword flags are conservative hints: negated descriptions can still
match, so explicit review notes take precedence. Some old video links are no
longer verifiable; these remain labelled in the structured inventory.

Downloaded Fortify files include both terrain2d and terrain3d headers. The initial
format check missed terrain3d; inspecting those payloads recovered six additional
blueprints, including Mini Fort and the original Garrison. Hash verification
checks the actual local bytes, not just that a download link exists.

No paid packs were purchased, no private Discord saves were assumed accessible,
and no unsafe or unknown build was enabled on the live server by this research.
