#!/usr/bin/env node

/**
 * DYNAMIC VENDOR TABLE GENERATOR
 *
 * Creates separate tables for:
 * 1. "Always Available" - Common basics that never run out
 * 2. "Current Stock" - Rotating inventory rolled fresh each visit
 *
 * This allows limited inventories (~50 items) with realistic restocking
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  pf2eEquipmentPath: '../pf2e/packs/equipment',
  outputPath: './vendor-tables/level-7-dynamic',
  playerLevel: 7,
  levelRange: { min: 1, max: 9 },

  // Rarity weights for rotating stock
  rarityWeights: {
    common: 4,
    uncommon: 2,
    rare: 1,
    unique: 0
  },

  // How many items to generate for rotating stock tables
  rotatingStockSize: {
    vendor1: 30, // Roll 30 times on Vendor 1 rotating table
    vendor2: 40  // Roll 40 times on Vendor 2 rotating table
  },

  // Vendor 1: General Goods & Armory
  vendor1: {
    name: "General Goods & Armory",
    description: "A well-stocked shop offering weapons, armor, shields, and adventuring gear.",

    // Always available items (common basics)
    alwaysAvailable: {
      description: "Basic equipment always in stock - the essentials every adventurer needs.",
      mustIncludeNames: [
        // Basic weapons
        'Dagger', 'Shortsword', 'Longsword', 'Spear', 'Club', 'Mace',
        'Shortbow', 'Longbow', 'Crossbow',
        // Basic armor
        'Leather Armor', 'Hide Armor', 'Chain Mail', 'Scale Mail',
        'Breastplate', 'Full Plate',
        // Shields
        'Buckler', 'Wooden Shield', 'Steel Shield',
        // Adventuring gear
        'Backpack', 'Bedroll', 'Rope', 'Torch', 'Rations',
        'Waterskin', 'Flint and Steel', 'Chalk', 'Piton'
      ],
      maxLevel: 2, // Only include low-level common items
      onlyCommon: true
    },

    // Rotating stock (changes each visit)
    rotatingStock: {
      description: "Current selection of weapons, armor, and special equipment - changes regularly.",
      types: ['weapon', 'armor', 'shield', 'equipment'],
      categories: {
        simple: true,
        martial: true,
        advanced: true,
        unarmed: true,
        light: true,
        medium: true,
        heavy: true,
        adventuring_gear: true,
        general: true
      },
      excludeTraits: ['consumable', 'magical'],
      maxPriceGp: 1000,
      minLevel: 1 // Include all levels in range
    }
  },

  // Vendor 2: Arcane Emporium & Alchemy
  vendor2: {
    name: "Arcane Emporium & Alchemy",
    description: "A mystical shop with magical consumables and alchemical creations.",

    // Always available items (common consumables)
    alwaysAvailable: {
      description: "Common potions and basic alchemical items always in stock.",
      mustIncludeNames: [
        // Basic healing (PF2e Remaster uses "Elixir of Life")
        'Elixir of Life (Minor)', 'Elixir of Life (Lesser)', 'Elixir of Life (Moderate)',
        // Basic alchemical
        "Alchemist's Fire (Lesser)", "Alchemist's Fire (Moderate)",
        'Acid Flask (Lesser)', 'Acid Flask (Moderate)',
        'Antidote (Lesser)', 'Antiplague (Lesser)',
        'Tanglefoot Bag (Lesser)', 'Thunderstone (Lesser)',
        // Basic utility
        'Holy Water', 'Oil', 'Torch'
      ],
      maxLevel: 6, // Include up to level 6 for better healing options
      onlyCommon: true,
      includeNamePatterns: [
        'Elixir of Life',
        'Antidote',
        'Antiplague'
      ]
    },

    // Rotating stock (changes each visit)
    rotatingStock: {
      description: "Current selection of magical consumables, scrolls, and alchemical items - inventory changes regularly.",
      types: ['consumable', 'equipment'],
      requireTraits: ['consumable', 'magical', 'alchemical'],
      categories: {
        potion: true,
        elixir: true,
        talisman: true,
        scroll: true,
        oil: true,
        bomb: true,
        ammunition: true
      },
      includeWandsStavesRods: true,
      maxPriceGp: 2000,
      minLevel: 1
    }
  }
};

// Helper functions
function generateId() {
  return Math.random().toString(36).substring(2, 18);
}

function readAllEquipment() {
  const equipmentDir = path.resolve(__dirname, CONFIG.pf2eEquipmentPath);
  const files = fs.readdirSync(equipmentDir);
  const equipment = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    try {
      const filePath = path.join(equipmentDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      equipment.push(data);
    } catch (error) {
      console.error(`Error reading ${file}:`, error.message);
    }
  }

  return equipment;
}

function getWeightForRarity(rarity) {
  return CONFIG.rarityWeights[rarity] || CONFIG.rarityWeights.common;
}

// Match items for "Always Available" table
function matchesAlwaysAvailable(item, alwaysConfig) {
  const level = item.system?.level?.value ?? 0;
  const rarity = item.system?.traits?.rarity ?? 'common';
  const itemName = item.name;

  // Must be common rarity
  if (alwaysConfig.onlyCommon && rarity !== 'common') {
    return false;
  }

  // Check level cap
  if (level > alwaysConfig.maxLevel) {
    return false;
  }

  // Check if in must-include list (exact match)
  if (alwaysConfig.mustIncludeNames) {
    if (alwaysConfig.mustIncludeNames.includes(itemName)) {
      return true;
    }
  }

  // Check if matches name patterns
  if (alwaysConfig.includeNamePatterns) {
    for (const pattern of alwaysConfig.includeNamePatterns) {
      if (itemName.includes(pattern)) {
        return true;
      }
    }
  }

  return false;
}

// Match items for "Rotating Stock" table
function matchesRotatingStock(item, rotatingConfig) {
  const level = item.system?.level?.value ?? 0;
  const rarity = item.system?.traits?.rarity ?? 'common';
  const traits = item.system?.traits?.value ?? [];
  const category = item.system?.category;
  const price = item.system?.price?.value?.gp ?? 0;

  // Check level range
  if (level < CONFIG.levelRange.min || level > CONFIG.levelRange.max) {
    return false;
  }

  // Exclude unique
  if (rarity === 'unique') {
    return false;
  }

  // Check type
  if (!rotatingConfig.types.includes(item.type)) {
    return false;
  }

  // Check price cap
  if (price > rotatingConfig.maxPriceGp) {
    return false;
  }

  // Vendor-specific filtering
  if (rotatingConfig.excludeTraits) {
    for (const trait of rotatingConfig.excludeTraits) {
      if (traits.includes(trait)) {
        return false;
      }
    }
  }

  if (rotatingConfig.requireTraits) {
    const hasRequiredTrait = rotatingConfig.requireTraits.some(trait => traits.includes(trait));
    const isInCategory = category && rotatingConfig.categories[category];

    if (rotatingConfig.includeWandsStavesRods) {
      if (item.name.toLowerCase().includes('wand') ||
          item.name.toLowerCase().includes('staff') ||
          item.name.toLowerCase().includes('rod') ||
          item.name.toLowerCase().includes('scroll')) {
        return true;
      }
    }

    if (!hasRequiredTrait && !isInCategory) {
      return false;
    }
  } else {
    if (category && !rotatingConfig.categories[category]) {
      return false;
    }
  }

  return true;
}

// Generate roll table
function generateRollTable(items, description, formula, name, imgPath, useWeights = true) {
  items.sort((a, b) => {
    const levelDiff = (a.system?.level?.value ?? 0) - (b.system?.level?.value ?? 0);
    if (levelDiff !== 0) return levelDiff;
    return a.name.localeCompare(b.name);
  });

  const results = [];
  let currentRange = 1;

  for (const item of items) {
    const rarity = item.system?.traits?.rarity ?? 'common';
    const weight = useWeights ? getWeightForRarity(rarity) : 1;

    if (weight === 0) continue;

    results.push({
      _id: generateId(),
      description: "",
      documentUuid: `Compendium.pf2e.equipment-srd.Item.${item._id}`,
      drawn: false,
      img: item.img,
      name: item.name,
      range: [currentRange, currentRange + weight - 1],
      type: "document",
      weight: weight
    });

    currentRange += weight;
  }

  const totalWeight = currentRange - 1;

  return {
    _id: generateId(),
    description: description,
    displayRoll: true,
    formula: formula || `1d${totalWeight}`,
    img: imgPath,
    name: name,
    ownership: { default: 0 },
    replacement: true,
    results: results
  };
}

// Main function
function main() {
  console.log('=== DYNAMIC VENDOR TABLE GENERATOR ===');
  console.log('This creates separate tables for:');
  console.log('  1. "Always Available" - Common basics that never run out');
  console.log('  2. "Rotating Stock" - Roll fresh each visit for variety');
  console.log();

  const allEquipment = readAllEquipment();
  console.log(`Found ${allEquipment.length} equipment items.\n`);

  const outputDir = path.resolve(__dirname, CONFIG.outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // ===== VENDOR 1 =====
  console.log('━━━ VENDOR 1: General Goods & Armory ━━━');

  // Always Available
  const v1AlwaysItems = allEquipment.filter(item =>
    matchesAlwaysAvailable(item, CONFIG.vendor1.alwaysAvailable)
  );
  console.log(`\n📌 Always Available: ${v1AlwaysItems.length} items`);
  console.log('   These items are permanently in stock (common basics)');

  const v1AlwaysTable = generateRollTable(
    v1AlwaysItems,
    CONFIG.vendor1.alwaysAvailable.description,
    null,
    `${CONFIG.vendor1.name} - Always Available (Level ${CONFIG.playerLevel})`,
    "systems/pf2e/icons/equipment/adventuring-gear/adventuring-gear.webp",
    false // No weights - all equal for always available
  );

  const v1AlwaysPath = path.join(outputDir, 'vendor-1-always-available.json');
  fs.writeFileSync(v1AlwaysPath, JSON.stringify(v1AlwaysTable, null, 2));
  console.log(`   Saved: vendor-1-always-available.json`);
  console.log(`   Formula: ${v1AlwaysTable.formula}`);

  // Rotating Stock
  const v1RotatingItems = allEquipment.filter(item =>
    matchesRotatingStock(item, CONFIG.vendor1.rotatingStock) &&
    !matchesAlwaysAvailable(item, CONFIG.vendor1.alwaysAvailable) // Exclude items already in "always available"
  );
  console.log(`\n🔄 Rotating Stock: ${v1RotatingItems.length} possible items`);
  console.log(`   Roll ${CONFIG.rotatingStockSize.vendor1} times to generate current inventory`);

  const v1RotatingTable = generateRollTable(
    v1RotatingItems,
    CONFIG.vendor1.rotatingStock.description,
    null,
    `${CONFIG.vendor1.name} - Rotating Stock (Level ${CONFIG.playerLevel})`,
    "systems/pf2e/icons/equipment/adventuring-gear/classkit-fighter.webp",
    true // Use rarity weights
  );

  const v1RotatingPath = path.join(outputDir, 'vendor-1-rotating-stock.json');
  fs.writeFileSync(v1RotatingPath, JSON.stringify(v1RotatingTable, null, 2));
  console.log(`   Saved: vendor-1-rotating-stock.json`);
  console.log(`   Formula: ${v1RotatingTable.formula} (weighted by rarity)`);

  const v1Rarities = v1RotatingItems.reduce((acc, item) => {
    const rarity = item.system?.traits?.rarity ?? 'common';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});
  console.log(`   Rarity breakdown:`, v1Rarities);

  // ===== VENDOR 2 =====
  console.log('\n━━━ VENDOR 2: Arcane Emporium & Alchemy ━━━');

  // Always Available
  const v2AlwaysItems = allEquipment.filter(item =>
    matchesAlwaysAvailable(item, CONFIG.vendor2.alwaysAvailable)
  );
  console.log(`\n📌 Always Available: ${v2AlwaysItems.length} items`);
  console.log('   Basic consumables always in stock');

  const v2AlwaysTable = generateRollTable(
    v2AlwaysItems,
    CONFIG.vendor2.alwaysAvailable.description,
    null,
    `${CONFIG.vendor2.name} - Always Available (Level ${CONFIG.playerLevel})`,
    "systems/pf2e/icons/equipment/consumables/potions/minor-healing-potion.webp",
    false
  );

  const v2AlwaysPath = path.join(outputDir, 'vendor-2-always-available.json');
  fs.writeFileSync(v2AlwaysPath, JSON.stringify(v2AlwaysTable, null, 2));
  console.log(`   Saved: vendor-2-always-available.json`);
  console.log(`   Formula: ${v2AlwaysTable.formula}`);

  // Rotating Stock
  const v2RotatingItems = allEquipment.filter(item =>
    matchesRotatingStock(item, CONFIG.vendor2.rotatingStock) &&
    !matchesAlwaysAvailable(item, CONFIG.vendor2.alwaysAvailable)
  );
  console.log(`\n🔄 Rotating Stock: ${v2RotatingItems.length} possible items`);
  console.log(`   Roll ${CONFIG.rotatingStockSize.vendor2} times to generate current inventory`);

  const v2RotatingTable = generateRollTable(
    v2RotatingItems,
    CONFIG.vendor2.rotatingStock.description,
    null,
    `${CONFIG.vendor2.name} - Rotating Stock (Level ${CONFIG.playerLevel})`,
    "systems/pf2e/icons/equipment/consumables/potions/potions.webp",
    true
  );

  const v2RotatingPath = path.join(outputDir, 'vendor-2-rotating-stock.json');
  fs.writeFileSync(v2RotatingPath, JSON.stringify(v2RotatingTable, null, 2));
  console.log(`   Saved: vendor-2-rotating-stock.json`);
  console.log(`   Formula: ${v2RotatingTable.formula} (weighted by rarity)`);

  const v2Rarities = v2RotatingItems.reduce((acc, item) => {
    const rarity = item.system?.traits?.rarity ?? 'common';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});
  console.log(`   Rarity breakdown:`, v2Rarities);

  console.log('\n✅ Dynamic vendor tables generated!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('HOW TO USE:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n1. Import all 4 tables into Foundry VTT');
  console.log('\n2. When players visit a vendor:');
  console.log('   • Show "Always Available" table (these never change)');
  console.log(`   • Roll ${CONFIG.rotatingStockSize.vendor1}x on "Rotating Stock" to generate current inventory`);
  console.log('\n3. Each visit/week/month:');
  console.log('   • Keep "Always Available" items');
  console.log('   • Re-roll "Rotating Stock" for fresh inventory');
  console.log('\n4. Example vendor inventory = ~' +
    (v1AlwaysItems.length + CONFIG.rotatingStockSize.vendor1) +
    ' items total for Vendor 1');
  console.log('   (' + v1AlwaysItems.length + ' always available + ' +
    CONFIG.rotatingStockSize.vendor1 + ' rotating items)');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
