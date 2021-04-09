import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import Menu from "./Menu";
import Search from "./Search";

function Header(props) {
  return (
    <>
      <div className="hearder bg-light">
        <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-around align-middle">
          <Link to="/" className="logo no-select mx-auto">
            <h1 className="navbar-brand ">𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵</h1>
          </Link>
          <Search />
          <Menu />
        </nav>
      </div>
    </>
  );
}

export default Header;
