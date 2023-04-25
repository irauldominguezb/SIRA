import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Alert = withReactContent(Swal);

export const confirmMsj =
  'Le solicitamos esperar un momento a que se realice la acción solicitada';
export const confirmTitle = '¿Está seguro de realizar la acción?';
export const successMsj =
  'La acción solicitada se ha realizado exitosamente';
export const successTitle = 'Acción realizada exitosamente';
export const errorMsj =
  'No se ha logrado realizar la actividad solicitada, por lo cual le pedimos intentar nuevamente, en caso contrario contactar a soporte técnico para solucionar el problema';
export const errorTitle = 'Error al realizar la acción';


export const msjEmail = 'Descargar Reporte';
export const msjEmailDescrp = '¿Seguro que deseas descargar el reporte PDF?';

export const msjEmailMonthE = 'Descargar reportes del mes';
export const msjEmailDescrpMonthE = '¿Deseas descargar el resumen de los reportes?';

export const anyReports = () => {
  Alert.fire({
    title: 'Sin Reportes',
    text: 'No se ha podido generar el resumen, dado que no hay reportes en el mes seleccionado',
    icon: 'error',
    confirmButtonColor: '#f27474',
    confirmButtonText: 'Aceptar',
  })
}


export const errorServer = (error) => {
  Alert.fire({
    title: errorTitle,
    text: errorMsj,
    icon: 'error',
    confirmButtonColor: '#f27474',
    confirmButtonText: 'Aceptar',
  });
}








export default Alert;
