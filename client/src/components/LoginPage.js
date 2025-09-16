import "./css/Login.css";
import { Link } from "react-router-dom";
import Input from "./Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ user, setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if ((!formData.email, !formData.password)) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("/record/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert("email ou mot de passe incorrect");
      } else {
        // alert("Login successful!" + data);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        // Redirect to profile page
        navigate("/profile");
      }
    } catch (error) {
      alert("error durant le login");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="loginContainer">
      <div className="login">
        <h2>Login Page</h2>
        <form>
          <div>
            <Input
              type="text"
              name="email"
              placeholder="Email"
              label="Email"
              value={formData.email}
              require={true}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Mot de passe"
              label="Mot de passe"
              value={formData.password}
              require={true}
              onChange={handleChange}
            />
          </div>
          <div className="buttonContainer">
            <button type="submit" onClick={handleLogin}>
              Login
            </button>
            <Link to="/register" className="registerLink">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
