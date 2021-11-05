import util from '../src/js/util.js';
import Regexper from '../src/js/regexper.js';
import Parser from '../src/js/parser/javascript.js';

describe('regexper.js', function() {

  beforeEach(function() {
    this.root = document.createElement('div');
    this.root.innerHTML = [
      '<form id="regexp-form" action="/">',
      '<input type="text" id="regexp-input">',
      '<ul class="example">',
      '<ul><a href="#" data-action="permalink"></a></ul>',
      '<ul><a href="#" data-action="download-svg"></a></ul>',
      '<ul><a href="#" data-action="download-png"></a></ul>',
      '</ul>',
      '</form>',
      '<div id="error"></div>',
      '<ul id="warnings"></ul>',
      '<div id="regexp-render"></div>',
    ].join('');

    this.regexper = new Regexper(this.root);
    spyOn(this.regexper, '_setHash');
    spyOn(this.regexper, '_getHash');
  });

  describe('#keypressListener', function() {

    beforeEach(function() {
      this.event = util.customEvent('keypress');
      spyOn(this.event, 'preventDefault');
      spyOn(this.regexper.form, 'dispatchEvent');
    });

    describe('when the shift key is not depressed', function() {

      beforeEach(function() {
        this.event.shiftKey = false;
        this.event.keyCode = 13;
      });

      it('does not prevent the default action', function() {
        this.regexper.keypressListener(this.event);

        expect(this.event.returnValue).not.toEqual(false);
        expect(this.event.preventDefault).not.toHaveBeenCalled();
      });

      it('does not trigger a submit event', function() {
        this.regexper.keypressListener(this.event);

        expect(this.regexper.form.dispatchEvent).not.toHaveBeenCalled();
      });

    });

    describe('when the keyCode is not 13 (Enter)', function() {

      beforeEach(function() {
        this.event.shiftKey = true;
        this.event.keyCode = 42;
      });

      it('does not prevent the default action', function() {
        this.regexper.keypressListener(this.event);

        expect(this.event.returnValue).not.toEqual(false);
        expect(this.event.preventDefault).not.toHaveBeenCalled();
      });

      it('does not trigger a submit event', function() {
        this.regexper.keypressListener(this.event);

        expect(this.regexper.form.dispatchEvent).not.toHaveBeenCalled();
      });

    });

    describe('when the shift key is depressed and the keyCode is 13 (Enter)', function() {

      beforeEach(function() {
        this.event.shiftKey = true;
        this.event.keyCode = 13;
      });

      it('prevents the default action', function() {
        this.regexper.keypressListener(this.event);

        expect(this.event.returnValue).not.toEqual(true);
        expect(this.event.preventDefault).toHaveBeenCalled();
      });

      it('triggers a submit event', function() {
        var event;

        this.regexper.keypressListener(this.event);

        expect(this.regexper.form.dispatchEvent).toHaveBeenCalled();

        event = this.regexper.form.dispatchEvent.calls.mostRecent().args[0];

        expect(event.type).toEqual('submit');
      });

    });

  });

  describe('#documentKeypressListener', function() {

    beforeEach(function() {
      this.event = util.customEvent('keyup');
      this.regexper.running = jasmine.createSpyObj('parser', ['cancel']);
    });

    describe('when the keyCode is not 27 (Escape)', function() {

      beforeEach(function() {
        this.event.keyCode = 42;
      });

      it('does not cancel the parser', function() {
        this.regexper.documentKeypressListener(this.event);

        expect(this.regexper.running.cancel).not.toHaveBeenCalled();
      });

    });

    describe('when the keyCode is 27 (Escape)', function() {

      beforeEach(function() {
        this.event.keyCode = 27;
      });

      it('cancels the parser', function() {
        this.regexper.documentKeypressListener(this.event);

        expect(this.regexper.running.cancel).toHaveBeenCalled();
      });

    });

  });

  describe('#submitListener', function() {

    beforeEach(function() {
      this.event = util.customEvent('submit');
      spyOn(this.event, 'preventDefault');

      this.regexper.field.value = 'example value';
    });

    it('prevents the default action', function() {
      this.regexper.submitListener(this.event);

      expect(this.event.returnValue).not.toEqual(true);
      expect(this.event.preventDefault).toHaveBeenCalled();
    });

    it('sets the location.hash', function() {
      this.regexper.submitListener(this.event);

      expect(this.regexper._setHash).toHaveBeenCalledWith('example value');
    });

    describe('when setting location.hash fails', function() {

      beforeEach(function() {
        this.regexper._setHash.and.throwError('hash failure');
      });

      it('disables the permalink', function() {
        this.regexper.submitListener(this.event);

        expect(this.regexper.permalinkEnabled).toEqual(false);
      });

      it('shows the expression directly', function() {
        spyOn(this.regexper, 'showExpression');
        this.regexper.submitListener(this.event);

        expect(this.regexper.showExpression).toHaveBeenCalledWith('example value');
      });

    });

  });

  describe('#hashchangeListener', function() {

    describe('when the URL is invalid', function() {

      beforeEach(function() {
        this.regexper._getHash.and.returnValue(new Error('example error'));
      });

      it('displays an error message', function() {
        this.regexper.hashchangeListener();

        expect(this.regexper.state).toEqual('has-error');
        expect(this.regexper.error.innerHTML).toEqual('Malformed expression in URL');
      });

    });

    describe('when the URL is valid', function() {

      beforeEach(function() {
        this.regexper._getHash.and.returnValue('example hash value');
      });

      it('enables the permalink', function() {
        this.regexper.hashchangeListener();

        expect(this.regexper.permalinkEnabled).toEqual(true);
      });

      it('shows the expression from the hash', function() {
        spyOn(this.regexper, 'showExpression');
        this.regexper.hashchangeListener();

        expect(this.regexper.showExpression).toHaveBeenCalledWith('example hash value');
      });

    });

  });

  describe('#bindListeners', function() {

    beforeEach(function() {
      spyOn(this.regexper, 'keypressListener');
      spyOn(this.regexper, 'submitListener');
      spyOn(this.regexper, 'documentKeypressListener');
      spyOn(this.regexper, 'hashchangeListener');
    });

    it('binds #keypressListener to keypress on the text field', function() {
      spyOn(this.regexper.field, 'addEventListener');
      this.regexper.bindListeners();

      expect(this.regexper.field.addEventListener).toHaveBeenCalledWith('keypress', jasmine.any(Function));

      this.regexper.field.addEventListener.calls.mostRecent().args[1]();

      expect(this.regexper.keypressListener).toHaveBeenCalled();
    });

    it('binds #submitListener to submit on the form', function() {
      spyOn(this.regexper.form, 'addEventListener');
      this.regexper.bindListeners();

      expect(this.regexper.form.addEventListener).toHaveBeenCalledWith('submit', jasmine.any(Function));

      this.regexper.form.addEventListener.calls.mostRecent().args[1]();

      expect(this.regexper.submitListener).toHaveBeenCalled();
    });

    it('binds #documentKeypressListener to keyup on the root', function() {
      spyOn(this.regexper.root, 'addEventListener');
      this.regexper.bindListeners();

      expect(this.regexper.root.addEventListener).toHaveBeenCalledWith('keyup', jasmine.any(Function));

      this.regexper.root.addEventListener.calls.mostRecent().args[1]();

      expect(this.regexper.documentKeypressListener).toHaveBeenCalled();
    });

    it('binds #hashchangeListener to hashchange on the window', function() {
      spyOn(window, 'addEventListener');
      this.regexper.bindListeners();

      expect(window.addEventListener).toHaveBeenCalledWith('hashchange', jasmine.any(Function));

      window.addEventListener.calls.mostRecent().args[1]();

      expect(this.regexper.hashchangeListener).toHaveBeenCalled();
    });

  });

  describe('#showExpression', function() {

    beforeEach(function() {
      spyOn(this.regexper, 'renderRegexp').and.returnValue(jasmine.createSpyObj('renderRegexp', ['catch']));
    });

    it('sets the text field value', function() {
      this.regexper.showExpression('example expression');

      expect(this.regexper.field.value).toEqual('example expression');
    });

    it('clears the state', function() {
      this.regexper.showExpression('');

      expect(this.regexper.state).toEqual('');
    });

    describe('when the expression is not blank', function() {

      it('renders the expression', function() {
        this.regexper.showExpression('example expression');

        expect(this.regexper.renderRegexp).toHaveBeenCalledWith('example expression');
      });

    });

  });

  describe('#updateLinks', function() {

    beforeEach(function() {
      spyOn(this.regexper, 'buildBlobURL');
      this.regexper.svgContainer.innerHTML = '<div class="svg">example image</div>';
    });

    it('builds the blob URL from the SVG image', function() {
      this.regexper.updateLinks();

      expect(this.regexper.buildBlobURL).toHaveBeenCalledWith('example image');
    });

    describe('when blob URLs are supported', function() {

      beforeEach(function() {
        this.regexper.buildBlobURL.and.returnValue('http://example.com/blob');
      });

      it('sets the download link href', function() {
        this.regexper.updateLinks();

        expect(this.regexper.downloadSvg.href).toEqual('http://example.com/blob');
      });

    });

    describe('when blob URLs are not supported', function() {

      beforeEach(function() {
        this.regexper.buildBlobURL.and.throwError('blob failure');
      });

      it('hides the download link', function() {
        this.regexper.updateLinks();

        expect(this.regexper.links.className).toMatch(/\bexample\b/);
        expect(this.regexper.links.className).toMatch(/\bhide-download\b/);
      });

    });

    describe('when the permalink is enabled', function() {

      beforeEach(function() {
        this.regexper.permalinkEnabled = true;
      });

      it('sets the permalink href', function() {
        this.regexper.updateLinks();

        expect(this.regexper.permalink.href).toEqual(location.toString());
      });

    });

    describe('when the permalink is disabled', function() {

      beforeEach(function() {
        this.regexper.permalinkEnabled = false;
      });

      it('hides the permalink', function() {
        this.regexper.updateLinks();

        expect(this.regexper.links.className).toMatch(/\bexample\b/);
        expect(this.regexper.links.className).toMatch(/\bhide-permalink\b/);
      });

    });

  });

  describe('#displayWarnings', function() {

    it('adds a list item for each warning', function() {
      spyOn(util, 'icon').and.returnValue('(icon-markup)');
      this.regexper.displayWarnings(['warning 1', 'warning 2']);

      expect(this.regexper.warnings.innerHTML).toEqual('<li class="inline-icon">(icon-markup)warning 1</li><li class="inline-icon">(icon-markup)warning 2</li>');
    });

  });

  describe('#renderRegexp', function() {

    beforeEach(function() {
      this.parsePromise = this.testablePromise();
      this.renderPromise = this.testablePromise();
      spyOn(Parser.prototype, 'parse').and.returnValue(this.parsePromise.promise);
      spyOn(Parser.prototype, 'render').and.returnValue(this.renderPromise.promise);
      spyOn(Parser.prototype, 'cancel');

      spyOn(this.regexper, 'updateLinks');
      spyOn(this.regexper, 'displayWarnings');
    });

    it('sets the state to "is-loading"', function() {
      this.regexper.renderRegexp('example expression');

      expect(this.regexper.state).toEqual('is-loading');
    });

    it('keeps a copy of the running property parser', function() {
      this.regexper.renderRegexp('example expression');

      expect(this.regexper.running).toBeTruthy();
    });

    it('parses the expression', function() {
      this.regexper.renderRegexp('example expression');

      expect(this.regexper.running.parse).toHaveBeenCalledWith('example expression');
    });

    describe('when parsing fails', function() {

      beforeEach(function() {
        this.parsePromise.reject(new Error('example parse error'));
      });

      it('sets the state to be "has-error"', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(() => {
            expect(this.regexper.state).toEqual('has-error');
            done();
          }).catch(done.fail);
      });

      it('displays the error message', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(() => {
            expect(this.regexper.error.innerHTML).toEqual('Error: example parse error');
            done();
          }).catch(done.fail);
      });

    });

    describe('when parsing succeeds', function() {

      beforeEach(function() {
        this.parser = new Parser(this.regexper.svgContainer);
        this.parsePromise.resolve(this.parser);
        this.renderPromise.resolve();
      });

      it('renders the expression', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(() => {
            expect(this.parser.render).toHaveBeenCalled();
            done();
          }).catch(done.fail);
      });

    });

    describe('when rendering is complete', function() {

      beforeEach(function() {
        this.parser = new Parser(this.regexper.svgContainer);
        this.parsePromise.resolve(this.parser);
        this.renderPromise.resolve();
      });

      it('sets the state to "has-results"', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(() => {
            expect(this.regexper.state).toEqual('has-results');
            done();
          }).catch(done.fail);
      });

      it('updates the links', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(() => {
            expect(this.regexper.updateLinks).toHaveBeenCalled();
            done();
          }).catch(done.fail);
      });

      it('displays the warnings', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(() => {
            expect(this.regexper.displayWarnings).toHaveBeenCalled();
            done();
          }).catch(done.fail);
      });

      it('sets the running property to false', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(() => {
            expect(this.regexper.running).toBeFalsy();
            done();
          }).catch(done.fail);
      });

    });

    describe('when the rendering is cancelled', function() {

      beforeEach(function() {
        this.parser = new Parser(this.regexper.svgContainer);
        this.parsePromise.resolve(this.parser);
        this.renderPromise.reject('Render cancelled');
      });

      it('clears the state', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(() => {
            expect(this.regexper.state).toEqual('');
            done();
          }).catch(done.fail);
      });

      it('sets the running property to false', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(() => {
            expect(this.regexper.running).toBeFalsy();
            done();
          }).catch(done.fail);
      });

    });

    describe('when the rendering fails', function() {

      beforeEach(function() {
        this.parser = new Parser(this.regexper.svgContainer);
        this.parsePromise.resolve(this.parser);
        this.renderPromise.reject('example render failure');
      });

      it('sets the running property to false', function(done) {
        this.regexper.renderRegexp('example expression')
          .then(fail, () => {
            expect(this.regexper.running).toBeFalsy();
            done();
          }).catch(done.fail);
      });

    });

  });

});
