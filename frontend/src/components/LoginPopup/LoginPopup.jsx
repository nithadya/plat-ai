import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, url, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    let new_url = url;
    if (currState === "Login") {
      new_url += "/api/user/login";
    } else {
      new_url += "/api/user/register";
    }
    const response = await axios.post(new_url, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      loadCartData({ token: response.data.token });
      setShowLogin(false);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-overlay-backdrop" onClick={() => setShowLogin(false)}></div>
      <form onSubmit={onLogin} className="login-form-card">
        <div className="login-form-header">
          <h2 className="login-form-title">{currState}</h2>
          <button type="button" className="login-close-btn" onClick={() => setShowLogin(false)}>
            <img src={assets.cross_icon} alt="Close" className="login-close-icon" />
          </button>
        </div>
        <div className="login-form-inputs">
          {currState === "Sign Up" && (
            <div className="login-input-group">
              <input
                name="name"
                onChange={onChangeHandler}  // Fixed attribute name
                value={data.name}
                type="text"
                placeholder="Your name"
                required
                className="login-input"
              />
            </div>
          )}
          <div className="login-input-group">
            <input
              name="email"
              onChange={onChangeHandler}  // Already correct
              value={data.email}
              type="email"
              placeholder="Your email"
              required
              className="login-input"
            />
          </div>
          <div className="login-input-group">
            <input
              name="password"
              onChange={onChangeHandler}  // Changed from onChangeHandler to onChange
              value={data.password}
              type="password"
              placeholder="Password"
              required
              className="login-input"
            />
          </div>
        </div>
        <button type="submit" className="login-submit-btn">
          {currState === "Login" ? "Login" : "Create account"}
        </button>
        <div className="login-terms">
          <input type="checkbox" required className="login-checkbox" />
          <label className="login-terms-label">By continuing, I agree to the terms of use & privacy policy.</label>
        </div>
        <div className="login-switch-state text-center">
          {currState === "Login" ? (
            <p>
              Create a new account?{" "}
              <button 
                type="button" 
                style={{ backgroundColor: "white", width: "auto" }} 
                className="login-switch-btn" 
                onClick={() => setCurrState("Sign Up")}
              >
                Click here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button 
                type="button" 
                style={{ backgroundColor: "white", width: "auto" }} 
                className="login-switch-btn" 
                onClick={() => setCurrState("Login")}
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;