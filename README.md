# youtrack-scripting

[![Build Status](https://img.shields.io/travis/JetBrains/youtrack-scripting/master.svg?style=flat-square)](https://travis-ci.org/JetBrains/youtrack-scripting)
[![official JetBrains project](http://jb.gg/badges/official-flat-square.svg)](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub)

The **@jetbrains/youtrack-scripting** package contains utilities that help you manage YouTrack workflows when you work in an external code editor. This lets you write and update workflows for YouTrack in JavaScript in your preferred development environment.

## Quick Start

To work with the scripting package, you need to install and run [Node.js](https://nodejs.org/en/). This also installs the npm package manager that lets you work with the scripting package in your projects.
Next, install the **@jetbrains/youtrack-scripting** package in your development environment. The easiest way to get started is to install the package globally with the following command:

```npm install -g @jetbrains/youtrack-scripting```

If you prefer to install packages as dependencies in your development environment, enter:

```npm install --save-dev @jetbrains/youtrack-scripting```

## Utility Scripts

The package includes scripts that let you synchronize local changes with your YouTrack installation. The following commands are available:

### List

`youtrack-workflow list --host --token`

This command lists all of the workflows that are available in your YouTrack installation. To use this command, specify the following parameters:

Parameter | Description
--- | :---
host | The base URL of your YouTrack installation. For an InCloud instance, include the trailing `/youtrack`.
token | A permanent token that grants access to the YouTrack service. You can generate your own permanent tokens to authenticate with YouTrack on the **Authentication** tab of your Hub profile.

### Download

`youtrack-workflow download <workflowName> --host --token [--output]`

This command downloads the referenced workflow from your YouTrack installation. 

If you don't specify a directory with the `output` parameter, a directory with the name `<workflowName>` is created in the current working directory and the workflow files are extracted into the new directory. Otherwise, the workflow is downloaded into the directory that is specified in the `output` parameter.

Here, you also need to specify values for the `--host` and `--token` parameters to gain authorized access to YouTrack.

### Upload

`youtrack-workflow upload <dir> --host --token`

This command uploads the workflow from the specified directory to your YouTrack installation. First, the script checks the reference directory for a `package.json` file that contains the name of the workflow. If the file is not present or does not specify the workflow name, the name of the directory is used as the name of the uploaded workflow.

Specify values for the `--host` and `--token` parameters to gain authorized access to YouTrack.

### Special Instructions for SSL Cerfiticates

If your YouTrack domain uses an SSL certificate that is issued by a known certificate authority, you can establish a connection using just your personal permanent token. Your certificate is already included in CA certificate store that is built into Node.js. For certificates that are issued by a CA that is not recognized automatically or is self-signed, you need to modify the environment variables in Node.js to recognize or ignore your certificate.

For more information, [refer to the YouTrack documentation](https://www.jetbrains.com/help/youtrack/incloud/js-workflow-external-editor.html#special-instructions-ssl-certificates).
