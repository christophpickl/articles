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
* TECH: spectron ui tests
* [2] UI: mit SHIFT+click auf tag: reset search to only this tag
* [3] UX: when search for #dao it also finds #daoism and also #foodaofoo (shouldn't it be a "direct" match?!)
* frameworks: bootstrap, log4js, tslint 
* ! FEATURE: likes button

## Super Fancy

* each search #term as a rounded-corner-box (proper clickable tag)
* [7] UX: live autocomplete suggestion combox for tags
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