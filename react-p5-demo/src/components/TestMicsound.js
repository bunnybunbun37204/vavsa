import React from 'react'

import "./p5sound_fix"
import "p5/lib/addons/p5.sound"
import * as p5 from "p5"
import benSong from "./Alan Walker - Fade [NCS Release].wav"

class Mic extends React.Component {

    constructor({songId}) {
        super()
        this.myRef = React.createRef()

    }
     Sketch = (p) => {
        let mic;
        p.setup = () => {
            let cnv = p.createCanvas(100, 100);
            //cnv.mousePressed(p.userStartAudio);
            p.textAlign(p.CENTER);
            mic = new p5.AudioIn();
            mic.start();
        }
        p.draw = () => {
            p.background(0);
            p.fill(255);
            p.text('tap to start', p.width/2, 20);
          
            let micLevel = mic.getLevel();
            let y = p.height - micLevel * p.height;
            p.ellipse(p.width/2, y, 10, 10);
        }

     }

    componentDidMount() {
      this.myP5 = new p5(this.Sketch, this.myRef.current)
  }

  componentDidUpdate() {
      this.myP5.remove()
      this.myP5 = new p5(this.Sketch, this.myRef.current)
  }

  componentWillUnmount() {
      this.myP5.remove()
  }


    render() {
        return (
          <div></div>
        )
    }
}



export default Mic;