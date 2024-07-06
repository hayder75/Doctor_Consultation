// UserTypeContext.js
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserType = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [isDoctor, setIsDoctor] = useState(false); // Set this based on user data

  return (
    <UserContext.Provider value={{ isDoctor, setIsDoctor }}>
      {children}
    </UserContext.Provider>
  );
};
