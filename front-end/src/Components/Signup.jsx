import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../Styles/userlogin.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../store/auth";
import { FaGoogle, FaGithub, FaLinkedin, FaEye, FaEyeSlash } from 'react-icons/fa';



function Signup() {
  const { storeToken } = useAuth();
  const [user, setuser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleInput = (e) => {
    const name = e.target.name;
    let val = e.target.value;
    setuser({ ...user, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://classsync-y1qe.onrender.com/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      if (response.ok) {
        const res_data = await response.json();
        storeToken(res_data.token);
        setuser({
          name: "",
          email: "",
          password: "",
          role: "",
        });
        navigate("/login");
        notifySuccess();
      } else if (response.status === 401) {
        notifyError();
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
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.heading}>
            <h1>Welcome to ClassSync</h1>
          </div>
          <div className={styles.details}>
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
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="*******"
                  value={user.password}
                  onChange={handleInput}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash className={styles.passwordIcon} onClick={togglePassword} />
                ) : (
                  <FaEye className={styles.passwordIcon} onClick={togglePassword} />
                )}
              </div>
            </div>
            <div className={styles.item}>
              <label htmlFor="role">Enter Your Role </label>
              <select
                className={styles.roles}
                id="role"
                name="role"
                value={user.role}
                onChange={handleInput}
              >
                <option value="">Select your role</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
            </div>
            <div className={styles.btn}>
              <button>Get Started</button>
            </div>
            <div className={styles.media}>
            <div>Use Social Media Credentials</div>
              <FaGoogle
                onClick={() => handleGoogle()}
                className={styles.icon}
              />
             
              <FaGithub
                className={styles.icon}
              />
              <FaLinkedin
                className={styles.icon}
              />
            </div>
          </div>
          <div className={styles.direct}>
            <p>
              Already registered ?{" "}
              <span>
                <NavLink to="/login"> Login </NavLink>
              </span>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;
