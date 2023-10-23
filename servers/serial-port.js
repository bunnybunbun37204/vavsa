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

const parser = ports.pipe(new ReadlineParser({ delimiter: '\n' }));
parser.on('data',  (data) => {
    console.log(data)
    io.emit('serialdata', { data: data });
});