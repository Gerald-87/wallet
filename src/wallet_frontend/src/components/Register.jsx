import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { wallet_backend } from "../../../declarations/wallet_backend";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    console.log('Form submitted with:', { fullName, email, password });

    try {
      console.log('Calling wallet_backend.registerUser...');
      const result = await wallet_backend.registerUser(fullName, email, password, { Customer: null });
      console.log('Result from registerUser:', result);

      if ("ok" in result) {
        alert(result.ok);
        navigate("/");
      } else if ("err" in result) {
        setError(result.err);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(`An error occurred during registration: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
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
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
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