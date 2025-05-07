import React from "react";
import { MdHome, MdBookmarks } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  return (
    <footer className="footer">
      <Link
        to="/"
        className={`footer-item ${location.pathname === "/" ? "active" : ""}`}
      >
        <MdHome />
        <span>Home</span>
      </Link>
      <Link
        to="/bookmarks"
        className={`footer-item ${
          location.pathname === "/bookmarks" ? "active" : ""
        }`}
      >
        <MdBookmarks />
        <span>Bookmarks</span>
      </Link>
    </footer>
  );
};

export default Footer;
