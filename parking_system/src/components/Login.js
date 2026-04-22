import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validation from "./LoginValidation";
import axios from "axios";
import "../styles/signup.css";

const Login = ({ isAuthenticated, setIsAuthenticated }) => {
  const [values, setValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: [event.target.value] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);
    if (!Object.values(validationErrors).some((error) => error)) {
      setLoading(true);
      axios
        .post("/login", values)
        .then((res) => {
          setLoading(false);
          if (res.data === "Success") {
            setIsAuthenticated(true);
            navigate("/Home");
          } else if (res.data === "Admin") {
            setIsAuthenticated(true);
            navigate("/Admin");
          } else {
            alert("No record found. Please check your credentials.");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-backdrop">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">🅿</div>
            <h1 className="brand-name">DarkEase</h1>
            <p className="brand-tagline">Smart Parking, Simplified</p>
          </div>

          <h2 className="auth-heading">Welcome Back</h2>
          <p className="auth-subheading">Sign in to manage your reservations</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  name="email"
                  autoComplete="current-email"
                  onChange={handleInput}
                  className="auth-input"
                />
              </div>
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  autoComplete="current-password"
                  onChange={handleInput}
                  className="auth-input"
                />
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">Signing in…</span>
              ) : (
                <span>Sign In →</span>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;