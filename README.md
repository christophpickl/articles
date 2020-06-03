# Articles

An (electron) desktop application to manage (tagged) articles locally.

# Todos

* !!! UI BUG:
    * GIVEN editing an article
    *   AND search so it won't match
    * WHEN update article so it does match
    * THEN suddenly show up in the UI
    * // same also in other direction: given visible, when update mismatching, then hide
    * SAME also for sort 
* store in settings also most recent sort order
* UI: mit SHIFT+click auf tag: reset search to only this tag
* UX: when search for #dao it also finds #daoism and also #foodaofoo (shouldn't it be a "direct" match?!)
* frameworks: bootstrap, log4js, tslint 
* proper environment (pass via system property; if none set-> fail! also needed for PROD/DEV/TEST)
* FINISH: spectron ui tests
* MINOR UI: UX from buttons also for inputs: black normally, :hover change grey
* MINOR UI: unify look of placeholders ("tags" is different)

## Super Fancy

* keyboard navigation up/down
* in-line editor, when click on article (don't jump to form at top!)
* [3] better build with electron, see: https://github.com/jreznot/electron-java-app/blob/master/build.gradle
* delete button which appears when hover over some part of an article (far right, just slightly indicated)
* change view mode: compact only seeing list of titles (sorted alphabetically?!)
* [8] auto backup functionality
* back office:
	* tags related to each other
	* articles link with each other
	* => increased search suggestions / network (afterwards with point system)
	
# HowTos

## NPM

* setup jquery:
    * `npm install --save-dev @types/jquery` 
    * `npm install jquery --save`
* setup jest:
    * `npm i -D jest ts-jest typescript`
    * `npm i -D @types/jest`
* setup spectron
    * `npm install --save-dev spectron`
