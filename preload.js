'use strict'

const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    // console.log(generateLink.getContents())
})

contextBridge.exposeInMainWorld('electron', {
    openDialog: () => {
        ipcRenderer.send('onOpenDialog')
    },
    changePort: port => {
        ipcRenderer.send('onChangePort', port)
    },
    deleteLink: contentId => {
        ipcRenderer.send('onDeleteLink', contentId)
    }
})

ipcRenderer.on('addLinks', (event, links) => {
    createLinkElement(links)
})
ipcRenderer.on('onPort', (event, port) => {
    onPortHandler(port) 
})
ipcRenderer.on('onPortError', (event, errorMessage, currentPort) => {
    onPortErrorHandler(errorMessage, currentPort) 
})

function createLinkElement(links) {
    const linksEl = document.querySelector('#links')
    linksEl.innerHTML = ''
    const inputEl = document.querySelector('input[disabled]')
    links.forEach(link => {
        link.links.forEach(_link => {
            const linkEl = document.createElement('section')
            linkEl.dataset.link = _link

            const pEl = document.createElement('p')
            pEl.textContent = link.filename

            const deleteEl = document.createElement('div')
            deleteEl.className = 'deleteBtn'
            deleteEl.dataset.contentId = link.contentId
            deleteEl.innerHTML = '<span class="material-icons">cancel</span>'

            let timer
            linkEl.addEventListener('click', event => {
                inputEl.value = linkEl.dataset.link
                inputEl.select()
                inputEl.setSelectionRange(0, 99999)
                navigator.clipboard.writeText(inputEl.value)
                pEl.textContent = 'LINK COPIED!'
                timer && clearTimeout(timer)
                timer = setTimeout(() => {
                    pEl.textContent = link.filename
                }, 500)
            })
            deleteEl.addEventListener('click', event => {
                event.preventDefault()
                event.stopPropagation()
                clearTimeout(timer)
                ipcRenderer.send('onDeleteLink', deleteEl.dataset.contentId)
                linkEl.remove()
            })
            linkEl.appendChild(pEl)
            linkEl.appendChild(deleteEl)
            linksEl.appendChild(linkEl)
        })
    })
}

function onPortHandler(port) {
    document.querySelector('#port').value = port
    document.querySelector('#port').classList.remove('error')
}
function onPortErrorHandler(errorMessage, currentPort) {
    console.log(errorMessage)
    // document.querySelector('#port').value = currentPort
    document.querySelector('#port').classList.add('error')
}