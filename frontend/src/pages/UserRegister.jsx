import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const UserRegister = ()=>{

const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    

   
      const response = await axios.post("https://food-scroll-iopy.onrender.com/api/auth/user/register", {
        name: name,
        email,
        password
      },{
        withCredentials: true
      })
      console.log('Registration successful:', response.data);
      navigate("/");
    
    
  };
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div>
            <h3 className="auth-title">Create account</h3>
            <div className="auth-sub">Sign up as a user to order food</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">Full Name</label>
            <input name="fullName" className="form-input" placeholder="Jane Doe" required />
          </div>

          <div className="form-row">
            <label className="form-label">Email</label>
            <input name="email" className="form-input" placeholder="you@example.com" required />
          </div>

          <div className="form-row">
            <label className="form-label">Password</label>
            <input name="password" className="form-input" type="password" placeholder="•••••••" required />
          </div>

          <button className="submit" type="submit">Create account</button>

          <div style={{marginTop:10,fontSize:13,color:'var(--muted)'}}>
            Already have an account? <a className="muted-link" href="/user/login">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserRegister
