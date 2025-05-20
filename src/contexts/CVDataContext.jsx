import React, { createContext, useContext, useState } from 'react';

const CVDataContext = createContext();

export const useCVData = () => useContext(CVDataContext);

export const CVDataProvider = ({ children }) => {
  const [cvData, setCVData] = useState({
    cv: null,
    isLoading: false,
    error: null
  });
  const [user, setUser] = useState(null);

  return (
    <CVDataContext.Provider value={{ cvData, setCVData, user, setUser }}>
      {children}
    </CVDataContext.Provider>
  );
};