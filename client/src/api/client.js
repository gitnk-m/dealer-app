import axios from "axios";

export const api= axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });

let accessToken = null;

export const setAccessToken = (token) => {accessToken = token};

api.interceptors.request.use((config) =>{
    if (accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response)=>response,
    async (error) =>{
        const original = error.config
        const isAuthCall = original.url === "/auth/login" || original.url === "/auth/refresh";
        
        if (error.response?.status !== 401 || isAuthCall || original._retry){
            return Promise.reject(error);
        }  

        original._retry = true
        try{
            const accToken = await api.post("/auth/refresh")
            setAccessToken(accToken.data.accessToken)
            return api(original)
        }catch(refreshError){
            setAccessToken(null)
            return Promise.reject(refreshError)
        }
    }
)