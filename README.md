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

New bases are decay-free until a regular player opens their TC, changes its authorization
(including assigning, clearing or removing authorization), or destroys it.
That permanently enables normal Rust upkeep and decay for the entire registered
base. TC opening and authorization changes by Rust admins or moderators
(auth level 1 or 2, or the admin flag) do not activate decay. TC destruction still
does, regardless of who destroys it. Merely opening a storage box does not.
An intact stocked TC continues buying upkeep normally, so interaction does not
mean immediate damage. Destroying a TC follows Rust's ordinary grace periods.
Replacing/refilling a TC can provide upkeep, but never restores the special
decay immunity. The activated state survives reloads and restarts. A TC found
missing on restore also activates decay. Existing bases are not retroactively
marked touched based on interactions before this feature was installed.

Permanent mode uses the paste/furnishing lifecycle without entering an upstream
raid event, including while construction is still in progress. It does not create
an event collider, NPCs, drone patrols, arena walls, spheres, map markers, event
UI/announcements, weapon confiscation, player ejection or event despawn timers.
Event-territory APIs return false and raid lifecycle notifications are suppressed.
Normal pickup eligibility is restored from each entity's native prefab. Loot,
locks, ordinary furnishing, skin consistency and the explicit TC decay policy
remain in place. Upstream event mode is retained separately when permanent mode
is disabled; its weapon-block messages now use plain wording rather than magic.

The current mode is intended for furnished buildings without special
plugin-managed elevators. It does not preserve raid rules or NPC AI.
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

Color-capable skins use their actual one-based palette, excluding Rust's zero
(random/default) sentinel. The selected color is supplied during skin creation
and synchronized to the global building representation as well as normal entity
updates, preventing differently colored representations of the same block.

For doors set `Skins -> Deployables -> Use Identical Skins` to `true` and enable
random/workshop skins. Upstream caches a selection per door prefab per base;
single, double, garage and armored doors therefore each use their own compatible
skin throughout a base. This is not a promise of an artist-matched collection
across different item types. Existing bases are not reskinned on reload.

`Restrict holiday skins to their holiday months (UTC)` defaults to true.
Construction, deployable, box and loot skin selection checks known skin names:
Christmas/gingerbread in December, Halloween/crypt in October, Valentine's in
February, and other configured holiday fragments in their listed months.
Easter and Lunar New Year use the holiday's actual month for the current year.
Whole-word matching avoids treating Twitch skins as witch skins. Skin-ID month
overrides take precedence; use them for artwork whose title does not identify its
holiday. Unknown imported skin IDs are excluded unless explicitly assigned allowed
months. Ordinary non-holiday art remains eligible. This is a metadata filter,
not image recognition; existing world skins are not changed automatically.

Normal-stability permanent bases retain the native prefab's foundation anchors.
Upper pieces still use ordinary support calculations. The post-registration
upgrade regression test forces recalculation and upgrades all Norseman blocks;
it must not rely on cached stability from the initial paste.

## Balanced Random Selection

`Balanced Base Families (template names grouped by layout)` groups template names
into equally weighted layout families. Random selection exhausts families in a
random order, then starts a new cycle without immediately repeating the last
family. Each family independently exhausts its variants before repeating them.
Templates not listed form individual families. Pools, previous choices and variant
history persist in `oxide/data/RaidableBases/SelectionState.json` across plugin
reloads and server restarts, and reset for a new world. Selection attempts still
consume a choice even if later placement fails. Explicit named spawns bypass the
random pool. Each family, including the saloon, has equal weight.

`Templates excluded from random selection (explicit spawning still allowed)` can
exclude aliases such as `RaidBases` without disabling explicit named spawns.
An empty family mapping retains upstream random selection. Existing world bases
are unaffected.

## Commands

The [creator catalogue](catalogue/creator-release.md) lists the converted layouts,
their provenance and verification limits. Placement tests actual square/triangle
foundations, not entrance steps. Low-FPS throttling on an empty server no longer
prevents profile initialization indefinitely.

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

Permanent mode bypasses event presentation even if an imported profile enables
it. Always Rainy's live configuration also clears blocked weapons, disables
Wizardry/Archery/DoubleJump/LifeSupport restrictions, disables event messages
and map markers, and keeps the status UI off.

## Creator-Sourced Catalogue

The previous 32 authored `ar_*` layouts, generator and previews have been retired.
Their live templates, profiles and family mappings were removed. This retirement
does not delete already-spawned world entities or change the plugin's skin,
decay, selection or placement behavior.

The replacement [source catalogue](catalogue/research/README.md) tracks real
creator designs, available saves, related versions and compatibility concerns.
Research candidates are not approved live templates. Patched mechanics and
unverified bunker dependencies stay outside the import queue. See the
[acceptance criteria](catalogue/README.md) before enabling a new template.

## Placement

Permanent mode always validates placement; event-mode profiles can enable
`Validate footprint before paste (including admin aim spawns)` independently.
The foundation footprint is checked for water, unsupported/buried foundations,
structures, deployables and world obstructions before entities are created.
Permanent bases can lift uniformly by up to 1.5m to fit gentle slopes, provided
all sampled foundations remain above ground and within 2.5m of support. This
replaces the event profile's stricter land-level limit in permanent mode.
Monument checks use actual monument bounds and safe zones instead of a broad
raid-event exclusion circle. Overhanging branches are allowed when the tree
trunk is outside the foundation footprint; trunks inside still block placement.
Rejections identify the obstruction, and failed checks do not adjust paste data.
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
