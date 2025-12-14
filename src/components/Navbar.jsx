import React, { useState } from "react";
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
            <a href="/service" className="navbar-link" onClick={closeMenu}>
              الخدمات
            </a>
          </li>
          <li className="navbar-item">
            <a href="/" className="navbar-link" onClick={closeMenu}>
              المقالات
            </a>
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
