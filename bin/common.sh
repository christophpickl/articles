
checkLastReturnCode() {
	if [ $? -ne 0 ]; then
		echo "Fail";
		exit 1;
	fi
}

packageElectron() {
  electron-packager . \
    --overwrite \
    --platform=darwin \
    --arch=x64 \
    --icon=local/applogo.mac.icns \
    --prune=true \
    --out=builds/ \
    --ignore=local \
    --ignore=bin \
    --ignore=.idea \
    --ignore=.vscode \
    --ignore=tests
  checkLastReturnCode
}