import React, { useEffect, useRef } from 'react';
import "./p5sound_fix";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";

function WaterSketch({ songId }) {
  const sketchRef = useRef();
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

  const Sketch = (p) => {

    class Ring {
        constructor(posXy, hi, posZInit, posZNoiseInit, posZNoiseThetaInit, posZNoiseSpeed, rNoiseInit, rNoiseThetaInit, rNoiseSpeed, posRNoiseInit, posRNoiseThetaInit, posRNoiseSpeed, palette) {
          this.posXy = posXy;
          this.hi = hi;
      
          this.posZInit = posZInit;
          this.posZNoiseInit = posZNoiseInit;
          this.posZNoiseThetaInit = posZNoiseThetaInit;
          this.rNoiseInit = rNoiseInit;
          this.rNoiseThetaInit = rNoiseThetaInit;
          this.posRNoiseInit = posRNoiseInit;
          this.posRNoiseThetaInit = posRNoiseThetaInit;
          
          this.posZNoiseSpeed = posZNoiseSpeed;
          this.posZMax = hi / 4;//5;
          this.posZMin = -this.posZMax;
          this.posZGap = this.posZMax - this.posZMin;
          this.posZNoiseFreq = 4;
          
          this.rNoiseSpeed = rNoiseSpeed;
          this.rMax = _minW / 3;
          this.rMin = this.rMax / 100;//10;
          this.rGap = this.rMax - this.rMin;
          this.rNoiseFreq = 4;
      
          this.posRNoiseSpeed = posRNoiseSpeed;
      
          this.colNoiseFreq = 4;//3;
      
          this.rotZ = p.random(2*p.PI);
      
          this.palette = palette;
          this.aryCol = [];
          for (let i = 0; i < _palette0.length; i++) {
            this.aryCol[i] = p.color("#" + _palette0[i]);
          }
      
          this.numCol = 5;
      
          this.count = 0;
        }
      
        draw() {
          let posZNoiseVal = p.sin(this.posZNoiseThetaInit + 2*p.PI * this.posZNoiseFreq * 
            p.noise(this.posZNoiseInit[0] + this.posZNoiseSpeed * this.count, this.posZNoiseInit[1] + this.posZNoiseSpeed * this.count, this.posZNoiseInit[2])) * 0.5 + 0.5;
          let posZ = this.posZInit + this.posZMin + this.posZGap * posZNoiseVal;
      
          let rNoiseVal = p.sin(this.rNoiseThetaInit + 2*p.PI * this.rNoiseFreq * 
            p.noise(this.rNoiseInit[0] + this.rNoiseSpeed * this.count, this.rNoiseInit[1] + this.rNoiseSpeed * this.count, this.rNoiseInit[2])) * 0.5 + 0.5;
          let r = this.rMin + this.rGap * rNoiseVal;
      
          let colNoiseVal = p.sin(this.posRNoiseThetaInit + 2*p.PI * this.colNoiseFreq * 
            p.noise(this.posRNoiseInit[0] + this.posRNoiseSpeed * this.count + 1000, this.posRNoiseInit[1] + this.posRNoiseSpeed * this.count + 1000, this.posRNoiseInit[2] + 1000)) * 0.5 + 0.5;
          let col_i1 = p.int(colNoiseVal * this.numCol);
          let col_i2 = (col_i1 + 1) % this.numCol;
          let colAmp = (colNoiseVal - col_i1 / this.numCol) * this.numCol;
          let col = p.lerpColor(this.aryCol[col_i1], this.aryCol[col_i2], colAmp);
      
          p.push();
          p.stroke(col);
          p.translate(this.posXy.x, this.posXy.y, posZ - this.hi / 2);
          p.rotateZ(this.rotZ);
          p.ellipse(0, 0, r, r, 50);//36);
          p.pop();
      
          this.count++;
        }
      }

    const setObject = (p) => {
      _count = 0;
      _minW = p.min(p.width, p.height) * 1;
      _maxW = p.max(p.width, p.height);
      p.rectMode(p.CENTER);
      p.ellipseMode(p.RADIUS);
      p.stroke(0, 0, 255);
      p.strokeWeight((_minW / 600) * p.pixelDensity());

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

      p.shuffle(_palette0, true);

      _aryRing = [];
      for (let i = 0; i < numRing; i++) {
        let posAngInit = (2 * p.PI / numRing) * i;
        let posAngNoiseInit = [posAngNoiseInit_0[0] + posAngNoiseStep * p.cos(posAngInit), posAngNoiseInit_0[1] + posAngNoiseStep * p.sin(posAngInit), posAngNoiseInit_0[2]];
        let rNoiseInit = [rNoiseInit_0[0] + rNoiseStep * p.cos(posAngInit), rNoiseInit_0[1] + rNoiseStep * p.sin(posAngInit), rNoiseInit_0[2]];
        let posRNoiseInit = [posRNoiseInit_0[0] + posRNoiseStep * p.cos(posAngInit), posRNoiseInit_0[1] + posRNoiseStep * p.sin(posAngInit), posRNoiseInit_0[2]];
        _aryRing[i] = new Ring(posR, posAngInit, posAngNoiseInit, posAngNoiseThetaInit, posAngNoiseSpeed, rNoiseInit, rNoiseThetaInit, rNoiseSpeed, posRNoiseInit, posRNoiseThetaInit, posRNoiseSpeed, _palette0);
      }

      _aryRotate = [
        [p.random(2 * p.PI), p.random(0.01)],
        [p.random(2 * p.PI), p.random(0.01)],
        [p.random(2 * p.PI), p.random(0.01)],
      ];
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      setObject(p);
    };

    p.draw = () => {
      p.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2, -_maxW * 2, _maxW * 4);
      p.background(0);
      p.rotateX(_aryRotate[0][0] + _aryRotate[0][1] * p.frameCount);
      p.rotateY(_aryRotate[1][0] + _aryRotate[1][1] * p.frameCount);
      p.rotateZ(_aryRotate[2][0] + _aryRotate[2][1] * p.frameCount);
      p.rotateX(p.PI / 4);

      for (let i = 0; i < _aryRing.length; i++) {
        _aryRing[i].draw();
      }
    };
  };

  useEffect(() => {
    const p5Canvas = new p5(Sketch, sketchRef.current);

    return () => {
      p5Canvas.remove();
    };
  }, [songId]);

  return <div ref={sketchRef}></div>;
}

export default WaterSketch;
