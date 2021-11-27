'use strict'

const openDialogEl = document.querySelector('#openDialog')

openDialogEl.addEventListener('click', event => {
    event.preventDefault()
    window.electron.openDialog()
})


const portEl = document.querySelector('#port')
portEl.addEventListener('change', event => {
    window.electron.changePort(portEl.value)
})
