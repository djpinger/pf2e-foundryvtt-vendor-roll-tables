# Level 7 Vendor Tables

Generated for a party at **level 7** with items from **levels 1-9**.

## Tables Included

### 1. Vendor 1: General Goods & Armory
**File:** `vendor-1-general-armory.json`

A well-stocked shop offering quality weapons, armor, shields, and essential adventuring gear.

**Stats:**
- 360 items total
- Roll formula: 1d950
- 141 common items (weight 4 each)
- 167 uncommon items (weight 2 each)  
- 52 rare items (weight 1 each)

**Includes:**
- All weapon types (simple, martial, advanced)
- All armor types (light, medium, heavy)
- Shields
- Adventuring gear and equipment
- Maximum price: 1000 gp

**Excludes:**
- Consumables
- Inherently magical items
- Unique items

### 2. Vendor 2: Arcane Emporium & Alchemy
**File:** `vendor-2-arcane-alchemy.json`

A mystical establishment specializing in magical consumables, scrolls, potions, elixirs, and alchemical creations.

**Stats:**
- 1754 items total
- Roll formula: 1d5265
- 968 common items (weight 4 each)
- 607 uncommon items (weight 2 each)
- 179 rare items (weight 1 each)

**Includes:**
- Potions and elixirs (all grades: lesser, moderate, greater, major)
- Scrolls
- Alchemical bombs and items
- Talismans and oils
- Wands, staves, and rods
- Maximum price: 2000 gp

## Rarity Distribution

With the 4:2:1 weighting system:

| Rarity | Weight | Example Probability |
|--------|--------|---------------------|
| Common | 4 | 80% chance |
| Uncommon | 2 | 15% chance |
| Rare | 1 | 5% chance |

This means when you roll on the table, common items appear roughly **16x more often** than rare items!

## How to Use in Foundry VTT

1. Open Foundry VTT
2. Go to **Rollable Tables** tab
3. Click **Create Rollable Table**
4. Click **Import Data** (folder icon)
5. Select the JSON file
6. Roll away!

## Customization

If you want to adjust these tables for a different level or modify the item selection, see the main `USAGE.md` file in the repository root.

### Quick Adjustments

**Too many consumables in Vendor 2?**
- Edit `generate-vendor-tables.js`
- Increase `levelRange.min` from 1 to 3 or 4
- This excludes low-level consumables

**Want different price ranges?**
- Edit `maxPriceGp` in the config
- Vendor 1 default: 1000 gp
- Vendor 2 default: 2000 gp

**Regenerate for next level:**
- Change `playerLevel: 7` to `playerLevel: 8`
- Change `levelRange: { min: 1, max: 9 }` to `{ min: 1, max: 10 }`
- Run: `node generate-vendor-tables.js`

---

**Generated:** 2025-11-12
**Party Level:** 7
**Item Level Range:** 1-9
