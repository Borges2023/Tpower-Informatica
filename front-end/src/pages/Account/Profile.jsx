import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import axios from "axios";

const Profile = ({ redirect, setRedirect }) => {
  const { user, setUser } = useUserContext();

  const handleLogout = async () => {
    await axios.post("/logout");
    setRedirect(true);
    setUser(null);
  };

  if (redirect) return <Navigate to="/" />;

  return (
    <div className="flex flex-col items-center gap-3">
      <p>
        Logado como {user?.name} ({user?.email})
      </p>

      <button
        className="bg-primary-400 w-full max-w-40 rounded-full text-white"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
