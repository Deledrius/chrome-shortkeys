Shortkeys for Firefox
================

A Firefox WebExtension for custom keyboard shortcuts.

### Installation

Download it [from the Github Release list](https://github.com/Deledrius/webext-shortkeys/releases).

### How to contribute

Don't be scared! Setup only takes 2 minutes.

**Step 1: Download and install dependencies**

1. Fork this repo and clone your fork locally.
2. Open up the root directory in a terminal
3. Run `npm install` to install the node dependencies, such as grunt and bower
4. Run `bower install` to install the bower components

**Step 2: Enable the extension**

1. Disable the AMO version of the extension if you have it enabled.
2. Open up [about:debugging](about:debugging) and click "Load Temporary Add-on".
3. Browse to the `app/` directory to install it.
4. Open up the "Options" page to configure some shortcuts.

**Step 3: Start developing**

1. Run `grunt debug`.
2. Edit some code. The extension itself should reload automatically (thanks Yeoman!).
3. When you're done with your changes, push them to your fork and create a pull request for them.
4. You can also run `grunt build` at any time to bump the manifest version and generate an
   AMO compatible zip file for upload.  See [Publishing your WebExtension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Publishing_your_WebExtension)
   for more information.
