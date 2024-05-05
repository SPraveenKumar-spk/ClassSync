import { NavLink } from "react-router-dom";
import styles from "../Styles/Submissions.module.css";
import { useState, useEffect } from "react";

function StudentSubmissions() {
  const [submissions, setSubmissions] = useState(false);
  const [tasks, setTasks] = useState([]);
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
            setTasks(data);
          }
        } catch (error) {}
      };
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
            <NavLink className={styles.links}>Task details</NavLink>
            <NavLink className={styles.links}>Drafts</NavLink>
            <NavLink className={styles.links} onClick={handleSubmissions}>
              Submissions
            </NavLink>
          </ul>
        </div>
        {submissions && tasks.length != 0 ? (
          <div>
            {tasks.map((task, index) => {
              <div key={index}>
                <p>
                  <span>Task Name :</span> {task.taskName}
                </p>
                <p>
                  <span>Task theme :</span> {task.theme}
                </p>
                <p>
                  <span>Task Description :</span> {task.description}
                </p>
                <p>
                  <span>Task files :</span> {task.files}
                </p>
              </div>;
            })}
          </div>
        ) : (
          <p>No submissions...</p>
        )}
      </div>
    </>
  );
}

export default StudentSubmissions;
