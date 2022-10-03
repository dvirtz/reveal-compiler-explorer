## 2.0.0 (2022-10-03)


### ⚠ BREAKING CHANGES

* **reveal-compiler-explorer-demo, reveal-test:** removes `parseMarkdownSync` API

### Features

* **compiler-explorer-directives, reveal-compiler-explorer-demo, reveal-compiler-explorer, reveal-test:** parse html in markdown 2ca543e
* **compiler-explorer-directives, reveal-compiler-explorer:** add debug logs 4ae0a07
* **compiler-explorer-directives, reveal-compiler-explorer:** get supported languages from CE 4d5a87b
* **compiler-explorer-directives, reveal-compiler-explorer:** set default C options to match C++ e992d1b
* **reveal-compiler-explorer-demo, reveal-test:** use async parsing 16dd579
* **reveal-compiler-explorer-demo:** display only the relevant keyboard shortcut 2400dd6
* **reveal-compiler-explorer:** skip unsupported code blocks 4e0bbc7


### Bug Fixes

* **compiler-explorer-directives, reveal-compiler-explorer, reveal-test:** support <mark> in code 3f70de3
* **compiler-explorer-directives:** use baseUrl when compiling d9e18a8
* **reveal-compiler-explorer-demo:** add test command to demo c5ed215, closes #42
* **reveal-compiler-explorer-demo:** npm link in demo 55bf898
* **reveal-test:** calling async function without await fb9285f
* **reveal-test:** correct dedent dependency 4faf529
* **reveal-test:** multiple newlines 2659c02


### Documentation

* **compiler-explorer-directives:** add missing directive bd8bd57


### General maintenance

* add developement notes 6b0e8ad
* check there's no uncommited changes 6fe719b
* **compiler-explorer-directives, reveal-compiler-explorer, reveal-test:** autopublish 2022-09-20T16:02:54Z 31575cb
* **compiler-explorer-directives, reveal-compiler-explorer, reveal-test:** build without warnings 70e1776
* **compiler-explorer-directives, reveal-compiler-explorer:** avoid optional chaining 8380b1b
* conventional publish commit 22fad13
* ignore .devcontainer e267cb6
* **release:** publish 42a756e
* **release:** publish bb083f5
* **release:** publish df77a40
* **release:** publish 58bc45d
* **release:** publish 92e4737
* **release:** publish 38a8644
* **release:** publish 4e8a394
* **release:** publish 074b63a
* **release:** publish 3e0ac9c
* rename default branch to main 3b56858
* **reveal-compiler-explorer-demo:** add a readme b840456
* **reveal-compiler-explorer-demo:** remove redundant script 9041dee
* **reveal-compiler-explorer, reveal-test:** add changed files a97441e
* **reveal-compiler-explorer, reveal-test:** refactor installation instruction 50a121c
* **reveal-test:** configure tests compiler version de6984c


### Build and continuous integration

* add build pre-commit fa7cf20
* adjust commit message limits 9211788
* call lerna version explicitly 0e7b51d
* check correct node version 06a7540
* **compiler-explorer-directives, reveal-compiler-explorer-demo, reveal-compiler-explorer, reveal-test:** release with semantic-release 78016b0
* **compiler-explorer-directives, reveal-compiler-explorer-demo, reveal-compiler-explorer:** sort out lerna link dfdf92c
* **compiler-explorer-directives, reveal-compiler-explorer, reveal-test:** rollup cleanup bc431c1
* don't commit files dbe3e98
* don't persist git creds 7bda1e7
* fix lerna switch db4f251
* fix npm token c30d42f
* independent versioning and conentional commits ([#28](undefined/dvirtz/reveal-compiler-explorer/issues/28)) 3b55e86
* let lerna create a release afa3ff0
* pass push token db6fec6
* push changes 9d9ef9b
* remove duplicate master builds 2fab2a8
* remove redundant steps dd98289
* **reveal-test:** deprecate node 10 3c37393
* top level module support 95b157d
* upgrade husky 722b255
* upgrade setup-node action 9361c90
* use a token that can bypass branch protection deb2eeb
