import "./css/Login.css";

function LoginPage() {
  return (
    <div className="loginContainer">
      <div className="login">
        <h2>Login Page</h2>
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <div className="buttonContainer">
            <button type="submit">Login</button>
            <button
              type="button"
              onClick={() => (window.location.href = "/register")}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
