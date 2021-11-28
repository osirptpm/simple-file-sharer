'use strict'

import Link from './components/Link.js'
import electronEventEmitter from './electronEventEmitter.js'

const useState = React.useState

const App = props => {
    const [links, setLinks] = useState([])
    electronEventEmitter.addEventListener('links', ({detail: links}) => {
        setLinks(links)
    })
    return (
        <React.Fragment>
            <div>
                <h1>SIMPLE FILE SHARER</h1>
                <section id="portWrap">
                    <span for="port">SERVER PORT:</span><input id="port" name="port" type="number" min="0" max="65535"
                    onChange={event => {
                        window.electron.changePort(event.target.value)
                    }}/>
                </section>
                <button id="generateBtn"
                    onClick={
                        event => {
                            event.preventDefault()
                            window.electron.generateLinks()
                        }
                    }
                >CREATE DOWNLOAD LINK</button>
            </div>
            <section id="links">
                {
                    links.map(link => <Link
                        contentId={link.contentId}
                        filename={link.filename}
                        link={link.links[0]}
                        onDelete={window.electron.deleteLink}
                    />)
                }
            </section>
        </React.Fragment>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)