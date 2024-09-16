import Image from "../assets/cambridge.jpeg";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import "../Styles/Home.css";
import NavBar from "./NavBar";

function Home() {
  return (
    <>
      <div className="hero  w-100 h-100">
        <div className="position-fixed w-100 h-100">
          <img src={Image} alt="Background" className="w-100 h-100" />
        </div>
        <NavBar />
      </div>
      <div className="content position-absolute top-50 start-50 translate-middle text-center text-white">
        <div className="text">
          <p className="fw-semibold w-100 fs-4 fs-sm-2 fs-lg-1">
            ~ Empower your projects with our all-in-one platform for seamless
            collaboration and productivity. ~
          </p>
        </div>
        <div className="btn pt-4">
          <NavLink to="/login">
            <button className="btn btn-outline-primary fs-3 p-2 fw-semibold text-nowrap">
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
