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


echo "Packaging APP file ..."
electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/applogo.mac.icns --prune=true --out=builds/
checkLastReturnCode

open builds/Articles-darwin-x64
echo "Done"