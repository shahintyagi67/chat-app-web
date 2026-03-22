import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import toast from "react-hot-toast";


const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/customer/signup", form);
          toast.success(res.data.message || "Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed ❌");
    }
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

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

        <button type="submit">Register</button>

        <p onClick={() => navigate("/login")}>
          Already have an account? <span>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
