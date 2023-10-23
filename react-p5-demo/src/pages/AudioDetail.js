import React from 'react';
import { useParams } from 'react-router-dom';
import BallSketch from '../components/Balls';
import RingSketch from '../components/Rings';

function AudioDetail({songId}) {

  // Use the filename as needed in your component

  return (
    <div>
      {/* <P5Sketch>{filename}</P5Sketch> */}
      <RingSketch songId = {songId}/>
      {/* Render details for the audio file with the given filename */}
    </div>
  );
}

export default AudioDetail;
