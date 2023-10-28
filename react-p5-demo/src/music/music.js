import React, { useEffect, useState } from 'react';
import { Piano } from "@tonejs/piano/build/piano/Piano";
import { ambience } from "./background";
import { playLead } from "./lead";
import * as Tone from 'tone';

const MyPianoComponent = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [keysPressed, setKeysPressed] = useState({});
  let piano;

  useEffect(() => {
    const handleKeyDown = async (event) => {
        console.log("Starttt");
      if (!isStarted) {
        setIsStarted(true);
        await init();
        ambience();
      }

      if (!keysPressed[event.key]) {
        console.log("start play lead");
        playLead(keysPressed, ["C4", "C5"]);
        console.log("finish play lead");
        setKeysPressed({ ...keysPressed, [event.key]: true });
      }
    };

    const handleKeyUp = (event) => {
      const updatedKeysPressed = { ...keysPressed };
      delete updatedKeysPressed[event.key];
      setKeysPressed(updatedKeysPressed);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isStarted, keysPressed]);

  async function init() {
    let data;
    fetch('https://api-ex4.vercel.app/get_notes/653c133d521cb91a3235f771')
      .then((response) => response.json())
      .then((datas) => {
        data = datas;
        console.log(data);
      });

    const soundPromise = Tone.start().then(() => {
      console.log("audio is ready");
    });

    const newPiano = new Piano({
      velocities: 5,
    });

    const pianoPromise = newPiano.load().then(() => {
      console.log("piano loaded!");
    });
    newPiano.toDestination();

    await Promise.all([soundPromise, pianoPromise]);

    piano = newPiano;
    console.log(piano);

    const tempoPattern = new Tone.Pattern({
      callback: function (time, value) {
        if (value) Tone.Transport.bpm.value = value;
      },
      values: [95, 100, 110, 120],
      pattern: "randomWalk",
      interval: "4m",
    }).start(0);

    Tone.Transport.start();
  }

  return (
    // Your JSX for the component if needed
    <div>
      {/* Component content here */}
    </div>
  );
};

export default MyPianoComponent;
