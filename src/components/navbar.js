import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../components/navbar.css'; // Import the CSS file for Navbar styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="Logo" />
          <span>Group 5: Automatic Facial Analysis</span>
        </div>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/upload">Upload Image</Link> {/* Use Link instead of <a> */}
          </li>
          <li className="nav-item">
            <Link to="/preview">All Images</Link> {/* Use Link instead of <a> */}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
