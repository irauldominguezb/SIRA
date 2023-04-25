import Alert, { errorMsj, errorTitle, msjEmail, successMsj, msjEmailDescrp, successTitle, confirmTitle, confirmMsj, msjEmailDescrpMonthE, msjEmailMonthE, anyReports, errorServer } from '../../../shared/plugins/alerts';
import AxiosClient from '../../../shared/plugins/axios';
import { dateFormat } from '../../../utils/functions';
import { useAspectsG } from './useAspectsG';


export const useReport = () => {


  const { countAllApectReports } = useAspectsG()

  //getreport
  const getReports = async (setReports) => {
    try {
      const data = await AxiosClient({
        url: '/report/',
      });
      if (!data.error) setReports(data.data);
    } catch (error) { console.log(error) }
    finally {
    }
  };

  //finishStatus
  const completedReport = (row, setReports, id) => {
    Alert.fire({
      title: confirmTitle,
      text: confirmMsj,
      icon: 'warning',
      confirmButtonColor: '#009574',
      confirmButtonText: 'Aceptar',
      cancelButtonColor: '#DD6B55',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Alert.isLoading,
      preConfirm: async () => {
        row.status = !row.status;
        row.date_end = new Date()
        try {
          const response = await AxiosClient({
            method: 'PATCH',
            url: `/report/${row.id}`,
            data: JSON.stringify(row),
          });
          if (!response.error) {
            Alert.fire({
              title: successTitle,
              text: successMsj,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar',
            });
          }
          return response;
        } catch (error) {
          Alert.fire({
            title: errorTitle,
            text: errorMsj,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
          });
        } finally {
          id ? getReportsByAscpect(setReports, id) : getReports(setReports)
        }
      },
    });
  };

  const getReportsByAscpect = async (setReports, id) => {
    try {
      const dataAspect = await AxiosClient({ url: `/aspect/user/${id}` })
      const data = await AxiosClient({ url: `/report/aspect/${dataAspect.data.name}/` })
      if (!data.error) setReports(data.data);
    } catch (error) { console.log(error) }
  }

  const countReportByAspectName = async (aspectName, startDay, endDay) => {
    try {
      const dataAspect = await AxiosClient({ url: `/report/aspect/${aspectName}/${startDay}/${endDay}` })
      if (!dataAspect.error) return dataAspect.data

    } catch (e) { errorServer(e) }
  }

  const downLoadReport = async (id, setIsDownloading) => {
    Alert.fire({
      title: msjEmail,
      text: msjEmailDescrp,
      icon: 'warning',
      confirmButtonColor: '#009574',
      confirmButtonText: 'Aceptar',
      cancelButtonColor: '#DD6B55',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Alert.isLoading,
      preConfirm: async () => {
        setIsDownloading(true)
        
        try {
          const FILE_NAME = `ReportedeIncidencia_${dateFormat(new Date())}_${id}.pdf`
          AxiosClient({
            url: `/report/generateReport/${id}`,
            responseType: 'blob'
          }).then((response) => {

            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            link.download = FILE_NAME;

            setTimeout(() => {
              link.click();
              setIsDownloading(false)
            }, 500);
          });


        } catch (e) { errorServer(e) }
      }
    });

  }

  const downloadReportMonth = (aspect, startDate, endDate, setIsDownloading) => {
    Alert.fire({
      title: msjEmailMonthE,
      text: msjEmailDescrpMonthE,
      icon: 'warning',
      confirmButtonColor: '#009574',
      confirmButtonText: 'Aceptar',
      cancelButtonColor: '#DD6B55',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Alert.isLoading,
      preConfirm: async () => {
        try {

          setIsDownloading(true)
          // const { firstDay, lastDay } = getDateMonth(month)

          const count = await countReportByAspectName(aspect.name, startDate, endDate)
          console.log(count)
          if (count > 0) {

            const FILE_NAME = `ReportedeIncidencia_${dateFormat(new Date())}_${aspect.name}.pdf`
            AxiosClient({
              url: `/report/generateReport/${aspect.id}/${startDate}/${endDate}`,
              responseType: 'blob'
            }).then((response) => {

              const url = window.URL.createObjectURL(response);
              const link = document.createElement('a');
              link.href = url;
              link.download = FILE_NAME;

              setTimeout(() => {
                link.click();
                setIsDownloading(false)
              }, 500);

            });


          } else {anyReports(); setIsDownloading(false)}
        } catch (e) { errorServer(e) }
      }
    });

  }

  const downloadAllReportByMonth = (startDate, endDate, setIsDownloading) => {
    Alert.fire({
      title: msjEmail,
      text: msjEmailDescrp,
      icon: 'warning',
      confirmButtonColor: '#009574',
      confirmButtonText: 'Aceptar',
      cancelButtonColor: '#DD6B55',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Alert.isLoading,
      preConfirm: async () => {
        setIsDownloading(true)
        try {

          const FILE_NAME = `ReportedeIncidencia_${dateFormat(new Date())}_${''}.pdf`
          // const { firstDay, lastDay } = getDateMonth(month)
          const { isEmpty } = await countAllApectReports(startDate, endDate)

          if (!isEmpty) {
            AxiosClient({
              url: `/report/generateReport/${startDate}/${endDate}`,
              responseType: 'blob'
            }).then((response) => {

              const url = window.URL.createObjectURL(response);
              const link = document.createElement('a');
              link.href = url;
              link.download = FILE_NAME;

              setTimeout(() => {
                link.click();
                setIsDownloading(false)
              }, 500);
            });

          } else { anyReports(); setIsDownloading(false) }

        } catch (e) { errorServer(e) }

      }
    });
  }


  return {
    getReports,
    getReportsByAscpect,
    downLoadReport,
    downloadReportMonth,
    completedReport,
    downloadAllReportByMonth,
    countReportByAspectName
  }
}
