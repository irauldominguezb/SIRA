export function setDate(v_date) {
    var date = new Date(v_date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate() + 1;
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var newDate = day + "/" + month + "/" + year;
    return newDate;
}