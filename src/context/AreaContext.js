// src/context/AreaContext.js
import React, { createContext, useState, useContext } from "react";

const AreaContext = createContext();

export const AreaProvider = ({ children }) => {
  const [area, setArea] = useState("");

  return (
    <AreaContext.Provider value={{ area, setArea }}>
      {children}
    </AreaContext.Provider>
  );
};

// Hook for easy usage
export const useArea = () => useContext(AreaContext);
