import React, { useState } from 'react';
import styles from "../Styles/Home.module.css";
import Image from "../assets/cambridge.jpeg";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import { IoMenuSharp } from "react-icons/io5";
import { AiOutlineHome, AiOutlineInfoCircle, AiOutlineMail, AiOutlineUser, AiOutlineLogin } from "react-icons/ai";

function Home() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.imageWrapper}>
          <img src={Image} alt="Background" />
        </div>
        <div className={styles.navbar}>
          <div className={styles.heading}>
            <a  className='text-decoration-none' href="/">ClassSync</a>
          </div>
          <div className={styles.mobileMenu}>
            <p onClick={toggleDropdown}><IoMenuSharp className={styles.iconMenu} /></p>
            {showDropdown && (
              <ul className={styles.dropdownContent}>
                <li><NavLink exact to="/" onClick={toggleDropdown}><AiOutlineHome className={styles.icon} /> Home</NavLink></li>
                <li><NavLink to="/about" onClick={toggleDropdown}><AiOutlineInfoCircle className={styles.icon} /> About</NavLink></li>
                <li><NavLink to="/contact" onClick={toggleDropdown}><AiOutlineMail className={styles.icon} /> Contact </NavLink></li>
                <li><NavLink to="/register" onClick={toggleDropdown}><AiOutlineUser className={styles.icon} /> Sign Up</NavLink></li>
                <li><NavLink to="/login" onClick={toggleDropdown}><AiOutlineLogin className={styles.icon} /> Sign In</NavLink></li>
              </ul>
            )}
          </div>
        </div>
        <ul className={styles.desktopNav}>
        <li>
              <a className='text-decoration-none' href="/">Home</a>
            </li>
            <li>
              <a  className='text-decoration-none' href="/about">About</a>
            </li>
            <li>
              <a  className='text-decoration-none' href="/">Contact Us</a>
              </li>
        </ul>
      </div>
      <div className={styles.container}>
        <div className={styles.item}>
          <NavLink to="/register">
            <button>SIGN UP</button>
          </NavLink>
        </div>
        <div className={styles.item}>
          <NavLink to="/login">
            <button>SIGN IN</button>
          </NavLink>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.text}>
          <p>
            "Empower your projects with our all-in-one platform for seamless
            collaboration and productivity."
          </p>
        </div>
        <div className={styles.btn}>
          <NavLink to="/register">
            <button>Transform Learning</button>
          </NavLink>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
