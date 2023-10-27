import React, { useEffect, useRef } from 'react';
import * as p5 from 'p5';

function BallSketch({ songId }) {
  const sketchRef = useRef();
  let song;
  let fft;
  let amplitude;
  let _aryBalls = [];
  let _palette = ['000000', 'FFFFFF'];
  let _minW;

  const Sketch = (p) => {
    class Balls {
      constructor(
        minEllipseX,
        maxEllipseX,
        ellipseStepAmp,
        ellipseStepSpeed,
        ellipseStepInit,
        ellipseStepD,
        ellipseStepTimeSpeed,
        ellipseY,
        noiseFreq,
        rotateAngle,
        col,
        col2,
        numBall,
        numFunction
      ) {
        this.minEllipseX = minEllipseX;
        this.maxEllipseX = maxEllipseX;
        this.ellipseStepAmp = ellipseStepAmp;
        this.ellipseStepSpeed = ellipseStepSpeed;
        this.ellipseStepInit = ellipseStepInit;
        this.ellipseStepD = ellipseStepD;
        this.ellipseStepTimeSpeed = ellipseStepTimeSpeed;
        this.ellipseY = ellipseY;
        this.noiseFreq = noiseFreq;
        this.rotateAngle = rotateAngle;
        this.col = col;
        this.col2 = col2;
        this.numBall = numBall;
        this.numFunction = numFunction;
        this.timeCount = 0;
        this.colorAmp = 1 / (_minW / 600);

        if (this.minEllipseX <= this.maxEllipseX) {
          this.ellipseDirection = 1;
        } else {
          this.ellipseDirection = -1;
        }
      }

      drawBalls() {
        p.push();
        p.rotate(this.rotateAngle);
        let ellipseStepCount = 0;
        let val = 0;
        for (let i = 0; i < this.numFunction; i++) {
          let theta =
            this.ellipseStepInit[i] +
            this.ellipseStepSpeed[i] * ellipseStepCount +
            this.ellipseStepTimeSpeed[i] * this.timeCount;
          val +=
            this.ellipseStepAmp[i] *
            (p.sin(this.noiseFreq[i] * (2 * p.PI * theta)) * 0.5 + 0.5) **
              this.ellipseStepD[i];
        }
        val /= this.numFunction;

        let ellipseStepX =
          this.ellipseDirection * (_minW / 100 + val);

        let currentEllipseX = this.minEllipseX;
        let ellipseR = p.abs(ellipseStepX);
        p.fill(
          p.lerpColor(this.col, this.col2, p.sin(this.colorAmp * val) * 0.5 + 0.5)
        );
        let prevEllipseR = ellipseR;

        if (this.ellipseDirection === 1) {
          for (let i = 0; i < this.numBall; i++) {
            ellipseStepCount++;

            val = 0;
            for (let i = 0; i < this.numFunction; i++) {
              let theta =
                this.ellipseStepInit[i] +
                this.ellipseStepSpeed[i] * ellipseStepCount +
                this.ellipseStepTimeSpeed[i] * this.timeCount;
              val +=
                this.ellipseStepAmp[i] *
                (p.sin(this.noiseFreq[i] * (2 * p.PI * theta)) * 0.5 + 0.5) **
                  this.ellipseStepD[i];
            }
            val /= this.numFunction;

            ellipseStepX =
              this.ellipseDirection * (prevEllipseR + val);
            currentEllipseX += ellipseStepX;

            ellipseR = p.abs(ellipseStepX) ** 2 / (4 * prevEllipseR);
            p.fill(
              p.lerpColor(this.col, this.col2, p.sin(this.colorAmp * val) * 0.5 + 0.5)
            );
            p.ellipse(currentEllipseX, -ellipseR + this.ellipseY, ellipseR);
            prevEllipseR = ellipseR;
          }
        } else if (this.ellipseDirection === -1) {
          for (let i = 0; i < this.numBall; i++) {
            ellipseStepCount++;

            val = 0;
            for (let i = 0; i < this.numFunction; i++) {
              let theta =
                this.ellipseStepInit[i] +
                this.ellipseStepSpeed[i] * ellipseStepCount +
                this.ellipseStepTimeSpeed[i] * this.timeCount;
              val +=
                this.ellipseStepAmp[i] *
                (p.sin(this.noiseFreq[i] * (2 * p.PI * theta)) * 0.5 + 0.5) **
                  this.ellipseStepD[i];
            }
            val /= this.numFunction;

            ellipseStepX =
              this.ellipseDirection * (prevEllipseR + val);
            currentEllipseX += ellipseStepX;

            ellipseR = p.abs(ellipseStepX) ** 2 / (4 * prevEllipseR);
            p.fill(
              p.lerpColor(this.col, this.col2, p.sin(this.colorAmp * val) * 0.5 + 0.5)
            );
            p.ellipse(currentEllipseX, -ellipseR + this.ellipseY, ellipseR);
            prevEllipseR = ellipseR;
          }
        }

        this.lastEllipseX = currentEllipseX;

        this.timeCount++;
        p.pop();
      }

      drawLine() {
        p.push();
        p.rotate(this.rotateAngle);
        p.fill(this.col);
        p.rect(-_minW / 2, this.ellipseY, this.lastEllipseX + _minW / 2, (_minW / 200));
        p.pop();
      }
    }

    const setObject = (p) => {
      _minW = p.min(p.width, p.height) * 0.8;
      p.strokeCap(p.SQUARE);

      p.noStroke();
      p.ellipseMode(p.RADIUS);
      let yRatio = 3 / 3;

      let numBalls = 40;
      _aryBalls = [];

      let numFunction = 4;
      let ellipseStepAmp = [];
      let ellipseStepSpeed = [];
      let ellipseStepInit = [];
      let ellipseStepD = [];
      let ellipseStepTimeSpeed = [];
      let noiseFreq = [];
      let columnStep = [];
      for (let i = 0; i < numFunction; i++) {
        ellipseStepAmp.push(_minW / 51);
        ellipseStepSpeed.push(0.04 * p.random(0.5, 1.9));
        ellipseStepInit.push(p.random(1000));
        ellipseStepD.push(1);
        ellipseStepTimeSpeed.push(0.005 * p.random([1, -1]));
        noiseFreq.push(2);
        let rnd = p.random(-0.05, 0.05);
        rnd = rnd ** 1;
        columnStep.push(rnd);
      }

      for (let i = 0; i < numBalls; i++) {
        let minEllipseX = -(_minW / 2);
        let maxEllipseX = _minW / 2;
        let ellipseY = ((-_minW / 2 + (_minW / numBalls) * (0.5 + i)) * yRatio);
        let rotateAngle = 0;
        let col = p.color('#' + _palette[0]);
        let col2 = p.color('#' + _palette[1]);
        let numBall = 50;

        let ellipseStepInit2 = [];
        for (let j = 0; j < numFunction; j++) {
          ellipseStepInit2[j] = ellipseStepInit[j] + columnStep[j] * i;
        }

        _aryBalls.push(new Balls(minEllipseX, maxEllipseX, ellipseStepAmp, ellipseStepSpeed, ellipseStepInit2, ellipseStepD, ellipseStepTimeSpeed, ellipseY, noiseFreq, rotateAngle, col, col2, numBall, numFunction));
      }
    };

    p.preload = () => {
      song = p.loadSound(`https://api-ex4.vercel.app/audioname/${songId}`);
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      setObject(p);
      fft = new p5.FFT();
      fft.setInput(song);
      amplitude = new p5.Amplitude();
      song.play();
    };

    p.draw = () => {
      p.background(255);
      p.translate(p.width / 2, p.height / 2);
      let level = amplitude.getLevel();
      for (let i = 0; i < _aryBalls.length; i++) {
        let sizeFactor = p.map(level, 0, 1, 0.5, 2);
        // You can modify the properties individually like this:
        _aryBalls[i].noiseFreq[0] = 6 * level;
        _aryBalls[i].noiseFreq[1] = 6 * level;
        _aryBalls[i].noiseFreq[2] = 6 * level;
        _aryBalls[i].noiseFreq[3] = 6 * level;
        _aryBalls[i].col = p.color(p.map(level, 0, 1, 0, 255), p.map(level, 0, 1, 0, 255) * sizeFactor, 255 - p.map(level, 0, 1, 0, 255));
        _aryBalls[i].drawBalls();
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

export default BallSketch;
