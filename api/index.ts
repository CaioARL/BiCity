import axios from "axios";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'access-token': process.env.EXPO_PUBLIC_API_KEY,
        "Content-Type": "application/json",
    },
    timeout: 10000,     
});


api.interceptors.request.use(
    (config) => {
        console.log("Request sent: ", config.baseURL);
        return config;
    }, 
    (error) => {
        console.error("Request error: ", error);
        console.error("Request error: ", error.response);
    
        return Promise.reject(error);
    }
)




api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("Response error: ", error)
        console.error("Response error: ", error.toJSON())

        return Promise.reject(error)
    }

)


export default api;