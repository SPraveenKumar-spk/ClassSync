import styles from "../Styles/userlogin.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaGoogle, FaGithub, FaLinkedin, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../store/auth";

function SignIn() {
  const { storeToken } = useAuth();
  const [login, setlogin] = useState(false);
  const [role, setrole] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setuser] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://classsync-y1qe.onrender.com/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

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
  const handleGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
        <div className={styles.heading}>
            {" "}
            <h1>Login to ClassSync</h1>
          </div>
          <div className={styles.details}>
            <div className={styles.item}>
              <label htmlFor="email">Email  </label>
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
              <label htmlFor="password">Password  </label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="********"
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
            <div className={styles.media}>
            <p>Use Social Media Credentials</p>
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
        </form>
      </div>
    </>
  );
}

export default SignIn;
