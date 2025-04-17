import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();

const url = "http://localhost:3000/api";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(url + "/isAuth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?._id) setUser(data);
      })
      .catch((err) => console.error("Auth check failed", err));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Optional helper to use context easily
export const useUser = () => useContext(UserContext);
