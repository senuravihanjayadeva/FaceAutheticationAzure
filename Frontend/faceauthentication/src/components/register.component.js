import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { storage } from "../firebase";
import Progress from "./Progress";

export default function RegisterComponent() {
  //states for webcam
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(
    "https://www.clker.com/cliparts/Z/k/z/B/Q/d/blue-silhouette-man-hi.png"
  );

  //states for send image to firebase

  const [imageURL, setImageURL] = useState("");
  const [uploadPercentage, setuploadPercentage] = useState(0);

  //states for send backend data
  const [userId, setuserId] = useState("");
  const [userName, setuserName] = useState("");

  //method for capture an image
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    //console.log(imageSrc);
  }, [webcamRef, setImgSrc]);

  function uploadImage(e) {
    e.preventDefault();

    if (imgSrc !== null) {
      alert("clicked");
      const fileName = Math.floor(Math.random() * 100000 + 1) + ".jpg";
      const uploadTask = storage
        .ref(`faceauth/${fileName}`)
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
            .ref("faceauth")
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
                  "https://eastus.api.cognitive.microsoft.com/face/v1.0/largefacelists/hexalist/persistedfaces?detectionModel=detection_01",
                  newImageDetails,
                  config
                )
                .then((response) => {
                  console.log(
                    "Response for LargeFaceList is = " +
                      response.data.persistedFaceId
                  );
                  setuserId(response.data.persistedFaceId);
                  alert("Successfully Added to Large Face List");

                  const newUserReg = {
                    userId: response.data.persistedFaceId,
                    userName: userName,
                  };

                  axios
                    .post("http://localhost:5000/users/add", newUserReg)
                    .then(() => {
                      const configTrain = {
                        headers: {
                          "Ocp-Apim-Subscription-Key":
                            "a680691db6174916bb8819e75475a406",
                        },
                      };
                      alert("user registered");
                      axios
                        .post(
                          "https://eastus.api.cognitive.microsoft.com/face/v1.0/largefacelists/hexalist/train",
                          configTrain
                        )
                        .then(() => {
                          alert("Trained Successfully");
                          window.location = "/";
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
      <h1>Register</h1>
      <div className="row">
        <div className="col-md-6">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <button onClick={capture}>Capture photo</button>
        </div>
        <div className="col-md-6">
          {" "}
          {imgSrc && (
            <>
              {" "}
              <div class="form-group">
                <img src={imgSrc} style={{ width: "80%" }} />{" "}
              </div>
              <br />
              <div class="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Your Name"
                  onChange={(e) => {
                    setuserName(e.target.value);
                  }}
                />
              </div>
              <br />
              <div class="form-group">
                <Progress percentage={uploadPercentage} />
              </div>
              <br />
              <button onClick={uploadImage}>Register</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
