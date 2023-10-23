import React from 'react'

import "./p5sound_fix"
import "p5/lib/addons/p5.sound"
import * as p5 from "p5"
import benSong from "./Alan Walker - Fade [NCS Release].wav"

class RingSketch extends React.Component {

    constructor({songId}) {
        super()
        this.myRef = React.createRef()
        this.songId = songId;
    }
    Sketch = (p) => {
        let song;
        let fft;
        let spectrum;
        let amplitude;
        let _minW;
        let _maxW;
        let _palette0 = ['FF7F50', 'FF6347', '8B4513', '2E8B57', '8B0000', '800080', 'FF1493'];
        let _count;
        let _aryRing = [];
        let _aryRotate = [];

        class Ring {
            constructor(posR, posAngInit, posAngNoiseInit, posAngNoiseThetaInit, posAngNoiseSpeed, rNoiseInit, rNoiseThetaInit, rNoiseSpeed, posRNoiseInit, posRNoiseThetaInit, posRNoiseSpeed, palette) {
              this.posR = posR;
              this.posAngInit = posAngInit;
              this.posAngNoiseInit = posAngNoiseInit;
              this.posAngNoiseThetaInit = posAngNoiseThetaInit;
              this.rNoiseInit = rNoiseInit;
              this.rNoiseThetaInit = rNoiseThetaInit;
              this.posRNoiseInit = posRNoiseInit;
              this.posRNoiseThetaInit = posRNoiseThetaInit;
      
              this.posAngNoiseSpeed = posAngNoiseSpeed;
              this.posAngMax = 2 * p.PI / 8 / 1.65;
              this.posAngMin = -this.posAngMax;
              this.posAngGap = this.posAngMax - this.posAngMin;
              this.posAngNoiseFreq = 4;
      
              this.rNoiseSpeed = rNoiseSpeed;
              this.rMax = this.posR / 2;
              this.rMin = this.rMax / 10;
              this.rGap = this.rMax - this.rMin;
              this.rNoiseFreq = 4;
      
              this.posRNoiseSpeed = posRNoiseSpeed;
              this.posRMax = this.posR;
              this.posRMin = this.posRMax * 0.75;
              this.posRGap = this.posRMax - this.posRMin;
              this.posRNoiseFreq = 4;
      
              this.colNoiseFreq = 3;
      
              this.rotZ = p.random(2 * p.PI);
      
              this.palette = palette;
              this.aryCol = [];
              for (let i = 0; i < this.palette.length; i++) {
                this.aryCol[i] = p.color("#" + this.palette[i]);
              }
      
              this.numCol = 5;
      
              this.count = 0;
            }
      
            draw() {
              let amplitudeVal = amplitude.getLevel(); // Get the audio amplitude
              // if (amplitudeVal < 0.1) {
              //   amplitudeVal *= 10;
              // }
              let posAngNoiseVal = p.sin(this.posAngNoiseThetaInit + 2 * p.PI * this.posAngNoiseFreq * p.noise(this.posAngNoiseInit[0], this.posAngNoiseInit[1] + this.posAngNoiseSpeed * this.count, this.posAngNoiseInit[2] + this.posAngNoiseSpeed * this.count)) * 0.5 + 0.5;
              let posAng = this.posAngInit + this.posAngMin + this.posAngGap * posAngNoiseVal;
      
              let rNoiseVal = p.sin(this.rNoiseThetaInit + 2 * p.PI * this.rNoiseFreq * p.noise(this.rNoiseInit[0], this.rNoiseInit[1] + this.rNoiseSpeed * this.count, this.rNoiseInit[2] + this.rNoiseSpeed * this.count)) * 0.5 + 0.5;
              let r = this.rMin + this.rGap * rNoiseVal * amplitudeVal;
      
              let posRNoiseVal = p.sin(this.posRNoiseThetaInit + 2 * p.PI * this.posRNoiseFreq * p.noise(this.posRNoiseInit[0], this.posRNoiseInit[1] + this.posRNoiseSpeed * this.count, this.posRNoiseInit[2] + this.posRNoiseSpeed * this.count)) * 0.5 + 0.5;
              let posRNew = this.posRMin + this.posRGap * posRNoiseVal * amplitudeVal;
      
              let colNoiseVal = p.sin(this.posRNoiseThetaInit + 2 * p.PI * this.colNoiseFreq * p.noise(this.posRNoiseInit[0] + 1000, this.posRNoiseInit[1] + this.posRNoiseSpeed * this.count + 1000, this.posRNoiseInit[2] + this.posRNoiseSpeed * this.count + 1000)) * 0.5 + 0.5;
              let col_i1 = p.int(colNoiseVal * this.numCol);
              let col_i2 = (col_i1 + 1) % this.numCol;
              let colAmp = (colNoiseVal - col_i1 / this.numCol) * this.numCol * amplitudeVal;
              let col = p.lerpColor(this.aryCol[col_i1], this.aryCol[col_i2], colAmp);
      
              p.push();
              p.stroke(col);
              p.rotateX(p.PI / 2);
              p.rotateY(posAng);
              p.translate(posRNew, 0, 0);
              p.rotateZ(this.rotZ);
              p.ellipse(0, 0, r, r, 36);
              p.pop();
      
              this.count++;
            }
          }
      
      

          const setObject = (p) => {
            // Initialize variables and parameters
            _count = 0;
            _minW = p.min(p.width, p.height) * 1;
            _maxW = p.max(p.width, p.height);
            p.rectMode(p.CENTER);
            p.ellipseMode(p.RADIUS);
            p.stroke(0, 0, 255);
            p.strokeWeight((_minW / 600) * p.pixelDensity());
          
            // Define the number of rings and initial parameters
            let numRing = 300;
            let posR = _minW / 2.9;
            let posAngNoiseInit_0 = [p.random(10000), p.random(10000), p.random(10000)];
            let rNoiseInit_0 = [p.random(10000), p.random(10000), p.random(10000)];
            let posRNoiseInit_0 = [p.random(10000), p.random(10000), p.random(10000)];
            let posAngNoiseThetaInit = p.random(2 * p.PI);
            let rNoiseThetaInit = p.random(2 * p.PI);
            let posRNoiseThetaInit = p.random(2 * p.PI);
            let posAngNoiseStep = 0.15;
            let rNoiseStep = 0.3;
            let posRNoiseStep = 0.3;
            let posAngNoiseSpeed = 0.004 * p.random([-1, 1]);
            let rNoiseSpeed = 0.004 * p.random([-1, 1]);
            let posRNoiseSpeed = 0.004 * p.random([-1, 1]);
          
            // Shuffle the Halloween color palette
            p.shuffle(_palette0, true);
          
            // Create an array to hold Ring objects
            _aryRing = [];
            for (let i = 0; i < numRing; i++) {
              let posAngInit = (2 * p.PI / numRing) * i;
              let posAngNoiseInit = [posAngNoiseInit_0[0] + posAngNoiseStep * p.cos(posAngInit), posAngNoiseInit_0[1] + posAngNoiseStep * p.sin(posAngInit), posAngNoiseInit_0[2]];
              let rNoiseInit = [rNoiseInit_0[0] + rNoiseStep * p.cos(posAngInit), rNoiseInit_0[1] + rNoiseStep * p.sin(posAngInit), rNoiseInit_0[2]];
              let posRNoiseInit = [posRNoiseInit_0[0] + posRNoiseStep * p.cos(posAngInit), posRNoiseInit_0[1] + posRNoiseStep * p.sin(posAngInit), posRNoiseInit_0[2]];
          
              // Create a Ring object with initial parameters and Halloween color palette
              _aryRing[i] = new Ring(posR, posAngInit, posAngNoiseInit, posAngNoiseThetaInit, posAngNoiseSpeed, rNoiseInit, rNoiseThetaInit, rNoiseSpeed, posRNoiseInit, posRNoiseThetaInit, posRNoiseSpeed, _palette0);
            }
          
            // Create an array to store rotation information for animation
            _aryRotate = [
              [p.random(2 * p.PI), p.random(0.01)],
              [p.random(2 * p.PI), p.random(0.01)],
              [p.random(2 * p.PI), p.random(0.01)],
            ];
          };
          



        // Loads the music file into p5.js to play on click
        p.preload = () => {
            song = p.loadSound(`http://localhost:4000/audio/${this.songId}`)
            //song = p.loadSound(benSong);
            //console.log("Hello");
        }

        // Initial setup to create canvas and audio analyzers
        p.setup = () => {
            console.log("Heelo");
            p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
            setObject(p);
            fft = new p5.FFT();
            fft.setInput(song);
            amplitude = new p5.Amplitude();
            song.play();
        }

        p.draw = () => {
            spectrum = fft.analyze(); // Calculate the spectrum data

            p.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2, -_maxW * 2, _maxW * 4);
            //p.background(90 / 100 * 255);
            p.background(0);
            p.rotateX(_aryRotate[0][0] + _aryRotate[0][1] * p.frameCount);
            p.rotateY(_aryRotate[1][0] + _aryRotate[1][1] * p.frameCount);
            p.rotateZ(_aryRotate[2][0] + _aryRotate[2][1] * p.frameCount);
      
            p.rotateX(p.PI / 4);
      
            for (let i = 0; i < _aryRing.length; i++) {
              _aryRing[i].draw();
            }
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



export default RingSketch;