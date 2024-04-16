import { useState} from "react";
import { MdCancel } from "react-icons/md";
import {NavLink,useNavigate} from "react-router-dom";
import styles from "../Styles/Signup.module.css";
import Image from "../assets/register-removebg-preview.png";
import { useGoogleLogin } from "@react-oauth/google";
function Signup() {
  
  const [user, setuser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const navigate = useNavigate()
  const handleInput = (e) => {
    const name = e.target.name;
    let val = e.target.value;
    setuser({ ...user, [name]: val });
  };

  // const { localToken } = AuthConsumer();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`'https://localhost:5000/login`, {
        method: "PoST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.Stringfy(user),
      });
      if (response.ok) {
        let res_token = response.data;
        setuser({
          name: " ",
          email: " ",
          role: " ",
        });
        localStorage.setItem(response.data);
        localToken(res_token.token);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });
 
  const handlevent = () => {
    return navigate("/");
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.imagecontainer}>
          <div className={styles.heading}> <h1>Welcome to ClassSync</h1></div>
          <div className={styles.cancel} onClick={handlevent}>
          <MdCancel />
          </div>
          <div className={styles.picture}>
            <img src={Image} />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.details}>
            <div className={styles.media}>
              <button onClick={() => login()}>Sign in with Google</button>
            </div>
            <div className={styles.linecontainer}>
              <div className={styles.line}>
                <hr />
              </div>
              <div className={styles.text}>
                <p>or</p>
              </div>
            </div>
            <div className={styles.item}>
              <label htmlFor="name">Enter Your Name </label>
              <input
                type="text"
                name="name"
                id="name"
                value={user.name}
                onChange={handleInput}
                required
              />
            </div>
            <div className={styles.item}>
              <label htmlFor="email">Enter Your Email </label>
              <input
                type="text"
                name="email"
                id="email"
                value={user.email}
                onChange={handleInput}
                required
              />
            </div>
            <div className={styles.item}>
              <label htmlFor="password">Password </label>
              <input
                type="password"
                id="password"
                name="password"
                required
              ></input>
            </div>
            <div className={styles.item}>
              <label htmlFor="role">Enter Your Role </label>
              <select className={styles.roles} id="role" name="role">
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
              <button>Get Started</button>
            </div>
          </div>
          <div className={styles.direct}>
          <p>Already registered ? <span><NavLink to = "/login"> Login </NavLink></span></p>
        </div>
        </form>
        
      </div>
    </>
  );
}

export default Signup;
