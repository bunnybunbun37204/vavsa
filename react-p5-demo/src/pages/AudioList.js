import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Routes, useNavigate } from 'react-router-dom';

function AudioList() {
  const [audioData, setAudioData] = useState([]);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    // Fetch data from the /audio API endpoint
    axios
      .get('http://localhost:4000/audio')
      .then((response) => {
        setAudioData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching audio data: ', error);
      });
  }, []);

  const handleAudioClick = (filename) => {
    // Navigate to the audio detail page using React Router
    navigate(`/audio/${filename}`); // Use navigate
  };

  return (
    <div>
      <h1>Audio Files</h1>
      <ul>
        {audioData.map((audio, index) => (
          <li key={index}>
            <a onClick={() => handleAudioClick(audio._id)} style={{ cursor: 'pointer' }}>
              {audio.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AudioList;
