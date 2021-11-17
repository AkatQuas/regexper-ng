import * as path from 'path';
import * as vscode from 'vscode';
import { getNonce } from './utils';

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
          <ul>
            <li>
              <a class="inline-icon" href="https://akatquas.github.io/regexper-ng/changelog.html"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 8"><use xlink:href="#list-rich" /></svg>Changelog</a>
            </li>
            <li>
              <a class="inline-icon" href="https://akatquas.github.io/regexper-ng/documentation.html"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 8"><use xlink:href="#document" /></svg>Documentation</a>
            </li>
            <li>
              Source on <a class="inline-icon" href="https://gitlab.com/javallone/regexper-static"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 8"><use xlink:href="#code" /></svg>GitLab</a> or
              <a class="inline-icon" href="https://github.com/AkatQuas/regexper-ng"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 8"><use xlink:href="#code" /></svg>GitHub</a>
            </li>
          </ul>
        </nav>
      </header>

  <main id="content">

  <div class="application">
    <form id="regexp-form">
      <textarea id="regexp-input" placeholder="Enter JavaScript-style regular expression to display (hotkey: Shift+Enter)"></textarea>
      <button type="submit">Display</button>
      <ul class="inline-list" style="pointer-events: none; opacity: 0;">
        <li class="download-svg">
          <a
            href="#"
            class="inline-icon"
            data-action="download-svg"
            download="image.svg"
            type="image/svg+xml"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 8 8"
            >
              <use xlink:href="#data-transfer-download" /></svg
            >Download SVG</a
          >
        </li>
        <li class="download-png">
          <a
            href="#"
            class="inline-icon"
            data-action="download-png"
            download="image.png"
            type="image/png"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 8 8"
            >
              <use xlink:href="#data-transfer-download" /></svg
            >Download PNG</a
          >
        </li>
        <li class="permalink">
          <a href="#" class="inline-icon" data-action="permalink"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 8 8"
            >
              <use xlink:href="#link-intact" /></svg
            >Permalink</a
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

  <svg xmlns="http://www.w3.org/2000/svg" id="open-iconic">
    <!-- These icon are from the Open Iconic project https://useiconic.com/open/ -->
    <defs>
      <g id="code">
        <path d="M5 0l-3 6h1l3-6h-1zm-4 1l-1 2 1 2h1l-1-2 1-2h-1zm5 0l1 2-1 2h1l1-2-1-2h-1z" transform="translate(0 1)" />
      </g>
      <g id="data-transfer-download">
        <path d="M3 0v3h-2l3 3 3-3h-2v-3h-2zm-3 7v1h8v-1h-8z" />
      </g>
      <g id="document">
        <path d="M0 0v8h7v-4h-4v-4h-3zm4 0v3h3l-3-3zm-3 2h1v1h-1v-1zm0 2h1v1h-1v-1zm0 2h4v1h-4v-1z" />
      </g>
      <g id="link-intact">
        <path d="M5.88.03c-.18.01-.36.03-.53.09-.27.1-.53.25-.75.47a.5.5 0 1 0 .69.69c.11-.11.24-.17.38-.22.35-.12.78-.07 1.06.22.39.39.39 1.04 0 1.44l-1.5 1.5c-.44.44-.8.48-1.06.47-.26-.01-.41-.13-.41-.13a.5.5 0 1 0-.5.88s.34.22.84.25c.5.03 1.2-.16 1.81-.78l1.5-1.5c.78-.78.78-2.04 0-2.81-.28-.28-.61-.45-.97-.53-.18-.04-.38-.04-.56-.03zm-2 2.31c-.5-.02-1.19.15-1.78.75l-1.5 1.5c-.78.78-.78 2.04 0 2.81.56.56 1.36.72 2.06.47.27-.1.53-.25.75-.47a.5.5 0 1 0-.69-.69c-.11.11-.24.17-.38.22-.35.12-.78.07-1.06-.22-.39-.39-.39-1.04 0-1.44l1.5-1.5c.4-.4.75-.45 1.03-.44.28.01.47.09.47.09a.5.5 0 1 0 .44-.88s-.34-.2-.84-.22z" />
      </g>
      <g id="list-rich">
        <path d="M0 0v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3zm-4 2v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3z" />
      </g>
      <g id="warning">
        <path d="M3.09 0c-.06 0-.1.04-.13.09l-2.94 6.81c-.02.05-.03.13-.03.19v.81c0 .05.04.09.09.09h6.81c.05 0 .09-.04.09-.09v-.81c0-.05-.01-.14-.03-.19l-2.94-6.81c-.02-.05-.07-.09-.13-.09h-.81zm-.09 3h1v2h-1v-2zm0 3h1v1h-1v-1z" />
      </g>
    </defs>
  </svg>
  <script nonce="${nonce}" src="${jsUri}"></script>
  </body>
</html>`;
}
