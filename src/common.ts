
export type Nullable<T> = T | null;

export function randomUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

// saved as: 2020-05-15T19:50:57.512Z
// let DEMO_DATE = new Date("2016-01-17T08:44:29+0100"); // had to remove the colon (:) after the T in order to make it work
// noinspection JSUnusedLocalSymbols
export function formatDate(date: Date): String {
  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();
  let minutes = date.getMinutes();
  let hours = date.getHours();
  return day+"."+(monthIndex+1)+"."+year+" "+ hours+":"+minutes;
}

export function removeAllChildren(node: Element) {
    while (node.firstChild) {
        node.removeChild(node.lastChild!);
    }
}

export function scrollToTop() {
    document.body.scrollTop = 0; // safari
    document.documentElement.scrollTop = 0; // chrome, firefox, IE, opera
}

export function findChildByAttribute(parent: HTMLElement, attributeName: string, searchValue: string): HTMLElement | null {
    let children = parent.children;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let childValue = child.getAttribute(attributeName);
        if (childValue == searchValue) {
            return child as HTMLElement;
        }
    }
    return null;
}

export function sortMapByKey<K, V>(map: Map<K, V>): Map<K, V> {
    let sortedKeys = Array.from(map.keys()).sort() as K[];
    let sortedMap = new Map<K, V>();
    sortedKeys.forEach((sortedKey) => {
        sortedMap.set(sortedKey, map.get(sortedKey)!);
    });
    return sortedMap;
}

export interface CrudOperations<T, K> {
    create(entity: T): T[];
    readAll(): T[];
    update(entity: T): T[];
    delete(id: K): T[];
}
