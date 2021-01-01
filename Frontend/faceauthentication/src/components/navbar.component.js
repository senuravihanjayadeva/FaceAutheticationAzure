import React from "react";

export default function NavbarComponent() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" style={{ color: "white" }}>
            HEXAAUTH
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link" href="/" style={{ color: "white" }}>
                Login
              </a>
              <a
                className="nav-link"
                href="/register"
                style={{ color: "white" }}
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
