import styles from "../Styles/SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { MdCancelPresentation } from "react-icons/md";
function SignIn() {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handlevent = () => {
    return navigate("/");
  };
  return (
    <>
      <div className={styles.container}>
        <form className={styles.details} onSubmit={handleSubmit}>
          <h1>Login to ClassSync</h1>
          <div className={styles.cancel} onClick={handlevent}>
            <MdCancelPresentation />
          </div>

          <div>
            <label htmlFor="email">Email : </label>
            <input
              type="text"
              id="text"
              name="text"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="*******"
            />
          </div>
          <div className={styles.btn}>
            <button>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignIn;
