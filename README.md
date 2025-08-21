# Vendor Roll Tables for Pathfinder 2e (Levels 1-20)

This collection contains vendor roll tables designed for FoundryVTT with the Pathfinder 2e system. Tables are organized into level ranges (1-5, 6-10, 11-15, 16-20) with each range containing six different vendor types, offering level-appropriate items, services, and pricing.

## Tables Included

### 1. General Store (`vendor-tables/levels-5-10/01-general-store.json`)
Essential adventuring gear and tools for mid-level characters:
- Enhanced climbing kits, thieves' tools, and healer's kits
- Quality storage solutions (Bag of Holding Type I)
- Advanced versions of basic supplies
- Professional-grade equipment

### 2. Blacksmith (`vendor-tables/levels-5-10/02-blacksmith.json`) 
Weapons, armor, and shields for seasoned warriors:
- +1 and +2 enchanted weapons and armor
- Cold iron, silver, mithral, and adamantine materials
- Striking runes and property runes
- Resilient armor for magical protection

### 3. Alchemist Shop (`vendor-tables/levels-5-10/03-alchemist.json`)
Potions, mutagens, and alchemical items:
- Moderate-level healing potions and antidotes
- Greater versions of combat alchemicals
- Specialized mutagens for different builds
- Utility elixirs (darkvision, comprehension, etc.)

### 4. Magic Shop (`vendor-tables/levels-5-10/04-magic-shop.json`)
Scrolls, wands, staves, and magical items:
- 3rd-5th level scrolls of popular spells
- Wands with moderate charges
- Protective items (rings, cloaks, armor)
- Utility magical items

### 5. Tavern Services (`vendor-tables/levels-5-10/05-tavern-services.json`)
Accommodations, meals, and information services:
- Quality lodging and dining options
- Information brokering and local contacts
- Specialized services (guides, repairs, healing)
- Pricing appropriate for successful adventurers

### 6. Exotic & Rare Goods (`vendor-tables/levels-5-10/06-exotic-rare-goods.json`)
Unusual items and rare materials:
- Unique magical items
- Rare crafting components and materials
- Powerful consumables
- Mysterious artifacts and curiosities

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

- Each table uses a 1d20 formula
- Items are weighted equally for balanced results
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

## Directory Structure

Tables are organized by level ranges in separate directories:

- `vendor-tables/levels-1-5/` - Basic gear and low-level items for beginning adventurers
- `vendor-tables/levels-6-10/` - Enhanced equipment and moderate magical items
- `vendor-tables/levels-11-15/` - Powerful gear and high-level consumables
- `vendor-tables/levels-16-20/` - Legendary items and epic-tier equipment

## Level Scaling

Each level range contains the same six vendor types with appropriately scaled items:

- **Levels 1-5:** Basic equipment, minor potions, simple enchantments
- **Levels 6-10:** +1/+2 items, moderate potions, professional gear
- **Levels 11-15:** +3 weapons/armor, major potions, higher-level scrolls
- **Levels 16-20:** Legendary items, artifact fragments, planar materials

## Notes on Pricing

- Tavern services reflect a prosperous establishment in a major city
- Exotic goods include rare materials priced for their scarcity
- All other items follow standard Pathfinder 2e pricing
- Adjust prices based on your campaign's economic conditions

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