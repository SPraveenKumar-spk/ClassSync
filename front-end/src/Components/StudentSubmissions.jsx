import { Navigate, NavLink, useNavigate } from "react-router-dom";
import HandleDiary from "./HandleDiary";
import styles from "../Styles/Submissions.module.css";
import { useState } from "react";
function StudentSubmissions() {
  const projectCode = localStorage.getItem("projectCode");
  const [assigned, setAssigned] = useState([]);
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
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

  const handleDiary = () => {
    <HandleDiary />;
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h1>ClassSync</h1>
          <ul>
            <li
              className={styles.links}
              onClick={() => navigate("/studentshome")}
            >
              Home
            </li>
            <li className={styles.links} onClick={handleTasks}>
              Task details
            </li>
            <li className={styles.links} onClick={() => handleDiary}>
              Diary Entry
            </li>
            <NavLink className={styles.links}>Submissions</NavLink>
          </ul>
        </div>
        {status && (
          <div className={styles.assignedContainer}>
            {assigned.length ? (
              assigned.map((task, index) => (
                <div key={index} className={styles.templates}>
                  <p>
                    <span>Task Id : </span>
                    {task.taskId}
                  </p>
                  <p>
                    <span>Task Name :</span> {task.taskName}
                  </p>
                  <p>
                    <span>Task theme :</span> {task.theme}
                  </p>
                  <p>
                    <span>Task Description :</span> {task.description}
                  </p>
                  <div className={styles.completebtn}>
                    <button onClick={() => navigate("/completetasks")}>
                      Complete Task
                    </button>
                  </div>
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
