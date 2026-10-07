import { useEffect, useState } from 'react'
import './App.css'
import { api } from './api/client'

function App() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  
  
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      const userAuth = await api.post("/auth/login", {email,password})
      setUser(`Logged in as ${userAuth.data.name} (${userAuth.data.role})`)
      setEmail(null)
      setPassword(null)
      setError(null)
    }catch(err){
      setEmail(null)
      setPassword(null)
      setUser(null)
      setError("Invalid Username or Password")
    }
  }


  return (
    <>
      <div className="App">
        <h1>Dealer Management</h1>
        <form className="card" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button>Login</button>
        </form>
        <p>{user}</p>
        <p>{error}</p>
      </div>
    </>
  )
}

export default App
