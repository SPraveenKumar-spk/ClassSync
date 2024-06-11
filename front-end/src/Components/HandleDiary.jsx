import styles from "../Styles/HandleDiary.module.css";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function handleDiary() {
  const [entry, setEntry] = useState(false);
  const [past, setPast] = useState(false);
  const [textData, setData] = useState("");
  const [allData, setAll] = useState([]);
  const [loading, setLoading] = useState(false);

  const notifyError = () => {
    toast.error("Failed to make the entry");
  };
  const notifySuccess = () => {
    toast.success("Your Entry is successful");
  };
  const handleEntry = () => {
    setEntry(true);
    setPast(false);
  };

  const handlePast = () => {
    setEntry(false);
    setPast(true);
  };

  useEffect(() => {
    const fetchPast = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const projectCode = localStorage.getItem("projectCode");
        const response = await fetch(
          `https://classsync-y1qe.onrender.com/api/auth/diaryrepo?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response) {
          const data = await response.json();
          console.log(data);
          setAll(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (past) {
      fetchPast();
    }
  }, [past, setAll]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const projectCode = localStorage.getItem("projectCode");
      const token = localStorage.getItem("token");
      const currentDate = new Date();
      const dateOnly = currentDate.toISOString().split("T")[0];
      const optionsDate = { dateStyle: "medium" };
      const optionsTime = { timeZone: "Asia/Kolkata", timeStyle: "medium" };

      const date = dateOnly;
      const time = currentDate.toLocaleTimeString("en-IN", optionsTime);
      const dayOfWeek = currentDate.toLocaleDateString("en-IN", {
        weekday: "long",
      });
      const response = await fetch(
        `https://classsync-y1qe.onrender.com/api/auth/diaryentry?projectCode=${projectCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: textData,
            date: dateOnly,
            time: time,
            dayOfWeek: dayOfWeek,
          }),
        }
      );
      if (response.ok) {
        notifySuccess();
      } else {
        notifyError();
      }
    } catch (error) {
      console.log(error);
    }
  };
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
            <button onClick={handleEntry}>New Entry</button>
          </div>
          <div className={styles.item}>
            <button onClick={handlePast}>Past Entries</button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {entry && (
            <div className={styles.newEntry}>
              <textarea
                name="data"
                id="data"
                cols="85"
                rows="20"
                value={textData}
                onChange={(e) => setData(e.target.value)}
                placeholder="Enter the entry"
              />
              <div className={styles.btn}>
                <button>Submit</button>
              </div>
            </div>
          )}
        </form>
        {loading ? (
          <Loader />
        ) : (
          allData.length > 0 &&
          allData.map((info, index) => (
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
              {info.comments && (
                <div className={styles.feedback}>
                  <h4>
                    <span>Feedback:</span>
                  </h4>
                  <p>
                    <span>Comments: </span>
                    {info.comments}
                  </p>
                  <p>
                    <span>Marks: </span>
                    {info.marks}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
