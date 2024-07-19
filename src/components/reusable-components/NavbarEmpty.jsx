import React from "react";
import "./NavbarEmpty.css";
import Logo from "../../images/logo.png"

export default function NavbarEmpty() {
    return (
      <header>
          <img className="logo" src={Logo} alt="logo" />
      </header>
    );
}