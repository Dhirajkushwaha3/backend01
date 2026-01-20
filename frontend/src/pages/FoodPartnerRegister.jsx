import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const FoodPartnerRegister = ()=>{
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const address = e.target.address.value;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/food-partner/register", {
        name,
        contactName,
        phone,
        email,
        password,
        address
      }, {
        withCredentials: true
      });
      console.log('Registration successful:', response.data);
      navigate("/create-food");
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div>
            <h3 className="auth-title">Partner sign up</h3>
            <div className="auth-sub">Create a food partner account</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">Name</label>
            <input name="name" className="form-input" placeholder="Tasty Bites" />
          </div>

          <div className="form-row">
            <label className="form-label">Contact name</label>
            <input name="contactName" className="form-input" placeholder="Jane Doe" />
          </div>

          <div className="form-row">
            <label className="form-label">Phone</label>
            <input name="phone" className="form-input" placeholder="+1 555 555 5555" />
          </div>

          <div className="form-row">
            <label className="form-label">Email</label>
            <input name="email" className="form-input" placeholder="owner@biz.com" />
          </div>

          <div className="form-row">
            <label className="form-label">Password</label>
            <input name="password" className="form-input" type="password" placeholder="•••••••" />
          </div>

          <div className="form-row">
            <label className="form-label">Address</label>
            <input name="address" className="form-input" placeholder="123 Main St, City, Country" />
          </div>

          <button className="submit" type="submit">Create account</button>

          <div style={{marginTop:10,fontSize:13,color:'var(--muted)'}}>
            Already registered? <a className="muted-link" href="/food-partner/login">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FoodPartnerRegister
