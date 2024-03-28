import styles from "../Styles/Header.module.css";
function Header() {
  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          {" "}
          <h1>ClassSync</h1>
        </div>

        <div className={styles.navlinks}>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/signup">Sign Up</a>
            </li>
            <li>
              <a href="/signin">Sign In</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
