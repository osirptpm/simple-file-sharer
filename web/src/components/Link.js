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
                setIsClicked(true)
                timer && clearTimeout(timer)
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