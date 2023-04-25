import { useAspectsG } from './useAspectsG';
import Alert from '../../../shared/plugins/alerts';

export const useGrafics = () => {

    const { countAllApectReports2,  countAllApectReports, countAspectReport} = useAspectsG()

    const onCountReportByAspect= async (startDate, endDate, aspect  ) => {
        

        let formTable = await countAspectReport(startDate, endDate, aspect)

        if (formTable.isEmpty) {
            formTable.done=[];
            formTable.pending=[];
            Alert.fire({
                title: 'Sin Reportes',
                text: 'No hay reportes en la fecha seleccionado',
                icon: 'info',
                showConfirmButton: false,
                timer: 1000
            })
        }


        return {
            labels: formTable.name,
            datasets: [{
                label: 'Reportes',
                backgroundColor: '#002E60',
                borderColor: '#002E60',
                hoverBorderColor: 'black',
                hoverBackgroundColor: '#002E60BB',
                borderWidth: 1,
                data: formTable.numberReport
            },{
                label: 'Completados',
                backgroundColor: '#0D8E66',
                borderColor: '#0D8E66',
                hoverBorderColor: 'black',
                hoverBackgroundColor: '#0D8E66aa',
                borderWidth: 1,
                data: formTable.done
            },{
                label: 'Pendientes',
                backgroundColor: '#aaa',
                borderColor: '#aaa',
                hoverBorderColor: 'black',
                hoverBackgroundColor: '#aaaaa',
                borderWidth: 1,
                data: formTable.pending 
            },]
        }


    } 

    const onCountReport = async (startDate, endDate) => {        //create date


        console.log("asmin")

        let formTable = await countAllApectReports2(startDate, endDate)

        if (formTable.isEmpty) {
            formTable.done=[];
            formTable.pending=[];
            Alert.fire({
                title: 'Sin Reportes',
                text: 'No hay reportes en el mes seleccionado',
                icon: 'info',
                showConfirmButton: false,
                timer: 1000
            })
        }

        return {
            labels: formTable.aspects,
            datasets: [{          
                label: 'Reportes',
                backgroundColor: '#002E60',
                borderColor: '#002E60',
                hoverBorderColor: 'black',
                hoverBackgroundColor: '#002E60BB',
                borderWidth: 1,
                data: formTable.numberReport
            },{
                label: 'Completados',
                backgroundColor: '#0D8E66',
                borderColor: '#0D8E66',
                hoverBorderColor: 'black',
                hoverBackgroundColor: '#002E60BB',
                borderWidth: 1,
                data: formTable.done
            },{
                label: 'Pendientes',
                backgroundColor: '#aaa',
                borderColor: '#aaa',
                hoverBorderColor: 'black',
                hoverBackgroundColor: '#002E60BB',
                borderWidth: 1,
                data: formTable.pending 
            },]
        }

    }
    const onCountReport2 = async (startDate,endDate) => {        //create date

        let formTable = await countAllApectReports(startDate, endDate)

        console.log(formTable);

        if (formTable.isEmpty) {
            formTable.done=[];
            formTable.pending=[];
            Alert.fire({
                title: 'Sin Reportes',
                text: 'No hay reportes en el mes seleccionado',
                icon: 'info',
                showConfirmButton: false,
                timer: 1000
            })
        }

        return {
            labels: formTable.aspects,
            datasets: [{
                label: 'Reportes',
                backgroundColor: '#002E60',
                borderColor: '#002E60',
                hoverBorderColor: 'black',
                hoverBackgroundColor: '#002E60BB',
                borderWidth: 1,
                data: formTable.numberReport
            },{
                label: 'Completados',
                backgroundColor: '#0D8E66',
                borderColor: '#0D8E66',
                hoverBorderColor: 'black',
                hoverBackgroundColor: '#002E60BB',
                borderWidth: 1,
                data: formTable.done
            },{
                label: 'Pendientes',
                backgroundColor: '#aaa',
                borderColor: '#aaa',
                hoverBorderColor: 'black',
                hoverBackgroundColor: '#002E60BB',
                borderWidth: 1,
                data: formTable.pending 
            },]
        }

    }

    return {
        onCountReport,
        onCountReport2,
        onCountReportByAspect
    }
}
