import React, { useState, useEffect } from "react";

export default function UserComponent() {
  const [UserName, setUserName] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("UserName"));
  }, []);

  return (
    <div className="container">
      <div style={{ margin: "10% 25%" }}>
        <h1>Login Successful</h1>
        <br />
        <h1>Hello {UserName}</h1>
      </div>
    </div>
  );
}
