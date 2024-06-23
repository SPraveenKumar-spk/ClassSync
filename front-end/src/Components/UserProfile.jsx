import React from 'react';
import styles from "../Styles/UserProfile.module.css";
import Image from "../assets/user.png"
import  { useState, useEffect } from 'react';
import {useNavigate } from "react-router-dom";
export default function UserProfile() {
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  const [password,setPassword] = useState(false);
  useEffect(() => {
    const fetchUser = async () => { 
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://classsync-y1qe.onrender.com/api/auth/userinfo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json(); 
          setUser(userData);
        } else {
          console.log("Failed to fetch user data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser(); 
  }, []);
const handlePassword = () =>{
  setPassword(setPrev => !setPrev);
}
const handleRoute=()=>{
  navigate(-1);
}
  return (
    <>
    <div className={styles.route}>
          <ul>
            <li>
              <a onClick={handleRoute}>Home/</a>
            </li>
            <li>
              <a href='#'>user/</a>
              </li>
          </ul>
        </div>
      <section className={styles.container}>
        
        <div className={styles.profile}>
          <div>
            <img src={Image}/>
            <div className={styles.username}>
                <p>{user.name} </p>
                <div className={styles.value}>
                <p>{user.email} </p>
              </div>
              </div>
              
        </div>
          </div>
        
        <div className={styles.details}>
          <div className={styles.userDetails}>
            <div className={styles.row}>
              <div className={styles.key}>
                <p>Full Name </p>
              </div>
              <div className={styles.value}>
                <p>{user.name}</p>
              </div>
            </div>
            <hr />
            <div className={styles.row}>
              <div className={styles.key}>
                <p>Email </p>
              </div>
              <div className={styles.value}>
                <p>{user.email}</p>
              </div>
            </div>
            <hr/>
            <div className={styles.row}>
              <div className={styles.key}>
                <p>College </p>
              </div>
              <div className={styles.value}>
                <p>KLU </p>
              </div>
            </div>
            <hr/>
            <div className={styles.row}>
              <div className={styles.key}>
                <p>Designation </p>
              </div>
              <div className={styles.value}>
                <p>{user.role} </p>
              </div>
            </div>
            <hr />
            {password && (
              <div>
              <div className={styles.row}>
              <div className={styles.key}>
                <p>Current Password </p>
              </div>
              <div className={styles.value}>
                <p><input type='password' placeholder='Enter your password' /></p>
              </div>
            </div>
            <hr />
            <div className={styles.row}>
              <div className={styles.key}>
                <p>Update Password </p>
              </div>
              <div className={styles.value}>
                <p><input type='password' placeholder='Enter your new password' /></p>
              </div>
            </div>
            <hr />
            </div>
            )}
            <div className={styles.btn}>
            
            <button className = {styles.password} onClick={handlePassword}>Change Password</button>

            <button className={styles.updation}>Update Profile</button>
            </div>
            
          </div>
          <div className={styles.projectDetails}>
          <div className={styles.item}>Box 1</div>
          <div className={styles.item}>Box 2</div>
          </div>
        </div>
      </section>
    </>
  );
}
