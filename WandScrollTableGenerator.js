/*
Wand and Scroll Table Generator
Creates a roll table with all possible wands/scrolls of specified rank, tradition, and rarity
*/

async function createWandScrollTable() {
    // Get user input through dialog
    const inputs = await Dialog.wait({
        title: "Wand/Scroll Table Generator",
        content: `
            <table>
                <tr>
                    <th style="text-align:center">Type:</th>
                    <td width="20%"><select id="type" autofocus>
                        <option value="scroll">Scroll</option>
                        <option value="wand">Wand</option>
                    </select></td>
                </tr>
                <tr>
                    <th style="text-align:center">Spell Rank:</th>
                    <td>
                        <select id="level">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th style="text-align:center">Tradition:</th>
                    <td>
                        <select id="trad">
                            <option value="random">Random</option>
                            <option value="arcane">Arcane</option>
                            <option value="divine">Divine</option>
                            <option value="occult">Occult</option>
                            <option value="primal">Primal</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th style="text-align:center">Rarity:</th>
                    <td><select id="rarity">
                        <option value="any">Any</option>
                        <option value="common">Common</option>
                        <option value="uncommon">Uncommon</option>
                        <option value="rare">Rare</option>
                    </select></td>
                </tr>
            </table>    
        `,
        buttons: {
            ok: {
                label: "Create Table",
                callback: (html) => { 
                    return [ 
                        html[0].querySelector("#type").value,
                        parseInt(html[0].querySelector("#level").value),
                        html[0].querySelector("#trad").value,
                        html[0].querySelector("#rarity").value
                    ]; 
                },
            },
            close: {
                label: "Close",
            }
        },
        close: () => { return "close" },
        default: "ok",
    },{width:"auto"});
    
    if (inputs === "close") { return }
    
    const [type, level, tradition, rarity] = inputs;
    
    // Validate input
    if (level > 10) { 
        ui.notifications.info("There are no spells above rank 10"); 
        return;
    }
    
    if (type !== "scroll" && level > 9) { 
        ui.notifications.info("There are no wands for spells above rank 9"); 
        return;
    }
    
    // Get all spells of the specified rank
    const compendiums = ["pf2e.spells-srd"];
    const aCSpells = game.packs.filter(c => compendiums.includes(c.collection));
    
    let spells = [];
    for (const s of aCSpells) {
        const index = (await s.getIndex({fields: ["system.level.value","system.slug","system.traits","system.ritual","uuid","system.area","system.duration","system.range","system.time"]})).filter(f => 
            !f.system.traits.value.includes("cantrip") && 
            !(f.system.ritual ??= false) && 
            !f.system.traits.value.includes("focus") && 
            f.system.level.value === level
        );
        
        index.forEach( x => {
            x.compendium = s.collection;
            spells.push(x);
        });
        
        if (rarity !== "any") { 
            spells = spells.filter(r => r.system.traits.rarity === rarity) 
        }
        
        if (tradition !== "random") { 
            spells = spells.filter(r => r.system.traits.traditions.includes(tradition)) 
        }
    }

    if (spells.length < 1) { 
        ui.notifications.info(`There are no ${rarity} spells at rank ${level}`); 
        return;
    }
    
    // Create roll table
    const tableName = `${type === "scroll" ? "Scroll" : "Wand"} Table - Rank ${level} ${tradition === "random" ? "" : tradition} ${rarity === "any" ? "" : rarity}`;
    
    const table = await RollTable.create({
        name: tableName,
        description: `Generated ${type} table for rank ${level} spells`,
        formula: `1d${spells.length}`,
        replacement: true,
        displayRoll: true
    });
    
    // Add entries to the table using proper format for Foundry VTT
    const tableEntries = [];
    
    for (let i = 0; i < spells.length; i++) {
        const spell = spells[i];
        const entryName = `${type === "scroll" ? "Scroll of " : "Wand of "}${spell.name} (Rank ${level})`;
        
        // Create proper table entry object
        const entry = {
            name: entryName,
            uuid: spell.uuid,
            weight: 1,
            range: [i+1, i+1]
        };
        
        tableEntries.push(entry);
    }
    
    // Use the proper method to create table entries
    await table.createEmbeddedDocuments("TableEntry", tableEntries);
    
    ui.notifications.info(`Created roll table "${tableName}" with ${spells.length} entries`);
    console.log(`Created roll table "${tableName}" with ${spells.length} entries`);
}

// Execute the function
createWandScrollTable();