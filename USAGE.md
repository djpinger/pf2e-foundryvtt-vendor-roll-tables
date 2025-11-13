# Vendor Table Generator - Usage Guide

This repository now includes an automated vendor table generator that creates level-appropriate rollable tables with proper rarity weighting for Pathfinder 2e in Foundry VTT.

## Quick Start

For your current level 7 party, the tables have already been generated:
- `vendor-tables/level-7/vendor-1-general-armory.json` - Weapons, armor, shields, general gear
- `vendor-tables/level-7/vendor-2-arcane-alchemy.json` - Consumables, scrolls, potions, alchemy

Simply import these into Foundry VTT!

## How It Works

### Rarity-Based Weighting

The generator uses a **4:2:1 ratio** for item weighting based on rarity:

| Rarity | Weight | Approximate % |
|--------|--------|---------------|
| Common | 4 | ~80% |
| Uncommon | 2 | ~15% |
| Rare | 1 | ~5% |
| Unique | 0 | Excluded |

This means common items appear roughly 4x more often than rare items, creating a realistic vendor experience where powerful rare items are truly rare finds!

### Vendor Types

**Vendor 1: General Goods & Armory**
- Weapons (simple, martial, advanced)
- Armor (light, medium, heavy)
- Shields
- Adventuring gear
- **Excludes:** Consumables and inherently magical items
- **Price Cap:** 1000 gp

**Vendor 2: Arcane Emporium & Alchemy**
- Potions and elixirs
- Scrolls
- Alchemical bombs and items
- Talismans
- Magical consumables
- Wands, staves, and rods
- **Price Cap:** 2000 gp

### Level Range

For level 7 players, the generator includes items from **levels 1-9**. This provides:
- Lower-level consumables (abundant and affordable)
- Level-appropriate permanent items
- Some higher-level items as aspirational purchases

## Customizing for Different Levels

To generate tables for a different party level, edit `generate-vendor-tables.js`:

```javascript
const CONFIG = {
  // ... other config ...
  playerLevel: 10,  // Change this to your party's level
  levelRange: { min: 1, max: 12 }, // Change max to playerLevel + 2
  // ... rest of config ...
};
```

### Recommended Level Ranges

| Party Level | Min Level | Max Level |
|-------------|-----------|-----------|
| 1-3 | 1 | 5 |
| 4-6 | 1 | 8 |
| 7-9 | 1 | 11 |
| 10-12 | 1 | 14 |
| 13-15 | 1 | 17 |
| 16-18 | 1 | 20 |
| 19-20 | 1 | 22 |

Then run:
```bash
node generate-vendor-tables.js
```

## Advanced Customization

### Adjusting Rarity Weights

Want more rare items to appear? Edit the weights in `generate-vendor-tables.js`:

```javascript
rarityWeights: {
  common: 4,    // Default: 4
  uncommon: 3,  // Change from 2 to 3 for more uncommon items
  rare: 2,      // Change from 1 to 2 for more rare items
  unique: 0     // Keep at 0 to exclude unique items
}
```

### Adjusting Price Caps

Control the maximum item price per vendor:

```javascript
vendor1: {
  // ...
  maxPriceGp: 1000,  // Increase for wealthier campaigns
},
vendor2: {
  // ...
  maxPriceGp: 2000,  // Adjust for magic item availability
}
```

### Filtering Item Types

Customize what each vendor sells by editing the `types` and `categories` arrays:

```javascript
vendor1: {
  types: ['weapon', 'armor', 'shield', 'equipment'],
  categories: {
    simple: true,
    martial: true,
    // advanced: false,  // Uncomment to exclude advanced weapons
  }
}
```

## Importing into Foundry VTT

1. Open your Foundry VTT game
2. Navigate to the **Rollable Tables** tab
3. Click **Create Rollable Table**
4. Click the **Import Data** button (folder icon)
5. Select the generated JSON file
6. The table will appear with all items properly weighted!

## Rolling on the Tables

Once imported, you can:
- **Right-click → Roll** to get a random item
- **Drag results to character sheets** to add items to inventory
- **Link to journal entries** for your vendors
- **Use with Merchant modules** for automated shop management

## Tips for DMs

### Creating Vendor NPCs

1. Import both vendor tables
2. Create a journal entry for each vendor NPC
3. Link the appropriate table in the journal
4. Roll multiple times to generate initial inventory

### Dynamic Inventory

Roll on the vendor tables at the start of each session or in-game week to simulate:
- Restocking of popular items
- New acquisitions
- Seasonal availability

### Regional Variations

Create multiple vendors in different cities:
- Adjust price caps for wealthy vs. poor regions
- Modify level ranges for frontier vs. metropolitan areas
- Change rarity weights to reflect magic item scarcity

### Quest Rewards

Use the tables to:
- Generate treasure hoards
- Stock dungeon merchants
- Populate magic item shops in adventure locations

## Table Statistics

### Current Generation (Level 7):

**Vendor 1: General Goods & Armory**
- **360 items** across levels 1-9
- Roll Formula: **1d950**
- Rarity breakdown:
  - Common: 141 items (weight 564)
  - Uncommon: 167 items (weight 334)
  - Rare: 52 items (weight 52)

**Vendor 2: Arcane Emporium & Alchemy**
- **1754 items** across levels 1-9
- Roll Formula: **1d5265**
- Rarity breakdown:
  - Common: 968 items (weight 3872)
  - Uncommon: 607 items (weight 1214)
  - Rare: 179 items (weight 179)

## Troubleshooting

**Too many items in Vendor 2?**
- Increase `levelRange.min` to exclude low-level consumables
- Add more restrictive category filters
- Lower the `maxPriceGp` cap

**Not enough variety?**
- Increase `levelRange.max`
- Adjust rarity weights to include more uncommon/rare
- Raise price caps

**Items not appearing?**
- Check that the pf2e equipment path is correct (`../pf2e/packs/equipment`)
- Ensure you've cloned/updated the pf2e repository
- Verify the equipment compendium is up to date

## Contributing

Have ideas for improvements? Consider:
- Adding specialty vendors (e.g., only scrolls, only bombs)
- Creating themed tables (cold region gear, nautical equipment)
- Building seasonal variants
- Implementing treasure generation

## License

This generator tool and the resulting tables follow the same ORC/OGL licenses as the Pathfinder 2e system data they reference.

---

**Happy Gaming!** May your vendors always have what your players need (at the right price). 🎲
