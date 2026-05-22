let char = null
let charClass = null
let charSubClass = null
let charRace = new CharacterRace()
let charBackground = null
let charId = getQueryParam("id") ?? 'ventris'

let dirty = false
let badPsw = false
function makeDirty() {
    if (!dirty)
        console.log("Marked dirty")
    dirty = true
}

function _updateAbilityDisp(ability) {
    let val = char.getAbility(ability)
    document.getElementById(`ability.${ability}.val`).innerHTML = val;
    let mod = char.toMod(val)
    let modEl = document.getElementById(`ability.${ability}.mod`)
    modEl.textContent = addModSign(mod);

    if (mod < 0)
        modEl.classList.add('modifierNeg')
    else
        modEl.classList.remove('modifierNeg')
}

function _updateSaveDisp(ability) {
    let el = document.getElementById(`save.${ability}`)
    let mod = char.getSave(ability)
    el.textContent = addModSign(mod);

    if (mod < 0) {
        el.classList.add('modifierNeg')
        el.classList.remove('modifierProf')
        el.classList.remove('modifierExp')
    }
    else {
        el.classList.remove('modifierNeg')
        let prof = char.saveThrows[ability]
        if (prof == 1) {
            el.classList.add('modifierProf')
            el.classList.remove('modifierExp')
        }
        else if (prof == 2) {
            el.classList.remove('modifierProf')
            el.classList.add('modifierExp')
        }
    }
}

function _updateSkillDisp(skill) {
    let el = document.getElementById(`skill.${skill}`)
    let mod = char.getSkill(skill)
    el.textContent = addModSign(mod);
    
    if (mod < 0) {
        el.classList.add('modifierNeg')
        el.classList.remove('modifierProf')
        el.classList.remove('modifierExp')
    }
    else {
        el.classList.remove('modifierNeg')
        let prof = char.skills[skill]
        if (prof == 1) {
            el.classList.add('modifierProf')
            el.classList.remove('modifierExp')
        }
        else if (prof == 2) {
            el.classList.remove('modifierProf')
            el.classList.add('modifierExp')
        }
    }
}

function setupSkills() {
    let tbl = document.getElementById('skills')
    Object.keys(skillToAbility).forEach(skill => {
        let tr = document.createElement('tr')
        tbl.appendChild(tr)
        let tdM = document.createElement('td')
        tr.appendChild(tdM)
        tdM.id = `skill.${skill}`
        tdM.classList.add('modifier')
        tdM.innerHTML = '0'
        let tdN = document.createElement('td')
        tr.appendChild(tdN)
        tdN.textContent = capitalize(skill)
        let spn = document.createElement('span')
        tdN.appendChild(spn)
        spn.classList.add('skillAbility')
        spn.textContent = ` (${capitalize(skillToAbility[skill])})`
    })
}
setupSkills()

function updateAbilities() {
    _updateAbilityDisp("str")
    _updateAbilityDisp("dex")
    _updateAbilityDisp("con")
    _updateAbilityDisp("int")
    _updateAbilityDisp("wis")
    _updateAbilityDisp("cha")


    _updateSaveDisp("str")
    _updateSaveDisp("dex")
    _updateSaveDisp("con")
    _updateSaveDisp("int")
    _updateSaveDisp("wis")
    _updateSaveDisp("cha")

    Object.keys(skillToAbility).forEach(skill => {
        _updateSkillDisp(skill)
    })
}

function loadCharacter(json) {
    char = new Character("")
    Object.assign(char, json);
    fetchClass()
    fetchSubClass()
    fetchRace()
    fetchBackground()
    if(char.features) {
        char.features.forEach(addFeature)
    }
    updateCharacter()
}


function updateCharacter() {

    document.getElementById('profBonus').textContent = addModSign(char.proficiencyBonus)
    updateAbilities()

    document.getElementById("sheet.characterName").textContent = char.name;
    document.title = `${char.name} - Character Sheet`

    document.getElementById('char.level').textContent = char.level

    let dexMod = toMod(char.abilities.dex)
    document.getElementById('char.init').innerHTML = addModSign(dexMod)
    document.getElementById('char.ac').innerHTML = 10 + dexMod
    document.getElementById('char.speed').innerHTML = char.speed
    
    document.getElementById('char.maxHP').innerHTML = char.maxHp
    updateHP()
    
    if (char.languages) {
        const langProf = document.getElementById('char.languages')
        char.languages.forEach(lang => {
            const el = document.createElement('p')
            el.innerHTML = lang
            langProf.appendChild(el)
        })
    }
    if (char.equipmentProficiencies) {
        const equipProf = document.getElementById('char.equipmentProficiencies')
        char.equipmentProficiencies.forEach(equip => {
            const el = document.createElement('p')
            el.innerHTML = capitalize(equip)
            equipProf.appendChild(el)
        })
    }
    if (char.otherProficiencies) {
        const otherProf = document.getElementById('char.otherProficiencies')
        char.otherProficiencies.forEach(prof => {
            const el = document.createElement('p')
            el.innerHTML = capitalize(prof)
            otherProf.appendChild(el)
        })
    }

    if(char.inventory) {
        char.inventory.forEach(addItem)
    }
    updateCoinage()

    if (char.spells) {
        if (char.spells.lvl0) {
            const lvl0 = document.getElementById('spells.lvl0')
            char.spells.lvl0.forEach(id => {
                lvl0.appendChild(loadSpell(0, id))
            })
        }
        if (char.spells.lvl1) {
            const lvl1 = document.getElementById('spells.lvl1')
            char.spells.lvl1.forEach(id => {
                lvl1.appendChild(loadSpell(1, id))
            })
        }
        if (char.spells.lvl2) {
            const lvl2 = document.getElementById('spells.lvl2')
            char.spells.lvl2.forEach(id => {
                lvl2.appendChild(loadSpell(2, id))
            })
        }
        if (char.spells.lvl3) {
            const lvl3 = document.getElementById('spells.lvl3')
            char.spells.lvl3.forEach(id => {
                lvl3.appendChild(loadSpell(3, id))
            })
        }
        if (char.spells.lvl4) {
            const lvl4 = document.getElementById('spells.lvl4')
            char.spells.lvl4.forEach(id => {
                lvl4.appendChild(loadSpell(4, id))
            })
        }
        if (char.spells.lvl5) {
            const lvl5 = document.getElementById('spells.lvl5')
            char.spells.lvl5.forEach(id => {
                lvl5.appendChild(loadSpell(5, id))
            })
        }
        for (let i = 1; i <= 5; i++) {
            updateSpellSlots(i)
        }
    }

    document.getElementById('char.notes').value = char.notes ?? ''
}

function updateSpellSlots(level) {
    level = `lvl${level}`
    if (!char.spellSlots)
        document.getElementById(`spells.${level}.slots`).innerHTML = `-/- Remaning`
    let used = char.spellSlotsUsed[level] ?? 0
    let total = char.spellSlots[level] ?? 0
    document.getElementById(`spells.${level}.slots`).innerHTML = `${total == 0 ? '-' : total-used}/${total == 0 ? '-' : total} Remaning`
}

function updateHP() {
    document.getElementById('char.hp').innerHTML = char.hp
    document.getElementById('char.tempHP').value = char.tempHp
}

function updateCoinage() {
    if (!char.coinage)
        return
    document.getElementById('pp').value = char.coinage.pp ?? 0
    document.getElementById('gp').value = char.coinage.gp ?? 0
    document.getElementById('sp').value = char.coinage.sp ?? 0
    document.getElementById('cp').value = char.coinage.cp ?? 0
}

function makeDescriptionEls(parent, description, alt=null) {
    if (typeof (description) == 'string') {
        const desc = document.createElement('p')
        desc.innerHTML = description
        parent.appendChild(desc)
    } else if(typeof(description) == 'object') {
        description.forEach(line => {
            const el = document.createElement('p')
            el.innerHTML = line
            parent.appendChild(el)
        })
    } else if(alt) {
        const desc = document.createElement('p')
        desc.innerHTML = alt
        parent.appendChild(desc)
    }
}

function loadSpell(lvl, id) {
    const el = document.createElement('div')
    el.classList.add("spellDiv")
    let atWill = false
    let source = null
    if (typeof (id) == 'object') {
        atWill = id.atWill
        source = id.source
        id = id.id
    }
    fetch(`data/spell/lvl${lvl}/${id}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        const spell = Object.assign(new Spell(), data)

        let action = {
            displayName: spell.displayName,
            type: spell.castingTime,
            damage: spell.damage,
            healing: spell.healing,
            save: spell.save,
            halfSave: spell.halfSave,
            range: spell.range
        }
        if (spell.damage && !(spell.save || spell.halfSave)) {
            action.attackBonus = charClass.features.spellCasting.mod
        }
        addAction(action)
        const name = document.createElement('button')
        name.type = 'button'
        const id = `item_${nextFeatId}`
        nextFeatId++;
        name.dataset.bsToggle = "collapse"
        name.dataset.bsTarget = "#" + id

        name.classList.add("spellName")
        name.innerHTML = spell.displayName
        el.appendChild(name)

        let t = ""
        if (source != null) {
            t += capitalize(source)+", "
        }
        if (atWill) {
            t += "At Will, "
        }
        if (spell.castingTime == 'action') {
            t += "A"
        } else if (spell.castingTime == 'bonusAction') {
            t += "BA"
        } else if (spell.castingTime == 'reaction') {
            t += "R"
        } else if (spell.castingTime == 'free') {
            t += "F"
        }
        t += ", " + spell.components
        if (spell.range) {
            t += ", " + spell.range
        }
        if (spell.duration) {
            t += ", " + spell.duration
            if (spell.concentration)
                t += " (C)"
        }
        if (spell.damage) {
            t += ", " + spell.damage
        }
        if (spell.save) {
            t += `, ${abilityToName(spell.save)} Save`
        } else if (spell.halfSave) {
            t += `, 1/2 ${abilityToName(spell.halfSave)} Save`
        }
        el.appendChild(makeTag(t))
        
        const bodyDiv = document.createElement('div')
        bodyDiv.classList.add("collapse")
        bodyDiv.id = id
        el.appendChild(bodyDiv)
        makeDescriptionEls(bodyDiv, spell.description)

        if (spell.higherLevels) {
            const hl = document.createElement('p')
            hl.innerHTML = `<b>At Higher Levels:</b>`
            bodyDiv.appendChild(hl)
            makeDescriptionEls(bodyDiv, spell.higherLevels.description)
        }
    }).catch(err => {
        console.error(`Error loading spell`, err)
    })
    return el
}

function makeTag(text, type='p') {
    const el = document.createElement(type)
    el.classList.add('tag')
    el.innerHTML = text
    return el
}

const inventoryEl = document.getElementById('inventory')
// let inventoryEls = []
function addItem(item) {
    const div = item._div ? item._div : document.createElement('div')
    if (!item._div) {
        div.classList.add('item')
        inventoryEl.appendChild(div)
        item._div = div
    }
    if (item.id) {
        // fetch the item
        fetchItem(item)
        return
    }

    const name = document.createElement('button')
    name.classList.add('featureName')
    name.type = 'button'
    const id = `item_${nextFeatId}`
    nextFeatId++;
    name.dataset.bsToggle = "collapse"
    name.dataset.bsTarget = "#" + id
    if(!item.count || item.count == 1)
        name.innerHTML = item.displayName
    else
        name.innerHTML = `${item.displayName} (x${item.count})`
    div.appendChild(name)
    const bodyDiv = document.createElement('div')
    bodyDiv.classList.add("collapse")
    bodyDiv.id = id
    div.appendChild(bodyDiv)
    let isProcficent = false
    let tag = ''
    if (item.armorType) {
        tag += `${capitalize(item.armorType)} Armor (${cleanFunction(item.ac, char)})`
        if (char.equipmentProficiencies.includes(`armor_${item.weaponType}`)) {
            isProcficent = true
        } else if (char.equipmentProficiencies.includes(item.id)) {
            isProcficent = true
        }
        if (item.equiped) {
            document.getElementById('char.ac').innerHTML = evalFunction(item.ac, char)
        }
    }
    if (item.weaponType) {
        tag += `${capitalize(item.weaponType)} Weapon`
        if (char.equipmentProficiencies.includes(`weapon_${item.weaponType}`)) {
            isProcficent = true
        } else if (char.equipmentProficiencies.includes(item.id)) {
            isProcficent = true
        }
    }
    if (item.properties)
        item.properties.forEach(prop => {
            if (tag.length > 0)
                tag += ", "
                tag += capitalize(prop)
        })
    if (tag.length > 0) {
        bodyDiv.appendChild(makeTag(tag))
    }
    if (item.description) {
        makeDescriptionEls(bodyDiv, item.description)
    }

    if (item.actions) {
        item.actions.forEach(action => {
            if(isProcficent)
                action.attackBonus += '+$PROF'
            addAction(action)
        })
    } else if (item.use) {
        if(isProcficent)
            item.use.attackBonus += '+$PROF'
        addAction(item.use)
    } else if (item.uses) {
        item.uses.forEach(use => {
            if(isProcficent)
                use.attackBonus += '+$PROF'
            addAction(use)
        })
    }
}

function fetchItem(item) {
    fetch(`data/item/${item.id}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        data.count = item.count
        data.equiped = item.equiped
        data._div = item._div
        if(item.displayName)
            data.displayName = item.displayName
        addItem(data)
    }).catch(err => {
        console.error(`Error loading item data`, err)
    })
}

function abilityToName(id) {
    switch (id.toLowerCase()) {
        case "str":
            return "Strength"
        case "dex":
            return "Dexterity"
        case "con":
            return "Constitution"
        case "int":
            return "Intelligence"
        case "wis":
            return "Wisdom"
        case "cha":
            return "Charisma"
    
        default:
            return "Unknown"
    }
}

const normalActionsEl = document.getElementById('normalActions')
const bonusActionsEl = document.getElementById('bonusActions')
const reactionsEl = document.getElementById('reactions')
const freeActionsEl = document.getElementById('freeActions')
function addAction(action) {
    // console.log(action)
    const el = document.createElement('div')
    switch (action.type) {
        case "action":
            normalActionsEl.appendChild(el)
            break;
        case "bonusAciton":
            bonusActionsEl.appendChild(el)
            break;
        case "reaction":
            reactionsEl.appendChild(el)
            break;
        case "free":
            freeActionsEl.appendChild(el)
            break;
    
        default:
            break;
    }
    const name = document.createElement('span')
    name.innerHTML = action.displayName
    el.appendChild(name)

    let t = ''
    if (action.attackBonus) {
        if (t.length > 0)
            t += ', '
        t += addModSign(evalFunction(action.attackBonus, char))
    }
    if (action.save) {
        if (t.length > 0)
            t += ', '
        t += `${abilityToName(action.save)} Save`
    } else if (action.halfSave) {
        if (t.length > 0)
            t += ', '
        t += `1/2 ${abilityToName(action.halfSave)} Save`
    }
    if (action.range) {
        if (t.length > 0)
            t += ', '
        t += capitalize(action.range)
    }
    if (action.damage) {
        if (t.length > 0)
            t += ', '
        t += interpFunction(action.damage, char, true)
    }
    if (action.healing) {
        if (t.length > 0)
            t += ', '
        t += interpFunction(action.healing, char, true) + 'HP'
    }
    if (action.twoHanded) {
        if (t.length > 0)
            t += ', '
        t += '2H'
    }
    if (t.length > 0)
        el.appendChild(makeTag(t))
}

const featDiv = document.getElementById('char.features')
let nextFeatId = 0
let _featureCache = {}
let _featureOrder = []
function addFeature(feat) {
    if(feat == undefined) {
        console.error('Attempted to add feat, but was undefined')
        return;
    }
    if (feat.hidden || feat.lvl > char.level) {
        return;
    }

    if (!feat.source)
        feat.source = "Custom"

    // if (!_featureCache[feat.source]) {
    //     _featureCache[feat.source] = []
    //     _featureOrder.push(feat.source)
    //     _featureOrder.sort((a, b) => a.localeCompare(b))
    // }
    // _featureCache[feat.source].push(feat)
    // _featureCache[feat.source].sort((a, b) => a.displayName.localeCompare(b.displayName))

    const div = document.createElement('div')
    feat._div = div
    div.classList.add('feature')
    featDiv.appendChild(div)
    const name = document.createElement('button')
    name.classList.add('featureName')
    name.type = 'button'
    const id = `feat_${nextFeatId}`
    nextFeatId++;
    name.dataset.bsToggle = "collapse"
    name.dataset.bsTarget = "#"+id
    name.innerHTML = feat.displayName
    div.appendChild(name)
    if (feat.source) {
        div.appendChild(makeTag(feat.source))
    } else {
        div.appendChild(makeTag("Custom"))
    }
    const bodyDiv = document.createElement('div')
    bodyDiv.classList.add("collapse")
    bodyDiv.id = id
    div.appendChild(bodyDiv)
    makeDescriptionEls(bodyDiv, feat.description, 'No Description')
    
    if (feat.actions) {
        feat.actions.forEach(addAction)
    } else if (feat.use) {
        addAction(feat.use)
    }
    // _reorderFeatures()
}

function _reorderFeatures() {
    for (let i = 0; i < _featureOrder.length; i++) {
        let features = _featureCache[_featureOrder[i]]
        for (let j = 0; j < features.length; j++) {
            featDiv.appendChild(features[j]._div)
        }
    }
}

function fetchCharacter(characterId) {
    fetch(`character/data/${characterId}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        loadCharacter(data)
    }).catch(err => {
        console.error(`Error loading default character`, err)
    })
}

function fetchClass() {
    fetch(`data/class/${char.class}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        charClass = Object.assign(new CharacterClass(), data)
        if (charSubClass != null)
            document.getElementById('char.class').textContent = `${charSubClass.displayName} ${charClass.displayName}`
        else {
            document.getElementById('char.class').textContent = `${charClass.displayName}`
        }
        if (charClass.features.spellCasting) {
            const spellCasting = charClass.features.spellCasting
            document.getElementById('spell.ability').innerHTML = abilityToName(spellCasting.ability)
            document.getElementById('spell.modifier').innerHTML = addModSign(evalFunction(spellCasting.mod, char))
            document.getElementById('spell.saveDC').innerHTML = evalFunction(spellCasting.save, char)
        }
        for(let i = 1; i <= char.level; i++) {
            charClass.levels[i].features.forEach(id => {
                if(id == 'abilityScore')
                    return
                let feat = charClass.features[id]
                if(!feat) {
                    console.error(`Class menionted feature '${id}', but had no feature with that name defined`)
                    return
                }
                if(!feat.source)
                    feat.source = 'Class: '+charClass.displayName
                addFeature(feat)
            })
        }
    }).catch(err => {
        console.error(`Error loading class`, err)
    })
}

function fetchSubClass() {
    if (char.subclass == '')
        return
    fetch(`data/subclass/${char.subclass}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        charSubClass = Object.assign(new CharacterSubClass(), data)
        if (charClass != null)
            document.getElementById('char.class').textContent = `${charSubClass.displayName} ${charClass.displayName}`
        
        for(let i = 1; i <= char.level; i++) {
            charSubClass.levels[i].features.forEach(id => {
                if(id == 'abilityScore')
                    return
                let feat = charSubClass.features[id]
                if(!feat) {
                    console.error(`Class menionted feature '${id}', but had no feature with that name defined`)
                    return
                }
                if(!feat.source)
                    feat.source = 'Subclass: '+charSubClass.displayName
                addFeature(feat)
            })
        }
    }).catch(err => {
        console.error(`Error loading subclass`, err)
    })
}

function fetchRace() {
    fetch(`data/race/${char.race}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        charRace = Object.assign(new CharacterRace(), data)
        document.getElementById('char.race').textContent = charRace.displayName
        charRace.features.forEach(feat => {
            if(!feat.source)
                feat.source = 'Race: '+charRace.displayName
            addFeature(feat)
        })
    }).catch(err => {
        console.error(`Error loading race`, err)
    })
}

function fetchBackground() {
    fetch(`data/background/${char.background}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        charBackground = Object.assign(new Background(), data)
        document.getElementById('char.background').textContent = charBackground.displayName
        const featDiv = document.getElementById('char.features')
        charBackground.features.forEach(feat => {
            if (!feat.source)
                feat.source = `Background: ${charBackground.displayName}`
            addFeature(feat)
        })
    }).catch(err => {
        console.error(`Error loading background`, err)
    })
}

let _cahcedBadPsw = ''
function saveCharacter(id = charId) {
    const psw = localStorage.getItem('vcs_password_'+id) ?? localStorage.getItem('vcs_password')
    if (!psw) {
        return;
    } else if(badPsw) {
        if(badPsw == psw)
            return
        badPsw = false;
        _cahcedBadPsw = null
    }
    let msg = {
        password: psw,
        id: id,
        char: char
    }
    console.log(`Saving character ${id}`)
    fetch('character/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg, (k, v) => {
            if (k == '_el' || k == '_div' || k.startsWith("__")) {
                return undefined
            }
            return v
        })
    }).then(response => {
        response.text().then(text => {
            if(!response.ok)
                console.warn(`Save error response: ${text}`)
            else
                console.log(`Save response: ${text}`)
            if(response.status == 401) {
                console.warn('Incorrect password detected, save will not be attempted until it has changed')
                badPsw = true
                _cahcedBadPsw = psw
            }
        })
        if (!response.ok) {
            makeDirty()
        }
    }).catch(error => {
        console.error(`Save Error: ${error}`)
        makeDirty()
    })
}

const charPasswordEl = document.getElementById('savePassword');
function saveCharPassword() {
    let psw = charPasswordEl.value;
    const keyId = 'vcs_password_'+charId
    if(psw == '')
        localStorage.removeItem(keyId)
    else
        localStorage.setItem(keyId, psw)
}

function useSpellSlot(lvl, amount = 1) {
    let lvlStr = `lvl${lvl}`
    let max = char.spellSlots[lvlStr] ?? 0
    let num = char.spellSlotsUsed[lvlStr] ? char.spellSlotsUsed[lvlStr] + amount : amount
    if (num < 0)
        num = 0
    else if (num > max)
        num = max
    if (char.spellSlotsUsed[lvlStr] == num)
        return
    char.spellSlotsUsed[lvlStr] = num
    updateSpellSlots(lvl)
    makeDirty()
}

function damage(ammount) {
    if (char.tempHp > 0) {
        let n = char.tempHp - ammount
        if (n >= 0) {
            setTempHp(n)
        } else {
            setTempHp(0)
            modifyHP(n)
        }
    } else {
        modifyHP(-ammount)
    }
}

function modifyHP(ammount) {
    setHP(char.hp+ammount)
}

function setHP(newHP) {
    if (newHP > char.maxHp) {
        newHP = char.maxHp
    } else if (newHP < 0) {
        newHP = 0
    }
    if (char.hp == newHP)
        return
    char.hp = newHP
    makeDirty()
    updateHP()
}
function setTempHp(newTemp = Number(document.getElementById('char.tempHP').value)) {
    if (newTemp < 0)
        newTemp = 0
    if (newTemp == char.tempHp)
        return
    char.tempHp = newTemp
    makeDirty()
    document.getElementById('char.tempHP').value = newTemp
}

function pullCoinages() {
    let pp = Number(document.getElementById('pp').value)
    if (pp != char.coinage.pp) {
        char.coinage.pp = pp
        makeDirty()
    }
    let gp = Number(document.getElementById('gp').value)
    if (gp != char.coinage.gp) {
        char.coinage.gp = gp
        makeDirty()
    }
    let sp = Number(document.getElementById('sp').value)
    if (sp != char.coinage.sp) {
        char.coinage.sp = sp
        makeDirty()
    }
    let cp = Number(document.getElementById('cp').value)
    if (cp != char.coinage.cp) {
        char.coinage.cp = cp
        makeDirty()
    }
}

function longRest() {
    if (charClass.features.spellCasting) {
        char.spellSlotsUsed = {}
    }
    for (let i = 1; i <= 5; i++)
        updateSpellSlots(i)
    char.hp = char.maxHp
    updateHP()
    makeDirty()
}
function shortRest() {
    if (charClass.features.spellCasting) {
        if(charClass.features.spellCasting.recovery == 'shortRest')
            char.spellSlotsUsed = {}
    }
    for (let i = 1; i <= 5; i++)
        updateSpellSlots(i)
    makeDirty()
}

function updateNotes(el) {
    if (char.notes == el.value)
        return
    char.notes = el.value
    makeDirty()
}

const featureAddName = document.getElementById('feature_add_displayName')
const featureAddSource = document.getElementById('feature_add_source')
const featureAddDescription = document.getElementById('feature_add_description')
function addFormFeature() {
    let feature = {
        displayName: featureAddName.value,
        source: featureAddSource.value,
        description: featureAddDescription.value
    }
    if(feature.description.includes('\n')) {
        feature.description = feature.description.split('\n')
    }
    console.log(feature)
    addFeature(feature)
    char.features.push(feature)
    makeDirty()
}

fetchCharacter(getQueryParam("id") || 'ventris')

setInterval(() => {
    if (dirty) {
        saveCharacter()
        dirty = false
    }
}, 5000)

charPasswordEl.value = localStorage.getItem('vcs_password_'+charId)

window.addEventListener('beforeunload', (event) => {
  if (dirty) {
    event.preventDefault();
    event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
});