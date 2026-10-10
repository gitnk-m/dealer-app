import { useEffect, useState } from "react";
import { api, setAccessToken } from "../api/client";
import { AuthContext } from "./authContext";

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const refAuth = async () =>{
            try{
                const userAuth = await api.post("/auth/refresh")
                setAccessToken(userAuth.data.accessToken)
                setUser({
                    userId:userAuth.data.user_id,
                    name:userAuth.data.name, 
                    email:userAuth.data.email,
                    role:userAuth.data.role,
                })
            }catch{
            }finally{
                setLoading(false);
            }
        }

        refAuth();
    },[]);

    const login = async(email, password)=>{
        const userAuth = await api.post("/auth/login", {email,password})
        setUser({
                userId:userAuth.data.user_id,
                name:userAuth.data.name, 
                email:userAuth.data.email,
                role:userAuth.data.role,
            })
        setAccessToken(userAuth.data.accessToken)
    }

    const logout = async() =>{
        try{
            await api.post("/auth/logout")
        }finally{
            setUser(null)
            setAccessToken(null)
        }
    }

    return(
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}