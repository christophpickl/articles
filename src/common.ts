
export { Nullable, randomUuid }

type Nullable<T> = T | null;


function randomUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

// saved as: 2020-05-15T19:50:57.512Z
let DEMO_DATE = new Date("2016-01-17T08:44:29+0100"); // had to remove the colon (:) after the T in order to make it work
function formatDate(date: Date): String {
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var minutes = date.getMinutes();
  var hours = date.getHours();
  return day+"."+(monthIndex+1)+"."+year+" "+ hours+":"+minutes;
}