# Vendor Roll Tables for Pathfinder 2e

**Automated vendor table generation with proper rarity-based weighting for FoundryVTT with the Pathfinder 2e system.**

This repository now includes an automated generation system that creates level-appropriate rollable tables with proper probability distributions based on item rarity. No more manual table management!

## 🆕 NEW: Automated Generation System

Generate custom vendor tables for any party level with proper rarity weighting:
- **Common items** appear 4x more often (weight: 4)
- **Uncommon items** appear 2x more often (weight: 2)
- **Rare items** appear at base rate (weight: 1)

This creates realistic vendor inventories where powerful rare items are truly rare finds!

## 🚀 Quick Start

For level 7 parties, pre-generated tables are ready to use:

```bash
# Option 1: Use regular version (comprehensive)
vendor-tables/level-7/vendor-1-general-armory.json
vendor-tables/level-7/vendor-2-arcane-alchemy.json

# Option 2: Use compact version (curated, less clutter)
vendor-tables/level-7-compact/vendor-1-general-armory.json
vendor-tables/level-7-compact/vendor-2-arcane-alchemy.json
```

**Import into Foundry VTT:**
1. Go to "Rollable Tables" tab
2. Create Rollable Table → Import Data
3. Select the JSON file
4. Roll away!

### Generate for Your Party Level

```bash
# Install dependencies (none required - uses Node.js built-ins)
node generate-vendor-tables.js        # Full version
node generate-vendor-tables-compact.js # Compact version
```

Edit `playerLevel` and `levelRange` in the script to customize for your party!

## 📖 Documentation

- **[GENERATION-SUMMARY.md](GENERATION-SUMMARY.md)** - Complete overview and version comparison
- **[USAGE.md](USAGE.md)** - Detailed usage guide and customization options
- **[DYNAMIC-USAGE.md](DYNAMIC-USAGE.md)** - Dynamic vendor system with rotating stock
- **[vendor-tables/level-7/README.md](vendor-tables/level-7/README.md)** - Level 7 specific details

## Vendor Types

### Vendor 1: General Goods & Armory (360 items)
- All weapon types (simple, martial, advanced)
- All armor types and shields
- Adventuring gear and equipment
- **No consumables or inherently magical items**
- Price cap: 1000 gp

### Vendor 2: Arcane Emporium & Alchemy (1754 items)
- Potions, elixirs, and alchemical items
- Scrolls, wands, staves, and rods
- Talismans, oils, and magical consumables
- All grades (lesser, moderate, greater, major)
- Price cap: 2000 gp

## Generation Process

These roll tables are generated using a systematic approach to ensure compatibility with FoundryVTT and the Pathfinder 2e system:

### Data Source Validation
- **Equipment References:** All items use validated UUIDs from the official PF2e system equipment compendium
- **Format Compliance:** Tables match the exact structure of official PF2e roll tables
- **Icon Verification:** All item icons use actual image paths from the PF2e system files

### Quality Assurance
- **UUID Verification:** Every item reference is checked against the official PF2e repository at `packs/equipment/`
- **Format Standardization:** Tables follow the official PF2e roll table format from `packs/rollable-tables/`
- **Field Structure:** Each result entry uses the correct field order: `_id`, `description`, `documentUuid`, `drawn`, `img`, `name`, `range`, `type`, `weight`

### Data Sources
- **Equipment Data:** https://github.com/foundryvtt/pf2e/tree/v13-dev/packs/equipment
- **Roll Table Format Reference:** https://github.com/foundryvtt/pf2e/tree/v13-dev/packs/rollable-tables

## How to Use

### Importing into FoundryVTT

1. **Manual Import Method:**
   - Open FoundryVTT and go to the "Rollable Tables" tab
   - Click "Create Rollable Table"
   - Click the import button (folder icon)
   - Select the desired JSON file
   - The table will be imported with all items properly configured

2. **Module Installation Method:**
   - Place the JSON files in your FoundryVTT Data/modules directory
   - Use the Roll Table Importer module to bulk import tables

### Rolling on Tables

- Tables use weighted formulas (e.g., 1d950 for Vendor 1, 1d5265 for Vendor 2)
- Items are weighted by rarity (common 4x, uncommon 2x, rare 1x)
- Tables support replacement rolling (can get the same item multiple times)
- Display roll is enabled to show what was rolled

### Item References

- **All items reference valid PF2e equipment compendium entries**
- Items appear with proper stats, pricing, and descriptions when clicked
- Full integration with FoundryVTT's item system for drag-and-drop functionality
- Compatible with merchant modules and inventory management

## Customization

Feel free to modify these tables to fit your campaign:

- **Adjust pricing:** Edit the text entries to match your economy
- **Change items:** Replace items that don't fit your setting
- **Add regional flavor:** Modify descriptions to match local culture
- **Scale difficulty:** Swap in higher/lower level items as needed

## Compatibility

- **FoundryVTT Version:** v12+ (tested and validated)
- **PF2e System:** v6.11.1+ (uses official v13-dev equipment data)
- **Required:** Core Pathfinder 2e system and equipment compendiums
- **Tested:** All item references verified against PF2e system version 13.346+
- **Optional:** Roll Table Importer module for easier management

## Technical Details

- **Format Standard:** Matches official PF2e roll table structure exactly
- **Data Validation:** All UUIDs reference actual items in `Compendium.pf2e.equipment-srd`
- **Icon Compatibility:** Uses validated icon paths from PF2e system files
- **Import Reliability:** 100% compatible with FoundryVTT's native JSON import system

---

*These tables are designed to enhance your Pathfinder 2e campaign with varied and level-appropriate vendor encounters. Happy adventuring!*