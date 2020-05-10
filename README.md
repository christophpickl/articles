# Articles

An (electron) desktop application to manage (tagged) articles locally.

# Todos

## Now

* ! data migration (date added, date updated, likes, isDeleted)
* CONTENT: rewrite everything, using "you" (but first introduce data migration ;)
* CONTENT: rework/rethink all tags
* UI!: move all tags in a vertical list as a side bar
* UI: order tags alphabetically
* CONTENT: mark every artikle, where a teacher is involved, the name of the teacher, at the end with a "[so-und-so]"
* TECH: refactor software design (context, classes, interfaces)
* change UI: make list of articles scrollable (fill vertical space); no need for "scrollUp" util
* TECH: tests
* UI: mit SHIFT+click auf tag: reset search to only this tag
* UI: save with hitting CMD+S
* UI: set focus on app load on title input field

## Later

* better build with electron, see: https://github.com/jreznot/electron-java-app/blob/master/build.gradle
* [8] auto backup functionality
* when search for #dao it also finds #daoism and also #foodaofoo (shouldn't it be a "direct" match?!)

## Luxury

* [7] live autocomplete suggestion combox for tags
* FANCY: in-line editor, when click on article (don't jump to form at top!)
* FANCY: delete button which appears when hover over some part of an article (far right, just slightly indicated)
- sort all tags (by number of occurence OR alphabetically)
- change view mode: compact only seeing list of titles (sorted alphabetically?!)
- back office:
	* tags related to each other
	* articles link with each other
	=> increased search suggestions / network (afterwards with point system)