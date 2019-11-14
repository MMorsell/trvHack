import React from "react";
import { NavLink, Router } from "react-router-dom";

function Header() {
  const activeStyle = { color: "purple" };
  return (
    <nav style={{zIndex:3,position:"relative"}}>

      <NavLink activeStyle={activeStyle} exact to="/">
        Map
      </NavLink>
      {" | "}
      <NavLink activeStyle={activeStyle} to="/about">
        about
      </NavLink>
      {" | "}
      <NavLink activeStyle={activeStyle} to="/hihi">
        hihi
      </NavLink>

    </nav>
    
  );
}

export default Header;