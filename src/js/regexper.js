// The Regexper class manages the top-level behavior for the entire
// application. This includes event handlers for all user interactions.

import _ from 'lodash';
import Parser from './parser/javascript.js';
import util from './util.js';

export default class Regexper {
  constructor(root) {
    this.root = root;
    this.buggyHash = false;
    this.form = root.querySelector('#regexp-form');
    this.field = root.querySelector('#regexp-input');
    this.error = root.querySelector('#error');
    this.warnings = root.querySelector('#warnings');

    this.links = this.form.querySelector('ul');
    this.permalink = this.links.querySelector('a[data-action="permalink"]');
    this.downloadSvg = this.links.querySelector(
      'a[data-action="download-svg"]'
    );
    this.downloadPng = this.links.querySelector(
      'a[data-action="download-png"]'
    );

    this.svgContainer = root.querySelector('#regexp-render');
  }

  _cancel_running() {
    this.running.cancel();
    this.running = false;
  }

  // Event handler for key presses in the regular expression form field.
  keypressListener(event) {
    // Pressing Shift-Enter displays the expression.
    if (event.shiftKey && event.keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }

      this.form.dispatchEvent(util.customEvent('submit'));
    }
  }

  // Event handler for key presses while focused anywhere in the application.
  documentKeypressListener(event) {
    // Pressing escape will cancel a currently running render.
    if (event.keyCode === 27 && this.running) {
      this._cancel_running();
    }
  }

  // Event handler for submission of the regular expression. Changes the URL
  // hash which leads to the expression being rendered.
  submitListener(event) {
    event.returnValue = false;
    if (event.preventDefault) {
      event.preventDefault();
    }

    try {
      this._setHash(this.field.value);
    } catch (e) {
      // Failed to set the URL hash (probably because the expression is too
      // long). Turn off display of the permalink and just show the expression.
      this.permalinkEnabled = false;
      this.showExpression(this.field.value);
    }
  }

  // Event handler for URL hash changes. Starts rendering of the expression.
  hashchangeListener() {
    let expr = this._getHash();

    if (expr instanceof Error) {
      this.state = 'has-error';
      this.error.innerHTML = 'Malformed expression in URL';
    } else {
      this.permalinkEnabled = true;
      this.showExpression(expr);
    }
  }

  // Binds all event listeners.
  bindListeners() {
    this.field.addEventListener('keypress', this.keypressListener.bind(this));
    this.form.addEventListener('submit', this.submitListener.bind(this));
    this.root.addEventListener(
      'keyup',
      this.documentKeypressListener.bind(this)
    );
    window.addEventListener('hashchange', this.hashchangeListener.bind(this));
  }

  // Detect if https://bugzilla.mozilla.org/show_bug.cgi?id=483304 is in effect
  detectBuggyHash() {
    if (typeof window.URL === 'function') {
      try {
        let url = new URL('http://regexper.com/#%25');
        this.buggyHash = url.hash === '#%';
      } catch (e) {
        this.buggyHash = false;
      }
    }
  }

  // Set the URL hash. This method exists to facilitate automated testing
  // (since changing the URL can throw off most JavaScript testing tools).
  _setHash(hash) {
    location.hash = encodeURIComponent(hash)
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29');
  }

  // Retrieve the current URL hash. This method is also mostly for supporting
  // automated testing, but also does some basic error handling for malformed
  // URLs.
  _getHash() {
    try {
      let hash = location.hash.slice(1);
      return this.buggyHash ? hash : decodeURIComponent(hash);
    } catch (e) {
      return e;
    }
  }

  // Currently state of the application. Useful values are:
  //  - `''` - State of the application when the page initially loads
  //  - `'is-loading'` - Displays the loading indicator
  //  - `'has-error'` - Displays the error message
  //  - `'has-results'` - Displays rendered results
  set state(state) {
    this.root.className = state;
  }

  get state() {
    return this.root.className;
  }

  // Start the rendering of a regular expression.
  //
  // - __expression__ - Regular expression to display.
  showExpression(expression) {
    this.field.value = expression;
    this.state = '';

    if (expression !== '') {
      this.renderRegexp(expression).catch(util.exposeError);
    }
  }

  // Creates a blob URL for linking to a rendered regular expression image.
  //
  // - __content__ - SVG image markup.
  buildBlobURL(content) {
    // Blob object has to stick around for IE, so the instance is stored on the
    // `window` object.
    window.blob = new Blob([content], { type: 'image/svg+xml' });
    return URL.createObjectURL(window.blob);
  }

  // Update the URLs of the 'download' and 'permalink' links.
  updateLinks() {
    let classes = _.without(this.links.className.split(' '), [
      'hide-download-svg',
      'hide-permalink',
    ]);
    let svg = this.svgContainer.querySelector('.svg');

    // Create the SVG 'download' image URL.
    try {
      this.downloadSvg.parentNode.style.display = null;
      this.downloadSvg.href = this.buildBlobURL(svg.innerHTML);
    } catch (e) {
      // Blobs or URLs created from a blob URL don't work in the current
      // browser. Giving up on the download link.
      classes.push('hide-download-svg');
    }

    //Create the PNG 'download' image URL.
    try {
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      let loader = new Image();

      loader.width = canvas.width = Number(
        svg.querySelector('svg').getAttribute('width')
      );
      loader.height = canvas.height = Number(
        svg.querySelector('svg').getAttribute('height')
      );
      loader.onload = () => {
        try {
          context.drawImage(loader, 0, 0, loader.width, loader.height);
          canvas.toBlob((blob) => {
            try {
              window.pngBlob = blob;
              this.downloadPng.href = URL.createObjectURL(window.pngBlob);
              this.links.className = this.links.className.replace(
                /\bhide-download-png\b/,
                ''
              );
            } catch (e) {
              // Ignore errors
            }
          }, 'image/png');
        } catch (e) {
          // Ignore errors
        }
      };
      loader.src = 'data:image/svg+xml,' + encodeURIComponent(svg.innerHTML);
      classes.push('hide-download-png');
    } catch (e) {
      // Ignore errors
    }

    // Create the 'permalink' URL.
    if (this.permalinkEnabled) {
      this.permalink.parentNode.style.display = null;
      this.permalink.href = location.toString();
    } else {
      classes.push('hide-permalink');
    }

    this.links.className = classes.join(' ');
  }

  // Display any warnings that were generated while rendering a regular expression.
  //
  // - __warnings__ - Array of warning messages to display.
  displayWarnings(warnings) {
    this.warnings.innerHTML = _.map(
      warnings,
      (warning) =>
        `<li class="inline-icon">${util.icon('#warning')}${warning}</li>`
    ).join('');
  }

  // Render regular expression
  //
  // - __expression__ - Regular expression to render
  renderRegexp(expression) {
    let parseError = false;

    // When a render is already in progress, cancel it and try rendering again
    // after a short delay (canceling a render is not instantaneous).
    if (this.running) {
      this._cancel_running();

      return util.wait(10).then(() => this.renderRegexp(expression));
    }

    this.state = 'is-loading';

    this.running = new Parser(this.svgContainer);

    return (
      this.running
        // Parse the expression.
        .parse(expression)
        // Display any error messages from the parser and abort the render.
        .catch((message) => {
          this.state = 'has-error';
          this.error.innerHTML = '';
          this.error.appendChild(document.createTextNode(message));

          parseError = true;

          throw message;
        })
        // When parsing is successful, render the parsed expression.
        .then((parser) => parser.render())
        // Once rendering is complete:
        //  - Update links
        //  - Display any warnings
        //  - Track the completion of the render and how long it took
        .then(() => {
          this.state = 'has-results';
          this.updateLinks();
          this.displayWarnings(this.running.warnings);
        })
        // Handle any errors that happened during the rendering pipeline.
        // Swallows parse errors and render cancellations. Any other exceptions
        // are allowed to continue on to be tracked by the global error handler.
        .catch((message) => {
          if (message === 'Render cancelled') {
            this.state = '';
          } else if (!parseError) {
            throw message;
          }
        })
        // Finally, mark rendering as complete (and pass along any exceptions
        // that were thrown).
        .then(
          () => {
            this.running = false;
          },
          (message) => {
            this.running = false;
            throw message;
          }
        )
    );
  }
}
