import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Input from "./Input";
import "./css/ProfilePage.css";

function ProfilePage({ user }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [addContacts, setAddContacts] = useState({
    name: "",
    fname: "",
    numero: "",
  });
  const [mycontacts, setMyContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editContact, setEditContact] = useState({
    name: "",
    fname: "",
    numero: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddContacts((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //redirige vers login si pas de user
  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      navigate("/login");
    }
  }, [user, navigate]);

  //fetch tous les contact enregistrer
  useEffect(() => {
    const fetchMyContacts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/record/myContacts/${user._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

    // Ne déclenchez fetchMyContacts que si user._id existe
    if (user && user._id) {
      fetchMyContacts();
    }
  }, [user, user._id, token]);

  //ajout contact
  const handleAddContact = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!user || Object.keys(user).length === 0) {
      return null;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/record/addContact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            name: addContacts.name,
            fname: addContacts.fname,
            numero: addContacts.numero,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        console.log("Contact added successfully:", data);
        setMyContacts((prevContacts) => [...prevContacts, data.contact]);
        // Clear the form after successful addition
        setAddContacts({
          name: "",
          fname: "",
          numero: "",
        });
      } else {
        console.log(
          "Failed to add contact:",
          JSON.stringify(data) || "Unknown error"
        );
      }
    } catch (error) {
      console.log("Error adding contact:", error);
    }
  };

  const handleRemoveContact = async (contactId) => {
    if (!user || Object.keys(user).length === 0) {
      return null;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/record/removeContact`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            contactId: contactId,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Contact removed successfully:", data);
        setMyContacts((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== contactId)
        );
      } else {
        console.log(
          "Failed to remove contact:",
          JSON.stringify(data) || "Unknown error"
        );
      }
    } catch (error) {
      console.log("Error removing contact:", error);
    }
  };

  const handleSaveContact = async (contactId) => {
    if (!user || Object.keys(user).length === 0) {
      return null;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/record/editContact`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            contactId: contactId,
            updatedContact: editContact,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Contact updated successfully:", data);
        setMyContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === contactId ? { ...contact, ...editContact } : contact
          )
        );
        // Exit edit mode
        setEditingContactId(null);
      } else {
        console.log(
          "Failed to update contact:",
          JSON.stringify(data) || "Unknown error"
        );
      }
    } catch (error) {
      console.log("Error updating contact:", error);
    }
  };

  const { name, fname, numero, email } = user;

  //deconnexion
  const deconnexion = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
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
          <strong>Numero:</strong> {numero}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>

        <button onClick={deconnexion}>Deconnexion</button>
      </div>
      <div className="usersSection">
        <div className="ajoutContact">
          <h3>Ajouter un contact</h3>
          <Input
            type="text"
            name="name"
            placeholder="Prenom"
            label="Prenom"
            value={addContacts.name}
            require={true}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="fname"
            placeholder="Nom"
            label="Nom"
            value={addContacts.fname}
            require={true}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="numero"
            placeholder="Numero"
            label="Numero"
            value={addContacts.numero}
            require={true}
            onChange={handleChange}
          />
          <div className="buttonContainer">
            <button type="submit" onClick={handleAddContact}>
              Ajouter Contact
            </button>
          </div>
        </div>
        <div className="ajoutContact" id="allUsers">
          <h3>Liste des contacts ({mycontacts.length})</h3>
          {mycontacts.map((element) => (
            <div key={element._id || element.numero} className="contact-item">
              {editingContactId === element._id ? (
                // Edit mode
                <div className="edit-form">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Prenom"
                    label="Prenom"
                    value={editContact.name}
                    require={true}
                    onChange={handleEditChange}
                  />
                  <Input
                    type="text"
                    name="fname"
                    placeholder="Nom"
                    label="Nom"
                    value={editContact.fname}
                    require={true}
                    onChange={handleEditChange}
                  />
                  <Input
                    type="text"
                    name="numero"
                    placeholder="Numero"
                    label="Numero"
                    value={editContact.numero}
                    require={true}
                    onChange={handleEditChange}
                  />
                  <div className="button-group">
                    <button onClick={() => handleSaveContact(element._id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingContactId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <>
                  <p>
                    {element.name} {element.fname} : {element.numero}
                  </p>
                  <div className="button-group">
                    <button onClick={() => handleRemoveContact(element._id)}>
                      Remove Contact
                    </button>
                    <button
                      onClick={() => {
                        setEditingContactId(element._id);
                        setEditContact({
                          name: element.name || "",
                          fname: element.fname || "",
                          numero: element.numero || "",
                        });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
