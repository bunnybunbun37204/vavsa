import React from "react";
import io from 'socket.io-client';
import QRCode from 'qrcode.react';

class InputMelody extends React.Component {
  constructor(props) {
    super(props);
    this.datas = [];
    this.socket = null;
    this.state = {
      data: null,
      message: "Start recording",
      showPopup: false,
      qrCodeData: "https://github.com/antonioerdeljac/next13-spotify",
      songName: "", // Add a state variable to store the song name
      songExists: false, // State variable to track if the song exists
    };
    this.fetchInterval = null;
  }

  componentDidMount() {
    this.socket = io('http://localhost:8888');
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleInputChange = (event) => {
    this.setState({
      songName: event.target.value,
    });
  }

  checkSongExistence = () => {
    const { songName } = this.state;
  
    fetch(`http://localhost:4000/audio`)
      .then((response) => response.json())
      .then((data) => {
        const songExists = data.some((audio) => audio.filename === songName);
  
        if (songExists) {
          this.setState({
            songExists: true,
            message: "Song name already exists",
          });
          
          // Show an alert message
          window.alert("Song name already exists");
        } else {
          this.startDataFetching();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error checking song name existence.");
      });
  }

  startDataFetching = () => {
    this.setState({
      message: "Recording",
    });
    this.datas = [];
    this.socket = io('http://localhost:8888');
    this.fetchInterval = setInterval(() => {
      // Start fetching data from the socket here
      this.socket.on('serialdata', (data) => {
        this.datas.push(data.data);
        // Update the data when new data arrives
        this.setState({
          data: data.data,
        });
      });
    }, 1000); // Fetch data every second

    // Stop fetching data after 10 seconds
    setTimeout(() => {
      clearInterval(this.fetchInterval);
      this.socket.close();
      console.log("Stop fetching: " + this.datas);
      this.setState({
        message: "View QR Code", // Change button text
        showPopup: true, // Show the popup
      });
      fetch('http://localhost:5000/receive_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songname: this.state.songName, datas: this.datas}),
      }).then((response) => response.json())
      .then((data) => {
        console.log(data);
      }).catch((err) => console.log("error : "+err));
      let audiofile = this.state.songName+".wav";

      this.setState({
        qrCodeData : `http://localhost:4000/audioname/${audiofile}`
      })
    }, 10000);

  }

  closePopup = () => {
    this.setState({
      showPopup: false,
    });
  }

  render() {
    const { songName, songExists } = this.state;

    return (
      <div className="halloween-input-melody">
        <h1 className="halloween-header">Hello, Spooky Halloween!</h1>

        <input
          type="text"
          placeholder="Type the song name"
          value={songName}
          onChange={this.handleInputChange}
          className="halloween-input" // Add the CSS class for styling
          style={{ display: this.state.showPopup ? 'none' : 'block' }}
        />

        <button
          onClick={songExists ? null : this.checkSongExistence}
          className="halloween-button"
          style={{ display: this.state.showPopup ? 'none' : 'block' }}
        >
          {this.state.message}
        </button>

        {this.state.showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <button onClick={this.closePopup} className="close-button">
                Close
              </button>
              <QRCode value={this.state.qrCodeData} />
            </div>
          </div>
        )}

        <div>
          Data: {this.state.data}
        </div>
      </div>
    );
  }
}

export default InputMelody;
