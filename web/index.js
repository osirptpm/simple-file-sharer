'use strict';

import Link from './components/Link.js';
import electronEventEmitter from './electronEventEmitter.js';
const useState = React.useState;

const App = props => {
  const [links, setLinks] = useState([]);
  electronEventEmitter.addEventListener('links', ({
    detail: links
  }) => {
    setLinks(links);
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "SIMPLE FILE SHARER"), /*#__PURE__*/React.createElement("section", {
    id: "portWrap"
  }, /*#__PURE__*/React.createElement("span", {
    for: "port"
  }, "SERVER PORT:"), /*#__PURE__*/React.createElement("input", {
    id: "port",
    name: "port",
    type: "number",
    min: "0",
    max: "65535",
    onChange: event => {
      window.electron.changePort(event.target.value);
    }
  })), /*#__PURE__*/React.createElement("button", {
    id: "generateBtn",
    onClick: event => {
      event.preventDefault();
      window.electron.generateLinks();
    }
  }, "CREATE DOWNLOAD LINK")), /*#__PURE__*/React.createElement("section", {
    id: "links"
  }, links.map(link => /*#__PURE__*/React.createElement(Link, {
    contentId: link.contentId,
    filename: link.filename,
    link: link.links[0],
    onDelete: window.electron.deleteLink
  }))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));