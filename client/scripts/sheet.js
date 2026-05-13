let char = null
let charClass = null
let charSubClass = null
let charRace = new CharacterRace()
let charBackground = null

function _updateAbilityDisp(ability)
{
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

function _updateSaveDisp(ability)
{
    let el = document.getElementById(`save.${ability}`)
    let mod = char.getSave(ability)
    el.textContent = addModSign(mod);

    if (mod < 0)
    {
        el.classList.add('modifierNeg')
        el.classList.remove('modifierProf')
        el.classList.remove('modifierExp')
    }
    else {
        el.classList.remove('modifierNeg')
        let prof = char.saveThrows[ability]
        if (prof == 1)
        {
            el.classList.add('modifierProf')
            el.classList.remove('modifierExp')
        }
        else if (prof == 2)
        {
            el.classList.remove('modifierProf')
            el.classList.add('modifierExp')
        }
    }
}

function _updateSkillDisp(skill)
{
    let el = document.getElementById(`skill.${skill}`)
    let mod = char.getSkill(skill)
    el.textContent = addModSign(mod);
    
    if (mod < 0)
    {
        el.classList.add('modifierNeg')
        el.classList.remove('modifierProf')
        el.classList.remove('modifierExp')
    }
    else {
        el.classList.remove('modifierNeg')
        let prof = char.skills[skill]
        if (prof == 1)
        {
            el.classList.add('modifierProf')
            el.classList.remove('modifierExp')
        }
        else if (prof == 2)
        {
            el.classList.remove('modifierProf')
            el.classList.add('modifierExp')
        }
    }
}

function setupSkills()
{
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

function updateAbilities()
{
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

function loadCharacter(json)
{
    char = new Character("")
    Object.assign(char, json);
    fetchClass()
    fetchSubClass()
    fetchRace()
    fetchBackground()
    updateCharacter()
}


function updateCharacter()
{

    document.getElementById('profBonus').textContent = addModSign(char.proficiencyBonus)
    updateAbilities()

    document.getElementById("sheet.characterName").textContent = char.name;
    document.title = `${char.name} - Character Sheet`

    document.getElementById('char.level').textContent = char.level

    document.getElementById('char.init').innerHTML = addModSign(toMod(char.abilities.dex))
    document.getElementById('char.speed').innerHTML = char.speed
    
    document.getElementById('char.maxHP').innerHTML = char.maxHp
    document.getElementById('char.hp').innerHTML = char.hp
    document.getElementById('char.tempHP').innerHTML = char.tempHp
    
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
    }
}

function loadSpell(lvl, id) {
    const el = document.createElement('div')
    el.classList.add("spellHeader")
    let atWill = false
    if (typeof (id) == 'object') {
        atWill = id.atWill
        id = id.id
    }
    fetch(`/data/spell/lvl${lvl}/${id}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        const spell = Object.assign(new Spell(), data)
        const name = document.createElement('h4')
        name.classList.add("spellName")
        name.innerHTML = spell.displayName
        el.appendChild(name)
        const tag = document.createElement('span')
        let t = ""
        if (atWill) {
            t = "At Will, "
        }
        if (spell.castingTime == 'action') {
            t += "A"
        } else if (spell.castingTime == 'bonusAction') {
            t += "BA"
        } else if (spell.castingTime == 'reaction') {
            t += "R"
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
        tag.innerHTML = t
        el.appendChild(tag)
    }).catch(err => {
        console.error(`Error loading spell`, err)
    })
    return el
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

function fetchCharacter(charId) {
    fetch(`/character/data/${charId}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        loadCharacter(data)
    }).catch(err => {
        console.error(`Error loading default character`, err)
    })
}

function fetchClass() {
    fetch(`/data/class/${char.class}`).then(rsp => {
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
            document.getElementById('spell.modifier').innerHTML = addModSign(interpFunction(spellCasting.mod, char))
            document.getElementById('spell.saveDC').innerHTML = interpFunction(spellCasting.save, char)
        }
    }).catch(err => {
        console.error(`Error loading class`, err)
    })
}

function fetchSubClass() {
    if (char.subclass == '')
        return
    fetch(`/data/subclass/${char.subclass}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        charSubClass = Object.assign(new CharacterSubClass(), data)
        if (charClass != null)
            document.getElementById('char.class').textContent = `${charSubClass.displayName} ${charClass.displayName}`
    }).catch(err => {
        console.error(`Error loading sub class`, err)
    })
}

function fetchRace() {
    fetch(`/data/race/${char.race}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        charRace = Object.assign(new CharacterRace(), data)
        document.getElementById('char.race').textContent = charRace.displayName
        const featDiv = document.getElementById('char.features')
        charRace.features.forEach(feat => {
            const div = document.createElement('div')
            div.classList.add('feature')
            featDiv.appendChild(div)
            const name = document.createElement('p')
            name.classList.add('featureName')
            name.innerHTML = feat.displayName
            div.appendChild(name)
            if (typeof (feat.description) == 'string') {
                const desc = document.createElement('p')
                desc.innerHTML = feat.description
                div.appendChild(desc)
            } else {
                feat.description.forEach(line => {
                    const el = document.createElement('p')
                    el.innerHTML = line
                    div.appendChild(el)
                })
            }
        })
    }).catch(err => {
        console.error(`Error loading race`, err)
    })
}

function fetchBackground() {
    fetch(`/data/background/${char.background}`).then(rsp => {
        return rsp.json()
    }).then(data => {
        charBackground = Object.assign(new Background(), data)
        document.getElementById('char.background').textContent = charBackground.displayName
        const featDiv = document.getElementById('char.features')
        charBackground.features.forEach(feat => {
            const div = document.createElement('div')
            div.classList.add('feature')
            featDiv.appendChild(div)
            const name = document.createElement('p')
            name.classList.add('featureName')
            name.innerHTML = feat.displayName
            div.appendChild(name)
            if (typeof (feat.description) == 'string') {
                const desc = document.createElement('p')
                desc.innerHTML = feat.description
                div.appendChild(desc)
            } else {
                feat.description.forEach(line => {
                    const el = document.createElement('p')
                    el.innerHTML = line
                    div.appendChild(el)
                })
            }
        })
    }).catch(err => {
        console.error(`Error loading background`, err)
    })
}

fetchCharacter(getQueryParam("id") || 'ventris')