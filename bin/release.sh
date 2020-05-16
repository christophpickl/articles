#!/bin/bash

# needs: npm install electron-packager -g

checkLastReturnCode() {
	if [ $? -ne 0 ]; then
		echo "Fail";
		exit 1;
	fi
}

rm -rf builds/
checkLastReturnCode

echo "Incrementing to next version number ..."
npm version minor
checkLastReturnCode

echo "Packaging APP file ..."
electron-packager . --overwrite --platform=darwin --arch=x64 --icon=local/applogo.mac.icns --prune=true --out=builds/
checkLastReturnCode

echo "Moving/overwriting binaries ..."
rm -rf /Applications/Articles.app
checkLastReturnCode
mv -f builds/Articles-darwin-x64/Articles.app /Applications/Articles.app
checkLastReturnCode

rm -rf builds
checkLastReturnCode

echo "Done ✅"
open /Applications/
