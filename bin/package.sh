#!/bin/bash
source "bin/common.sh"
# needs: npm install electron-packager -g
echo "Packaging DEV APP file ..."

rm -rf builds/
checkLastReturnCode

tsc
packageElectron

touch builds/Artikles-darwin-x64/Artikles.app/Contents/Resources/app/ENV_DEV
open builds/Artikles-darwin-x64
echo "Done"
