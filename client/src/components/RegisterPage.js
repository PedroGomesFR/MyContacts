import "./css/Register.css";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import { useState } from "react";

function RegisterPage({ user, setUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fname: "",
    age: "",
    email: "",
    password: "",
  });

  const handleRegiste = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/record/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert("not good");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/profile");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form method="POST">
        <Input
          type="text"
          name="name"
          placeholder="Prenom"
          label="Prenom"
          value={formData.name}
          require={true}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="fname"
          placeholder="Nom"
          label="Nom"
          value={formData.fname}
          require={true}
          onChange={handleChange}
        />
        <Input
          type="number"
          name="age"
          placeholder="Age"
          label="Age"
          value={formData.age}
          require={true}
          onChange={handleChange}
        />
        <Input
          type="email"
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
          placeholder="Password"
          label="Password"
          value={formData.password}
          require={true}
          onChange={handleChange}
        />
        <button onClick={handleRegiste}>
          {loading ? "loading" : "Resgister"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
