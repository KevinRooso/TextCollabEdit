import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }else{
            config.headers.Authorization = null
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },(error) => {        
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token")
            window.location.replace('/login');
        }
    }
)

export default axiosInstance;