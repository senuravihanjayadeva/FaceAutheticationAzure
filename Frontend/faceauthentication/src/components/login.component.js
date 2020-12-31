import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { storage } from "../firebase";
import Progress from "./Progress";

export default function LoginComponent() {
  //states for webcam
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(
    "https://i.stack.imgur.com/l60Hf.png"
  );

  //states for send image to firebase

  const [imageURL, setImageURL] = useState("");
  const [uploadPercentage, setuploadPercentage] = useState(0);

  //states for send backend data
  const [userId, setuserId] = useState("");

  //method for capture an image
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    //console.log(imageSrc);
  }, [webcamRef, setImgSrc]);

  function uploadImage(e) {
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
                .then((response) => {
                  console.log(
                    "Response for face detect is = " + response.data[0].faceId
                  );
                  setuserId(response.data[0].faceId);
                  alert("Face Detect Successfully");

                  const newUserLogin = {
                    faceId: response.data[0].faceId,
                    largeFaceListId: "hexalist",
                    maxNumOfCandidatesReturned: 10,
                    mode: "matchPerson",
                  };

                  axios
                    .post(
                      "https://eastus.api.cognitive.microsoft.com/face/v1.0/findsimilars",
                      newUserLogin,
                      config
                    )
                    .then((res) => {
                      console.log(res.data[0].persistedFaceId);

                      alert("Face Verify Successfully");

                      axios
                        .get(
                          process.env.REACT_APP_BACKEND_URL +
                            "/users/" +
                            res.data[0].persistedFaceId
                        )
                        .then((res) => {
                          console.log(res.data.userName);
                          localStorage.setItem("UserName", res.data.userName);
                          window.location = "/user";
                        })
                        .catch((err) => {
                          alert(err);
                        });
                    })
                    .catch((err) => {
                      alert(err);
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
      <br />
      <h1 className="text-center">HexaAuth Login </h1>
      <br />
      <div className="row">
        <div className="col-md-6">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <button className="btn btn-warning" onClick={capture}>
            Capture photo
          </button>
        </div>
        <div className="col-md-6">
          {" "}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
