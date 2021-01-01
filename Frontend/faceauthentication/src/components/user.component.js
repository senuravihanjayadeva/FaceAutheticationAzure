import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserComponent() {
  const [ProfileID, setProfileID] = useState("");
  const [UserName, setUserName] = useState("");
  const [StateOfProcess, setStateOfProcess] = useState("");

  useEffect(() => {
    setProfileID(localStorage.getItem("UserID"));
    setUserName(localStorage.getItem("UserName"));
  }, []);

  function logoutFunc() {
    localStorage.removeItem("UserID");
    localStorage.removeItem("UserName");
    window.location = "/";
  }

  function deleteAccount() {
    console.log("Profile ID is " + ProfileID);
    const config = {
      headers: {
        "Ocp-Apim-Subscription-Key": "a680691db6174916bb8819e75475a406",
      },
    };

    axios
      .delete(
        `https://eastus.api.cognitive.microsoft.com/face/v1.0/largefacelists/hexalist/persistedfaces/${ProfileID}`,
        config
      )
      .then(() => {
        //alert("Face Deleted from Large Face List Successfully");
        setStateOfProcess("Processing....");
        axios
          .post(
            "https://eastus.api.cognitive.microsoft.com/face/v1.0/largefacelists/hexalist/train",
            "",
            config
          )
          .then(() => {
            //alert("Dataset Trained Successfully");
            setStateOfProcess("Processing....");
            axios
              .delete(
                process.env.REACT_APP_BACKEND_URL + "/users/delete/" + ProfileID
              )
              .then(() => {
                localStorage.removeItem("UserID");
                localStorage.removeItem("UserName");
                //alert("Account Deleted");
                setStateOfProcess("Account Deleted....");
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
        alert(err);
      });
  }

  return (
    <div className="container">
      <div style={{ margin: "10% 25%" }}>
        <div className="container">
          <h3 style={{ color: "red" }}>{StateOfProcess}</h3>
        </div>
        <h1>Login Successful</h1>
        <br />
        <h1>Hello {UserName}</h1>
        <br />
        <button
          className="btn btn-warning"
          onClick={logoutFunc}
          style={{ margin: "10px" }}
        >
          Logout
        </button>
        <button
          className="btn btn-danger"
          onClick={deleteAccount}
          style={{ margin: "10px" }}
        >
          Remove Account
        </button>
      </div>
    </div>
  );
}
