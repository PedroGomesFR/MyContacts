import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProfilePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || Object.keys(user).length === 0) {
    return null;
  }

  const name = user.name;
  const fname = user.fname;
  const age = user.age;
  const email = user.email;
  console.log(name, fname, age, email);

  const deconnexion = () => {
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      <div className="profile-info">
        <p>
          <strong>Prenom:</strong> {name}
        </p>
        <p>
          <strong>Nom:</strong> {fname}
        </p>
        <p>
          <strong>Age:</strong> {age}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>

        <button onClick={deconnexion}>Deconnexion</button>
      </div>
    </div>
  );
}

export default ProfilePage;
