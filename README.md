# Raidable Bases: Always Rainy Fork

Based on nivex's free [Raidable Bases 3.1.9](https://umod.org/plugins/raidable-bases),
licensed GPL-3.0-or-later. The initial commit preserves the downloaded upstream
source. This is a source fork of the uMod distribution, not the premium plugin.

## Permanent World Bases

Set `Permanent World Bases (detach completed spawns from raid events)` to `true`.
After construction, furnishing and loot generation, the plugin registers the
base's exact entity IDs, enables native Rust saving for its structures and
attached entities, and removes the raid event controller without destroying the
base, its locks or its inventories. There is no raid zone, raid completion,
inactivity cleanup, or automatic replenishment afterward. Players can still
damage and loot these structures under the server's normal PvP rules.

Records are stored in `oxide/data/RaidableBases/PermanentBases.json`. On load,
the plugin restores the saved decay state and original stability mode only for matching
entity IDs and prefab IDs. The world seed, size and save creation time prevent
old records from being applied to a new wipe. Destroyed entities are not respawned.
Keep this data file with the Rust world save in backups. The fork must remain
installed to restore protection for untouched bases after server restarts; the structures themselves
are saved by Rust. New player-built additions are not made permanent automatically.

New bases are decay-free until somebody opens their TC, changes its authorization
(including assigning, clearing or removing authorization), or destroys it.
That permanently enables normal Rust upkeep and decay for the entire registered
base. Admin interactions count too; merely opening a storage box does not.
An intact stocked TC continues buying upkeep normally, so interaction does not
mean immediate damage. Destroying a TC follows Rust's ordinary grace periods.
Replacing/refilling a TC can provide upkeep, but never restores the special
decay immunity. The activated state survives reloads and restarts. A TC found
missing on restore also activates decay. Existing bases are not retroactively
marked touched based on interactions before this feature was installed.

The current mode is intended for furnished buildings without NPCs, arena walls,
or special plugin-managed elevators. It does not preserve raid rules or NPC AI.
Disable scheduled/maintained spawning unless you deliberately want automatic
generation of permanent bases. These remain until destroyed, explicitly removed,
or wiped and therefore consume persistent entity capacity.

## Consistent Skins

Set `Random Building Skins (one supported skin and color per grade per base)` to
`true`. Each new base selects one skin per wood/stone/metal/armored grade from
the game's construction definitions, intersecting compatibility across every
piece of that grade. The selected grade's color is shared too. Building grades
and structural strength are unchanged. A new base can randomly choose the same
skin as a previous base; the unskinned appearance is also a valid choice.

For doors set `Skins -> Deployables -> Use Identical Skins` to `true` and enable
random/workshop skins. Upstream caches a selection per door prefab per base;
single, double, garage and armored doors therefore each use their own compatible
skin throughout a base. This is not a promise of an artist-matched collection
across different item types. Existing bases are not reskinned on reload.

## Balanced Random Selection

`Balanced Base Families (template names grouped by layout)` groups template names
into equally weighted layout families. Random selection exhausts families in a
random order, then starts a new cycle without immediately repeating the last
family. Each family independently exhausts its variants before repeating them.
Templates not listed form individual families. Pools reset when the plugin reloads;
selection attempts consume a choice even if later placement fails.

`Templates excluded from random selection (explicit spawning still allowed)` can
exclude aliases such as `RaidBases` without disabling explicit named spawns.
An empty family mapping retains upstream random selection. Existing world bases
are unaffected.

## Commands

Admin/server access is required:

- `/rbe`: random base at your aim. New catalogue profiles also validate the footprint.
- `/rbe TEMPLATE`: select a configured template.
- `/rbevent`: use upstream's checked random-world-location search.
- `/rbe despawn`: aim at a registered permanent base to remove only that base;
  otherwise falls back to upstream active-raid removal.
- `rb.permanent`: list IDs, surviving/saved entity counts and skin assignments.
- `rb.permanent remove ID`: remove precisely that registered base's surviving
  entities, including attached locks, in batches. It does not remove later
  player additions or unrelated entities nearby.

For an unmarked appearance also disable `UI -> Status UI -> Enabled`,
enter/exit announcements, NPCs, arena walls, spheres and map markers in the
ordinary Raidable Bases configuration/profile. The Always Rainy deployment
does so; upstream defaults are otherwise retained.

## Original Catalogue

The [catalogue](catalogue/README.md) adds 32 hand-authored layouts in eight
families: expanded starters, narrow homes, courtyard homes, workshops, farms,
fortified homes, group compounds and two-floor tower homes. These are distinct
floorplans, not cosmetic variants. Browse their plans and exact commands in
[`catalogue/dist/index.html`](catalogue/dist/index.html).

Permanent mode always validates placement; event-mode profiles can enable
`Validate footprint before paste (including admin aim spawns)` independently.
The entire foundation footprint is checked for water, terrain variation,
unsupported/buried foundations, structures, deployables, world obstructions and
monument proximity before entities are created. It is conservative: an admin
aim spawn can be refused even if the original plugin allowed the aim point.
Permanent mode also skips raid-event clutter clearing entirely: no surrounding
trees, resources, deployables or vehicles are removed or relocated to make room.
Choose a clear site instead. This does not restore objects removed by older versions.

## Deployment

Requires Oxide and Copy Paste. Upload `RaidableBases.cs` under a temporary name,
rename it atomically, and run `oxide.reload RaidableBases`. Disable automatic
plugin updates in any host updater that would overwrite the fork.

**Migrating existing stock events requires care:** upstream destroys active
events on unload. Preserve/register their entities and detach their controllers
before replacing stock Raidable Bases. Merely setting the inactivity timer to
zero does not preserve bases across reloads, and setting the after-looting timer
to zero means immediate despawn in upstream.
