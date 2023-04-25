import AxiosClient from '../../config/axios'

export default {
    doGet(endPoint){
        return AxiosClient.get(endPoint)
    },
    doPost(endPoint, payload){
        return AxiosClient.post(endPoint, payload)
    },
    doPatch(endPoint, payload){
        return AxiosClient.patch(endPoint, payload)
    },
    doPut(endPoint, payload){
        return AxiosClient.put(endPoint, payload)
    },
    doDelete(endPoint){
        return AxiosClient.delete(endPoint)
    },
    doGetAndDownload(endPoint){
        return AxiosClient.get(endPoint, {responseType: 'arraybuffer'})
    }
}