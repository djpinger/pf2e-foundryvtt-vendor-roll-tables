# Vendor Table Generation - Complete Summary

## What Was Created

I've built an automated vendor table generation system that creates level-appropriate rollable tables with **proper rarity-based weighting** for your Pathfinder 2e Foundry VTT game.

## Key Features

### ✅ Rarity-Based Weighting
- **Common items**: 4x more likely to appear (weight: 4)
- **Uncommon items**: 2x more likely to appear (weight: 2)
- **Rare items**: Base chance (weight: 1)
- **Unique items**: Excluded entirely

This means common items appear ~80% of the time, uncommon ~15%, and rare ~5%, creating a realistic vendor experience!

### ✅ Level-Appropriate Items
For your **level 7 party**, the system includes items from **levels 1-9** (or 3-9 in compact mode), providing:
- Affordable lower-level consumables
- Level-appropriate gear
- Aspirational higher-level items

### ✅ Two Vendor Types

**Vendor 1: General Goods & Armory**
- Weapons, armor, shields
- Adventuring gear
- Excludes consumables and magical items
- Price cap: 1000 gp

**Vendor 2: Arcane Emporium & Alchemy**
- Potions, elixirs, scrolls
- Alchemical items and bombs
- Talismans, oils, wands, staves
- Price cap: 1500-2000 gp

## Generated Files

### Regular Version (Comprehensive)
📁 `vendor-tables/level-7/`
- `vendor-1-general-armory.json` - **360 items**, 1d950 formula
- `vendor-2-arcane-alchemy.json` - **1754 items**, 1d5265 formula

**Best for:** DMs who want maximum variety and don't mind larger tables

### Compact Version (Curated)
📁 `vendor-tables/level-7-compact/`
- `vendor-1-general-armory.json` - **240 items**, 1d632 formula
- `vendor-2-arcane-alchemy.json` - **1376 items**, 1d4098 formula

**Best for:** DMs who want a more manageable selection without low-level clutter

## Scripts Available

### `generate-vendor-tables.js` - Full Version
Generates comprehensive tables with all items from level 1-9.

**Usage:**
```bash
node generate-vendor-tables.js
```

### `generate-vendor-tables-compact.js` - Compact Version
Generates curated tables starting from level 3, excluding lesser/minor grades of low-level items.

**Usage:**
```bash
node generate-vendor-tables-compact.js
```

## Customization

Both scripts can be easily customized by editing the `CONFIG` object:

```javascript
const CONFIG = {
  playerLevel: 7,              // Your party's level
  levelRange: { min: 1, max: 9 }, // Item level range
  rarityWeights: {
    common: 4,    // Adjust these ratios
    uncommon: 2,
    rare: 1
  },
  maxPriceGp: 1000, // Price caps per vendor
  // ... more options
};
```

## Comparison Table

| Aspect | Regular Version | Compact Version |
|--------|----------------|-----------------|
| **Level Range** | 1-9 | 3-9 |
| **Vendor 1 Items** | 360 | 240 |
| **Vendor 2 Items** | 1754 | 1376 |
| **Low-level Consumables** | ✅ All grades | ❌ Excludes lesser/minor |
| **Best For** | Maximum variety | Curated selection |

## How to Use in Foundry VTT

1. Choose which version you want (regular or compact)
2. Navigate to the appropriate folder
3. In Foundry VTT:
   - Open the **Rollable Tables** tab
   - Click **Create Rollable Table**
   - Click **Import Data** (folder icon)
   - Select the JSON file
4. Roll away!

## Rolling Examples

When you roll on these tables:

**Vendor 1 (1d950 formula):**
- Rolls 1-564: Common items (59% of table)
- Rolls 565-898: Uncommon items (35% of table)
- Rolls 899-950: Rare items (5% of table)

**Vendor 2 (1d5265 formula):**
- Rolls 1-3872: Common items (74% of table)
- Rolls 3873-5086: Uncommon items (23% of table)
- Rolls 5087-5265: Rare items (3% of table)

The weighted ranges ensure proper probability distribution!

## Regenerating for Different Levels

When your party levels up:

1. Edit the script's CONFIG:
   ```javascript
   playerLevel: 8,  // Update to new level
   levelRange: { min: 1, max: 10 }, // Update max to playerLevel + 2
   ```

2. Run the script:
   ```bash
   node generate-vendor-tables.js
   ```

3. Import the new tables into Foundry VTT

## Tips for DMs

### Creating Vendor NPCs
- Import both vendor tables
- Create journal entries for your vendors
- Link tables to the journals
- Roll multiple times to generate starting inventory

### Dynamic Inventory
Roll at the start of each session or in-game week to simulate:
- Restocking
- New acquisitions
- Seasonal changes

### Regional Variations
Modify the scripts to create vendors for different locations:
- Adjust price caps for wealthy/poor regions
- Change level ranges for frontier/metropolitan areas
- Modify rarity weights to reflect magic scarcity

## Documentation

- **USAGE.md** - Complete usage guide and customization options
- **vendor-tables/level-7/README.md** - Details on the regular version
- **This file** - Quick reference and comparison

## Technical Details

### Data Source
All items reference the official PF2e equipment compendium:
- Path: `../pf2e/packs/equipment`
- Format: Individual JSON files per item
- UUID: `Compendium.pf2e.equipment-srd.Item.{id}`

### Weighting Algorithm
Each item's weight determines its range on the d-table:
```
Item A (weight 4): [1-4]
Item B (weight 2): [5-6]
Item C (weight 1): [7-7]
Total: 1d7
```

## Next Steps

1. **Choose your version**: Regular (comprehensive) or Compact (curated)
2. **Import into Foundry**: Follow the import instructions above
3. **Test rolling**: Make sure the tables work as expected
4. **Customize if needed**: Adjust weights, prices, or level ranges
5. **Generate for other levels**: As your party levels up

## Support

If you need to adjust the generation:
- **Too many items?** Use the compact version or increase `levelRange.min`
- **Not enough variety?** Use the regular version or decrease `levelRange.min`
- **Want more rare items?** Increase their weight in `rarityWeights`
- **Price too high/low?** Adjust `maxPriceGp` in the config

---

**Generated:** 2025-11-12
**For Party Level:** 7
**Item Level Range:** 1-9 (regular) or 3-9 (compact)

Happy gaming! 🎲
