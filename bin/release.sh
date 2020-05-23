#!/bin/bash
source "bin/common.sh"
# needs: npm install electron-packager -g

npm test
checkLastReturnCode

rm -rf builds/
checkLastReturnCode

echo "Incrementing to next version number ..."
npm version minor
checkLastReturnCode

echo "Packaging APP file ..."
packageElectron

echo "Moving/overwriting app packages ..."
rm -rf /Applications/Artikles.app
checkLastReturnCode

# create file indicating in environment=PROD
touch builds/Artikles-darwin-x64/Artikles.app/Contents/Resources/app/ENV_PROD
mv -f builds/Artikles-darwin-x64/Artikles.app /Applications/Artikles.app
checkLastReturnCode

rm -rf builds
checkLastReturnCode

echo "Done ✅"
open /Applications/
