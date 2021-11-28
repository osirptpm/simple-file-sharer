'use strict'

const path = require('path')

module.exports = {
    packagerConfig: {
        icon: './assets/images/icons/link'
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'simple-file-sharer',
                iconUrl: path.join(__dirname, './assets/images/icons/link.ico'),
                icosetupIconnUrl:  path.join(__dirname, './assets/images/icons/link.ico')
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: [
                'darwin'
            ]
        },
        {
            name: '@electron-forge/maker-deb',
            config: {}
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {}
        }
    ]
}