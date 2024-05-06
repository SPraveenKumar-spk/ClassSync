import { NavLink } from "react-router-dom";
import styles from "../Styles/Submissions.module.css";
import { useState, useEffect } from "react";

function StudentSubmissions() {
  const projectCode = localStorage.getItem("projectCode");
  // const [submissions, setSubmissions] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [status, setStatus] = useState(false);
  const handleSubmissions = () => {
    setSubmissions((prevState) => !prevState);

    useEffect(() => {
      const fetchSubmissions = async () => {
        try {
          const token = localStorage.get("token");
          const response = await fetch(``, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response) {
            const data = await response.json();
            setAssigned(data);
          }
        } catch (error) {}
      };
      fetchSubmissions();
    }, []);
  };

  const handleTasks = () => {
    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:5000/api/auth/assignedDetails?projectCode=${projectCode}`,
            {
              method: "GET",
              methods: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response) {
            const data = response.json();
          }
        } catch (error) {}
      };
      fetchTasks();
    }, []);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h1>ClassSync</h1>
          <ul>
            <NavLink className={styles.links} to="/studentshome">
              Home
            </NavLink>
            <NavLink className={styles.links} onClick={handleTasks}>
              Task details
            </NavLink>
            <NavLink className={styles.links}>Drafts</NavLink>
            <NavLink className={styles.links} onClick={handleSubmissions}>
              Submissions
            </NavLink>
          </ul>
        </div>
        {status && (
          <div className={styles.assignedContainer}>
            {assigned.length ? (
              assigned.map((task, index) => (
                <div key={index} className={styles.templates}>
                  <p>
                    <span>Task Name :</span> {task.taskName}
                  </p>
                  <p>
                    <span>Task theme :</span> {task.theme}
                  </p>
                  <p>
                    <span>Task Description :</span> {task.description}
                  </p>
                  {/* <p>
                  <span>Task files :</span> {task.files}
                </p> */}
                </div>
              ))
            ) : (
              <h1>You haven't created any tasks..</h1>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StudentSubmissions;
