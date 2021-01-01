import React, { useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { storage } from "../firebase";
import Progress from "./Progress";

import NavbarComponent from "./navbar.component";

export default function RegisterComponent() {
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
  const [userName, setuserName] = useState("");
  const [StateOfProcess, setStateOfProcess] = useState("");

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
                  //alert("Image added to Large Face List");
                  setStateOfProcess("Processing...");

                  const newUserReg = {
                    userId: response.data.persistedFaceId,
                    userName: userName,
                  };

                  axios
                    .post(
                      process.env.REACT_APP_BACKEND_URL + "/users/add",
                      newUserReg
                    )
                    .then(() => {
                      const configTrain = {
                        headers: {
                          "Ocp-Apim-Subscription-Key":
                            "a680691db6174916bb8819e75475a406",
                        },
                      };
                      //alert("User Details sent to the Database");
                      setStateOfProcess("Processing...");
                      axios
                        .post(
                          "https://eastus.api.cognitive.microsoft.com/face/v1.0/largefacelists/hexalist/train",
                          "",
                          configTrain
                        )
                        .then(() => {
                          //alert("Dataset Trained Successfully");
                          setStateOfProcess("Account Created...");
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
      <NavbarComponent />
      <br />
      <h1 className="text-center">HexaAuth Register</h1>
      <br />
      <div className="row">
        <div className="col-md-6">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <button className="btn btn-warning" onClick={capture}>
            Capture photo
          </button>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <h3 style={{ color: "red" }}>{StateOfProcess}</h3>
            </div>
            <div className="col-md-12">
              {" "}
              {imgSrc && (
                <>
                  {" "}
                  <div class="form-group">
                    <img src={imgSrc} style={{ width: "300px" }} />{" "}
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
                  <button className="btn btn-success" onClick={uploadImage}>
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
