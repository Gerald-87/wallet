// Register.jsx
import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { wallet_backend } from 'declarations/wallet_backend'; // Ensure this import is correct

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', fullName, email, password); // Debugging line
    try {
      const result = await wallet_backend.registerUser(fullName, email, password, { Customer: null });
      console.log(result); // Log the result to check what is being returned
      if (result.tag === "ok") {
        alert(result.value); // Show success message
        navigate("/");
      } else if (result.tag === "err") {
        setError(result.value);
      }
    } catch (error) {
      console.error("Registration error:", error); // Log error details
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="addUser">
      <h3>Sign Up</h3>
      <h3>Smart Wallet</h3>
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            autoComplete="off"
            placeholder="Enter your Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="login">
        <p>Already have an account? </p>
        <Link to="/" className="btn btn-success">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
