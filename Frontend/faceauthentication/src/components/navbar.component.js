import React from "react";

export default function NavbarComponent() {
  return (
    <div>
      <nav
        class="navbar navbar-expand-lg navbar-light bg-dark"
        style={{ padding: "10px" }}
      >
        <a class="navbar-brand" href="/" style={{ color: "white" }}>
          HexaAuth
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" href="/" style={{ color: "white" }}>
                Login
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/register" style={{ color: "white" }}>
                Register
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
