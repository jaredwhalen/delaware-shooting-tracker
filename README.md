# 2021-07-shooting-tracker

This is an old React app deployed to the Gannett CDN.


### Running locally
If running on Silicon Macbook Pro, follow these [steps](https://stackoverflow.com/questions/67254339/nvm-install-node-fails-to-install-on-macos-big-sur-m1-chip) to install older versions of Node with nvm.
 
```
# if on a newer Mac
softwareupdate --install-rosetta
arch -x86_64 zsh
nvm install 14.18.1
nvm use 14.18.1
npm start
```

### Building
Run `npm run build`

### Deploying
To deploy, you'll need to have the following on your path
```
export CDN_CURL_AUTH=" ... [key] ... "
export CDN_AUTH=" ... [key] ... "
export USAT_AUTH=" ... [key] ... "
export USCP_AUTH=" ... [key] ... "
```
You will also need `gsutil` installed, which can be [downloaded from here](https://cloud.google.com/storage/docs/gsutil_install#install).

Once those are set, from the project root you can run `./deploy.sh --production` (or `--staging` or `--preprod` depending on your need), which will deploy the `build/` folder.

