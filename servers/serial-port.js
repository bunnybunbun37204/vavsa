const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    port = 8888;
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
  }));

//Server start
server.listen(port, () => console.log('on port' + port))

//user server
app.use(express.static(__dirname + '/public'));


io.on('connection', onConnection);

var connectedSocket = null;
function onConnection(socket){
    connectedSocket = socket;
}

const {SerialPort, ReadlineParser} = require('serialport');

const ports = new SerialPort({path: '/dev/ttyUSB0', baudRate: 9600 }); // Replace 'COM3' with the appropriate port name (e.g., '/dev/ttyUSB0' on Linux).
const player = require('play-sound')();

// Define the key mappings and corresponding sound files (adjust paths as needed)
const keyMappings = {
  'C4': 'sounds/piano-88-notes/4-c.wav',
  'D4': 'sounds/piano-88-notes/4-d.wav',
  'E4': 'sounds/piano-88-notes/4-e.wav',
  'F4': 'sounds/piano-88-notes/4-f.wav',
  'G4': 'sounds/piano-88-notes/4-g.wav',
  'A4': 'sounds/piano-88-notes/4-a.wav',
  'B4': 'sounds/piano-88-notes/4-b.wav',
  'C5': 'sounds/piano-88-notes/5-c.wav',
  'D5': 'sounds/piano-88-notes/5-d.wav',

};

const parser = ports.pipe(new ReadlineParser({ delimiter: '\n' }));
parser.on('data',  (data) => {
    console.log(data)
    player.play(keyMappings[data.toString().trim()], (err) => {
      if (err) {
        console.error('Error playing sound:', err);
      }
    })
    io.emit('serialdata', { data: data });

});