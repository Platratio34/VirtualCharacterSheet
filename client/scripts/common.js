const queryParameters = new URLSearchParams(window.location.search);

function getQueryParam(param) {
    return queryParameters.get(param);
}

function addModSign(mod) {
    if (mod > 0)
        return "+" + mod
    return mod;
}

function toMod(value) {
    return Math.floor((value - 10) / 2)
}

function capitalize(str) {
    return (str.charAt(0).toUpperCase() + str.slice(1)).replace('_', ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
}

function cleanFunction(func) {
    func = func.replace('$STR', "Str")
    func = func.replace('$DEX', "Dex")
    func = func.replace('$CON', "Con")
    func = func.replace('$INT', "Int")
    func = func.replace('$WIS', "Wis")
    func = func.replace('$CHA', "Cha")
    func = func.replace('$PROF', "Prof")
    func = func.replace('$LVL', "Level")
    func = func.replace(/\$max\(([^,]+),\s*([^\)]+)\)/, '$1 (max $2)')
    return func
}

function max(a, b) {
    return a <= b ? a : b;
}

function interpFunction(func, char, display=false) {
    func = func.replace('$STR', toMod(char.abilities.str))
    func = func.replace('$DEX', toMod(char.abilities.dex))
    func = func.replace('$CON', toMod(char.abilities.con))
    func = func.replace('$INT', toMod(char.abilities.int))
    func = func.replace('$WIS', toMod(char.abilities.wis))
    func = func.replace('$CHA', toMod(char.abilities.cha))
    func = func.replace('$PROF', char.proficiencyBonus)
    func = func.replace('$LVL', char.level)
    if (display) {
        func = func.replace(/\$max\(([^,]+),\s*(%d+)\)/, '$1 (max $2)')
    } else {
        func = func.replace('$max(', "max(")
    }
    return func
}

function evalFunction(func, char) {
    return eval(interpFunction(func, char))
}