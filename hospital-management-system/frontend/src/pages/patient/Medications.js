import React, { useState, useEffect, useContext } from "react";
import { PatientContext } from "../../PatientContext";
import { Pill } from "lucide-react";

const Medications = () => {
  const { patientId } = useContext(PatientContext); // Get patient ID
  const [medications, setMedications] = useState([]);
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");

  // Fetch medications when component loads
  const fetchMedications = async () => {
    if (!patientId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/medications/${patientId}`);
      const data = await res.json();
  
      setMedications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching medications:", error);
      setMedications([]);
    }
  };

  // Fetch medications when component mounts or patientId changes
  useEffect(() => {
    fetchMedications();
  }, [patientId]);

  // Function to add a new medication
  const addMedication = async () => {
    if (medName && dosage && frequency) {
      const newMed = { name: medName, dosage, frequency };

      try {
        const res = await fetch(`http://localhost:8000/medications/${patientId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMed),
        });

        if (res.ok) {
          const savedMed = await res.json();
          setMedications([...medications, savedMed]); // Update state with saved medication
          setMedName("");
          setDosage("");
          setFrequency("");
        }
      } catch (error) {
        console.error("Error saving medication:", error);
      }
    }
  };

  // Function to fetch AI advice
  const fetchAIResponse = async () => {
    if (!patientId) return;

    const medList = medications
      .map((med) => `${med.name} (${med.dosage}, ${med.frequency})`)
      .join(", ");
    const fullPrompt = `I am taking these medications: ${medList}. ${prompt}`;

    try {
      const res = await fetch("http://127.0.0.1:8000/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, patient_id: patientId }),
      });

      const data = await res.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Pill size={20} /> Current Medications
      </h2>

      {/* Medication Input Form */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Add Medication</h3>
        <input type="text" value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="Medication Name" className="w-full p-2 border rounded" />
        <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage (e.g., 10mg)" className="w-full p-2 border rounded" />
        <input type="text" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="Frequency (e.g., Once daily)" className="w-full p-2 border rounded" />
        <button onClick={addMedication} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Medication</button>
      </div>

      {/* Medications List */}
      <div className="space-y-3">
        {medications.length > 0 ? medications.map(med => (
          <div key={med.id} className="flex items-center gap-4 p-4 border rounded">
            <Pill size={24} className="text-blue-500" />
            <div>
              <h3 className="font-semibold">{med.name}</h3>
              <p className="text-gray-600">{med.dosage} - {med.frequency}</p>
            </div>
          </div>
        )) : <p className="text-gray-500">No medications added yet.</p>}
      </div>

      {/* AI Chat Feature */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Ask AI for Advice</h3>
        <input 
          type="text" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          placeholder="Ask about interactions, side effects..." 
          className="w-full p-2 border rounded"
        />
        <button onClick={fetchAIResponse} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Ask AI</button>
        {aiResponse && <p className="p-3 bg-gray-100 rounded"><strong>AI Response:</strong> {aiResponse}</p>}
      </div>

      {/* Doctor Response Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Doctor’s Response</h3>
        <textarea
          value={doctorResponse}
          onChange={(e) => setDoctorResponse(e.target.value)}
          placeholder="Doctor will respond here..."
          className="w-full p-2 border rounded h-24"
          readOnly
        ></textarea>
      </div>
    </div>
  );

};

export default Medications;