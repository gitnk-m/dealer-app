import { createContext, useContext, useEffect, useState } from "react";
import { api, setAccessToken } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({childern}) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const refAuth = async () =>{
            const userAuth = await api.post("/auth/refresh")
            if (userAuth.response?.status === 200){
                setAccessToken(userAuth.data.accessToken)
                setUser({
                    userId:userAuth.data.user_id,
                    name:userAuth.data.name, 
                    email:userAuth.data.email,
                    role:userAuth.data.role,
                })
            }

            setLoading(false);
            refAuth();
        }
    },[]);

    const login = async(email, password)=>{
        try{
            const userAuth = await api.post("/auth/login", {email,password})
            setUser(userAuth.data)
            setAccessToken(userAuth.data.accessToken)
            setEmail("")
            setPassword("")
            setError(null)
        }catch(err){
            if (err.response?.status === 401){
                setError("Invalid Username or Password")
            }else{
                setError("Could not reach the server")
            }
            setPassword("")
            setUser(null)    
        }
    }

    const logout = async() =>{
        const userAuht = await api.post("/auth/logout")
        setUser(null)
    }

    return(
        <AuthContext.Provider value={(user, loading, login, logout)}>
            {childern}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);