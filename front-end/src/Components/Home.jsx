  import React, { useState } from "react";
  import Image from "../assets/cambridge.jpeg";
  import { NavLink } from "react-router-dom";
  import Footer from "./Footer";
  import { IoMenuSharp } from "react-icons/io5";
  import {
    AiOutlineHome,
    AiOutlineInfoCircle,
    AiOutlineMail,
    AiOutlineUser,
    AiOutlineLogin,
  } from "react-icons/ai";

  import '../Styles/Home.css';
  function Home() {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };

    return (
      <>
        <div className="hero position-fixed w-100 h-100">
          <div className="position-absolute w-100 h-100">
            <img src={Image} alt="Background" className="w-100 h-100" />
          </div>
          <nav className="navbar navbar-expand-md p-3">
            <div className="container-fluid">
              <a className="navbar-brand text-white fs-2 fw-bold" href="/">
                ClassSync
              </a>
              <button
                className="navbar-toggler"
                type="button"
                onClick={toggleDropdown}
              >
                <IoMenuSharp className="text-white" />
              </button>
              <div
                className={`collapse navbar-collapse  text-center  ${
                  showDropdown ? "show" : ""
                }`}
              >
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 fs-4">
                  <li className="nav-item">
                    <NavLink className="nav-link text-warning" to="/">
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-warning " to="/about">
                      About
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-warning" to="/contact">
                      Contact Us
                    </NavLink>
                  </li>
                 
                </ul>
                <ul className="navbar-nav ms-auto d-none d-md-flex">
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/register">
                      <button className="btn btn-outline-info bg-light fs-5 fw-semibold">
                        Sign Up
                      </button>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/login">
                      <button className="btn btn-outline-info bg-light fs-5 fw-semibold">
                        Sign In
                      </button>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="content position-absolute top-50 start-50 translate-middle text-center text-white">
          <div className="text">
            <p className="fw-semibold d-none d-sm-block fs-2 d-md-block fs-2 d-lg-block fs-1 d-xl-block fs-1 w-100">
              "Empower your projects with our all-in-one platform for seamless
              collaboration and productivity."
            </p>
            <p className="fw-semibold d-block d-sm-none fs-4 w-100 ">
              "Empower your projects with our all-in-one platform for seamless
              collaboration and productivity."
            </p>
          </div>
          <div className="btn pt-4">
            <NavLink to="/register">
              <button className="btn btn-outline-primary fs-3 p-2 fw-semibold text-nowrap ">
                Transform Learning
              </button>
            </NavLink>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  export default Home;
