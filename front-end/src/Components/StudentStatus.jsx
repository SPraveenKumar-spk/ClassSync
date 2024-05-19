import styles from "../Styles/StudentStatus.module.css";
import { useState, useEffect } from "react";
export default function StudentStatus() {
  const [taskbtn, setTaskbtn] = useState(false);
  const [diarybtn, setDiarybtn] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [diaryData, setDiaryData] = useState([]);
  const taskSubmissions = () => {
    setTaskbtn(true);
  };
  const diaryEntries = () => {
    setDiarybtn(true);
  };

  useEffect(() => {
    const fetchdiaries = async () => {
      try {
        const token = localStorage.getItem("token");
        const projectCode = localStorage.getItem("projectCode");
        const response = await fetch(
          `http://localhost:5000/api/auth/diaryrepo`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await data.json();
          setDiaryData(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (diarybtn) {
      fetchdiaries();
    }
  }, [diarybtn]);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.options}>
          <button onClick={taskSubmissions}>Task Submissions</button>
          <button onClick={diaryEntries}>Diary Entries</button>
        </div>

        {taskbtn && <div></div>}
      </div>
    </>
  );
}
