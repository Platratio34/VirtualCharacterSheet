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
function interpFunction(func, char) {
    func = func.replace('$STR', toMod(char.abilities.str))
    func = func.replace('$DEX', toMod(char.abilities.dex))
    func = func.replace('$CON', toMod(char.abilities.con))
    func = func.replace('$INT', toMod(char.abilities.int))
    func = func.replace('$WIS', toMod(char.abilities.wis))
    func = func.replace('$CHA', toMod(char.abilities.cha))
    func = func.replace('$PROF', char.proficiencyBonus)
    func = func.replace('$LVL', char.level)
    return func
}
function evalFunction(func, char) {
    return eval(interpFunction(func, char))
}