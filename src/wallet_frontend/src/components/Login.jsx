import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { wallet_backend } from 'declarations/wallet_backend';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      console.log("Attempting login with email:", email);
      
      // Call the backend login function
      const result = await wallet_backend.login(email, password);
      console.log("Login result:", result);

      if ("ok" in result) {
        console.log("Login successful");
        const { role } = result.ok;

        // Store the user role in localStorage or state management as needed
        localStorage.setItem("userRole", role);

        // Navigate based on role
        switch (role) {
          case "Admin":
            navigate("/dashboard");
            break;
          case "Customer":
            navigate("/customer");
            break;
          case "Agent":
            navigate("/agent");
            break;
          default:
            navigate("/"); // Redirect to a default page if role is unknown
            break;
        }
      } else {
        console.log("Login failed:", result.err);
        alert(result.err); // Display error message from backend
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again."); // Handle unexpected errors
    } finally {
      setIsLoading(false); // Reset loading state after processing
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
