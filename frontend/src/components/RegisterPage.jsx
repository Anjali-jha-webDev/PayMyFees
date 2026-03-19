import React, { useState, useEffect } from "react";
import "./Loginstyle.css";
import "boxicons/css/boxicons.min.css";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterPage() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  // ── SHOW/HIDE STATE ──────────────────────────────────────────────────────
  const [showLoginPassword, setShowLoginPassword]       = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // ── FORM STATE ───────────────────────────────────────────────────────────
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "", email: "", password: "", courseId: "",
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/auth/courses")
      .then((res) => setCourses(res.data))
      .catch(() => {});
  }, []);

  const handleLoginChange    = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  // ── VALIDATION ───────────────────────────────────────────────────────────
  const validateRegister = () => {
    const { username, email, password, courseId } = registerData;
    if (!username.trim())                            { toast.error("Username is required"); return false; }
    if (username.trim().length < 3)                  { toast.error("Username must be at least 3 characters"); return false; }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim()))   { toast.error("Username can only contain letters, numbers and underscores"); return false; }
    if (!email.trim())                               { toast.error("Email is required"); return false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast.error("Please enter a valid email address"); return false; }
    if (!password)                                   { toast.error("Password is required"); return false; }
    if (password.length < 6)                         { toast.error("Password must be at least 6 characters"); return false; }
    if (!courseId)                                   { toast.error("Please select your course"); return false; }
    return true;
  };

  // ── LOGIN SUBMIT ─────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim()) { toast.error("Username is required"); return; }
    if (!loginData.password)        { toast.error("Password is required"); return; }
    try {
      const res = await API.post("/auth/login", loginData);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Login Successful!");
      setLoginData({ username: "", password: "" });
      if (res.data.role === "ADMIN") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed. Please check your credentials.";
      toast.error(msg);
    }
  };

  // ── REGISTER SUBMIT ──────────────────────────────────────────────────────
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    try {
      await API.post("/auth/register", {
        ...registerData,
        username: registerData.username.trim(),
        email:    registerData.email.trim(),
        courseId: parseInt(registerData.courseId),
      });
      toast.success("Registered Successfully! Please log in.");
      setRegisterData({ username: "", email: "", password: "", courseId: "" });
      setIsActive(false);
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  // ── TOGGLE ICON HELPER ───────────────────────────────────────────────────
  const EyeIcon = ({ show, onToggle }) => (
    <i
      className={`bx ${show ? "bx-show" : "bx-hide"}`}
      onClick={onToggle}
      style={{ cursor: "pointer", position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", fontSize:"20px", color:"#888", userSelect:"none" }}
    />
  );

  return (
    <div className={`container ${isActive ? "active" : ""}`}>

      {/* ── LOGIN ── */}
      <div className="form-box login">
        <form onSubmit={handleLoginSubmit}>
          <h1>login</h1>

          <div className="input-box">
            <input
              type="text" name="username" placeholder="Username"
              value={loginData.username} onChange={handleLoginChange}
            />
            <i className="bx bx-user"></i>
          </div>

          <div className="input-box" style={{ position:"relative" }}>
            <input
              type={showLoginPassword ? "text" : "password"}
              name="password" placeholder="Password"
              value={loginData.password} onChange={handleLoginChange}
              style={{ paddingRight:"50px" }}
            />
            <EyeIcon show={showLoginPassword} onToggle={() => setShowLoginPassword(p => !p)} />
          </div>

          <div className="forgot-link"><a href="#">Forgot password?</a></div>
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

      {/* ── REGISTER ── */}
      <div className="form-box register">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Registration</h1>

          <div className="input-box">
            <input
              type="text" name="username" placeholder="Username (min 3 chars)"
              value={registerData.username} onChange={handleRegisterChange}
            />
            <i className="bx bx-user"></i>
          </div>

          <div className="input-box">
            <input
              type="email" name="email" placeholder="Email"
              value={registerData.email} onChange={handleRegisterChange}
            />
            <i className="bx bx-envelope"></i>
          </div>

          <div className="input-box" style={{ position:"relative" }}>
            <input
              type={showRegisterPassword ? "text" : "password"}
              name="password" placeholder="Password (min 6 chars)"
              value={registerData.password} onChange={handleRegisterChange}
              style={{ paddingRight:"50px" }}
            />
            <EyeIcon show={showRegisterPassword} onToggle={() => setShowRegisterPassword(p => !p)} />
          </div>

          <div className="input-box">
            <select
              name="courseId" value={registerData.courseId}
              onChange={handleRegisterChange}
              style={{ width:"100%", padding:"13px 20px", background:"#eee", borderRadius:"8px", border:"none", outline:"none", fontSize:"16px", color: registerData.courseId ? "#333" : "#888", cursor:"pointer", appearance:"none" }}
            >
              <option value="">Select Your Course</option>
              {courses.length === 0
                ? <option disabled>No courses available yet</option>
                : courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.duration ? ` (${c.duration})` : ""}
                    </option>
                  ))
              }
            </select>
            <i className="bx bx-book-alt"></i>
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

      {/* ── TOGGLE PANELS ── */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left" onClick={() => setIsActive(true)}>
          <h1>hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" type="button">Register</button>
        </div>
        <div className="toggle-panel toggle-right" onClick={() => setIsActive(false)}>
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" type="button">Login</button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
