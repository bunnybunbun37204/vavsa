import * as Tone from 'tone';

// Function to play notes sequentially
export default function playNotes(noteArray) {
  if (noteArray.length > 0) {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(noteArray[0], "0.5");
    
    setTimeout(() => {
      playNotes(noteArray.slice(1));
    }, 500); 
  }
}