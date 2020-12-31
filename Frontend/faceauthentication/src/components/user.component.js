import React, { useState, useEffect } from "react";

export default function UserComponent() {
  const [UserName, setUserName] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("UserName"));
  }, []);

  return (
    <div className="container">
      <h1>Hello {UserName}</h1>
    </div>
  );
}
