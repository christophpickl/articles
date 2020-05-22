# Articles

An (electron) desktop application to manage (tagged) articles locally.

# Todos

## Now

* change UI: make list of articles scrollable (fill vertical space); no need for "scrollUp" util
* UI: tag summary list, make font-size dynamic based on count
* UI: order tags alphabetically everywhere
* UI: save with hitting CMD+S

## Later

* keyboard navigation:
    * up/down, CMD+F/S
    * ESC (cancel edit in all inp fields; when esc "ins nichts" UND search active => cancel search)
    * tab order
* TECH: tests
* [2] UI: mit SHIFT+click auf tag: reset search to only this tag
* [3] better build with electron, see: https://github.com/jreznot/electron-java-app/blob/master/build.gradle
* [7] live autocomplete suggestion combox for tags
* [3] when search for #dao it also finds #daoism and also #foodaofoo (shouldn't it be a "direct" match?!)
* [8] auto backup functionality

## Luxury

* FANCY: in-line editor, when click on article (don't jump to form at top!)
* FANCY: delete button which appears when hover over some part of an article (far right, just slightly indicated)
- sort all tags (by number of occurence OR alphabetically)
- change view mode: compact only seeing list of titles (sorted alphabetically?!)
- back office:
	* tags related to each other
	* articles link with each other
	=> increased search suggestions / network (afterwards with point system)