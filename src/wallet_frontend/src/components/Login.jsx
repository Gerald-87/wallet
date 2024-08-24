import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { wallet_backend } from '../../../declarations/wallet_backend';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with email:", email);
      
      const result = await wallet_backend.login(email, password);
      console.log("Login result:", result);

      if ("ok" in result) {
        console.log("Login successful");
        const [userId, fullName, role] = result.ok;

        localStorage.setItem("userId", userId);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("userRole", JSON.stringify(role));

        if ("Admin" in role) {
          navigate("/dashboard");
        } else if ("Customer" in role) {
          navigate("/customer");
        } else if ("Agent" in role) {
          navigate("/agent");
        } else {
          setError("Unauthorized role");
        }
      } else {
        console.log("Login failed:", result.err);
        setError(result.err);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="addUser">
      <h3>Sign in</h3>
      <h3>Smart Wallet</h3>
      <form className="addUserForm" onSubmit={handleLogin}>
        <div className="inputGroup">
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
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {error && <p className="error">{error}</p>}
          <div className="login">
            <p>Don't have an Account?</p>
            <Link to="/Register" type="button" className="btn btn-success">
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
