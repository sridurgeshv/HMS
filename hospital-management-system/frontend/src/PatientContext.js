import React, { createContext, useState, useEffect } from "react";

export const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    // Retrieve patient ID from localStorage when component mounts
    const storedPatientId = localStorage.getItem("patient_id");
    if (storedPatientId) {
      setPatientId(storedPatientId);
    }
  }, []);

  return (
    <PatientContext.Provider value={{ patientId, setPatientId }}>
      {children}
    </PatientContext.Provider>
  );
};