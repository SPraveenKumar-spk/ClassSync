import styles from "../Styles/HandleDiary.module.css";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function StudentStatus() {
  const [taskbtn, setTaskbtn] = useState(false);
  const [diarybtn, setDiarybtn] = useState(false);
  const [feed, setFeed] = useState(-1);
  const [taskData, setTaskData] = useState([]);
  const [diaryData, setDiaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");
  const [marks, setMarks] = useState("");

  const notifySuccess = () => toast.success("Feedback submitted successfully");

  const notifyError = () => {
    toast.error("Failed to submit feedback");
  };
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
  const handleFeedbackSubmit = async (diaryId) => {
    try {
      const response = await fetch(
        "https://classsync-y1qe.onrender.com/api/auth/submitFeedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ diaryId, comments, marks }),
        }
      );
      if (response.ok) {
        notifySuccess();
        setFeed(-1);
        setComments("");
        setMarks("");
      } else {
        notifyError();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };
  useEffect(() => {
    const fetchdiaries = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const projectCode = localStorage.getItem("projectCode");
        const response = await fetch(
          `https://classsync-y1qe.onrender.com/api/auth/studentdiaryrepo?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
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
                      cols="72"
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
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                            />{" "}
                          </div>
                          <div className={styles.item}>
                            <p>
                              Marks :{" "}
                              <input
                                type="text"
                                name="marks"
                                id="marks"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                              />{" "}
                            </p>
                          </div>
                          <div className={styles.submitbtn}>
                            <button
                              onClick={() => handleFeedbackSubmit(info._id)}
                            >
                              Submit FeedBack
                            </button>
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
