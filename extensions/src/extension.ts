import * as path from 'path';
import * as vscode from 'vscode';
import { getNonce } from './utils';

// Shared with the web app via lib/icons.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { icon } = require('../../lib/icons.js') as {
  icon: (name: string) => string;
};

let currentPanel: vscode.WebviewPanel | undefined = undefined;
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'regexper-ng.visualize',
    () => {
      const editor = vscode.window.activeTextEditor;

      let text = '';
      if (editor?.selection) {
        text = editor.document.getText(editor.selection).trim();
      }

      if (currentPanel) {
        if (text) {
          currentPanel.webview.html = getWebviewContent(
            context,
            currentPanel.webview,
            text
          );
        }
        currentPanel.reveal(vscode.ViewColumn.Beside);
        return;
      }

      currentPanel = vscode.window.createWebviewPanel(
        'regexp-ng',
        'Regexper NG',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          enableFindWidget: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'media')),
          ],
        }
      );

      currentPanel.webview.html = getWebviewContent(
        context,
        currentPanel.webview,
        text
      );
      currentPanel.onDidDispose(() => {
        currentPanel = undefined;
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  if (currentPanel) {
    currentPanel.dispose();
    currentPanel = undefined;
  }
}

function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
  regText: string = ''
): string {
  const cssUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'media', 'main.css'))
  );
  const jsUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'media', 'main.js'))
  );
  const nonce = getNonce();
  return /* html */ `<!DOCTYPE html>
  <html>
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https://licensebuttons.net data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';" >
    <title>Regexper</title>

    <script nonce="${nonce}">
      /* set the hash before regexer work  */
      if ('${regText}') {
        window.location.hash = encodeURIComponent('${regText}')
        .replace(\/\\(\/g, '%28')
        .replace(\/\\)\/g, '%29');
      }
    </script>
    <link href="${cssUri}" rel="stylesheet"></head>
    <body>
      <header>
        <div class="logo">
          <h1>Regexper</h1>
          <span>You thought you only had two problems&hellip;</span>
        </div>

        <nav>
          <ul class="nav-list">
            <li>
              <a class="inline-icon" href="https://akatquas.github.io/regexper-ng/changelog.html">${icon('list')}Changelog</a>
            </li>
            <li>
              <a class="inline-icon" href="https://akatquas.github.io/regexper-ng/documentation.html">${icon('document')}Documentation</a>
            </li>
            <li>
              Source on <a class="inline-icon" href="https://gitlab.com/javallone/regexper-static">${icon('gitlab')}GitLab</a> or
              <a class="inline-icon" href="https://github.com/AkatQuas/regexper-ng">${icon('github')}GitHub</a>
            </li>
          </ul>
        </nav>
      </header>

  <main id="content">

  <div class="application">
    <form id="regexp-form">
      <textarea id="regexp-input" placeholder="Enter JavaScript-style regular expression to display (hotkey: Shift+Enter)"></textarea>
      <div class="regexp-form-actions">
        <button type="submit">Display</button>
        <button type="button" id="random-regexp">Random example</button>
      </div>
      <ul class="inline-list" style="pointer-events: none; opacity: 0;">
        <li class="download-svg">
          <a
            href="#"
            class="inline-icon"
            data-action="download-svg"
            download="image.svg"
            type="image/svg+xml"
            >${icon('download')}Download SVG</a
          >
        </li>
        <li class="download-png">
          <a
            href="#"
            class="inline-icon"
            data-action="download-png"
            download="image.png"
            type="image/png"
            >${icon('download')}Download PNG</a
          >
        </li>
        <li class="permalink">
          <a href="#" class="inline-icon" data-action="permalink"
            >${icon('link')}Permalink</a
          >
        </li>
      </ul>
    </form>
  </div>

  <div class="results">
    <div id="error"></div>

    <ul id="warnings"></ul>

    <div id="regexp-render"></div>
  </div>

  </main>

  <footer>
    <ul class="inline-list">
      <li>Created by <a href="mailto:jeff.avallone@gmail.com">Jeff Avallone</a></li>
      <li>Maintained by <a href="https://github.com/AkatQuas">AkatQuas</a></li>
      <li>
        Generated images licensed:
        <a rel="license" href="http://creativecommons.org/licenses/by/3.0/"><img alt="Creative Commons License" src="https://licensebuttons.net/l/by/3.0/80x15.png" /></a>
      </li>
    </ul>

    <script type="text/html" id="svg-container-base">
      <div class="svg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:cc="http://creativecommons.org/ns#"
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          version="1.1">
          <defs>
            <style type="text/css">svg { background-color: #fff; }

      .root text,
      .root tspan { font: 12px Arial; }

      .root path {
        fill-opacity: 0;
        stroke-width: 2px;
        stroke: #000; }

      .root circle { fill: #6b6659; stroke-width: 2px; stroke: #000; }

      .anchor text, .any-character text { fill: #fff; }
      .anchor rect, .any-character rect { fill: #6b6659; }

      .escape text, .charset-escape text, .literal text { fill: #000; }

      .escape rect, .charset-escape rect { fill: #bada55; }

      .literal rect { fill: #dae9e5; }

      .charset .charset-box { fill: #cbcbba; }

      .subexp .subexp-label tspan,
      .charset .charset-label tspan,
      .match-fragment .repeat-label tspan { font-size: 10px; }

      .repeat-label { cursor: help; }

      .subexp .subexp-label tspan,
      .charset .charset-label tspan { dominant-baseline: text-after-edge; }

      .subexp .subexp-box { stroke: #908c83; stroke-dasharray: 6,2; stroke-width: 2px; fill-opacity: 0; }

      .quote { fill: #908c83; }
      </style>
          </defs>
          <metadata>
            <rdf:RDF>
              <cc:License rdf:about="http://creativecommons.org/licenses/by/3.0/">
                <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction" />
                <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution" />
                <cc:requires rdf:resource="http://creativecommons.org/ns#Notice" />
                <cc:requires rdf:resource="http://creativecommons.org/ns#Attribution" />
                <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks" />
              </cc:License>
            </rdf:RDF>
          </metadata>
        </svg>
      </div>
      <div class="progress">
        <div style="width:0;"></div>
      </div>
    </script>
  </footer>
  <script nonce="${nonce}" src="${jsUri}"></script>
  </body>
</html>`;
}
