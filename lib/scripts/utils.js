'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.hexToRGB=hexToRGB;exports.getDocHeight=getDocHeight;exports.getRootEl=getRootEl;exports.sanitizeSelector=sanitizeSelector;/*eslint-disable no-nested-ternary *//**
 * Convert hex to RGB
 *
 * @param {string} hex
 * @returns {Object}
 */function hexToRGB(hex){// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
var shorthandRegex=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;var newHex=hex.replace(shorthandRegex,function(m,r,g,b){return r+r+g+g+b+b;});var result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex);return result?{r:parseInt(result[1],16),g:parseInt(result[2],16),b:parseInt(result[3],16)}:null;}/**
 * Get the current browser
 *
 * @returns {String}
 */function getBrowser(){if(typeof window==='undefined'){return'node';}// Opera 8.0+
var isOpera=Boolean(window.opera)||navigator.userAgent.indexOf(' OPR/')>=0;// Firefox 1.0+
var isFirefox=typeof InstallTrigger!=='undefined';// Chrome 1+
var isChrome=!!window.chrome&&!!window.chrome.webstore;// Safari <= 9 "[object HTMLElementConstructor]"
var isSafari=(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor')>0||!isChrome)&&!isOpera&&window.webkitAudioContext!==undefined;// Internet Explorer 6-11
var isIE=Boolean(document.documentMode);// At least IE6
return isOpera?'opera':isFirefox?'firefox':isChrome?'chrome':isSafari?'safari':isIE?'ie':'';}function getDocHeight(){var body=document.body;var html=document.documentElement;return Math.max(body.scrollHeight,body.offsetHeight,html.clientHeight,html.scrollHeight,html.offsetHeight);}var browser=exports.browser=getBrowser();/**
 * Get DOM document root element
 * @returns {Element}
 */function getRootEl(){return['ie','firefox'].indexOf(getBrowser())>-1?document.documentElement:document.body;}/**
 * Check for deprecated selector styles, return stringified, safer versions
 *
 * @param   {string|Object} selector - The selector provided in a step object
 * @returns {string}                   A cleaned-up selector string
 */function sanitizeSelector(selector){if(selector.dataset&&selector.dataset.reactid){console.warn('Deprecation warning: React 15.0 removed reactid. Update your code.');//eslint-disable-line no-console
return'[data-reactid="'+selector.dataset.reactid+'"]';}else if(selector.dataset){console.error('Unsupported error: React 15.0+ doesn’t write reactid to the DOM anymore, please use a plain class in your step.',selector);//eslint-disable-line no-console
if(selector.className){return'.'+selector.className.replace(' ','.');}}return selector;}