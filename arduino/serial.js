const {SerialPort, ReadlineParser} = require('serialport');

const port = new SerialPort({path: '/dev/ttyUSB0', baudRate: 9600 }); // Replace 'COM3' with the appropriate port name (e.g., '/dev/ttyUSB0' on Linux).


const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// play piano
const player = require('play-sound')();

// Define the key mappings and corresponding sound files (adjust paths as needed)
const keyMappings = {
  'C4': 'sound/piano-c_C_major.wav',
  'D4': 'sound/piano-d_D_major.wav',
  'E4': 'sound/piano-e_E_major.wav',
  'F4': 'sound/piano-f_F_major.wav',
  'G4': 'sound/piano-c_C_major.wav',
  'A4': 'sound/piano-d_D_major.wav',
  'B4': 'sound/piano-e_E_major.wav',
  'C5': 'sound/piano-f_F_major.wav',
};

port.on('open', (err) => {
  if (err) {
    console.error('Error opening port:', err);
  } else {
    console.log('Serial port is open.');
  }
});

parser.on('data', (data) => {
  console.log(data); // This will print the data received from the Arduino.
  player.play(keyMappings[data.toString().trim()], (err) => {
     console.log(keyMappings[data.toString()])
    if (err) {
      console.error('Error playing sound:', err);
    }
  });
});





console.log('Virtual Piano is ready! Press keys from A to K to play notes.');





