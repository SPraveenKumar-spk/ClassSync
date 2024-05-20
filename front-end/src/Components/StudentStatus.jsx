import styles from "../Styles/HandleDiary.module.css";
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
          `http://localhost:5000/api/auth/diaryrepo?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setDiaryData(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (diarybtn) {
      fetchdiaries();
    }
  }, [diarybtn, setDiaryData]);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.clickevents}>
          <div className={styles.item}>
            <button onClick={taskSubmissions}>Task Submissions</button>
          </div>
          <div className={styles.item}>
            <button onClick={diaryEntries}>Diary Entries</button>
          </div>
        </div>

        {taskbtn && <div></div>}

        {diarybtn && diaryData.length ? (
          diaryData.map((info, index) => (
            <div
              key={index}
              className={`${styles.newEntry} ${styles.feedContainer}`}
            >
              <div className={styles.timeDetails}>
                <h3>Date : {info.date}</h3>
                <h3>Time : {info.time}</h3>
                <h3>Day : {info.dayOfWeek}</h3>
              </div>
              <textarea
                name="data"
                id="data"
                cols="85"
                rows="20"
                value={info.data}
                readOnly
              />
            </div>
          ))
        ) : (
          <p>No diary entries</p>
        )}
      </div>
    </>
  );
}
