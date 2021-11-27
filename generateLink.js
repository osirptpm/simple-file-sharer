'use strict'
const os = require('os'),
    path = require('path'),
    http = require('http')

const { dialog } = require('electron')
const { v4: uuidv4 } = require('uuid')

const server = require('./server')

const contents = new Map()

module.exports.selectFiles = () => {
    return dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
}

module.exports.generateLinks = filePaths => {
    return Promise.all(filePaths.map(module.exports.generateLink))
}

module.exports.generateLink = filePath => {
    const contentId = generateContentId()
    addContent(contentId, filePath)
    return getLinks(contentId, filePath)
}

module.exports.destroyLink = contentId => {
    deleteContent(contentId)
}

module.exports.getContents = () => {
    return Promise.all(Array.from(contents).map(([contentId, filePath]) => getLinks(contentId, filePath)))
}

module.exports.getFilePath = contentId => {
    return contents.get(contentId)
}

function generateContentId() {
    return uuidv4()
}

function addContent(contentId, filePath) {
    contents.set(contentId, filePath)
    return contentId
}

function deleteContent(contentId) {
    contents.delete(contentId)
}

async function getHostIPs() {
    // https://stackoverflow.com/a/8440736
    // const { networkInterfaces } = os

    // const nets = networkInterfaces()
    const results = [] // Or just '{}', an empty object

    // for (const name of Object.keys(nets)) {
    //     for (const net of nets[name]) {
    //         // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    //         if (net.family === 'IPv4' && !net.internal) {
    //             results.push(net.address)
    //         }
    //     }
    // }
    results.push(await getExternalIP())
    return results
}

async function getExternalIP() {
    return fetch("http://myexternalip.com/raw")
}
async function getLinks(contentId, filePath) {
    return (await getHostIPs()).reduce((result, ip) => {
        const filename = path.basename(filePath)
        result.filename = filename
        result.contentId = contentId
        if (Array.isArray(result.links)) {
            result.links.push(`http://${ip}:${server.port}/${contentId}`)
        } else {
            result.links = [`http://${ip}:${server.port}/${contentId}`]
        }
        return result
    }, {})
}

function fetch(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            const { statusCode } = res

            if (statusCode !== 200) {
                res.resume()
                reject(new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`))
            }

            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', chunk => { rawData += chunk })
            res.on('end', () => {
                resolve(rawData)
            })
        }).on('error', error => {
            reject(error)
        })
    })
}