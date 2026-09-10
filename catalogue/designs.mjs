// Hand-authored plans. One character is a 3 m Rust foundation, not a rescaled room.
// A entry airlock; H passage; T TC; W workbench; F furnaces; S storage; B bunks;
// K kitchen; R research; E repair; M mixing; L sitting room; P growing beds;
// G garage; C open courtyard; D open deck; U stairwell (same coordinate upstairs).
const design = (id, name, family, tier, story, ground, upper) => ({
  id: `ar_${id}`, name, family, tier, story, floors: upper ? [ground, upper] : [ground],
});

export const designs = [
  design('dogleg', 'Dogleg', 'Expanded starters', 1, 'A compact solo core with a furnace annex added after the first night.', ['TB.', 'HAW', 'F..']),
  design('lean_to', 'Lean-to', 'Expanded starters', 1, 'A straight starter with an offset sleeping and storage extension.', ['TWS', '.HB', '.AF']),
  design('boot', 'Boot', 'Expanded starters', 1, 'A bent stone home with a protected back room and a wooden utility wing.', ['TW', 'BH', 'FA']),
  design('switchback', 'Switchback', 'Expanded starters', 1, 'A staggered entry path links the original core to a little kitchen.', ['TWB', '.HF', '.AK']),

  design('railhouse', 'Railhouse', 'Narrow homes', 1, 'A long, narrow dwelling with bedrooms and utilities off a single passage.', ['TBWF', 'HHHA', 'S...']),
  design('needle', 'Needle', 'Narrow homes', 2, 'A deep workshop home with a secure end room and a side entrance.', ['TS', 'WH', 'BH', 'RH', 'FA']),
  design('sidecar', 'Sidecar', 'Narrow homes', 2, 'Two unequal wings share a passage; the short wing houses the furnace room.', ['TWB..', 'HHHAF', 'S.K.F']),
  design('terrace', 'Terrace House', 'Narrow homes', 2, 'A linear duo house with an open side terrace and a rear workshop.', ['TSWBK', 'HHHAF', '.DD.D']),

  design('horseshoe', 'Horseshoe', 'Courtyard homes', 2, 'Living and crafting wings wrap three sides of a small open courtyard.', ['TWBS', 'HCCK', 'FHAR']),
  design('cloister', 'Cloister', 'Courtyard homes', 3, 'A closed ring keeps its main circulation outdoors around a protected court.', ['TSWB', 'HCCK', 'FCCL', 'EHAR']),
  design('keyhole', 'Keyhole', 'Courtyard homes', 2, 'A small court opens into a broader rear home through a narrow entrance neck.', ['TSWB', 'HCCF', 'RHHK', '.AA.']),
  design('sundial', 'Sundial', 'Courtyard homes', 3, 'Offset wings put the workroom and sleeping quarters on opposite sides of the court.', ['TSW..', 'HCCBK', 'FCCLH', 'EHAR.']),

  design('toolbox', 'Toolbox', 'Workshop homes', 2, 'A small repair shop fronts a lived-in home and enclosed garage bay.', ['TSB', 'WHK', 'EHF', 'GGA']),
  design('foundry', 'Foundry', 'Workshop homes', 3, 'A furnace hall and service passage form the spine of a crafting-heavy group home.', ['TSWB', 'RHHK', 'EFFH', 'GGHA']),
  design('motor_court', 'Motor Court', 'Workshop homes', 3, 'Twin garage bays open onto an interior yard; the home sits behind the workshop.', ['TSWBK', 'EHHHR', 'GGCHF', 'GGCHA']),
  design('chemist', 'The Chemist', 'Workshop homes', 2, 'A side laboratory and furnace annex branch from a compact domestic core.', ['TSWB', '.HHK', 'MMHF', '..AE']),

  design('market_garden', 'Market Garden', 'Farm homes', 2, 'A practical farmhouse with an open raised growing strip along one side.', ['TSWB', 'HHHK', 'AHFF', 'PPPP']),
  design('seedhouse', 'Seedhouse', 'Farm homes', 1, 'A small grower home prioritizes seed storage, cooking and a sunny side plot.', ['TSW', 'BHK', 'AHF', '.PP']),
  design('orchard', 'Orchard Lodge', 'Farm homes', 2, 'An L-shaped farmhouse shelters a broad, open planting court.', ['TSWBK', 'HPPPH', 'FPPPH', 'EHAR.']),
  design('grange', 'The Grange', 'Farm homes', 3, 'A working farm compound separates supplies, processing and the family rooms.', ['TSWWBB', 'RHHHHK', 'FPPPPH', 'FPPPPH', 'EHAGGL']),

  design('anvil', 'Anvil', 'Fortified homes', 3, 'A narrow vestibule feeds a wide secure core, with crafting in a recessed wing.', ['.TSB.', 'FHHHW', 'RHHHK', '..AA.']),
  design('bastion', 'Bastion', 'Fortified homes', 3, 'A layered core with separated storage and a service wing, without fake bunker exploits.', ['SBTWS', 'FHHHK', 'EHHRR', '.HAA.']),
  design('crab', 'Crab House', 'Fortified homes', 2, 'Two forward utility wings flank a recessed airlock and deeper living rooms.', ['TSWBK', 'FHHHR', 'FH.HS', '.AAA.']),
  design('strongbox', 'Strongbox', 'Fortified homes', 3, 'Offset compartments distribute supplies around a reinforced TC room.', ['.STBS', 'EHHHW', 'FHHHR', 'FHAK.']),

  design('crossroads', 'Crossroads', 'Group compounds', 3, 'Four purposeful wings meet at a shared internal passage.', ['..TB..', '..HH..', 'FFHHSW', 'EKHHRR', '..HA..', '..BB..']),
  design('hamlet', 'The Hamlet', 'Group compounds', 3, 'An open pedestrian court separates domestic and industrial wings under one footprint.', ['TSW.CBB', 'HHHCCKH', 'FFHCCLH', '..HCCRH', '..HHAEE']),
  design('yardworks', 'Yardworks', 'Group compounds', 3, 'A work yard joins garage bays, a furnace shop and the rear residential wing.', ['TSWBBK', 'HHHHHH', 'FFCCRR', 'EECCGG', '..AAGG']),
  design('longhouse', 'Longhouse', 'Group compounds', 3, 'A shared hall supports separate sleeping, storage and crafting rooms along its length.', ['TSBBWWK', 'HHHHHHH', 'FFREASA']),

  design('lookout', 'Lookout', 'Tower homes', 2, 'A small two-floor home puts living space above its secure workroom.', ['TW.', 'HU.', 'AF.'], ['BB.', 'HU.', 'KS.']),
  design('gatehouse', 'Gatehouse', 'Tower homes', 3, 'A garage-and-workshop ground floor supports a residential upper wing.', ['TSW', 'EUF', 'GGA'], ['BBK', 'HUL', 'RSD']),
  design('offset_loft', 'Offset Loft', 'Tower homes', 2, 'The upper rooms step back from the furnace extension to leave a roof terrace.', ['TSWF', 'HUHK', 'AHRE'], ['BB..', 'HU..', 'SD..']),
  design('watch_house', 'Watch House', 'Tower homes', 3, 'A raised living block overlooks a lower workshop and a small front deck.', ['TSWB', 'EUHF', 'GAHK'], ['BBK.', 'HUH.', 'RSD.']),
];

export const roles = { A: 'Airlock', H: 'Passage', T: 'Tool cupboard', W: 'Workbench', F: 'Furnaces',
  S: 'Storage', B: 'Sleeping', K: 'Kitchen', R: 'Research', E: 'Repair', M: 'Mixing', L: 'Sitting',
  P: 'Growing', G: 'Garage', C: 'Courtyard', D: 'Deck', U: 'Stairs' };
