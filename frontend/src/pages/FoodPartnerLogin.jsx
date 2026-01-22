import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodPartnerLogin = ()=>{
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post("https://food-scroll-iopy.onrender.com/api/auth/food-partner/login", {
        email,
        password
      }, {
        withCredentials: true
      });
      console.log('Login successful:', response.data);
      // store token for Authorization header fallback

      
      if (response.data && response.data.token) {
        localStorage.setItem('foodPartnerToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      navigate("/create-food");
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div>
            <h3 className="auth-title">Partner sign in</h3>
            <div className="auth-sub">Access your food partner dashboard</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">Email</label>
            <input name="email" className="form-input" placeholder="owner@biz.com" />
          </div>

          <div className="form-row">
            <label className="form-label">Password</label>
            <input name="password" className="form-input" type="password" placeholder="•••••••" />
          </div>

          <button className="submit" type="submit">Sign in</button>

          <div style={{marginTop:10,fontSize:13,color:'var(--muted)'}}>
            New partner? <a className="muted-link" href="/food-partner/register">Create account</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FoodPartnerLogin
