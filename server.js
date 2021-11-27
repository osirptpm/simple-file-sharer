'use strict'

const express = require('express')
const app = express()
const NatAPI = require('nat-api')

const config = require('./config')
const CODE = require('./code')

const router = require('./router')

const client = new NatAPI()

app.use(router)
app.use((error, req, res, next) => {
    res.sendStatus(400)
})

let server, port = config.PORT
module.exports.listen = _port => {
    return new Promise((resolve, reject) => {
        server = app.listen(_port || config.PORT, () => {
            port = server.address().port
            portMap(port)
                .catch(reject)
            resolve(port)
        }).on('error', error => {
            server = app.listen(module.exports.port || config.PORT, () => {
                port = server.address().port
            })
            error.CODE = CODE.ERROR.EBIND
            reject(error)
        })
    })
}
module.exports.close = async () => {
    await portUnmap(module.exports.port).catch(console.warn)
    server.close()
}

Object.defineProperty(
    module.exports,
    'port',
    {
        get: () => port
    })

function portMap(port) {
    return new Promise((resolve, reject) => {
        client.map(port, error => {
            if (error) {
                // console.log('Error', error)
                error.CODE = CODE.ERROR.EMAP
                reject(error)
            }
            // console.log('Port mapped!')
            resolve()
        })
    })
}

function portUnmap(port) {
    return new Promise((resolve, reject) => {
        client.unmap(port, error => {
            if (error) {
                // console.log('Error', error)
                error.CODE = CODE.ERROR.EUNMAP
                reject(error)
            }
            // console.log('Port unmapped!')
            resolve()
        })
    })
}