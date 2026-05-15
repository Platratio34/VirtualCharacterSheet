const console = require('./logger').console;

const { createServer } = require('http');
const fs = require('fs')
const path = require('path')
const nodeUrl = require('url');
const { error } = require('console');

// const config = {
//     host: "127.0.0.1",
//     port: 14011,
//     basePath: "C:/Users/pcral/Documents/DnD/VirtualCharacterSheet/"
// }
const config = require("../config.json")

const server = createServer(processRequest)
async function processRequest(req, res) {
    const { method, url, headers } = req;
    // console.log(`Msg '${url}'`)
    try {

        let body = "";
        if (method == 'POST') {
            // console.log('POST request')
            let done = false
            req.on("data", data => {
                body += data;
            });
            req.on("end", () => {
                // console.log(headers['content-type'])
                if (headers['content-type'] == 'application/json') {
                    body = JSON.parse(body);
                    // console.log(body)
                }
                done = true
            });
            while (!done) {
                await new Promise(r => setTimeout(r, 10))
            }
        }

        let path = nodeUrl.parse(url, true)
        let rtUrl = path.query.return
        let parts = path.pathname.split(/\//g)

        if (parts.length == 0 || parts[1] == '') {
            let chars = []
            fs.readdirSync(config.basePath + 'data/characters').forEach(file => {
                chars.push(file.replace('.json', ''))
            })
            returnPage(res, 'index', { characters: chars })
            return;
        }

        if (parts[1] == 'scripts') {
            res.statusCode = 200
            let path = parts[2];
            if (path == 'classes')
                path += "/" + parts[3]
            returnFile(res, 'scripts/' + path, 'text/javascript')
            return;
        } else if (parts[1] == 'style') {
            res.statusCode = 200
            returnFile(res, 'style/' + parts[2], 'text/css')
            return;
        } else if (parts[1] == 'favicon.ico') {
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain')
            res.end('No icon')
            return;
        }

        if (parts[1] == 'data')
        {
            switch (parts[2]) {
                case 'class':
                    returnFile(res, '../data/class/'+parts[3]+'.json', 'application/json')
                    return;
                case 'subclass':
                    returnFile(res, '../data/subclass/'+parts[3]+'.json', 'application/json')
                    return;
                case 'race':
                    returnFile(res, '../data/race/'+parts[3]+'.json', 'application/json')
                    return;
                case 'background':
                    returnFile(res, '../data/background/'+parts[3]+'.json', 'application/json')
                    return;
                case 'item':
                    returnFile(res, '../data/item/'+parts[3]+'.json', 'application/json')
                    return;
                case 'spell':
                    if (!parts[3].startsWith("lvl")) {
                        res.statusCode = 400
                        res.setHeader('Content-Type', 'text/plain')
                        res.end(`Invalid spell level '${parts[3]}'`)
                        return; 
                    }
                    returnFile(res, `../data/spell/${parts[3]}/${parts[4]}.json`, 'application/json')
                    return;
            }
            res.statusCode = 400
            res.setHeader('Content-Type', 'text/plain')
            res.end(`Unknown data type '${parts[2]}'`)
            return;
        } else if (parts[1] == 'character') {
            if (parts.length >= 4 && parts[2] == 'data') {
                let cName = parts[3]
                returnFile(res, `../data/characters/${cName}.json`, 'application/json')
                return
            } else if (parts.length == 3 && parts[2] == 'save') {
                if (method != 'POST') {
                    returnText(res, 400, 'Path `charter/save` must be post')
                    return
                }
                if (body.password == null) {
                    returnText(res, 400, 'Missing password')
                    return
                } else if (body.password != config.password) {
                    console.warn(`Character save attempted with invald password`)
                    returnText(res, 401, 'Invalid password')
                    return
                }
                let fName = `${config.basePath}data/characters/${body.id}.json`
                fs.writeFile(fName, JSON.stringify(body.char), (err) => {
                    if (err) {
                        console.error(`Error saving character ${body.id}: ${err}`)
                        returnText(res, 500, 'Server Error saving character')
                    } else {
                        console.log(`Saved character ${body.id}`)
                        returnText(res, 200, 'Character saved')
                    }
                })
                return
            }
            res.statusCode = 200
            returnPage(res, "character/sheet", {})
            return
        } else if (parts[1] == 'setPassword') {
            returnPage(res, "setPassword", {})
            return
        }
    } catch (e) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/plain')
        res.end('Server error processing request, try again later')
        console.warn(`Uncaught error processing request: '${url}'`)
        console.error(e)
        return
    }

    console.log(`Unknown page: '${url}'`)
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end('How did you get here?\n')
    console.warn(`Got invalid url: '${url}'`)
    return
}

server.listen(config.port, config.host, () => {
    console.log(`Starting server on ${config.host}:${config.port}`)
})

function returnPage(res, page, rp) {
    try {
        res.setHeader('Content-Type', 'text/html')
        let file = fs.readFileSync(config.basePath + 'client/html/' + page + '.html').toString()
        if (rp) {
            for (let key in rp) {
                let val = rp[key]
                if (Array.isArray(val) || typeof val === 'object')
                    val = JSON.stringify(val)
                file = file.replace(new RegExp('\\$' + key + '\\$', "g"), val)
            }
        }
        res.end(file, 'utf8')
    } catch (e) {
        console.error(`Error loading file ${path}: ${e}`)
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end('Could not find page')
    }
}
function returnFile(res, path, type = "text/plain") {
    try {
        res.setHeader('Content-Type', type)
        res.end(fs.readFileSync(config.basePath + 'client/' + path), 'utf8')
    } catch (e) {
        console.error(`Error loading file ${path}: ${e}`)
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end('Could not find file')
    }
}
function returnText(res, code, text) {
    res.statusCode = code
    res.setHeader('Content-Type', 'text/plain')
    res.end(text)
}

const readline = require('readline');
const { json } = import('stream-consumers');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'vcs>'
})

function stopServer() {
    console.log('Stopping server ...')
    process.exit(0);
}

rl.prompt();
rl.on('line', (line) => {
    console.logOnly(`> ${line}`)
    var args = line.split(' ')
    switch (args[0]) {
        case 'help':
            switch (args[1]) {
                case 'help':
                    console.log('help [command?]: Print the help list, or show command specific help')
                    console.log('- [command?]: The name of the command to get help for')
                    break;

                case 'stop':
                    console.log('stop: Stop the server')
                    break;

                default:
                    console.log('- help           | Print this list')
                    console.log('- help [command] | Print the help for specific command')
                    console.log('- stop           | Stop the server')
            }
            break;
        
        case 'stop':
            stopServer()
            break;
        
        default:
            console.log(`Unknown command: ${args[0]}. Use help for list of commands`)
    }
}).on('close', () => {
    stopServer()
})