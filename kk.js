function getCurrentMonthFirst() {
    var date = new Date();
    date.setDate(1);
    return date;
}

function getCurrentMonthLast() {
    var date = new Date();
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    return new Date(nextMonthFirstDay - oneDay);
}

// console.log(getCurrentMonthFirst());
// console.log(getCurrentMonthLast());

let da = new Date(1512958872);

// console.log(da.getYear());

// function formatDate(now) {
//     var year = now.getUTCFullYear();
//     var month = now.getMonth() + 1;
//     var date = now.getDate();
//     var hour = now.getHours();
//     var minute = now.getMinutes();
//     var second = now.getSeconds();
//     return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
// }
//
// var d = new Date(1512958872);
// console.log(formatDate(d));
var time = new Date(parseInt(1512958872) * 1000).toLocaleDateString();
console.log(time);