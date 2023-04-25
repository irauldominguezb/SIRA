import { useEffect, useState } from 'react';
import AxiosClient from '../../../shared/plugins/axios';

export const useAspects = () => {


    const [state, setState] = useState({
        data: null,
        isLoading: true,
        hasError: null
    })


    const getAspects = async () => {
        try {

            setState({
                ...state, 
                isLoading: true
            })

            const data = await AxiosClient({ url: '/aspect/active' })
            if (!data.error) {
                setState({
                    data: data.data,
                    isLoading: false,
                    hasError: null
                })
            }else{
                setState({
                    data: null, 
                    isLoading: false,
                    hasError: data.error
                })
            }

        } catch (error) {
            setState({
                data: null, 
                isLoading: false, 
                hasError: error
            })
        } 
    }

    useEffect(() => {
        getAspects()
    },[])


    return {
        aspects: state.data, 
        isLoading : state.isLoading, 
        hasError : state.hasError
    }
}