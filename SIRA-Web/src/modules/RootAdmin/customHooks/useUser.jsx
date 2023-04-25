import Alert, { confirmMsj, confirmTitle, errorMsj, errorTitle, successMsj, successTitle } from '../../../shared/plugins/alerts';
import AxiosClient from '../../../shared/plugins/axios';

export const useUser = () => {

    const enableOrDisable = (row, getUsers) => {
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
            try {
              const response = await AxiosClient({
                method: 'PUT',
                url: `/user/${row.id}`,
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
              getUsers();
            }
          },
        });
      };
    
  return {
    enableOrDisable
  }
}
