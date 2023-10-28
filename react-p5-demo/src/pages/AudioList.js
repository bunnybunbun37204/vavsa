import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AudioList() {
  const [audioData, setAudioData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the /audio API endpoint
    axios
      .get('https://api-ex4.vercel.app/audio')
      .then((response) => {
        setAudioData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching audio data: ', error);
      });
  }, []);

  const handleAudioClick = (filename) => {
    // Navigate to the audio detail page using React Router
    navigate(`/audiodetail/${filename}`);
  };

  return (
    <div className="audio-list-container">
      <h1 className="audio-list-header">Spooky Songs</h1>
      <ul>
        {audioData.map((audio, index) => (
          <li
            key={index}
            onClick={() => handleAudioClick(audio.songname)}
            className="audio-item"
          >
            {audio.songname}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AudioList;
