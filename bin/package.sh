#!/bin/bash
source "bin/common.sh"
# needs: npm install electron-packager -g

rm -rf builds/
checkLastReturnCode

packageElectron

open builds/Artikles-darwin-x64
echo "Done"
