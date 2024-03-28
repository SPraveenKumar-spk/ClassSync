import styles from "../Styles/Signup.module.css";
import { useGoogleLogin } from "@react-oauth/google";
function Signup() {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });
  return (
    <>
      <div className={styles.container}>
        <form className={styles.details}>
          <div className={styles.item}>
            <label htmlFor="name">Enter Your Name : </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className={styles.item}>
            <label htmlFor="mail">Enter Your Email : </label>
            <input
              type="text"
              name="mail"
              id="mail"
              placeholder="Enter your mail"
              required
            />
          </div>
          <div className={styles.item}>
            <label htmlFor="role">Enter Your Role : </label>
            <select className={styles.roles} id="role" name="role">
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className={styles.btn}>
            <button>Submit</button>
          </div>
        </form>
      </div>
      <div className={styles.media}>
        <button onClick={() => login()}>Sign in with Google</button>
      </div>
    </>
  );
}

export default Signup;
