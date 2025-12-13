#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  pf2eEquipmentPath: '../pf2e/packs/pf2e/equipment',
  outputPath: './vendor-tables/level-7',
  playerLevel: 7,
  levelRange: { min: 1, max: 9 }, // For level 7 players, show items from level 1-9

  // Rarity weights
  rarityWeights: {
    common: 4,
    uncommon: 2,
    rare: 1,
    unique: 0 // Exclude unique items
  },

  // Vendor 1: General Goods & Weapons/Armor Shop
  vendor1: {
    name: "General Goods & Armory",
    description: "A well-stocked shop offering quality weapons, armor, shields, and essential adventuring gear for seasoned heroes.",
    types: ['weapon', 'armor', 'shield', 'equipment'],
    categories: {
      // Weapons
      simple: true,
      martial: true,
      advanced: true,
      unarmed: true,
      // Armor
      light: true,
      medium: true,
      heavy: true,
      // Equipment categories we want
      adventuring_gear: true,
      general: true
    },
    excludeTraits: ['consumable', 'magical'], // Exclude consumables and inherently magical items
    maxPriceGp: 1000 // Reasonable price cap for mundane goods
  },

  // Vendor 2: Magic Shop (Consumables, Scrolls, Magic Items, Alchemy)
  vendor2: {
    name: "Arcane Emporium & Alchemy",
    description: "A mystical establishment specializing in magical consumables, scrolls, potions, elixirs, and alchemical creations.",
    types: ['consumable', 'equipment'],
    requireTraits: ['consumable', 'magical', 'alchemical'], // Must have at least one of these
    categories: {
      potion: true,
      elixir: true,
      talisman: true,
      scroll: true,
      oil: true,
      bomb: true,
      drug: true,
      poison: true,
      snare: true,
      fulu: true,
      ammunition: true, // Magical ammunition
    },
    includeWandsStavesRods: true, // Include wands, staves, rods even if not consumable
    maxPriceGp: 2000 // Higher price cap for magical items
  }
};

// Helper function to generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 18);
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
    // Vendor 1: Exclude items with consumable or magical traits
    if (vendorConfig.excludeTraits) {
      for (const trait of vendorConfig.excludeTraits) {
        if (traits.includes(trait)) {
          return false;
        }
      }
    }

    // Check if category is allowed
    if (category && !vendorConfig.categories[category]) {
      return false;
    }

    return true;
  } else if (vendorConfig === CONFIG.vendor2) {
    // Vendor 2: Must have at least one required trait OR be in allowed category
    const hasRequiredTrait = vendorConfig.requireTraits.some(trait => traits.includes(trait));
    const isInCategory = category && vendorConfig.categories[category];

    // Special case: wands, staves, rods
    if (vendorConfig.includeWandsStavesRods) {
      if (item.name.toLowerCase().includes('wand') ||
          item.name.toLowerCase().includes('staff') ||
          item.name.toLowerCase().includes('rod') ||
          item.name.toLowerCase().includes('scroll')) {
        return true;
      }
    }

    return hasRequiredTrait || isInCategory;
  }

  return false;
}

// Helper function to get weight based on rarity
function getWeightForRarity(rarity) {
  return CONFIG.rarityWeights[rarity] || CONFIG.rarityWeights.common;
}

// Generate roll table from filtered items
function generateRollTable(items, vendorConfig, vendorNumber) {
  // Sort items by level, then alphabetically
  items.sort((a, b) => {
    const levelDiff = (a.system?.level?.value ?? 0) - (b.system?.level?.value ?? 0);
    if (levelDiff !== 0) return levelDiff;
    return a.name.localeCompare(b.name);
  });

  // Build results array with weights
  const results = [];
  let currentRange = 1;

  for (const item of items) {
    const rarity = item.system?.traits?.rarity ?? 'common';
    const weight = getWeightForRarity(rarity);

    if (weight === 0) continue; // Skip items with 0 weight

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

  // Calculate total range
  const totalWeight = currentRange - 1;

  // Create roll table
  const rollTable = {
    _id: generateId(),
    description: vendorConfig.description,
    displayRoll: true,
    formula: `1d${totalWeight}`,
    img: vendorNumber === 1
      ? "systems/pf2e/icons/equipment/adventuring-gear/classkit-fighter.webp"
      : "systems/pf2e/icons/equipment/consumables/potions/potions.webp",
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
  console.log('Reading equipment data...');
  const allEquipment = readAllEquipment();
  console.log(`Found ${allEquipment.length} equipment items.`);

  // Create output directory
  const outputDir = path.resolve(__dirname, CONFIG.outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate Vendor 1 table
  console.log('\nGenerating Vendor 1 (General Goods & Armory)...');
  const vendor1Items = allEquipment.filter(item => matchesVendorCriteria(item, CONFIG.vendor1));
  console.log(`  Found ${vendor1Items.length} matching items.`);

  const vendor1Table = generateRollTable(vendor1Items, CONFIG.vendor1, 1);
  const vendor1Path = path.join(outputDir, 'vendor-1-general-armory.json');
  fs.writeFileSync(vendor1Path, JSON.stringify(vendor1Table, null, 2));
  console.log(`  Saved to ${vendor1Path}`);
  console.log(`  Roll formula: ${vendor1Table.formula} (${vendor1Table.results.length} entries)`);

  // Print rarity breakdown for Vendor 1
  const vendor1Rarities = vendor1Items.reduce((acc, item) => {
    const rarity = item.system?.traits?.rarity ?? 'common';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});
  console.log('  Rarity breakdown:', vendor1Rarities);

  // Generate Vendor 2 table
  console.log('\nGenerating Vendor 2 (Arcane Emporium & Alchemy)...');
  const vendor2Items = allEquipment.filter(item => matchesVendorCriteria(item, CONFIG.vendor2));
  console.log(`  Found ${vendor2Items.length} matching items.`);

  const vendor2Table = generateRollTable(vendor2Items, CONFIG.vendor2, 2);
  const vendor2Path = path.join(outputDir, 'vendor-2-arcane-alchemy.json');
  fs.writeFileSync(vendor2Path, JSON.stringify(vendor2Table, null, 2));
  console.log(`  Saved to ${vendor2Path}`);
  console.log(`  Roll formula: ${vendor2Table.formula} (${vendor2Table.results.length} entries)`);

  // Print rarity breakdown for Vendor 2
  const vendor2Rarities = vendor2Items.reduce((acc, item) => {
    const rarity = item.system?.traits?.rarity ?? 'common';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});
  console.log('  Rarity breakdown:', vendor2Rarities);

  console.log('\n✅ Vendor tables generated successfully!');
  console.log(`\nTo use these tables in Foundry VTT:`);
  console.log(`1. Go to the "Rollable Tables" tab`);
  console.log(`2. Click "Create Rollable Table"`);
  console.log(`3. Click the import button (folder icon)`);
  console.log(`4. Select the JSON file`);
  console.log(`5. Roll away!`);
}

// Run the script
main();
