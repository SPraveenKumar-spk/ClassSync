import styles from "../Styles/HandleDiary.module.css";
import { useState, useEffect } from "react";
import Loader from "./Loader";
export default function StudentStatus() {
  const [taskbtn, setTaskbtn] = useState(false);
  const [diarybtn, setDiarybtn] = useState(false);
  const [feed, setFeed] = useState(-1);
  const [taskData, setTaskData] = useState([]);
  const [diaryData, setDiaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const taskSubmissions = () => {
    setTaskbtn(true);
    setDiarybtn(false);
  };
  const diaryEntries = () => {
    setDiarybtn(true);
    setTaskbtn(false);
  };

  const handleFeed = (index) => {
    setFeed(index);
  };
  useEffect(() => {
    const fetchdiaries = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const projectCode = localStorage.getItem("projectCode");
        const response = await fetch(
          `http://localhost:5000/api/auth/studentdiaryrepo?projectCode=${projectCode}`,
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
      } finally {
        setLoading(false);
      }
    };
    if (diarybtn) {
      fetchdiaries();
    }
  }, [diarybtn]);
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
        {loading ? (
          <Loader />
        ) : (
          diarybtn && (
            <div>
              {diaryData.length ? (
                diaryData.map((info, index) => (
                  <div
                    key={index}
                    className={`${styles.newEntry} ${styles.feedContainer}`}
                  >
                    <div className={styles.timeDetails}>
                      <div>
                        {" "}
                        <h3>Email: {info.user.email}</h3>
                      </div>
                      <div>
                        <h3>
                          Date: {new Date(info.date).toLocaleDateString()}
                        </h3>
                        <h3>Time: {info.time}</h3>
                        <h3>Day: {info.dayOfWeek}</h3>
                      </div>
                    </div>
                    <textarea
                      name="data"
                      id="data"
                      cols="85"
                      rows="20"
                      value={info.data}
                      readOnly
                    />
                    <div className={styles.feed}>
                      <button onClick={() => handleFeed(index)}>
                        Give FeedBack
                      </button>

                      {feed === index && (
                        <div className={styles.diaryResult}>
                          <div className={styles.item}>
                            <p>Comments : </p>
                            <textarea
                              type="text"
                              name="comment"
                              id="comment"
                              cols="20"
                              rows="2"
                            />{" "}
                          </div>
                          <div className={styles.item}>
                            <p>
                              Marks :{" "}
                              <input type="number" name="marks" id="marks" />{" "}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No diary entries</p>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}
