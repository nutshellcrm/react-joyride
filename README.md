React Joyride
===

[![NPM version](https://badge.fury.io/js/react-joyride.svg)](https://badge.fury.io/js/react-joyride.svg)
[![build status](https://travis-ci.org/gilbarbara/react-joyride.svg)](https://travis-ci.org/gilbarbara/react-joyride)
[![Code Climate status](https://codeclimate.com/github/gilbarbara/react-joyride/badges/gpa.svg)](https://codeclimate.com/github/gilbarbara/react-joyride)
[![Join the chat at https://gitter.im/gilbarbara/react-joyride](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/eslint/eslint?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Joyride example image](http://gilbarbara.github.io/react-joyride/media/example.png)](http://gilbarbara.github.io/react-joyride/)

View the demo [here](http://gilbarbara.github.io/react-joyride/) [[source](https://github.com/gilbarbara/react-joyride/tree/demo)]

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.svg)](https://gratipay.com/React-Joyride/)

## Setup

```javascript
npm install --save react-joyride
```

Include `Joyride` in the parent component.


```javascript
var react = require('react');
var Joyride = require('react-joyride');

var App = React.createClass({
  render: function () {
    return (
      <div className="app">
        <Joyride ref={c => (this.joyride = c)} steps={this.state.steps} debug={true} ... />
        <YourComponents .../>
      </div>
    );
  }
 ...
});
```
Don't forget to pass a `ref` to the component.

### Styles

If you are using **SCSS** (and you should):

```scss
@import '../path/to/node-modules/react-joyride/lib/styles/react-joyride'

```

Alternatively, there is a version of the stylesheet using some proposed specifications for [CSS Custom Properties for Cascading Variables Module Level 1](https://drafts.csswg.org/css-variables/) and [CSS Color Module Level 4](https://drafts.csswg.org/css-color).  These are draft specifications and are not yet well supported in browsers, but you are able to use [PostCSS-cssnext](http://cssnext.io/) to use this new syntax today.  In particular, you will need:  

- [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties)
- [postcss-color-function](https://github.com/postcss/postcss-color-function)
- [postcss-base64](https://github.com/jelmerdemaat/postcss-base64) (not part of cssnext, but unfortunately needed here)

You can override any of the custom-properties in [CSSNext Options](#cssnext-options) by defining them in your `:root`.

```js
import "react-joyride/lib/styles/react-joyride.css";
// Make sure to configure your bundler to run this through postcss
```

Or include this directly in your html:

```html
<link rel="stylesheet" href="react-joyride/lib/styles/react-joyride-compiled.css" type="text/css">
```


## Getting Started

Add a custom method to include steps to your component state (or store).

```javascript
addSteps: function (steps) {
  if (!steps || typeof steps !== 'object') return false;

  this.setState(function(currentState) {
    currentState.steps = currentState.steps.concat(steps);
    return currentState;
  });
}

// Render a standalone tooltip
addTooltip: function(data) {
  this.joyride.addTooltip(data);
}
```

When your component is mounted or his child components, just add steps.

```javascript
componentDidMount: function () {
  this.addSteps({...}); // or this.props.addSteps({...}); in your child components
}
...  
render: function () {
  return (
   <div>
     <Joyride
       ref="joyride"
       steps={this.state.steps}
       run={this.state.steps.length} //or some other trigger to start the Joyride
       ...
     />
     <ChildComponent
       addSteps={this.addSteps}
       addTooltip={this.addTooltip}
     />
    </div>
  );
}
```

Please refer to the source code of the demo if you need a practical [example](https://github.com/gilbarbara/react-joyride/tree/demo/app/scripts).

## Options

You can change the initial options passing props to the component.

**steps** {array}: The tour's steps. Defaults to `[]`

**stepIndex** {number}: Jump to a specific step index.

**run** {bool}: Run/stop the tour.

**autoStart** {bool}: Open the tooltip automatically when started, without showing a beacon.

**keyboardNavigation** {bool}: Toggle keyboard navigation (esc, space bar, return). Defaults to `true`

**locale** {object}: The strings used in the tooltip. Defaults to `{ back: 'Back', close: 'Close', last: 'Last', next: 'Next', skip: 'Skip' }`

**resizeDebounce** {bool}: Delay the reposition of the current step while the window is being resized. Defaults to `false`

**resizeDebounceDelay** {number}: The amount of delay for the `resizeDebounce` callback. Defaults to `200`

**holePadding** {number}: The gap around the target inside the hole. Defaults to `5`

**scrollOffset** {number}: The scrollTop offset used in `scrollToSteps`. Defaults to `20`

**scrollToSteps** {bool}: Scroll the page to the next step if needed. Defaults to `true`

**scrollToFirstStep** {bool}: Scroll the page for the first step. Defaults to `false`

**showBackButton** {bool}: Display a back button. Defaults to `true`

**showOverlay** {bool}: Display an overlay with holes above your steps (for tours only). Defaults to `true`

**showSkipButton** {bool}: Display a link to skip the tour. Defaults to `false`

**showStepsProgress** {bool}: Display the tour progress in the next button *e.g. 2/5* in `continuous` tours. Defaults to `false`

**tooltipOffset** {number}: The tooltip offset from the target. Defaults to `30`

**type** {string}: The type of your presentation. It can be `continuous` (played sequencially with the Next button) or `single`. Defaults to `single`

**disableOverlay** {bool}: Don't close the tooltip on clicking the overlay. Defaults to `false`

**debug** {bool}: Console.log Joyride's inner actions. Defaults to `false`

**onTargetClick** {func}: A click handler for the current step's target.  The function will be provided two parameters: the target DOM element and (`target`) a callback function (`cb`).  When finished doing whatever it needs to do, the function provided to `onTargetClick` should call `cb()` to execute the default click handler of the target element.

**callback** {function}: It will be called when the tour's state changes and returns a single parameter:

* entering a step `{ type: 'step:before', index: 0, step: {...} }`
* rendering the beacon `{ type: 'beacon:before', step: {...} }`
* triggering the beacon `{ type: 'beacon:trigger', step: {...} }`
* rendering the tooltip `{ type: 'tooltip:before', step: {...} }`
* closing a step `{ type: 'step:after', step: {...} }`
* clicking on the overlay (if not disabled) `{ type: 'overlay:click', step: {...} }`
* clicking on the hole `{ type: 'hole:click', step: {...} }`
* the tour ends. `{ type: 'finished', steps: [{...}], skipped: boolean }`

The callback object also receives an `action` string (start|next|back) and the step `index`.

Defaults to `undefined`

Example:

```javascript
<Joyride
  ref="joyride"
  steps={this.state.steps}
  run={this.state.steps.length}
  debug={true}
  type="single"
  callback={this.callback}
  ...
/>
```

## API

### this.joyride.addTooltip(data)

Add tooltips in your elements.

- `data` {object} - A step object (check the syntax below)

### this.joyride.start(autorun)

Call this method to start the tour.

- `autorun` {boolean} - Starts the tour with the first tooltip opened.

### this.joyride.next()

Call this method to programmatically advance to the next step.

### this.joyride.back()

Call this method to programmatically return to the previous step.

### this.joyride.stop()

Call this method to stop/pause the tour.

### this.joyride.reset(restart)

Call this method to reset the tour iteration back to 0

- `restart` {boolean} - Starts the tour again

### this.joyride.getProgress()
Retrieve the current progress of your tour. The object returned looks like this:

```javascript
{
  index: 2,
  percentageComplete: 50,
  step: {
    title: "...",
    text: "...",
    selector: "...",
    position: "...",
    ...
  }
}}
```

### **Deprecated** this.joyride.parseSteps(steps)

Parse the incoming steps, check if it's already rendered and returns an array with valid items

- `steps ` {array|object}

```javascript
var steps = this.joyride.parseSteps({
  title: 'Title',
  text: 'description',
  selector: 'my-super-class',
  position: 'top'
});

// steps
[{
  title: 'Title',
  text: 'description',
  selector: '#super-panel',
  position: 'top'
}]
```

### Only start the tour after all target elements (or at least the first step) are rendered in the page.


## Tooltip / Step Syntax
There are a few usable options but you can pass custom parameters.

- `title`: The title of the tooltip
- `text`: The tooltip's body text **(required)**
- `selector`: The target DOM selector of your feature **(required)**
- `position`: Relative position of you beacon and tooltip. It can be one of these:`top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right`, `right` and `left`. This defaults to `top`.
- `type`: The event type that trigger the tooltip: `click` or `hover`. Defaults to `click`
- `isFixedPosition`: Forces the tooltip to be fixed position so that scrolling the page will not affect the position of the tooltip
- `onTargetClick`: function to execute before target's default click handler.  Takes precedence over a `onTargetClick` prop provided to `<Joyride />`, but behaves the same way as that prop.

Extra option for standalone tooltips

- `trigger`: The DOM element that will trigger the tooltip

You can style tooltips independently with these options: `backgroundColor`, `borderRadius`, `color`, `mainColor`, `textAlign` and `width`.

Also you can style `button`, `skip`, `back`, `close` and `hole` individually using standard style options. And `beacon` offset, inner and outer colors.


Example:

```javascript
{
  title: 'First Step',
  text: 'Start using the <strong>joyride</strong>', // supports html tags
  selector: '.first-step',
  position: 'bottom-left',
  type: 'hover',
  style: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '0',
    color: '#fff',
    mainColor: '#ff4456',
    textAlign: 'center',
    width: '29rem',
    beacon: {
      offsetX: 10,
      offsetY: 10,
      inner: '#000',
      outer: '#000'
    },
    button: {
      display: 'none'
      // or any style attribute
    },
    skip: {
      color: '#f04'
    },
    hole: {
      backgroundColor: 'RGBA(201, 23, 33, 0.2)',
    }
    ...
  },
  // custom params...
  name: 'my-first-step',
  parent: 'MyComponentName'
}
```

## SCSS Options

#### Basic

- `$joyride-color`: The base color. Defaults to `#f04`
- `$joyride-zindex`: Defaults to `1500`
- `$joyride-overlay-color`: Defaults to `rgba(#000, 0.5)`
- `$joyride-beacon-color`: Defaults to `$joyride-color`
- `$joyride-beacon-size`: Defaults to `36px`
- `$joyride-hole-border-radius`: Defaults to `4px`
- `$joyride-hole-shadow`: Defaults to `0 0 15px rgba(#000, 0.5)`

#### Tooltip

- `$joyride-tooltip-arrow-size`: You must use even numbers to avoid half-pixel inconsistencies. Defaults to `28px`
- `$joyride-tooltip-bg-color`: Defaults to `#fff`
- `$joyride-tooltip-border-radius`: Defaults to `4px`
- `$joyride-tooltip-color`: The header and text color. Defaults to `#555`
- `$joyride-tooltip-font-size`: Defaults to `16px`
- `$joyride-tooltip-padding`: Defaults to `20px`
- `$joyride-tooltip-shadow`: Sass list for drop-shadow. Defaults to `(x: 1px, y: 2px, blur: 3px, color: rgba(#000, 0.3))`
- `$joyride-tooltip-width`: Sass list of Mobile / Tablet / Desktop sizes. Defaults to `(290px, 360px, 450px)`
- `$joyride-header-color`: Defaults to `$joyride-tooltip-header-color`
- `$joyride-header-font-size`: Defaults to `20px`
- `$joyride-header-border-color`: Defaults to `$joyride-color`
- `$joyride-header-border-width`: Defaults to `1px`
- `$joyride-button-bg-color`: Defaults to `$joyride-color`
- `$joyride-button-color`: Defaults to `#fff`
- `$joyride-button-border-radius`: Defaults to `4px`
- `$joyride-back-button-color`: Defaults to `$joyride-color`
- `$joyride-skip-button-color`: Defaults to `#ccc`
- `$joyride-close`: Sass list for the close button: Defaults to `(color: rgba($joyride-tooltip-color, 0.5), size: 30px, top: 10px, right: 10px)`
- `$joyride-close-visible`: Default to `true`;

## CSSNext Options

#### Basic

- `--joyride-color`: The base color. Defaults to `#f04`
- `--joyride-zindex`: Defaults to `1500`
- `--joyride-overlay-color`: Defaults to `rgba(0, 0, 0, 0.5)`
- `--joyride-beacon-color`: Defaults to `--joyride-color`
- `--joyride-beacon-size`: Defaults to `36px`
- `--joyride-hole-border-radius`: Defaults to `4px`
- `--joyride-hole-shadow`: Defaults to `0 0 15px rgba(0, 0, 0, 0.5)`

#### Tooltip

- `--joyride-tooltip-arrow-size`: You must use even numbers to avoid half-pixel inconsistencies. Defaults to `36px`
- `--joyride-tooltip-arrow-height`: Defaults to `--joyride-tooltip-arrow-size / 2`
- `--joyride-tooltip-arrow-scale`: Defaults to `2.25` (--joyride-tooltip-arrow-size / 16)
- `--joyride-tooltip-bg-color`: Defaults to `#fff`
- `--joyride-tooltip-border-radius`: Defaults to `4px`
- `--joyride-tooltip-color`: The header and text color. Defaults to `#555`
- `--joyride-tooltip-font-size`: Defaults to `16px`
- `--joyride-tooltip-padding`: Defaults to `20px`
- `--joyride-tooltip-shadow-x`: Defaults to `1px`
- `--joyride-tooltip-shadow-y`: Defaults to `2px`
- `--joyride-tooltip-shadow-blur`: Defaults to `3px`
- `--joyride-tooltip-shadow-color`: Defaults to `rgba(0, 0, 0, 0.3)`
- `--joyride-tooltip-width-narrow`: Breakpoint for mobile size. Defaults to `290px`
- `--joyride-tooltip-width-medium`: Breakpoint for tablet size. Defaults to `360px`
- `--joyride-tooltip-width-wide`: Breakpoint for desktop size. Defaults to `450px`
- `--joyride-tooltip-animation`: Defaults to `joyride-tooltip 0.4s forwards`
- `--joyride-tooltip-animation-timing`: Defaults to `cubic-bezier(0, 1.05, 0.55, 1.18)`

- `--joyride-close-color`: Defaults to `color(var(--joyride-tooltip-color, #555) alpha(0.5))`
- `--joyride-close-size`: Defaults to `30px`
- `--joyride-close-top`: Defaults to `10px`
- `--joyride-close-right`: Defaults to `10px`
- `--joyride-close-display`: Display property of close button. Defaults to `block`. Set to "none" to hide

- `--joyride-header-color`: Defaults to `--joyride-tooltip-color`
- `--joyride-header-font-size`: Defaults to `20px`
- `--joyride-header-border-color`: Defaults to `--joyride-color,`
- `--joyride-header-border-width`: Defaults to `1px`

- `--joyride-button-bg-color`: defaults to `--joyride-color`
- `--joyride-button-color`: defaults to `#fff`
- `--joyride-button-radius`: defaults to `4px`

- `--joyride-back-button-color`: defaults to `--joyride-color`
- `--joyride-skip-button-color`: defaults to `#ccc`

## License

Copyright © 2016 Gil Barbara - [MIT License](LICENSE)

---

Inspired by [react-tour-guide](https://github.com/jakemmarsh/react-tour-guide) and [jquery joyride tour](http://zurb.com/playground/jquery-joyride-feature-tour-plugin)
