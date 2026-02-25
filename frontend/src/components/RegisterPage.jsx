import React, { useState } from "react";
import "./Loginstyle.css";
import "boxicons/css/boxicons.min.css";
import API from "../services/api";       // <-- API import
import { useNavigate } from "react-router-dom";

function RegisterPage() {

  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  // LOGIN STATE
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // REGISTER STATE
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // HANDLE LOGIN INPUT
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE REGISTER INPUT
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  // LOGIN SUBMIT
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", loginData);

      localStorage.setItem("user", JSON.stringify(res.data));
      
      // role based navigation
      if (res.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/student");
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  // REGISTER SUBMIT
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", registerData);
      alert("Registered Successfully");
      setIsActive(false); // back to login
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`}>

      {/* LOGIN */}
      <div className="form-box login">
        <form onSubmit={handleLoginSubmit}>
          <h1>login</h1>

          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleLoginChange}
            />
            <i className="bx bx-user"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleLoginChange}
            />
            <i className="bx bx-lock-alt"></i>
          </div>

          <div className="forgot-link">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="btn">Login</button>

          <p>or login with other platforms</p>

          <div className="social-icons">
            <a href="#" className="social-icon"><i className="bx bxl-google"></i></a>
            <a href="#" className="social-icon"><i className="bx bxl-facebook"></i></a>
            <a href="#" className="social-icon"><i className="bx bxl-github"></i></a>
            <a href="#" className="social-icon"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

      {/* REGISTER */}
      <div className="form-box register">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Registration</h1>

          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleRegisterChange}
            />
            <i className="bx bx-user"></i>
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleRegisterChange}
            />
            <i className="bx bx-envelope"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleRegisterChange}
            />
            <i className="bx bx-lock-alt"></i>
          </div>

          <button type="submit" className="btn">Register</button>

          <p>or register with other platforms</p>

          <div className="social-icons">
            <a href="#" className="social-icon"><i className="bx bxl-google"></i></a>
            <a href="#" className="social-icon"><i className="bx bxl-facebook"></i></a>
            <a href="#" className="social-icon"><i className="bx bxl-github"></i></a>
            <a href="#" className="social-icon"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

      {/* TOGGLE */}
      <div className="toggle-box">

        <div
          className="toggle-panel toggle-left"
          onClick={() => setIsActive(true)}
        >
          <h1>hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" type="button">
            Register
          </button>
        </div>

        <div
          className="toggle-panel toggle-right"
          onClick={() => setIsActive(false)}
        >
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" type="button">
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;