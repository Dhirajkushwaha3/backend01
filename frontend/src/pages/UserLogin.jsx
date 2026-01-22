import React from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';

const UserLogin = ()=>{
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post("https://food-scroll-iopy.onrender.com/api/auth/user/login", {
        email,
        password
      }, {
        withCredentials: true
      });
      console.log('Login successful:', response.data);
      navigate("/");
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
  
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div>
            <h3 className="auth-title">Welcome back</h3>
            <div className="auth-sub">Sign in to your user account</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">Email</label>
            <input name="email" className="form-input" placeholder="you@example.com" />
          </div>

          <div className="form-row">
            <label className="form-label">Password</label>
            <input name="password" className="form-input" type="password" placeholder="•••••••" />
          </div>

          <button className="submit" type="submit">Sign in</button>

          <div style={{marginTop:10,fontSize:13,color:'var(--muted)'}}>
            New here? <Link className="muted-link" to="/user/register" 
            style={{
              display: 'inline-block',
              padding: '10px 1px',
              color: 'var(--accent)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
    
  }}>Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserLogin
