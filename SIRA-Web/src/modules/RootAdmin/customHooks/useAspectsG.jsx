import AxiosClient from '../../../shared/plugins/axios';
import { useReport } from '../../report/hooksCustom/useReport';

export const useAspectsG = () => {

    const { getReportsByAspect } = useReport();

    const getAllAspect = async () => {
        try {
            const data = await AxiosClient({ url: `/aspect/` })
            if (!data.error) return data;
        } catch (error) {
            console.error('No se pudieron consultar los aspectos')
        }
    }


    const countReportsByMonth = async (payload) => {
        try {
            const data = await AxiosClient({ url: `/report/aspect/${payload.name}/${payload.first_date}/${payload.last_date}` })
            if (!data.error) {
                return data
            };
        } catch (error) {
            console.error('No se pudieron consultar los datos para la grafica')
        }
    }

    const countReportsByMonthAndDone = async (payload) => {
        try {
            const data = await AxiosClient({ url: `/report/aspect/done/${payload.name}/${payload.first_date}/${payload.last_date}` })
            if (!data.error) {
                return data
            };
        } catch (error) {
            console.error('No se pudieron consultar los datos para la grafica')
        }
    }
    const countReportsByMonthAndPending = async (payload) => {
        try {
            const data = await AxiosClient({ url: `/report/aspect/pending/${payload.name}/${payload.first_date}/${payload.last_date}` })
            if (!data.error) {
                return data
            };
        } catch (error) {
            console.error('No se pudieron consultar los datos para la grafica')
        }
    }

    const getAspectByUserId = async (setAspect, id) => {
        try {
            const data = await AxiosClient({ url: `/aspect/user/` + id })
            if (!data.error)   setAspect(data.data?data.data:'NULO');

        } catch (error) {
            console.error('No se pudo consultar el aspecto que tiene el user')
        }
    }


    const countAllApectReports = async (startDate, endDate) => {

        let counter = {
            aspects: [],
            pending: [],
            done: [],
            numberReport: [],
            isEmpty: false
        }

        // const { firstDay, lastDay } = getDateMonth(month)

        const aspects = await getAllAspect()

        for (let i = 0; i < aspects.data.length; i++) {

            let aspectsReports = await getReportsByAspect(aspects.data[i].name)

            let size = aspectsReports.filter(e => e.status === false)
            counter.done.push(size.length)
            size = aspectsReports.filter(e => e.status === true)
            counter.pending.push(size.length)

            const aspectCount = await countReportsByMonth({
                name: aspects.data[i].name,
                first_date: startDate,
                last_date: endDate
            })

            counter.aspects.push(aspects.data[i].name)
            counter.numberReport.push(aspectCount.data)
        }

        for (let index = 0; index < counter.aspects.length; index++) {
            const element = counter.numberReport[index];
            if (element !== 0) {
                index = counter.aspects.length
            } else counter.isEmpty = true;
        }

        return counter;

    }

    const countAllApectReports2 = async (startDate, endDate) => {

        let counter = {
            aspects: [],
            pending: [],
            done: [],
            numberReport: [],
            isEmpty: false
        }

        // const { firstDay, lastDay } = getDateMonth(month)

        const aspects = await getAllAspect()

        for (let i = 0; i < aspects.data.length; i++) {

            // let aspectsReports = await getReportsByAspect(aspects.data[i].name)

            // let size = aspectsReports.filter(e => e.status===false)
            // counter.done.push(size.length)
            // size = aspectsReports.filter(e => e.status===true)
            // counter.pending.push(size.length)

            const doneCount = await countReportsByMonthAndDone({
                name: aspects.data[i].name,
                first_date: startDate,
                last_date: endDate
            })

            const pendingCount = await countReportsByMonthAndPending({
                name: aspects.data[i].name,
                first_date: startDate,
                last_date: endDate
            })



            const aspectCount = await countReportsByMonth({
                name: aspects.data[i].name,
                first_date: startDate,
                last_date: endDate
            })

            counter.aspects.push(aspects.data[i].name)
            counter.numberReport.push(aspectCount.data)
            counter.done.push(doneCount.data)
            counter.pending.push(pendingCount.data)
        }

        for (let index = 0; index < counter.aspects.length; index++) {
            const element = counter.numberReport[index];
            if (element !== 0) {
                index = counter.aspects.length
            } else counter.isEmpty = true;
        }

        return counter;

    }


    const countAspectReport = async (startDate, endDate, aspect) => {

        let counter = {
            name: [],
            pending: [],
            done: [],
            numberReport: [],
            isEmpty: false
        }

        const doneCount = await countReportsByMonthAndDone({
            name: aspect,
            first_date: startDate,
            last_date: endDate
        })

        const pendingCount = await countReportsByMonthAndPending({
            name: aspect,
            first_date: startDate,
            last_date: endDate
        })


        const aspectCount = await countReportsByMonth({
            name: aspect,
            first_date: startDate,
            last_date: endDate
        })

        counter.name.push(aspect)
        counter.numberReport.push(aspectCount.data)
        counter.done.push(doneCount.data)
        counter.pending.push(pendingCount.data)


        if(aspectCount.data===0) counter.isEmpty= true


        return counter;

    }


    return {
        getAllAspect,
        countReportsByMonth,
        getAspectByUserId,
        countAllApectReports,
        countAllApectReports2,
        countReportsByMonthAndDone,
        countAspectReport
    }
}