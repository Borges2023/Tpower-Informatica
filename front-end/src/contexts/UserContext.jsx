import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export const useUserContext = () => useContext(UserContext);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const getUser = async () => {
    try {
      const { data } = await axios.get("/profile");
      setUser(data);
    } catch (error) {
      console.error("Não foi possível consultar a sessão do usuário.", error);
      setUser(null);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    if (!user) getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
