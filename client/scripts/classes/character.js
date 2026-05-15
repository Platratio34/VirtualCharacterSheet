const skillToAbility = {
    acrobatic: 'dex',
    animalHandling: 'wis',
    arcana: 'int',
    athletics: 'str',
    deception: 'cha',
    history: 'int',
    insight: 'wis',
    intimidation: 'cha',
    investigation: 'int',
    medicine: 'wis',
    nature: 'int',
    perception: 'wis',
    performance: 'cha',
    persuasion: 'cha',
    religion: 'int',
    slightOfHand: 'dex',
    stealth: 'dex',
    survival: 'wis'
}

class Character {
    constructor(name) {
        this.name = name
        this.level = 1
        this.class = ""
        this.subclass = ""
        this.race = ""
        this.background = ""
        this.abilities = {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10
        }
        this.saveThrows = {
            str: 0,
            dex: 0,
            con: 0,
            int: 0,
            wis: 0,
            cha: 0
        }
        this.skills = {
            acrobatic: 0,
            animalHandling: 0,
            arcana: 0,
            athletics: 0,
            deception: 0,
            history: 0,
            insight: 0,
            intimidation: 0,
            investigation: 0,
            medicine: 0,
            nature: 0,
            perception: 0,
            performance: 0,
            persuasion: 0,
            religion: 0,
            slightOfHand: 0,
            stealth: 0,
            survival: 0
        }
        this.proficiencyBonus = 2
        this.hp = 0
        this.maxHp = 0
        this.tempHp = 0
        this.hitDice = 1
        this.hitDiceTotal = 1
        this.hitDiceType = 8

        this.spells = null
        this.spellSpots = {}
        this.spellSlotsUsed = {}
        this.lanugages = []
        this.equipmentProficiencies = []
        this.features = []
        this.coinage = { pp: 0, gp: 0, sp: 0, cp: 0 }
        this.inventory = []
    }

    toMod(value)
    {
        return Math.floor((value - 10) / 2)
    }

    toAbilityId(ability)
    {
        ability = ability.toLowerCase()
        switch (ability) {
            case 'str':
            case 'strength':
                return "str"
            
            case 'dex':
            case 'dexterity':
                return 'dex'
            
            case 'con':
            case 'constitution':
                return 'con'
            
            case 'int':
            case 'intelligence':
                return 'int'
            
            case 'wis':
            case 'wisdom':
                return 'wis'
            
            case 'cha':
            case 'charisma':
                return 'cha'
        
            default:
                break;
        }
    }

    getAbility(ability)
    {
        return this.abilities[this.toAbilityId(ability)]
    }

    getSave(ability)
    {
        ability = this.toAbilityId(ability)
        let v = this.toMod(this.getAbility(ability))
        return v + (this.proficiencyBonus * this.saveThrows[ability])
    }

    getSkill(skill)
    {
        let v = this.toMod(this.getAbility(skillToAbility[skill]))
        return v + (this.proficiencyBonus * this.skills[skill])
    }
}