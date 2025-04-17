import axios, { AxiosError } from "axios";
import { router } from "expo-router";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'X-Access-Key': process.env.EXPO_PUBLIC_API_KEY,
        "Content-Type": "application/json",
    },
    timeout: 30000,     
});


api.interceptors.request.use(
    (config) => {
        console.log("Request sent: ", config.baseURL)
        console.log("Request endpoint: ", config.url)
        console.log("Request headers: ", config.headers)
        console.log("Request params: ", config.data)
        return config;
    }, 
    (error) => {
        console.error("Request error: ", error)
        console.error("Request error: ", error.response)
    
        return Promise.reject(error);
    }
)




api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if(error.response?.status === 403) router.replace('/sign-in')
        console.error("Response error: ", error)
        console.error("Response error: ", error.toJSON())

        return Promise.reject(error)
    }

)


export default api;