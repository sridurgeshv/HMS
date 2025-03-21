import React, { useState, useRef } from "react";
import axios from "axios";
import "./VoiceAppointment.css";

const VoiceAppointment = ({ patientId }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [message, setMessage] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const streamRef = useRef(null); // Holds the audio stream

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      }); // Request audio only
      streamRef.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" }); // WAV format
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        uploadAudio(audioBlob); // Upload audio after recording
      };

      mediaRecorder.current.start();
      setRecording(true);
      setMessage("🎙️ Recording... Speak now.");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMessage(
        "❗ Microphone access denied. Please check your browser settings."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      // Stop audio stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setRecording(false);
      setMessage("⏳ Processing audio...");
    }
  };

  const closeMic = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
    setMessage("🎤 Microphone closed.");
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "voice_appointment.wav");

    try {
      const response = await axios.post(
        `http://localhost:8000/book-appointment-voice/${patientId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(`✅ ${response.data.message}`);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setMessage("❌ Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="voice-appointment-container">
      <h2>📞 Book Appointment with Voice</h2>
      <p className="message">{message}</p>

      {audioURL && (
        <audio controls className="audio-player">
          <source src={audioURL} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}

      <div className="button-group">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`btn ${recording ? "stop-btn" : "start-btn"}`}
          disabled={!patientId}
        >
          {recording ? "🛑 Stop Recording" : "🎙️ Start Recording"}
        </button>

        {recording && (
          <button onClick={closeMic} className="btn close-btn">
            ❌ Close Mic
          </button>
        )}
      </div>

      {!patientId && (
        <p className="error">
          ⚠️ Patient ID is not available. Please make sure you are logged in.
        </p>
      )}
    </div>
  );
};

export default VoiceAppointment;
