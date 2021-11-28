'use strict'

import { copyToClipboard } from '../helper/index.js'

const useState = React.useState

export default props => {
    const [isClicked, setIsClicked] = useState(false)
    let timer
    return (
        <section
            // data-link={props.link}
            onClick={event => {
                copyToClipboard(props.link)
                timer && clearTimeout(timer)
                setIsClicked(true)
                timer = setTimeout(() => {
                    setIsClicked(false)
                }, 500)
            }}
        >
            <p>{isClicked ? 'LINK COPIED!' : props.filename}</p>
            <div
                className="deleteBtn"
                // data-contentId={props.contentId}
                onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()
                    timer && clearTimeout(timer)
                    props.onDelete(props.contentId)
                }}
            >
                <span class="material-icons">cancel</span>
            </div>
        </section>
    )
}



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