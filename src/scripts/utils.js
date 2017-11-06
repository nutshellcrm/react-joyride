/*eslint-disable no-nested-ternary */

const wrappedListeners = {};

/**
 * Convert hex to RGB
 *
 * @param {string} hex
 * @returns {Object}
 */
export function hexToRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const newHex = hex.replace(shorthandRegex, (m, r, g, b) => (r + r + g + g + b + b));

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get the current browser
 *
 * @returns {String}
 */
function getBrowser() {
  if (typeof window === 'undefined') {
    return 'node';
  }

  // Opera 8.0+
  const isOpera = Boolean(window.opera) || navigator.userAgent.indexOf(' OPR/') >= 0;
  // Firefox 1.0+
  const isFirefox = typeof InstallTrigger !== 'undefined';
  // Chrome 1+
  const isChrome = !!window.chrome && !!window.chrome.webstore;
  // Safari <= 9 "[object HTMLElementConstructor]"
  const isSafari = (Object.prototype.toString.call(window.HTMLElement)
      .indexOf('Constructor') > 0 || !isChrome) && !isOpera && window.webkitAudioContext !== undefined;
  // Internet Explorer 6-11
  const isIE = Boolean(document.documentMode); // At least IE6

  return isOpera ? 'opera' :
         isFirefox ? 'firefox' :
         isChrome ? 'chrome' :
         isSafari ? 'safari' :
         isIE ? 'ie' :
         '';
}

export function getDocHeight() {
  const body = document.body;
  const html = document.documentElement;
  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

export const browser = getBrowser();

/**
 * Get DOM document root element
 * @returns {Element}
 */
export function getRootEl() {
  const scrollingElement = document.scrollingElement || document.body;
  return ['ie', 'firefox'].indexOf(browser) > -1 ? document.documentElement : scrollingElement;
}

/**
 * Log method calls if debug is enabled
 *
 * @private
 * @param {Object}       arg         - Immediately destructured option argument
 * @param {string}       arg.type    - The method the logger was called from
 * @param {string|Array} [arg.msg]   - The message to be logged
 * @param {boolean}      [arg.warn]  - If true, the message will be a warning
 * @param {boolean}      [arg.debug] - Nothing will be logged unless debug is true
 */
export function logger({ type = 'joyride', msg, warn = false, debug = false }) {
  const loggingFunction = warn ? console.warn || console.error : console.log; //eslint-disable-line no-console

  if (debug) {
    console.log(`%c${type}`, 'color: #760bc5; font-weight: bold; font-size: 12px;'); //eslint-disable-line no-console
    if (msg) {
      if (Array.isArray(msg)) {
        loggingFunction.apply(console, msg);
      }
      else {
        loggingFunction.apply(console, [msg]);
      }
    }
  }
}

/**
 * Check for deprecated selector styles, return stringified, safer versions
 *
 * @param   {string|Object} selector - The selector provided in a step object
 * @returns {string}                   A cleaned-up selector string
 */
export function sanitizeSelector(selector) {
  if (selector.dataset && selector.dataset.reactid) {
    console.warn('Deprecation warning: React 15.0 removed reactid. Update your code.'); //eslint-disable-line no-console
    return `[data-reactid="${selector.dataset.reactid}"]`;
  }
  else if (selector.dataset) {
    console.error('Unsupported error: React 15.0+ doesn’t write reactid to the DOM anymore, please use a plain class in your step.', selector); //eslint-disable-line no-console
    if (selector.className) {
      return `.${selector.className.replace(' ', '.')}`;
    }
  }
  return selector;
}

/**
 * Add a click event handler to a target DOM element.
 * The handler will be called with a reference to the DOM element and a callback.
 * The callback should be executed when the handler is finished with its work.
 * The callback will remove the wrapping event listener and then click the target.
 *
 * This has the effect of adding handler code to execute before the click is passed along.
 *
 * Only one target can be wrapped at any given time.
 *
 * @param   {Object}   target  - DOM element being targeted by a tooltip
 * @param   {function} handler - The function to execute when target is clicked.
 *                               It is provided a callback as a second argument,
 *                               which should be called by the handler to perform target's original click handler.
 * @returns {void}
 */
export function wrapTargetWithHandler(target, handler) {
  if (wrappedListeners[target]) target.removeEventListener('click', wrappedListeners[target]);
  wrappedListeners[target] = (e) => {
    e.stopPropagation();
    handler(target, () => {
      target.removeEventListener('click', wrappedListeners[target]);
      target.click(e);
    });
  };
  target.addEventListener('click', wrappedListeners[target]);
}

/**
 * Remove target handler wrapper applied from `wrapTargetWithHandler`
 *
 * @param   {Object} target - The DOM element to remove the click handler wrapper from
 * @returns {void}
 */
export function unwrapTargetHandler(target) {
  if (wrappedListeners[target]) target.removeEventListener('click', wrappedListeners[target]);
  wrappedListeners[target] = undefined;
}
