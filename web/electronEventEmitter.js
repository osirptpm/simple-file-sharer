class ElectronEventEmitter extends EventTarget {
  constructor() {
    super();
  }

}

const electronEventEmitter = new ElectronEventEmitter();
window.addEventListener('message', event => {
  if (window.location.href.indexOf(event.origin) !== 0 || event.source !== window) return;

  if (event.data.type === 'event') {
    const customEvent = new CustomEvent(event.data.name, {
      detail: event.data.data
    });
    electronEventEmitter.dispatchEvent(customEvent);
  }
});
export default electronEventEmitter;