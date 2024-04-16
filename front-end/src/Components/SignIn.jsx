import styles from "../Styles/SignIn.module.css";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import { MdCancel } from "react-icons/md";
import Image from "../assets/case-studies-illustration-digital-services-a.png"
function SignIn() {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const [user, setuser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const handleInput = (e) => {
    const name = e.target.name;
    let val = e.target.value;
    setuser({ ...user, [name]: val });
  };
  const handlevent = () => {
    return navigate("/");
  };
  return (
    <>
     <div className={styles.container}>
     <div className={styles.imagecontainer}>
          <div className={styles.heading}> <h1>Login to ClassSync</h1></div>
          <div className={styles.cancel} onClick={handlevent}>
          <MdCancel />
          </div>
          <div className={styles.picture}>
            <img src={Image} />
          </div>
        </div>
        <form  onSubmit={handleSubmit}>
        <div className={styles.details}>
          <div className={styles.item}>
            <label htmlFor="email">Email : </label>
            <input
              type="text"
              id="text"
              name="text"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.item}>
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="*******"
              required
            />
          </div>
          <div className={styles.item}>
              <label htmlFor="role">Enter Your Role </label>
              <select className={styles.roles} id="role" name="role" required>
                <option value="">Select your role</option>
                <option value={user.role} onChange={handleInput}>
                  Teacher
                </option>
                <option value={user.role} onChange={handleInput}>
                  Student
                </option>
              </select>
            </div>
          <div className={styles.btn}>
            <button>Sign IN</button>
          </div>
          </div>
        </form>
        </div>
    </>
  );
}

export default SignIn;
