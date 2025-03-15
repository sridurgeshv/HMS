import React, { createContext, useState, useEffect } from "react";

export const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  const [patientId, setPatientId] = useState(() => {
    return localStorage.getItem("patient_id") || null;
  });

  useEffect(() => {
    const storedPatientId = localStorage.getItem("patient_id");
    if (storedPatientId && storedPatientId !== patientId) {
      setPatientId(storedPatientId);
    }
  }, [patientId]);

  return (
    <PatientContext.Provider value={{ patientId, setPatientId }}>
      {children}
    </PatientContext.Provider>
  );
};