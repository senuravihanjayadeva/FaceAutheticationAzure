import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { storage } from "../firebase";
import Progress from "./Progress";

import NavbarComponent from "./navbar.component";

import "./style.css";

export default function LoginComponent() {
  //states for webcam
  const webcamRefMobile = React.useRef(null);
  const webcamRefDesktop = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(
    "https://i.stack.imgur.com/l60Hf.png"
  );

  //states for send image to firebase

  const [imageURL, setImageURL] = useState("");
  const [uploadPercentage, setuploadPercentage] = useState(0);

  //states for send backend data
  const [userId, setuserId] = useState("");
  const [StateOfProcess, setStateOfProcess] = useState("");

  //method for capture an image Destop
  const captureDesktop = React.useCallback(() => {
    const imageSrc = webcamRefDesktop.current.getScreenshot();
    setImgSrc(imageSrc);
    //console.log(imageSrc);
  }, [webcamRefDesktop, setImgSrc]);

  //method for capture an image Mobile
  const captureMobile = React.useCallback(() => {
    const imageSrc = webcamRefMobile.current.getScreenshot();
    setImgSrc(imageSrc);
    //console.log(imageSrc);
  }, [webcamRefMobile, setImgSrc]);

  async function uploadImage(e) {
    e.preventDefault();

    if (imgSrc !== null) {
      const fileName = Math.floor(Math.random() * 100000 + 1) + ".jpg";
      const uploadTask = storage
        .ref(`facelogin/${fileName}`)
        .putString(imgSrc, "data_url", { contentType: "image/jpeg" });
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setuploadPercentage(progress);
        },
        (error) => {
          //error function
          console.log(error);
        },
        () => {
          //complete function
          storage
            .ref("facelogin")
            .child(fileName)
            .getDownloadURL()
            .then((urlFirebase) => {
              console.log("Image Url is = " + urlFirebase);
              setImageURL(urlFirebase);

              const config = {
                headers: {
                  "Content-Type": "application/json",
                  "Ocp-Apim-Subscription-Key":
                    "a680691db6174916bb8819e75475a406",
                },
              };

              const newImageDetails = {
                url: urlFirebase,
              };

              axios
                .post(
                  "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_03&returnRecognitionModel=false&detectionModel=detection_02&faceIdTimeToLive=86400",
                  newImageDetails,
                  config
                )
                .then(async (response) => {
                  console.log(
                    "Response for face detect is = " + response.data[0].faceId
                  );
                  setuserId(response.data[0].faceId);
                  //alert("Face Detect Successfully");
                  setStateOfProcess("Processing Your Face.....");

                  const newUserLogin = {
                    faceId: response.data[0].faceId,
                    largeFaceListId: "hexalist",
                    maxNumOfCandidatesReturned: 10,
                    mode: "matchPerson",
                  };

                  await axios
                    .post(
                      "https://eastus.api.cognitive.microsoft.com/face/v1.0/findsimilars",
                      newUserLogin,
                      config
                    )
                    .then((res) => {
                      console.log(res.data[0].persistedFaceId);

                      //alert("Face Verify Successfully");
                      setStateOfProcess("Please Wait...");

                      axios
                        .get(
                          process.env.REACT_APP_BACKEND_URL +
                            "/users/" +
                            res.data[0].persistedFaceId
                        )
                        .then((res) => {
                          console.log(res.data.userName);
                          if (!res.data) {
                            //alert("Authentication Failed..Try Again");
                            setStateOfProcess(
                              "Authentication Failed..Try Again..."
                            );
                          } else {
                            localStorage.setItem("UserID", res.data.userId);
                            localStorage.setItem("UserName", res.data.userName);
                            window.location = "/user";
                          }
                        })
                        .catch(() => {
                          //alert("Authentication Failed..Try Again");
                          setStateOfProcess(
                            "Authentication Failed..Try Again..."
                          );
                        });
                    })
                    .catch(() => {
                      //alert("Authentication Failed..Try Again");
                      setStateOfProcess("Authentication Failed..Try Again...");
                    });
                })
                .catch((err) => {
                  alert(err.message);
                });
            });
        }
      );
    } else {
      alert("First You Must Select An Image");
    }
  }

  return (
    <div className="container">
      <NavbarComponent />
      <br />
      <h1
        className="text-center"
        style={{
          backgroundColor: "#333399",
          color: "#ffffff",
          padding: "10px",
        }}
      >
        HEXAAUTH LOGIN{" "}
      </h1>
      <br />
      <div className="row">
        <div className="col-md-6 DestopView">
          <Webcam
            audio={false}
            ref={webcamRefDesktop}
            screenshotFormat="image/jpeg"
          />
          <button className="btn btn-warning" onClick={captureDesktop}>
            Capture photo
          </button>
        </div>
        <div className="col-md-6 MobileView">
          <Webcam
            audio={false}
            ref={webcamRefMobile}
            width={300}
            height={400}
            screenshotFormat="image/jpeg"
          />
          <button className="btn btn-warning" onClick={captureMobile}>
            Capture photo
          </button>
          <br /> <br />
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <h3 style={{ color: "red" }}>{StateOfProcess}</h3>
            </div>

            <div className="col-md-12">
              {imgSrc && (
                <>
                  {" "}
                  <div class="form-group">
                    <img src={imgSrc} style={{ width: "300px" }} />{" "}
                  </div>
                  <br />
                  <br />
                  <div class="form-group">
                    <Progress percentage={uploadPercentage} />
                  </div>
                  <br />
                  <button className="btn btn-primary" onClick={uploadImage}>
                    Login
                  </button>
                  <br /> <br />
                </>
              )}
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
