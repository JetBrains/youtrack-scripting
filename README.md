# youtrack-scripting

[![Build Status](https://img.shields.io/travis/JetBrains/youtrack-scripting/master.svg?style=flat-square)](https://travis-ci.org/JetBrains/youtrack-scripting)
[![official JetBrains project](http://jb.gg/badges/official-flat-square.svg)](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub)

The **@jetbrains/youtrack-scripting** package contains utility scripts that help manage YouTrack workflows when you work in an external code editor. This lets you write and update workflows for YouTrack in JavaScript in your preferred development environment.

## Quick Start

To work with the scripting package, you need to install and run [Node.js](https://nodejs.org/en/). This also installs the npm package manager that lets you work with the scripting package in your projects.
Next, install the **@jetbrains/youtrack-scripting** package in your development environment. The installation process varies based on the tool that you use to write your code. If you’re working with an IDE from JetBrains, follow the instructions provided in the documentation:
* [IntelliJ IDEA](https://www.jetbrains.com/help/idea/node-js.html)
* [PhpStorm](https://www.jetbrains.com/help/phpstorm/npm.html)
* [WebStorm](https://www.jetbrains.com/help/webstorm/2017.2/npm.html)

The easiest way to get started is to install the package globally with the following command:

```npm install -g @jetbrains/youtrack-scripting```

## Utility Scripts

The package includes scripts that let you synchronize local changes with your YouTrack installation. The following commands are available:

### List

`youtrack-workflow list --host [--token]`

This command lists all of the workflows that are available in your YouTrack installation. To use this command, specify the following parameters:

Parameter | Description
--- | :---
host | The domain name of your YouTrack installation.
token | A permanent token that grants access to the YouTrack service. You can generate your own permanent tokens to authenticate with YouTrack on the **Authentication** tab of your Hub profile.

### Download

`youtrack-workflow download <workflowName> [--output]`

This command downloads the referenced workflow from your YouTrack installation. 

If you don't specify a directory with the `output` parameter, a directory with the name `<workflowName>` is created in the current working directory and the workflow files are extracted into the new directory. Otherwise, the workflow is downloaded into the directory that is specified in the `output` parameter.

Here, you also need to specify values for the `--host` and `--token` parameters to gain authorized access to YouTrack.

### Upload

`youtrack-workflow upload <dir>`

This command uploads the workflow from the specified directory to your YouTrack installation. First, the script checks the reference directory for a `package.json` file that contains the name of the workflow. If the file is not present or does not specify the workflow name, the name of the directory is used as the name of the uploaded workflow.

Specify values for the `--host` and `--token` parameters to gain authorized access to YouTrack.

