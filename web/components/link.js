'use strict';

import { copyToClipboard } from '../helper/index.js';
const useState = React.useState;
export default (props => {
  const [isClicked, setIsClicked] = useState(false);
  let timer;
  return /*#__PURE__*/React.createElement("section", {
    // data-link={props.link}
    onClick: event => {
      copyToClipboard(props.link);
      setIsClicked(true);
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        setIsClicked(false);
      }, 500);
    }
  }, /*#__PURE__*/React.createElement("p", null, isClicked ? 'LINK COPIED!' : props.filename), /*#__PURE__*/React.createElement("div", {
    className: "deleteBtn" // data-contentId={props.contentId}
    ,
    onClick: event => {
      event.preventDefault();
      event.stopPropagation();
      timer && clearTimeout(timer);
      props.onDelete(props.contentId);
    }
  }, /*#__PURE__*/React.createElement("span", {
    class: "material-icons"
  }, "cancel")));
});