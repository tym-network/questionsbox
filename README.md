# QuestionsBox

An electron app (for desktop) that allows you to automatically record the webcam and the audio of your computer while questions are being dislayed on screen.

It's great to provide some entertainment during a party, a team building or any event, and it's pretty easy to setup. All you need is a computer with a webcam and a microphone.

## Feature list

-   Record the webcam and the microphone and automatically save it in .webm
-   Allow the users to start a session on their own (loop by itself, instructions are provided in the app)
-   Supports multiple languages for questions: write your questions in any language, the user will chose the one he/she prefers before the questions start
-   Interface available in English and in French (and can easily be extended if someone wishes to translate it in an another language)
-   Customize the title, the logo and even the buzz sound to make it match your event
-   Edit the questions directly in the app

## Compatibility

Works on Windows, Mac and Linux.

## How to install

Download the release for your OS (.dmg for macOS, .exe for Windows, .deb or Appfile for Linux).

### macOS

Double-click on the .dmg file. It should open a new window. Simply drag the "QuestionsBox" app to the "Applications" folder. You can now run the app directly for your Applications folder.

## How to use

When you start the app for the first time, a new `questions.json` file will be created in a folder dedicated to the app (see "Where to find the generated files" to know more about this). The questions can be edited on the app in "Customize" > "Edit Questions". For now only a few locales are supported but more should arrive soon.

Note that you do not need to provide the same number of questions for each locale. The question sets can be totally different.

If you only have one locale and this locale is either "fr" or "en", then the app will detect it and use the correct translation for the interface.

If you use another locale or you have multiple locales, the app will be in English by default. When the user selects the locale he/she wishes to use for the questions, the interface will also try to adapt if the locale is supported (only English and French for the moment).

When using QuestionsBox for the first time, make sure you check the "Settings" part before clicking on "Start". That way, you can make sure the webcam and the microphone work properly. Check that the video displayed in "Settings" is the correct one and that when you speak the volume bar is changing. These settings are saved in a configuration file so you do not need to check them everytime you run the app.

If you ever encounter an error using the app, please create an issue on Github and check the error log located in the `error.json` file (should be next to `questions.json`).

## Where to find the generated files

The path where your `questions.json`, `config.json`, `error.json` files and the recorded videos are stored depends of the OS you use:

-   %APPDATA%/QuestionsBox on Windows
-   $XDG_CONFIG_HOME/QuestionsBox or ~/.config/QuestionsBox on Linux
-   ~/Library/Application Support/QuestionsBox or ~/Users/%CURRENTUSER%/Library/Application Support/QuestionsBox on macOS

# Developer notes

## How to build the code from the source

To build the source code, run `npm run build`. This will build the code for both the main and the renderer process (this is a specificity of Electron, with a main context and a renderer for each window). Consequently, this will run two webpack process at the same time to build the source accordingly.

The executable code will be located in the `web` folder, will all the assets required.

If you only wish to build the "main" JS file, run `npm run build-main`. To build the code for the "rendered", run `npm run build-renderer:dev` (for development) or `npm run build-renderer:prod` (for production).

Note that these scripts also exist in "watch" versions: `npm run watch`, `npm run watch-main`, `npm run watch-renderer`.

Once the code is build, you can start your Electron app by running `npm start`.

TLDR:

-   Terminal 1: `npm run watch`
-   Terminal 2 : `npm start`

## How to package your own version

If you want to create a release of your code, a node script is here to do it for you in one line: `node ./scripts/build.js`.

This will build the source code for the main and the renderer, in production mode. It will then rely on [electron-builder](https://github.com/electron-userland/electron-builder) to package the app into an executable that is ready to be released. The release will be located in `./build`

### Build for Linux on MacOS

To build for Linux when you are on MacOS, please install `xz` by doing `brew install xz` (if you have Homebrew on your machine).

If you have an issue with the .tar (`Process failed: tar failed`), you can install GNU-tar and link tar to GNU-tar because of an option not being available on MacOS tar:

`brew install gnu-tar`

Add `export PATH="/usr/local/opt/gnu-tar/libexec/gnubin:$PATH" # Use GNUtar rather than tar` to your .bash_profile. Don't forget to `source` your bash_profile or to open a new terminal before running the build script.

### Build for Windows on MacOS

To build for Windows on MacOS, install wine and mono: `brew install mono` and `brew install wine`

## Features to come

-   Improve UI and UX
-   More customizations
