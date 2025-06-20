import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { DefaultErrorResponse } from "types";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'X-Access-Key': process.env.EXPO_PUBLIC_API_KEY,
        'Content-Type': "application/json",
    },
    timeout: 30000,     
})


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
    (error: AxiosError<DefaultErrorResponse>) => {
        if(error.response?.status === 403) router.replace('/sign-in')
        console.error("Response error: ", error?.response?.data)
        console.log(error?.response?.data)

        return Promise.reject(error)
    }

)


export default api


export const viaCepApi = axios.create({
    timeout: 30000,
    baseURL: 'https://viacep.com.br',
    headers: {
        'X-Access-Key': undefined,
        'Content-Type': "application/json",
    },
})

export const nominatimApi = axios.create({
    timeout: 10000,
    baseURL: 'https://nominatim.openstreetmap.org/search',
    headers: {
        'User-Agent': 'BiCity/1.0.0 (bicity@bicity.com.br)'
    }
})

// nominatimApi.interceptors.request.use(
//     (config) => {
//         console.log("Request sent: ", config.baseURL)
//         console.log("Request endpoint: ", config.url)
//         console.log("Request headers: ", config.headers)
//         console.log("Request params: ", config.data)
//         return config;
//     }, 
//     (error) => {
//         console.error("Request error: ", error)
//         console.error("Request error: ", error.response)
    
//         return Promise.reject(error);
//     }
// )

// nominatimApi.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error: AxiosError<DefaultErrorResponse>) => {
//         if(error.response?.status === 403) router.replace('/sign-in')
//         console.error("Response error: ", error?.response?.data)
//         console.log(error?.response?.data)

//         return Promise.reject(error)
//     }

// )