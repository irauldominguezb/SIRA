import AxiosClient from '../../../shared/plugins/axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../../../utils/firebase';
import Alert from "../../../shared/plugins/alerts";


export const useReport = (setIsLoading) => {


    //user email is not saved in db ??
    const onSaveAndSendReport = async (report) => {


        setIsLoading(true)
        //save image in fire


        let urlImage = ''
        if (report.photo) {
            urlImage = await uploadImageFirebase(report.photo, report.aspect, report.date_start)
        }

        report = { //only payload format
            ...report,
            aspect: { name: report.aspect },
            photo: urlImage
        }

        console.log(report)


        try {
            const response = await AxiosClient({
                method: "POST",
                url: "/report/",
                data: JSON.stringify(report),
            });
            if (!response.error) {
                await sendEmail(report)
                setIsLoading(false)
                Alert.fire({
                    title: 'Reporte enviado',
                    text: 'Se ha enviad de manera correcta ',
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
                return 'OK' // to know if it's necessary reset the form
            }

        } catch (error) {
            setIsLoading(false)
            Alert.fire({
                title: 'Error',
                text: 'Algo Fallo intente nuevamente',
                icon: "error",
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    //user information , do we need to say if the email had sent??
    const sendEmail = async (report) => {
        const response = await AxiosClient({
            method: "POST",
            url: "/report/sendMail",
            data: JSON.stringify(report),
        });
        return response;
    }

    /*
        save Image on firebase
    */
    const uploadImageFirebase = async (file, aspect, date) => {
        const storageRef = ref(storage, `reportes/${aspect}/${date}/${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        const url = await getDownloadURL(snapshot.ref)
        return url;
    }

    const getReportsByAspect = async (nameAspect) => {
        try {
            const data = await AxiosClient({ url: `/report/aspect/${nameAspect}/` })
            if (!data.error) return data.data;
        } catch (error) {
            console.error('No se pudieron consultar los reportes por aspecto')
        }
    }



    return {
        onSaveAndSendReport,
        getReportsByAspect
    }
}
