import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupValidation } from "./LoginValidation";
import axios from "axios";
import "../styles/signup.css";

const Signup = () => {
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: [event.target.value] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(signupValidation(values));
    if (errors.username === "" && errors.email === "" && errors.password === "") {
      setLoading(true);
      axios
        .post("/signup", values)
        .then((res) => {
          setLoading(false);
          navigate("/");
          console.log(res);
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
            <h1 className="brand-name">ParkEase</h1>
            <p className="brand-tagline">Smart Parking, Simplified</p>
          </div>

          <h2 className="auth-heading">Create Account</h2>
          <p className="auth-subheading">Join us and start reserving spots</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Your full name"
                  name="username"
                  autoComplete="current-username"
                  onChange={handleInput}
                  className="auth-input"
                />
              </div>
              {errors.username && <span className="auth-error">{errors.username}</span>}
            </div>

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
                  placeholder="Create a strong password"
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
                <span className="btn-loading">Creating account…</span>
              ) : (
                <span>Create Account →</span>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;