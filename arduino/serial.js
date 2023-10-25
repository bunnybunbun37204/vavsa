const {SerialPort, ReadlineParser} = require('serialport');

const port = new SerialPort({path: '/dev/ttyUSB0', baudRate: 9600 }); // Replace 'COM3' with the appropriate port name (e.g., '/dev/ttyUSB0' on Linux).


const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// play piano
const player = require('play-sound')();

// Define the key mappings and corresponding sound files (adjust paths as needed)
const keyMappings = {
  'C4': 'servers/sounds/piano-88-notes/4-c.wav',
  'D4': 'servers/sounds/piano-88-notes/4-d.wav',
  'E4': 'servers/sounds/piano-88-notes/4-e.wav',
  'F4': 'servers/sounds/piano-88-notes/4-f.wav',
  'G4': 'servers/sounds/piano-88-notes/4-g.wav',
  'A4': 'servers/sounds/piano-88-notes/4-a.wav',
  'B4': 'servers/sounds/piano-88-notes/4-b.wav',
  'C5': 'servers/sounds/piano-88-notes/5-c.wav',
  'D5': 'servers/sounds/piano-88-notes/5-d.wav',

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





