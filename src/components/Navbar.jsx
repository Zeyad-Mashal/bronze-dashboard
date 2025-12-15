import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-text">Bronze</span>
        </div>

        {/* Desktop Navigation */}
        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={closeMenu}>
              الحجوزات
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/service" className="navbar-link" onClick={closeMenu}>
              الخدمات
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/blogs" className="navbar-link" onClick={closeMenu}>
              المقالات
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Toggle Button */}
        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <HiX className="menu-icon" />
          ) : (
            <HiMenu className="menu-icon" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
