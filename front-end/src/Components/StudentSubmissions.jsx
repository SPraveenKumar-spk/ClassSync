import { NavLink } from "react-router-dom";
import styles from "../Styles/Submissions.module.css";
import { useState } from "react";
function StudentSubmissions() {
  const projectCode = localStorage.getItem("projectCode");
  const [assigned, setAssigned] = useState([]);
  const [status, setStatus] = useState(false);

  const handleTasks = async () => {
    setStatus((prevState) => !prevState);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/auth/assignedDetails?projectCode=${projectCode}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAssigned(data);
      } else {
        console.log("Failed to fetch tasks");
      }
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
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
            <li className={styles.links} onClick={handleTasks}>
              Task details
            </li>
            <NavLink className={styles.links}>Drafts</NavLink>
            <NavLink className={styles.links}>Submissions</NavLink>
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
                </div>
              ))
            ) : (
              <div className={styles.error}>
                <h1>No tasks are assigned..</h1>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StudentSubmissions;
