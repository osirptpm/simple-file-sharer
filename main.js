'use strict'

const path = require('path')

const { app, BrowserWindow, ipcMain } = require('electron')

const server = require('./server'),
    generateLink = require('./generateLink'),
    CODE = require('./code')

if(require('electron-squirrel-startup')) app.quit()

app.on('window-all-closed', async () => {
    await server.close().catch(error => { })
    if (process.platform !== 'darwin') app.quit()
})

app.whenReady()
    .then(server.listen)
    .then(port => {
        const win = createWindow()

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })

        generateLink.onChange(links => {
            win.webContents.send('links', links)
        })

        ipcMain.on('generateLinks', async (event) => {
            const { filePaths } = await generateLink.selectFiles()
            // const links = await generateLink.generateLinks(filePaths)
            await generateLink.generateLinks(filePaths)
            // win.webContents.send('links', links)
            // return await generateLink.getContents()
        })
        ipcMain.on('onChangePort', async (event, port) => {
            try {
                await server.close()
                await server.listen(port)
                win.webContents.send('onPort', server.port)
                generateLink.getContents().then(content => win.webContents.send('links', content))
            } catch (error) {
                serverErrorHandler(error, win)
            }
        })
        ipcMain.on('deleteLink', async (event, contentId) => {
            generateLink.destroyLink(contentId)
        })
        win.webContents.on('dom-ready', event => {
            win.webContents.send('onPort', server.port)
            generateLink.getContents().then(content => win.webContents.send('links', content))
        })
    })

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        show: false,
        // backgroundColor: '#2e2c29',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#e0e0ce',
            symbolColor: '#000000'
        },
        icon: path.join(__dirname, 'assets', 'images', 'icons', 'link.ico')
    })
    win.once('ready-to-show', () => {
        win.show()
    })
    win.loadFile('web/index.html')
    return win
}


function serverErrorHandler(error, win) {
    switch (error.code) {
        case CODE.ERROR.EBIND:
            win.webContents.send('onPortError', `The port already in use: ${port}`, server.port)
            break
        case CODE.ERROR.EMAP:
            win.webContents.send('onUPNPMapError', `The link won't work on external networks`)
            break
        default:
            break
    }
}