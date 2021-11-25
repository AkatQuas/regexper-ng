# Regexper

[Code](https://gitlab.com/javallone/regexper-static) for the http://regexper.com/ site.

[Code](https://github.com/AkatQuas/regexper-ng) for the https://akatquas.github.io/regexper-ng/ site.

## Contributing

I greatly appreciate any contributions that you may have for the site. Feel free to fork the project and work on any of the reported issues, or let me know about any improvements you think would be beneficial.

When sending pull requests, please keep them focused on a single issue. I would rather deal with a dozen pull requests for a dozen issues with one change each over one pull request fixing a dozen issues. Also, I appreciate tests to be included with feature development, but for minor changes I will probably not put up much of a fuss if they're missing.

### Working with the code

Node is required for working with this site.

> It's preferred to develop on a Unix machine since the build process rely on the command `make`.
>
> However, it's still possible to run these process by executing commands directly.

To start with, install the necessary dependencies:

    $ make setup

To start a development server, run:

    $ make start

This will build the site into the `./build` directory, start a local start on port 8080, and begin watching the source files for modifications in `./src/`. The site will automatically be rebuilt when files are changed. Also, if you browser has the LiveReload extension, then the page will be reloaded.

These other gulp tasks are available:

    $ yarn docs # Build documentation into the ./docs directory
    $ yarn build # Build the site into the ./build directory
    $ yarn test # Run JSCS lint and Karma tests

A snippet of folder structure.

```bash
src
|----index.handlebars # entry html template
|
|----sass # style files folder
| |----...
|
|----js
| |----regexper.js # DOM binding with Regexper
| |----main.js # entry
| |----parser
| | |----javascript.js # JavaScript Regexper Parser
| | |----javascript
| | | |----grammar.peg # grammar file
| | | |----regexp.js
| | | |----...
```

### Docker distribution

To build a docker image distribution:

    $ make build-docker

### VS Code Extension distribution

Check out the [release list](https://github.com/AkatQuas/regexper-ng/releases) and the [installation guidance](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix).

#### Work with Extension code

> Remember to run `make build_extensions` to build assets for extension to consume.

1. Open the project in VS Code editor.
1. Press `F5` to run the extension in debug mode. You are free to modify the files in `extensions`.

A snippet of folder structure.

```bash
extensions
|----webpack.config.js
|----package.json
|
|----media # assets built by regexper
| |----main.css
| |----main.js
|
|----src # extension source code
| |----extension.ts
| |----utils.ts
|
|----dist # output
| |----...
```

## License

See [LICENSE.txt](/LICENSE.txt) file for licensing details.
