# Vendor Table Solution - Complete Overview

## The Problem

You needed a better vendor system for your level 7 Pathfinder 2e game that:
- ✅ Has **limited inventories** (~50 items, not 1000+)
- ✅ **Changes over time** as players visit
- ✅ Makes **common items always available** (rope, torches, basics)
- ✅ Makes **rare items occasional** (they're not always in stock)
- ✅ Uses **proper rarity weighting** (common more likely than rare)
- ✅ Separates two vendor types (mundane goods vs. magic/alchemy)

## The Solution: Dynamic Vendor System

I created a **two-table approach** for each vendor:

### 🔒 "Always Available" Table
- Small curated list of essential basics
- Always in stock (infinite supply)
- Common rarity only
- Examples: rope, torches, basic weapons, healing potions

### 🔄 "Rotating Stock" Table
- Large pool of possible items
- Roll 30-40 times each visit to generate current inventory
- Rarity-weighted (common 4x more likely than rare)
- Changes each time you roll

**Result**: Realistic 50-item inventories that change over time!

## Generated Files

```
vendor-tables/level-7-dynamic/
├── vendor-1-always-available.json    ← 27 basic items (always in stock)
├── vendor-1-rotating-stock.json      ← 359 items pool (roll 30x)
├── vendor-2-always-available.json    ← 12 basic consumables (always in stock)
└── vendor-2-rotating-stock.json      ← 1751 items pool (roll 40x)
```

**Scripts:**
- `generate-dynamic-vendor-tables.js` - Generates the dynamic system

**Documentation:**
- `DYNAMIC-USAGE.md` - Complete usage guide with examples
- `SOLUTION-OVERVIEW.md` - This file

## How to Use

### In Foundry VTT:

1. **Import all 4 tables** from `vendor-tables/level-7-dynamic/`

2. **When players visit Vendor 1:**
   - Show "Always Available" table (27 items, always there)
   - Roll 30x on "Rotating Stock" table (current inventory)
   - Total: ~57 items for sale

3. **When they return later:**
   - Show same "Always Available" table
   - Roll 30x AGAIN on "Rotating Stock" (different items now!)
   - Total: ~57 items, but different selection

### Example Workflow:

**Session 10 - Players visit armory:**
```
DM: "You enter the armory. As always, they have the basics..."
→ Show Always Available table (rope, torches, basic weapons/armor)

DM: "But their special selection today includes..."
→ Roll 30x on Rotating Stock
→ Results: Composite Longbow, Adamantine Dagger (rare!), Battle Axe, etc.

Total inventory: 27 basics + 30 special items = 57 items
```

**Session 14 - Players return 2 weeks later:**
```
DM: "The basics are still here, but the special stock has changed..."
→ Same Always Available items
→ Roll 30x AGAIN on Rotating Stock (new results!)
→ Different items this time!
```

## What's Always Available

### Vendor 1 - General Goods & Armory (27 items)
**Weapons**: Dagger, Shortsword, Longsword, Spear, Club, Mace, Shortbow, Longbow, Crossbow

**Armor**: Leather Armor, Hide Armor, Chain Mail, Scale Mail, Breastplate, Full Plate

**Shields**: Buckler, Wooden Shield, Steel Shield

**Gear**: Backpack, Bedroll, Rope, Torch, Rations, Waterskin, Flint & Steel, Chalk, Piton

### Vendor 2 - Arcane Emporium & Alchemy (12 items)
**Healing**: Elixir of Life (Minor), Elixir of Life (Lesser)

**Alchemical**: Alchemist's Fire (Lesser/Moderate), Acid Flask (Lesser/Moderate)

**Utility**: Antidote (Lesser/Moderate), Antiplague (Lesser/Moderate), Holy Water, Torch

## Rarity Weighting

When you roll on "Rotating Stock" tables:
- **Common items** (weight 4): ~80% of rolls
- **Uncommon items** (weight 2): ~15% of rolls
- **Rare items** (weight 1): ~5% of rolls

**Example**: Rolling 30 times typically gives you:
- ~24 common items
- ~4-5 uncommon items
- ~1-2 rare items (if lucky!)

This creates realistic scarcity!

## Comparison of Approaches

### ❌ Original System (Manual)
- All items listed explicitly
- Equal probability for each item
- Static tables
- **Problem**: Too manual, no rarity weighting

### ❌ First Attempt (Full Tables)
- Generated all 360/1754 items in one table
- Proper rarity weighting
- **Problem**: Too many items, everything always available

### ✅ Final Solution (Dynamic System)
- Separate "Always Available" + "Rotating Stock"
- Limited inventories (~50 items)
- Proper rarity weighting
- Dynamic restocking
- **Perfect fit for your use case!**

## Customization

### Adjust Stock Size

Edit `generate-dynamic-vendor-tables.js`:

```javascript
rotatingStockSize: {
  vendor1: 30,  // Change to 20 for smaller inventory
  vendor2: 40   // Change to 50 for larger inventory
}
```

### Add/Remove Always-Available Items

```javascript
mustIncludeNames: [
  'Dagger',
  'Longsword',
  'Healing Potion',  // Add more items here
  'Custom Item Name'
]
```

### Change Level Range

```javascript
playerLevel: 8,  // Update when party levels up
levelRange: { min: 1, max: 10 }  // playerLevel + 2
```

Then regenerate:
```bash
node generate-dynamic-vendor-tables.js
```

## Frequency of Restocking

Choose what fits your game:
- **Every visit** - Maximum variety (can feel random)
- **Weekly** - Good balance (encourages regular visits)
- **Monthly** - More realistic (players plan around restock day)
- **Story-driven** - Restock when caravans arrive

## Benefits Over Static Tables

### Player Engagement
- "What's in stock today?" creates excitement
- Rare items feel special when they appear
- Players make multiple visits over time

### Realistic Economy
- Limited stock feels like a real shop
- Common basics always available (realistic)
- Rare items rotate in/out (scarce by nature)

### DM Flexibility
- Easy to restock (just roll again)
- Can control inventory size
- Level-appropriate items only

## Advanced Usage

### Multiple Vendors in Different Towns

Generate separate inventories:
- **Frontier outpost**: Roll 15 times (limited)
- **Major city**: Roll 50 times (well-stocked)
- **Black market**: Only uncommon/rare items

### Special Orders

Player wants an item not in stock?
- Check if it's in the "Rotating Stock" table
- If yes: "I can order it, check back next week"
- If no: "That's beyond what I can get"

### Price Adjustments

- **High demand items**: +20% price
- **Overstocked items**: -10% discount
- **NPC relationships**: Discount for friends

## Troubleshooting

**"I don't like the always-available list"**
→ Edit the script's `mustIncludeNames` array and regenerate

**"50 items is still too many"**
→ Reduce `rotatingStockSize` to 20 or 15

**"I want more rare items"**
→ Increase `rarityWeights.rare` from 1 to 2

**"Vendor 2 has too many consumables"**
→ Reduce `rotatingStockSize.vendor2` from 40 to 25

## For Other Party Levels

When your party levels up:

1. Edit `generate-dynamic-vendor-tables.js`
2. Change `playerLevel: 7` to your new level
3. Change `levelRange.max` to `playerLevel + 2`
4. Run: `node generate-dynamic-vendor-tables.js`
5. Re-import the new tables into Foundry

## Summary

You now have a complete dynamic vendor system that:

✅ Limits inventory to ~50 items per vendor
✅ Makes basics always available (rope, torches, healing)
✅ Rotates special items based on rarity
✅ Creates player engagement ("what's new today?")
✅ Works perfectly for level 7 party
✅ Easy to regenerate for other levels
✅ Fully automated - just roll and import!

This is exactly what you envisioned: realistic vendors with limited, changing inventories where common items are reliable but rare items create excitement when they appear!

---

**Ready to use**: Import the 4 JSON files from `vendor-tables/level-7-dynamic/` into Foundry VTT and start rolling! 🎲
