import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(
    () => {
      try {
        return JSON.parse(localStorage.getItem("user"))
      } catch {
        return null
      }
    }

  )
  
  return (
    <Router>
      <div className="container">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/login" user={user} setUser={setUser} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage user={user} setUser={setUser} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
