# Dynamic Vendor System - Usage Guide

This system creates **realistic vendor inventories with limited stock** that changes over time, just like your original vision!

## How It Works

Instead of one massive table with all items, this system uses **two types of tables per vendor**:

### 1. "Always Available" Tables
Common basics that never run out of stock:
- **Vendor 1**: 27 items (rope, torches, basic weapons, basic armor)
- **Vendor 2**: 12 items (healing elixirs, basic alchemical items, holy water)

### 2. "Rotating Stock" Tables
Larger pool of items to roll from for variety:
- **Vendor 1**: 359 possible items (roll 30 times to generate current stock)
- **Vendor 2**: 1751 possible items (roll 40 times to generate current stock)

## Example: Vendor 1 (General Goods & Armory)

### Always In Stock (27 items)
- Backpack, Bedroll, Rope, Torch, Rations, Waterskin
- Dagger, Shortsword, Longsword, Spear, Club, Mace
- Shortbow, Longbow, Crossbow
- Leather Armor, Chain Mail, Breastplate, Full Plate
- Buckler, Wooden Shield, Steel Shield
- etc.

### Current Stock (roll 30 times on rotating table)
Players visit on Day 1 and see:
- Alkenstar Ice Wine
- Battle Axe
- Composite Longbow
- Dueling Cape
- +1 Striking Longsword (rare find!)
- ... (25 more items)

**Two weeks later**, the vendor has restocked. The basics are still there, but you roll 30 new items:
- Ammunition (50 arrows)
- Bastard Sword
- Chain Shirt
- Grappling Hook
- Silvered Dagger
- ... (25 more items)

## Setting Up in Foundry VTT

### Step 1: Import Tables

1. Open Foundry VTT
2. Go to **Rollable Tables** tab
3. Import all 4 tables:
   - `vendor-1-always-available.json`
   - `vendor-1-rotating-stock.json`
   - `vendor-2-always-available.json`
   - `vendor-2-rotating-stock.json`

### Step 2: Generate Initial Inventory

When players first visit each vendor:

**For Vendor 1:**
1. Open "Vendor 1 - Always Available" table
2. These 27 items are permanently in stock
3. Open "Vendor 1 - Rotating Stock" table
4. Roll **30 times** (with replacement) to generate current inventory
5. Record what items came up (or use Foundry's roll history)

**For Vendor 2:**
1. Open "Vendor 2 - Always Available" table
2. These 12 items are permanently in stock
3. Open "Vendor 2 - Rotating Stock" table
4. Roll **40 times** (with replacement) to generate current inventory
5. Record the results

**Total Inventory:**
- Vendor 1: ~57 items (27 always + 30 rotating)
- Vendor 2: ~52 items (12 always + 40 rotating)

### Step 3: Track Purchases

As players buy items:
- Remove purchased items from inventory
- "Always Available" items restock immediately (infinite supply)
- "Rotating Stock" items stay gone until next restock

### Step 4: Restock

When it's time to restock (weekly, monthly, or whenever you choose):
1. Keep all "Always Available" items (they never change)
2. Clear the old "Rotating Stock"
3. Roll fresh on the "Rotating Stock" table:
   - Vendor 1: Roll 30 times
   - Vendor 2: Roll 40 times
4. The vendor now has new items for sale!

## Rarity-Based Probability

The "Rotating Stock" tables use rarity weighting, so common items appear more frequently:

| Rarity | Weight | Probability |
|--------|--------|-------------|
| Common | 4 | ~80% of rolls |
| Uncommon | 2 | ~15% of rolls |
| Rare | 1 | ~5% of rolls |

**Example**: When you roll 30 times on Vendor 1 Rotating Stock:
- ~24 common items (mundane weapons, armor, gear)
- ~4-5 uncommon items (special materials, exotic weapons)
- ~1-2 rare items (if you're lucky!)

This means:
- Most visits, players see common items
- Sometimes they find uncommon specialty gear
- Rarely, a rare item appears (exciting!)

## Practical Example Session

### Session 1: Players Visit Vendor 1

**DM rolls 30 times on Rotating Stock:**
```
Roll 1: d946 = 234 → Composite Longbow (common)
Roll 2: d946 = 678 → Dueling Cape (uncommon)
Roll 3: d946 = 912 → Adamantine Dagger (rare!)
...
Roll 30: d946 = 45 → Grappling Hook (common)
```

**Current inventory:**
- 27 always-available basics (rope, torches, basic weapons, etc.)
- 30 special items from today's rolls
- **Total: 57 items**

### Session 5: Two Weeks Later

Players return. The basics are still there, but:

**DM rolls 30 NEW times on Rotating Stock:**
```
Roll 1: d946 = 445 → Battle Axe (common)
Roll 2: d946 = 789 → +1 Striking Sword (uncommon)
Roll 3: d946 = 123 → Silvered Arrows (common)
...
```

The vendor's special stock has completely changed!

## Tips for DMs

### Frequency of Restocking

Choose what works for your campaign:
- **Every visit** - Maximum variety, but can feel random
- **Weekly** - Good balance, encourages regular visits
- **Monthly** - More realistic, players plan around restock days
- **Story-driven** - Restock when vendor gets new shipments

### Adjusting Stock Size

Edit the script if you want different inventory sizes:

```javascript
rotatingStockSize: {
  vendor1: 20,  // Change from 30 to 20 for smaller inventory
  vendor2: 30   // Change from 40 to 30
}
```

### Creating Scarcity

For rare items, you might want even fewer:
- Only roll 20 times instead of 30 for Vendor 1
- Save rare items for special occasions
- Let players special-order items not in stock

### Regional Variations

Create multiple vendors with different stock:
- Frontier town: Roll 15 times (limited selection)
- Major city: Roll 50 times (well-stocked)
- Black market: Only uncommon/rare items

### Using Merchant Modules

Some Foundry modules can help automate this:
1. **Shop Manager** - Create vendor NPCs with inventory
2. **Loot Sheet** - Turn rolled items into purchasable inventory
3. **Better Rolltables** - Auto-roll multiple times

### Managing the Always-Available List

Don't like what's in the "Always Available" tables? Edit the script!

Find this section in `generate-dynamic-vendor-tables.js`:

```javascript
mustIncludeNames: [
  'Dagger', 'Shortsword', 'Longsword', // Add or remove items
  'Backpack', 'Bedroll', 'Rope',
  // ... etc
]
```

Add or remove items, then regenerate:
```bash
node generate-dynamic-vendor-tables.js
```

## Comparison: Dynamic vs. Full Tables

| Aspect | Dynamic System | Full Table System |
|--------|----------------|-------------------|
| **Inventory Size** | ~50-60 items | 360-1754 items |
| **Realism** | High (limited stock) | Low (everything available) |
| **Variety Over Time** | High (changes each visit) | Static |
| **Player Engagement** | "What's new today?" | "Everything's here" |
| **DM Setup** | Roll 30-40 times per restock | Import once |
| **Common Items** | Always available | Mixed in with rare items |

## Quick Reference

### Vendor 1: General Goods & Armory
- **Always Available**: 27 basic items (weapons, armor, gear)
- **Rotating Stock**: Roll **30 times** to generate current inventory
- **Total Inventory**: ~57 items

### Vendor 2: Arcane Emporium & Alchemy
- **Always Available**: 12 basic consumables (healing elixirs, basic alchemical)
- **Rotating Stock**: Roll **40 times** to generate current inventory
- **Total Inventory**: ~52 items

### Restocking Workflow
1. Keep "Always Available" items (never change)
2. Clear old "Rotating Stock"
3. Roll fresh on "Rotating Stock" table
4. Vendor is now restocked with new items!

---

**Pro Tip**: Create a journal entry in Foundry for each vendor with:
- Link to their tables
- Current date last restocked
- Notes on special orders or requests
- Disposition toward the party (affects prices!)

This creates a living, breathing merchant economy instead of a static item catalog. Your players will actually look forward to returning to town to see "what's new at the shop"! 🛍️
