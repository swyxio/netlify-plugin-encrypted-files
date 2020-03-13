# Netlify Plugin Encrypted Files

[Netlify Build](https://github.com/netlify/build) Plugin to partially obscure files (names and contents) in git repos!

This enables you to ***partially* open source your site**, while still being able to work as normal on your local machine and in your Netlify builds. 

External viewers of your Git repo will just see hashes for your secret content while it is encrypted - and as long as it still builds without these files, they can still contribute to the rest of your site.

## Usage

Specify the plugin in your `netlify.yml`. No config is required but we show the default options here.

```yml
# netlify.yml
build:
  publish: build # NOTE: you should have a publish folder specified here for this to work
  command: echo "your build command goes here"
  NODE_ENV: 10.15.3

plugins:
  - package: netlify-plugin-encrypted-files
    # no config required
    # config:
      # branches: # if specified, allow a small set of branches for which the decrypt is applied
      # - master
      # - swyx/myNewBranch
    # dont forget to specify a NETLIFY_ENCRYPT_KEY env variable in Netlify's UI
```

In your local environment, install the plugin and run the `encrypt` CLI on your project specifying a glob filepath for what should be encrypted and what `NETLIFY_ENCRYPT_KEY` you intend to use, e.g.

```bash
npm i netlify-plugin-encrypted-files
NETLIFY_ENCRYPT_KEY='test' node encrypt.js content/secretstuff/**/*.*
```

This generates a `.encrypted` folder which you should check into git. ([Here's how it looks - even filenames are obscured!](https://github.com/sw-yx/netlify-plugin-encrypted-files/tree/master/.encrypted))

Also dont forget to `.gitignore` your secret content!

On Netlify's side, all it does is it runs `decrypt` for you, using the same `NETLIFY_ENCRYPT_KEY` you used to encrypt it. To set the environment variable without it being visible in git, you should [use the Netlify UI](https://docs.netlify.com/configure-builds/environment-variables/#declare-variables).

## How It Works

This plugin is an unusual one. it has a CLI that works outside of the build bot.

The idea is:

0. you should have your site linked with the Netlify CLI
1. while developing, work with your files as normal

- before committing, run `encrypt secretcontent/**/*.md` (any file matching logic here will do)
- make sure encrypted files are gitignored
- `encrypt` will encrypt your files to the `.encrypt` folder with the `NETLIFY_ENCRYPT_KEY` environment variable

2. while deploying, this plugin runs a `decrypt` before any build and decrypts it with the same env variable
3. for collaborators, they should run `decrypt` on git pull

To test locally you can run:

-  `NETLIFY_ENCRYPT_KEY='test' node encrypt.js fixtures/files/secretstuff/**/*.*`
-  `NETLIFY_ENCRYPT_KEY='test' node decrypt.js --testdecrypt`

No configuration is required - by default the `decrypt`ing works on all Netlify Builds, but you can restrict it to a small set of branches you specify:

```yml
# netlify.yml
plugins:
  - package: netlify-plugin-encrypted-files
    config:
      branches: # if specified, allow a small set of branches for which the decrypt is applied
      - master
      - swyx/myNewBranch
    # dont forget to specify a NETLIFY_ENCRYPT_KEY env variable in Netlify's UI
```
