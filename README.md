[![publish](https://github.com/dvirtz/reveal-compiler-explorer/workflows/publish/badge.svg)](https://github.com/dvirtz/reveal-compiler-explorer/actions?query=workflow%3Apublish)

monorepo for plugins and utilities to enhance [Reveal.js](https://revealjs.com/) presentations with [Compiler Explorer](https://godbolt.org).

- [reveal-compiler-explorer](/packages/reveal-compiler-explorer)
- [reveal-test](/packages/reveal-test)

# Development

This monorepo is managed by [yarn](https://yarnpkg.com).

Clone the project from Github :

```sh
git clone https://github.com/dvirtz/reveal-compiler-explorer.git
cd reveal-compiler-explorer
```

Install dependencies :

```sh
yarn
```

Run tests:

```sh
yarn test
```

Now you're ready to start contributing!

## Commit messages

This project uses [conventional commits](https://conventionalcommits.org/) so that changelogs could be generated automatically. Commit messages are validated automatically upon commit. 
