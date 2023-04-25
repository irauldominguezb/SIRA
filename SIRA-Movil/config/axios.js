import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const SERVER_URL = "http://172.20.10.2:8080/api-sira";

const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 3000,
})

instance.interceptors.request.use(async (config)=> {
  const token =((await AsyncStorage.getItem("@token") || null))
  if(token!= null){
    const token2 = token.substring(1, token.length-1)
    config.headers.Authorization = `Bearer ${token2}`;
  }
  return config;
}, function (error){
  return Promise.reject(error);
})

export default instance;