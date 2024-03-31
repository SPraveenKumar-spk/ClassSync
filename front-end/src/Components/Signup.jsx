import { useState } from "react";
import styles from "../Styles/Signup.module.css";
import { useGoogleLogin } from "@react-oauth/google";
function Signup() {
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

  const { localToken } = AuthConsumer();
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
  return (
    <>
      <div className={styles.container}>
        <form className={styles.details} onSubmit={handleSubmit}>
          <div className={styles.item}>
            <label htmlFor="name">Enter Your Name : </label>
            <input
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={handleInput}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className={styles.item}>
            <label htmlFor="email">Enter Your Email : </label>
            <input
              type="text"
              name="email"
              id="email"
              value={user.email}
              onChange={handleInput}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.item}>
            <label htmlFor="role">Enter Your Role : </label>
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
