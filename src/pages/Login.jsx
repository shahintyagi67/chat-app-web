import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import "../styles/Login.css";   
import API from "../services/api";
import toast from "react-hot-toast";


const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/customer/login", form);
      console.log("res-----",res);
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
         toast.success("Login successful");
      navigate("/chat");
    } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p onClick={() => navigate("/register")}>
          Don’t have an account? <span>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
