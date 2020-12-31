import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { storage } from "../firebase";
import Progress from "./Progress";

export default function RegisterComponent() {
  //states for webcam
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  //method for capture an image
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  return (
    <div>
      <h1>Register</h1>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>Capture photo</button>
      {imgSrc && <img src={imgSrc} />}
    </div>
  );
}
