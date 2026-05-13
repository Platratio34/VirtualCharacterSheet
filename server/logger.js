const fs = require('fs');

function timeStamp(time) {
    if (time) {
        time = new Date(time)
    } else {
        time = new Date()
    }
    return time.toLocaleString('en-US', {hour12:false}).replace(', ' , ' ')
}

const regex = /[/:]/g
const logFileName = `${timeStamp().replace(', ','_').replace(regex,'-')}.log`

const util = require('util');
const fileLog = undefined // fs.createWriteStream(__dirname + '/logs/' + logFileName, { flags: 'w' });
let errorLog = undefined
const latestLog = fs.createWriteStream(__dirname + '/latest.log', { flags: 'w' });
const logOutput = process.stdout;

function format(t, m) {
    return `${timeStamp()} | ${t} | ${util.format(m)}\n`
}

function toFile(msg) {
    if (fileLog) {
        fileLog.write(msg)
    }
}

function toError(msg) {
    if (!errorLog) {
        errorLog = fs.createWriteStream(__dirname + '/logs/error_' + logFileName, { flags: 'w' });
    }
    errorLog.write(msg)
}

console.logOnly = (e) => {
    const msg = format('INFO', e)
    latestLog.write(msg);
    toFile(msg);
};

console.log = (e) => {
    const msg = format('INFO', e)
    latestLog.write(msg);
    toFile(msg);
    logOutput.write(msg);
};

console.info = (e) => {
    const msg = format('INFO', e)
    latestLog.write(msg);
    toFile(msg);
    logOutput.write(msg);
};

console.warn = (e) => {
    const msg = format('WARN', e)
    latestLog.write(msg);
    toFile(msg);
    toError(msg);
    logOutput.write(msg)
};

console.error = (e) => {
    const msg = format('ERROR', e)
    latestLog.write(msg);
    toFile(msg);
    toError(msg);
    logOutput.write(msg)
};

module.exports = { console }