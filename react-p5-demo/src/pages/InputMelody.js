import React from "react";
import io from 'socket.io-client';
import QRCode from 'qrcode.react'; // Import the QRCode component

class InputMelody extends React.Component {
  constructor(props) {
    super(props);
    this.datas = [];
    this.socket = null;
    this.state = {
      data: null,
      message: "Start recording",
      showPopup: false,
      qrCodeData: "https://github.com/antonioerdeljac/next13-spotify", // Replace with your QR code data
    };
    this.fetchInterval = null;
  }

  componentDidMount() {
    this.socket = io('http://localhost:8888');
  }

  componentWillUnmount() {
    this.socket.close();
  }

  startDataFetching = () => {
    this.setState({
      message: "Recording"
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
    }, 10000);
  }

  closePopup = () => {
    this.setState({
      showPopup: false,
    });
  }

  render() {
    return (
      <div className="halloween-input-melody">
        <h1 className="halloween-header">Hello, Spooky Halloween!</h1>
        <button
          onClick={this.startDataFetching}
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
              <QRCode value={this.state.qrCodeData} /> {/* Display the QR code */}
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
