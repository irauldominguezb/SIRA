

const getDateMonth = (month) => {
  const year = new Date().getFullYear()
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const firstDay = `${year}-${month}-01`;
  const lastDay = `${year}-${month}-${lastDayOfMonth}`;

  return {
    firstDay, lastDay
  }
}

const dateFormat = (date_start) => {
  const fecha = new Date(date_start);
  const dia = fecha.getUTCDate();
  const mes = fecha.getUTCMonth() + 1;
  const anio = fecha.getUTCFullYear();
  const fechaFormateada = `${dia < 10 ? '0' + dia : dia}-${mes < 10 ? '0' + mes : mes
    }-${anio}`;
  return fechaFormateada;
};

//currentMonth
const currentMoth = (new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1);

const splitName = (fullname) => {
  const array = fullname.split(' ')
  let name = '';
  let surname = '';
  let lastName = '';

  // console.log(fullname)

  if (array.length >= 2) {
    name = array[0]
    lastName = array[1]

    if (array.length === 3) {
      surname = array[1]
      lastName = array[2]
    }

    if (array.length === 4) {
      name += ' ' + array[1]
      surname = array[2]
      lastName = array[3]
    }
  }

  return { name, surname, lastName }
}


export function newDateFormat() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  var newDate = year + "-" + month + "-" + day;
  return newDate;
}

export {
  getDateMonth,
  currentMoth,
  dateFormat,
  splitName
}