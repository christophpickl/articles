
export type Nullable<T> = T | null;

export function randomUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

// saved as: 2020-05-15T19:50:57.512Z
// let DEMO_DATE = new Date("2016-01-17T08:44:29+0100"); // had to remove the colon (:) after the T in order to make it work
// noinspection JSUnusedGlobalSymbols
export function formatDate(date: Date): String {
  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();
  let minutes = date.getMinutes();
  let hours = date.getHours();
  return day+"."+(monthIndex+1)+"."+year+" "+ hours+":"+minutes;
}

export function sortMapByKey<K, V>(map: Map<K, V>): Map<K, V> {
    let sortedKeys = Array.from(map.keys()).sort() as K[];
    let sortedMap = new Map<K, V>();
    sortedKeys.forEach((sortedKey) => {
        sortedMap.set(sortedKey, map.get(sortedKey)!);
    });
    return sortedMap;
}
