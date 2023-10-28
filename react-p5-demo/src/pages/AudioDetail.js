import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FrequencyChart from '../components/charts';

const AudioDetail = ({ songId }) => {
  const navigate = useNavigate();
  const [audioData, setAudioData] = useState({});
  const note = {
    "C4": 261.63,
    "D4": 293.66,
    "E4": 329.63,
    "F4": 349.23,
    "G4": 392,
    "A4": 440,
    "B4": 493.88,
    "C5": 523.25
  };

  useEffect(() => {
    axios
      .get(`https://api-ex4.vercel.app/getNotesByName/${songId}`)
      .then((response) => {
        setAudioData(response.data);
        console.log(audioData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleClick = (songId) => {
    navigate(`/audio/${songId}`);
  };

  const removeDuplicates = (arr) => {
    return [...new Set(arr)];
  }

  const arrayToAmplitude = (arr) => {
    let a = [];
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (note[arr[i].trim()]) {
          a.push(note[arr[i].trim()]);
        }
      }
    }
    return a;
  };
  

  const arrayToText = (arr) => {
    if (arr && arr.length > 0) {
      const uniqueNotes = removeDuplicates(arr);
      return uniqueNotes.join(", ");
    }
    return '';
  }

  return (
    <div className="halloween-container" style={{ fontFamily: 'Creepster, sans-serif' }}>
      <div className="halloween-header">
        <h3>{audioData.songname}</h3>
        <hr />
      </div>
      <div className="receipt-details">
        <div className="receipt-info">
          <p><b>Date:</b> October 30, 2023</p>
          <p><b>Receipt ID :</b> {audioData.id}</p>
        </div>
        <div className="customer-info">
          <p><b>Notes:</b> {arrayToText(audioData.data)}</p>
        </div>
      </div>
      <div className="total">
        <hr />
        <FrequencyChart frequencies={arrayToAmplitude(audioData.data)} />
      </div>
      <hr />
      <button style={{ fontFamily: 'Nosifer' }} onClick={() => handleClick(songId)} className="halloween-button">
        Let's play the song!
      </button>
    </div>
  );
};

export default AudioDetail;
