#!/usr/bin/env node

// This is a COMPACT version that reduces the number of items in Vendor 2
// by being more selective about consumables and excluding lower-level items

const fs = require('fs');
const path = require('path');

// Configuration - COMPACT VERSION
const CONFIG = {
  pf2eEquipmentPath: '../pf2e/packs/pf2e/equipment',
  outputPath: './vendor-tables/level-7-compact',
  playerLevel: 7,
  levelRange: { min: 3, max: 9 }, // Exclude levels 1-2 consumables (reduces clutter)

  // Rarity weights
  rarityWeights: {
    common: 4,
    uncommon: 2,
    rare: 1,
    unique: 0
  },

  // Vendor 1: Same as regular version
  vendor1: {
    name: "General Goods & Armory",
    description: "A well-stocked shop offering quality weapons, armor, shields, and essential adventuring gear for seasoned heroes.",
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
    maxPriceGp: 1000
  },

  // Vendor 2: COMPACT VERSION - More selective
  vendor2: {
    name: "Arcane Emporium & Alchemy (Curated Selection)",
    description: "A carefully curated magical establishment with quality consumables, scrolls, and alchemical creations appropriate for experienced adventurers.",
    types: ['consumable', 'equipment'],
    requireTraits: ['consumable', 'magical', 'alchemical'],
    categories: {
      potion: true,
      elixir: true,
      talisman: true,
      scroll: true,
      oil: true,
      bomb: true,
      // Exclude some less common categories to reduce clutter
      // drug: false,
      // poison: false,
      // snare: false,
      // fulu: false,
    },
    includeWandsStavesRods: true,
    maxPriceGp: 1500, // Slightly lower cap
    // NEW: Limit consumable grades
    preferHigherGrades: true, // Only include moderate+ for levels below player level
  }
};

// Helper function to generate a random ID
function generateId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Helper function to read all equipment files
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

// Helper function to check item grade
function getItemGrade(itemName) {
  const lowerName = itemName.toLowerCase();
  if (lowerName.includes('(lesser)') || lowerName.includes('(minor)')) return 'lesser';
  if (lowerName.includes('(moderate)')) return 'moderate';
  if (lowerName.includes('(greater)')) return 'greater';
  if (lowerName.includes('(major)')) return 'major';
  return 'base';
}

// Helper function to check if item matches vendor criteria
function matchesVendorCriteria(item, vendorConfig) {
  const level = item.system?.level?.value ?? 0;
  const rarity = item.system?.traits?.rarity ?? 'common';
  const traits = item.system?.traits?.value ?? [];
  const category = item.system?.category;
  const price = item.system?.price?.value?.gp ?? 0;

  // Check level range
  if (level < CONFIG.levelRange.min || level > CONFIG.levelRange.max) {
    return false;
  }

  // Check rarity (exclude unique)
  if (rarity === 'unique') {
    return false;
  }

  // Check type
  if (!vendorConfig.types.includes(item.type)) {
    return false;
  }

  // Check price cap
  if (price > vendorConfig.maxPriceGp) {
    return false;
  }

  // Vendor-specific logic
  if (vendorConfig === CONFIG.vendor1) {
    if (vendorConfig.excludeTraits) {
      for (const trait of vendorConfig.excludeTraits) {
        if (traits.includes(trait)) {
          return false;
        }
      }
    }

    if (category && !vendorConfig.categories[category]) {
      return false;
    }

    return true;
  } else if (vendorConfig === CONFIG.vendor2) {
    // COMPACT VERSION: Additional filtering
    const hasRequiredTrait = vendorConfig.requireTraits.some(trait => traits.includes(trait));
    const isInCategory = category && vendorConfig.categories[category];

    // Special case: wands, staves, rods, scrolls
    if (vendorConfig.includeWandsStavesRods) {
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

    // COMPACT FILTER: For lower-level consumables, only include moderate+
    if (vendorConfig.preferHigherGrades && level < CONFIG.playerLevel - 1) {
      const grade = getItemGrade(item.name);
      if (grade === 'lesser' || grade === 'minor') {
        return false; // Skip lesser/minor versions of low-level items
      }
    }

    return true;
  }

  return false;
}

// Helper function to get weight based on rarity
function getWeightForRarity(rarity) {
  return CONFIG.rarityWeights[rarity] || CONFIG.rarityWeights.common;
}

// Generate roll table from filtered items
function generateRollTable(items, vendorConfig, vendorNumber) {
  items.sort((a, b) => {
    const levelDiff = (a.system?.level?.value ?? 0) - (b.system?.level?.value ?? 0);
    if (levelDiff !== 0) return levelDiff;
    return a.name.localeCompare(b.name);
  });

  const results = [];
  let currentRange = 1;

  for (const item of items) {
    const rarity = item.system?.traits?.rarity ?? 'common';
    const weight = getWeightForRarity(rarity);

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

  const rollTable = {
    _id: generateId(),
    description: vendorConfig.description,
    displayRoll: true,
    formula: `1d${totalWeight}`,
    img: vendorNumber === 1
      ? "systems/pf2e/icons/equipment/adventuring-gear/classkit-fighter.webp"
      : "systems/pf2e/icons/unidentified_item_icons/potions.webp",
    name: `${vendorConfig.name} (Level ${CONFIG.playerLevel})`,
    ownership: {
      default: 0
    },
    replacement: true,
    results: results
  };

  return rollTable;
}

// Main function
function main() {
  console.log('=== COMPACT VERSION ===');
  console.log('This version reduces item count by:');
  console.log('  - Starting from level 3 instead of level 1');
  console.log('  - Excluding lesser/minor grades for lower-level items');
  console.log('  - Slightly lower price cap for Vendor 2');
  console.log();

  console.log('Reading equipment data...');
  const allEquipment = readAllEquipment();
  console.log(`Found ${allEquipment.length} equipment items.`);

  const outputDir = path.resolve(__dirname, CONFIG.outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('\nGenerating Vendor 1 (General Goods & Armory)...');
  const vendor1Items = allEquipment.filter(item => matchesVendorCriteria(item, CONFIG.vendor1));
  console.log(`  Found ${vendor1Items.length} matching items.`);

  const vendor1Table = generateRollTable(vendor1Items, CONFIG.vendor1, 1);
  const vendor1Path = path.join(outputDir, 'vendor-1-general-armory.json');
  fs.writeFileSync(vendor1Path, JSON.stringify(vendor1Table, null, 2));
  console.log(`  Saved to ${vendor1Path}`);
  console.log(`  Roll formula: ${vendor1Table.formula} (${vendor1Table.results.length} entries)`);

  const vendor1Rarities = vendor1Items.reduce((acc, item) => {
    const rarity = item.system?.traits?.rarity ?? 'common';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});
  console.log('  Rarity breakdown:', vendor1Rarities);

  console.log('\nGenerating Vendor 2 (Arcane Emporium & Alchemy - COMPACT)...');
  const vendor2Items = allEquipment.filter(item => matchesVendorCriteria(item, CONFIG.vendor2));
  console.log(`  Found ${vendor2Items.length} matching items (vs 1754 in full version).`);

  const vendor2Table = generateRollTable(vendor2Items, CONFIG.vendor2, 2);
  const vendor2Path = path.join(outputDir, 'vendor-2-arcane-alchemy.json');
  fs.writeFileSync(vendor2Path, JSON.stringify(vendor2Table, null, 2));
  console.log(`  Saved to ${vendor2Path}`);
  console.log(`  Roll formula: ${vendor2Table.formula} (${vendor2Table.results.length} entries)`);

  const vendor2Rarities = vendor2Items.reduce((acc, item) => {
    const rarity = item.system?.traits?.rarity ?? 'common';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});
  console.log('  Rarity breakdown:', vendor2Rarities);

  console.log('\n✅ COMPACT vendor tables generated successfully!');
  console.log(`\nCompact version reduces clutter while maintaining variety.`);
}

main();
