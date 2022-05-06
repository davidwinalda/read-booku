import React from 'react';
import { MdHome, MdBookmarks } from "react-icons/md";
import { Link } from "react-router-dom";

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.listFooter}>
        <MdHome size="1.5em" />
        <span><Link to="/" style={{ textDecoration: 'none', color: '#52565e' }}>Home</Link></span>
      </div>
      <div className={styles.listFooter}>
        <MdBookmarks size="1.5em" />
        <span><Link to="/bookmarks" style={{ textDecoration: 'none', color: '#52565e' }}>Bookmarks</Link></span>
      </div>
    </div>
  );
}

export default Footer;