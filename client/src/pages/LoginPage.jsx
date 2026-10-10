import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";

export default function LoginPage (){
    const {user, login} = useAuth();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    
    if(user){
        return <Navigate to="/" replace/>
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
          await login(email, password);
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
        }
    }
    
    return (
    <>
      <div className="App">
        <h1>Dealer Management</h1>
        {!user && <form className="card" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button>Login</button>
        </form>}
        {user && <p>Logged in as {user.name} ({user.role})</p>}
        <p>{error}</p>
      </div>
    </>
  )
    
}