import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/ProfilePage.css";

function ProfilePage({ user }) {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [mycontacts, setMyContacts] = useState([]);

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/record/allUsers");
        const data = await response.json();
        if (response.ok) {
          setAllUsers(data);
          console.log(`Fetched ${data.length} users from server`);
        } else {
          console.log("Failed to fetch users");
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMyContacts = async () => {
      try {
        const response = await fetch("/record/myContacts");
        const data = await response.json();
        if (response.ok) {
          setMyContacts(data);
        } else {
          console.log("Failed to fetch my contacts");
        }
      } catch (error) {
        console.log("Error fetching my contacts:", error);
      }
    };
    fetchMyContacts();
  }, []);

  const handleAddContact = async (contactId) => {
    if (!user || Object.keys(user).length === 0) {
      return null;
    }
    try {
      const response = await fetch("/record/addContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, contactId }),
      });

      if (response.ok) {
        // After successful contact add, fetch updated contacts list
        const contactsResponse = await fetch("/record/myContacts");
        const contactsData = await contactsResponse.json();
        if (contactsResponse.ok) {
          setMyContacts(contactsData);
        }
      } else {
        console.log("Failed to add contact");
      }
    } catch (error) {
      console.log("Error adding contact:", error);
    }
  };

  const { name, fname, age, email } = user;

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
      <div className="usersSection">
        <div className="all-users" id="allUsers">
          {allUsers.map((element) => (
            <div className="userList" key={element._id}>
              <p>
                {element.name} : {element.fname}
              </p>

              <p className="idUser" style={{ display: "none" }}>
                ID: {element._id}
              </p>
              <button onClick={() => handleAddContact(element._id)}>
                Add Contact
              </button>
            </div>
          ))}
        </div>

        <div className="all-users" id="allUsers">
          {mycontacts.map((element) => (
            <div key={element._id}>
              <p>{element.name}</p>
              <p className="idUser" style={{ display: "none" }}>
                ID: {element._id}
              </p>
              <button>Remove Contact</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
