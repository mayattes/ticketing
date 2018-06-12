import React from "react";
import "./Navbar.css";

class Navbar extends React.Component {
  render() {
    return (
      <nav className=" d-flex navbar navbar-light bg-light justify-content-between">
        <div>
          <a className="navbar-brand col-lg-6">Navbar</a>
          <form className="form-inline">
            <input
              className="form-control mr-sm-2 col-lg-3"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0 col-lg-3"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </nav>
    );
  }
}

export default Navbar;
