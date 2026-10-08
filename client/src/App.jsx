import { useState } from 'react'
import './App.css'
import { api, setAccessToken } from './api/client'

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  
  
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      const userAuth = await api.post("/auth/login", {email,password})
      setUser(userAuth.data)
      setAccessToken(userAuth.data.accessToken)
      setEmail("")
      setPassword("")
      setError(null)
    }catch(err){
      if (err.response?.status === 401){
        try{
          const userRef = await api.post("/auth/refresh")
          setUser(userRef.data)
          setAccessToken(userRef.data.accessToken)
          setEmail("")
          setPassword("")
          setError(null)
        }catch(errRef){
          setError("Invalid Username or Password")
        }
      }else{
        setError("Could not reach the server")
      }
      setPassword("")
      setUser(null)
      
    }
  }

  // const checkMe = async(e) =>{
  //   e.preventDefault();
  //   try{
  //     const check = await api.get("/auth/me")
  //     console.log(check)
  //   }catch(err){
  //     console.log(err)
  //   }
  // }

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
        {/* {user && <button onClick={checkMe}>Check</button>} */}
      </div>
    </>
  )
}

export default App
