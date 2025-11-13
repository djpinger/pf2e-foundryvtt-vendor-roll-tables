# Level 7 Dynamic Vendor Tables

**Limited inventories (~50 items) that change over time!**

## What's Here

This directory contains **4 rollable tables** that work together to create realistic, dynamic vendor inventories:

### Vendor 1: General Goods & Armory

1. **vendor-1-always-available.json** (27 items)
   - Basic gear that's ALWAYS in stock
   - Rope, torches, basic weapons, basic armor
   - Infinite supply - never runs out

2. **vendor-1-rotating-stock.json** (359 item pool)
   - Special items that rotate in and out
   - Roll **30 times** to generate current inventory
   - Rarity-weighted (common 80%, uncommon 15%, rare 5%)

**Total Inventory**: ~57 items (27 always + 30 rotating)

### Vendor 2: Arcane Emporium & Alchemy

3. **vendor-2-always-available.json** (12 items)
   - Basic consumables ALWAYS in stock
   - Healing elixirs, alchemist's fire, antidotes
   - Infinite supply - never runs out

4. **vendor-2-rotating-stock.json** (1751 item pool)
   - Magical consumables, scrolls, special alchemy
   - Roll **40 times** to generate current inventory
   - Rarity-weighted (common 80%, uncommon 15%, rare 5%)

**Total Inventory**: ~52 items (12 always + 40 rotating)

## How to Use

### Step 1: Import into Foundry VTT

1. Open Foundry VTT
2. Go to **Rollable Tables** tab
3. Click **Create Rollable Table**
4. Click **Import Data** (folder icon)
5. Select each JSON file and import
6. Repeat for all 4 files

### Step 2: Generate Vendor Inventory

When players first visit:

**For Vendor 1:**
1. Open "Vendor 1 - Always Available" table
   - These 27 items are permanently in stock
2. Open "Vendor 1 - Rotating Stock" table
3. Roll **30 times** (Ctrl+Enter or click roll repeatedly)
4. Those 30 items are the current special stock
5. **Total**: 27 + 30 = ~57 items for sale

**For Vendor 2:**
1. Open "Vendor 2 - Always Available" table
   - These 12 items are permanently in stock
2. Open "Vendor 2 - Rotating Stock" table
3. Roll **40 times**
4. Those 40 items are the current special stock
5. **Total**: 12 + 40 = ~52 items for sale

### Step 3: Restock When Needed

When you want the vendor to have new items (weekly, monthly, etc.):

1. Keep the "Always Available" items (they never change)
2. Roll fresh on "Rotating Stock":
   - Vendor 1: Roll 30 new times
   - Vendor 2: Roll 40 new times
3. The old special stock is replaced with new items!

## What's Always Available

### Vendor 1 (27 items)
**Weapons**: Dagger, Shortsword, Longsword, Spear, Club, Mace, Shortbow, Longbow, Crossbow

**Armor**: Leather Armor, Hide Armor, Chain Mail, Scale Mail, Breastplate, Full Plate

**Shields**: Buckler, Wooden Shield, Steel Shield

**Gear**: Backpack, Bedroll, Rope, Torch, Rations, Waterskin, Flint & Steel, Chalk, Piton

### Vendor 2 (12 items)
**Healing**: Elixir of Life (Minor), Elixir of Life (Lesser)

**Alchemical**: Alchemist's Fire (Lesser/Moderate), Acid Flask (Lesser/Moderate)

**Utility**: Antidote (Lesser/Moderate), Antiplague (Lesser/Moderate), Holy Water, Torch

## Example Session

### Session 10: Players Visit

**DM opens Vendor 1 tables:**
- Shows "Always Available" (27 basic items)
- Rolls 30x on "Rotating Stock":
  - 24 common items (battle axes, hide armor, etc.)
  - 4 uncommon items (exotic weapons, composite bows)
  - 2 rare items (adamantine dagger!)

**Current inventory**: 57 items total

### Session 14: Players Return

**DM restocks Vendor 1:**
- Same "Always Available" (27 basic items still there)
- Rolls 30x AGAIN on "Rotating Stock":
  - Different 24 common items this time
  - Different 4-5 uncommon items
  - Maybe 1 rare item (or maybe none!)

**New inventory**: 57 items total, but completely different specials!

## Rarity Probability

When rolling on "Rotating Stock" tables:
- **Common** (weight 4): ~80% chance per roll
- **Uncommon** (weight 2): ~15% chance per roll
- **Rare** (weight 1): ~5% chance per roll

**Expected results from 30 rolls:**
- ~24 common items
- ~4-5 uncommon items
- ~1-2 rare items (if lucky!)

## Tips

### Restocking Frequency
- **Every visit**: Maximum variety (can feel chaotic)
- **Weekly**: Good balance (realistic and exciting)
- **Monthly**: More realistic (players plan around restock day)
- **Story-based**: When caravans arrive

### Managing Sold Items
- "Always Available" items restock immediately (infinite supply)
- "Rotating Stock" items stay gone until next restock
- Consider: Some items stay in stock if unsold?

### Customizing
Want different inventory sizes? Edit `generate-dynamic-vendor-tables.js`:

```javascript
rotatingStockSize: {
  vendor1: 30,  // Change to 20 for smaller inventory
  vendor2: 40   // Change to 50 for larger inventory
}
```

Then regenerate: `node generate-dynamic-vendor-tables.js`

## Why This System?

✅ **Limited inventories** - ~50 items instead of 1000+
✅ **Common basics reliable** - rope and torches always available
✅ **Rare items exciting** - adamantine dagger doesn't always appear
✅ **Dynamic gameplay** - "what's new this week?"
✅ **Proper rarity** - rare items are actually rare!

---

**For detailed usage guide**: See `DYNAMIC-USAGE.md` in the repository root
**For party level**: These tables are for level 7 parties (items level 1-9)
