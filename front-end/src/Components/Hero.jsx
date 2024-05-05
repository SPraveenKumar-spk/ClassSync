import styles from "../Styles/Hero.module.css";
import Image from "../assets/cambridge.jpeg";
import { NavLink } from "react-router-dom";
function Hero() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.imageWrapper}>
          <img src={Image} alt="Background" />
        </div>
        <div className={styles.heading}>
          <a href="/">ClassSync</a>
        </div>
        <div className={styles.navbar}>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/">About</a>
            </li>
            <li>
              <a href="/">Contact Us</a>
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
              {" "}
              <button>Transform Learning</button>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
