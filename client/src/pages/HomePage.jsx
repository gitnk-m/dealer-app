import { useAuth } from "../auth/useAuth";
import { api } from "../api/client";


export default function HomePage () {
    const {user, logout} = useAuth();

    const checkMe = async(e) =>{
        e.preventDefault();
        try{
          const check = await api.get("/auth/me")
          console.log(check)
        }catch(err){
          console.log(err)
        }
      }
    
    return(
        <div>
            <p>Hi, {user.name} ({user.role})</p>
            <button onClick={checkMe}>Check</button>
            <button onClick={logout}>Logout</button>
        </div>
    )
}