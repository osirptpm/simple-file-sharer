'use strict'

const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    // console.log(generateLink.getContents())
})

contextBridge.exposeInMainWorld('electron', {
    generateLinks: () => ipcRenderer.send('generateLinks'),
    getLinks: () => ipcRenderer.invoke('getLinks'),
    deleteLink: contentId => ipcRenderer.send('deleteLink', contentId),
    changePort: port => ipcRenderer.send('onChangePort', port)
})

ipcRenderer.on('links', (event, links) => {
    // createLinkElement(links)
    window.postMessage({
        type: 'event',
        name: 'links',
        data: links
    }, '*')
})
ipcRenderer.on('onPort', (event, port) => {
    onPortHandler(port) 
})
ipcRenderer.on('onPortError', (event, errorMessage, currentPort) => {
    onPortErrorHandler(errorMessage, currentPort) 
})

function onPortHandler(port) {
    document.querySelector('#port').value = port
    document.querySelector('#port').classList.remove('error')
}
function onPortErrorHandler(errorMessage, currentPort) {
    console.log(errorMessage)
    // document.querySelector('#port').value = currentPort
    document.querySelector('#port').classList.add('error')
}