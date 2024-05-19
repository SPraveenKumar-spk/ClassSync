import styles from "../Styles/SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdCancel } from "react-icons/md";
import Image from "../assets/case-studies-illustration-digital-services-a.png";
import { useAuth } from "../store/auth";
import Loader from "./Loader";
function SignIn() {
  const { storeToken } = useAuth();
  const [login, setlogin] = useState(false);
  const [role, setrole] = useState(false);
  const [user, setuser] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        storeToken(token);
        setuser({
          email: " ",
          password: " ",
          role: " ",
        });
        if (user.role == "Teacher") {
          navigate("/projectshome");
        } else {
          navigate("/studentshome");
        }
      } else if (response.status === 404) {
        setrole(true);
      } else if (response.status === 401) {
        setlogin(true);
      }
    } catch (error) {}
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setuser({ ...user, [name]: value });
  };
  const handlevent = () => {
    return navigate("/");
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.imagecontainer}>
          <div className={styles.heading}>
            {" "}
            <h1>Login to ClassSync</h1>
          </div>
          <div className={styles.cancel} onClick={handlevent}>
            <MdCancel />
          </div>
          <div className={styles.picture}>
            <img src={Image} />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.details}>
            <div className={styles.item}>
              <label htmlFor="email">Email : </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleInput}
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
                value={user.password}
                onChange={handleInput}
                required
              />
            </div>
            <div className={styles.item}>
              <label htmlFor="role">Enter Your Role </label>
              <select
                className={styles.roles}
                id="role"
                name="role"
                value={user.role}
                onChange={handleInput}
                required
              >
                <option value="">Select your role</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
            </div>
            {login ? (
              <div className={styles.error}>
                <p>Invalid email or password</p>
              </div>
            ) : role ? (
              <div className={styles.error}>
                <p>Invalid user</p>
              </div>
            ) : null}

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
