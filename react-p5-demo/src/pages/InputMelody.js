import React from "react";
import io from 'socket.io-client';

class InputMelody extends React.Component {
  constructor(props) {
    super(props);
    this.datas = [];
    this.socket = null;
    this.state = {
      data: null,
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
    this.datas = [];
    this.socket = io('http://localhost:8888');
    this.fetchInterval = setInterval(() => {
      // Start fetching data from the socket here
      this.socket.on('serialdata', (data) => {
        this.datas.push(data.data)
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
      console.log("Stop fetching : "+this.datas);
    }, 10000);
  }

  render() {
    return (
      <div>
        <h1>Hello</h1>
        <button onClick={this.startDataFetching}>Start Data Fetching</button>
        <div>
          Data: {this.state.data}
        </div>
      </div>
    )
  }
}

export default InputMelody;
