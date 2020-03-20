# Netlify Plugin Encrypted Files

[Netlify Build](https://github.com/netlify/build) Plugin to partially obscure files (names and contents) in git repos!

This enables you to ***partially* open source your site**, while still being able to work as normal on your local machine and in your Netlify builds. 

External viewers of your Git repo will just see hashes for your secret content while it is encrypted - and as long as it still builds without these files, they can still contribute to the rest of your site.

## Demo

https://netlify-plugin-encrypted-files.netlify.com

## Usage

To install, add the following lines to your `netlify.toml` file:

```toml
[[plugins]]
package = "netlify-plugin-encrypted-files"
  # all inputs are optional. uncomment to apply
  # [plugins.inputs]
  # branches = [ # if specified, allow a small set of branches for which the decrypt is applied
    # "master",
    # "swyx/myNewBranch"
  # ] # dont forget to specify a NETLIFY_ENCRYPT_KEY env variable in Netlify's UI
```

In your local environment, install the plugin and run the `encrypt` CLI on your project specifying a glob filepath for what should be encrypted and what `NETLIFY_ENCRYPT_KEY` you intend to use, e.g.

```bash
npm i netlify-plugin-encrypted-files
NETLIFY_ENCRYPT_KEY='test' node encrypt.js content/secretstuff/**/*.*
```

This generates a `.encrypted` folder which you should check into git. ([Here's how it looks - even filenames are obscured!](https://github.com/sw-yx/netlify-plugin-encrypted-tree/master/.encrypted))

Also dont forget to `.gitignore` your secret content!

On Netlify's side, all it does is it runs `decrypt` for you, using the same `NETLIFY_ENCRYPT_KEY` you used to encrypt it. To set the environment variable without it being visible in git, you should [use the Netlify UI](https://docs.netlify.com/configure-builds/environment-variables/#declare-variables).

![image](https://user-images.githubusercontent.com/6764957/77190041-e827d600-6aae-11ea-9a5d-5dc13b4b0475.png)


## How It Works

This plugin is an unusual one: it has a CLI that works outside of the build bot, that you use to encrypt stuff. Then, inside the plugin, it runs the decrypt command for you before proceeding with the build.

The idea is:

1. while developing, work with your files as normal

- before committing, run `encrypt secretcontent/**/*.md` (any file matching logic here will do)
- make sure files-to-be-encrypted are gitignored
- `encrypt` will encrypt your files to the `.encrypt` folder with the `NETLIFY_ENCRYPT_KEY` environment variable
- so you run something like:
  -  `NETLIFY_ENCRYPT_KEY='test' yarn encrypt demo/secretstuff/**/*.*`
  -  or `NETLIFY_ENCRYPT_KEY='test' /node_modules/.bin/encrypt demo/secretstuff/**/*.*`
- check the new `.encrypt` folder into git

2. while deploying, this plugin runs a `decrypt` before any build and decrypts it with the same env variable
3. for collaborators, they should run `decrypt` on git pull. 
- so you run something like:
  -  `NETLIFY_ENCRYPT_KEY='test' yarn decrypt demo/secretstuff/**/*.*`
  -  or `NETLIFY_ENCRYPT_KEY='test' /node_modules/.bin/decrypt demo/secretstuff/**/*.*`
- NOTE: By default this overwrites files since that is usually the desired behavior, but if you want to be extra sure, you can add a `--testdecrypt` flag:
  -  `NETLIFY_ENCRYPT_KEY='test' yarn decrypt --testdecrypt demo/secretstuff/**/*.*`
  -  or `NETLIFY_ENCRYPT_KEY='test' /node_modules/.bin/decrypt --testdecrypt demo/secretstuff/**/*.*`
  - this will decrypt to a `testdecrypt` folder instead of the real destination, so you can preview what the effect of decrypting will be.

## Configuration

No configuration is required - by default the `decrypt`ing works on all Netlify Builds, but you can restrict it to a small set of branches you specify:

```toml
# netlify.toml
[[plugins]]
package = "netlify-plugin-encrypted-files"

  [plugins.inputs]
  
  # if specified, allow a small set of branches for which the decrypt is applied
  branches = [
    "master",
    "swyx/myNewBranch"
  ] 
  
  # dont forget to specify a NETLIFY_ENCRYPT_KEY env variable in Netlify's UI
```

## For Collaborators

To test this repo locally you can run:

-  `NETLIFY_ENCRYPT_KEY='test' node encrypt demo/secretstuff/**/*.*`
-  `NETLIFY_ENCRYPT_KEY='test' node decrypt --testdecrypt` by default decrypt
