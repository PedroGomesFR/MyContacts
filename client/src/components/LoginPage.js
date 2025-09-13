import "./css/Login.css";
import { Link } from "react-router-dom";
import Input from "./Input";

function LoginPage() {
  return (
    <div className="loginContainer">
      <div className="login">
        <h2>Login Page</h2>
        <form>
          <Input type="email" placeholder="Email" label="Email" />
          <Input type="password" placeholder="Password" label="Password" />
          <div className="buttonContainer">
            <button type="submit">Login</button>
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
