import { useState, useEffect } from "react";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HandleDiary() {
  const [entry, setEntry] = useState(false);
  const [past, setPast] = useState(false);
  const [textData, setTextData] = useState("");
  const [allData, setAllData] = useState([]);
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
    setLoading(false);
  };

  const handlePast = async () => {
    setEntry(false);
    setPast(true);
    setLoading(true);
    try {
      const projectCode = sessionStorage.getItem("projectCode");
      const response = await fetch(
        `https://class-sync-geht.vercel.app/api/auth/diaryrepo?projectCode=${projectCode}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAllData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const projectCode = sessionStorage.getItem("projectCode");
      const currentDate = new Date();
      const dateOnly = currentDate.toISOString().split("T")[0];
      const optionsTime = {
        timeZone: "Asia/Kolkata",
        timeStyle: "medium",
      };
      const time = currentDate.toLocaleTimeString("en-IN", optionsTime);
      const dayOfWeek = currentDate.toLocaleDateString("en-IN", {
        weekday: "long",
      });
      const response = await fetch(
        `https://class-sync-geht.vercel.app/api/auth/diaryentry?projectCode=${projectCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: textData,
            date: dateOnly,
            time: time,
            dayOfWeek: dayOfWeek,
          }),
          credentials: "include",
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
      <div className="position-absolute top-30 start-50 transform-middle">
        <div className="d-flex justify-content-between">
          <div className="col-md-6">
            <button className="btn btn-primary p-2 fs-5" onClick={handleEntry}>
              New Entry
            </button>
          </div>
          <div className="col-md-6 w-auto">
            <button className="btn btn-primary p-2 fs-5" onClick={handlePast}>
              Past Entries
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {entry && (
            <div className="row mb-3">
              <textarea
                className="form-control"
                name="data"
                id="data"
                cols="85"
                rows="10"
                value={textData}
                onChange={(e) => setTextData(e.target.value)}
                placeholder="Enter the entry"
              />
              <div className="text-center mt-3">
                <button className="btn btn-primary">Submit</button>
              </div>
            </div>
          )}
        </form>
        {loading ? (
          <Loader />
        ) : (
          allData.length > 0 &&
          allData.map((info, index) => (
            <div key={index} className="row mb-3 border rounded p-3">
              <div className="col-md-12 mb-3">
                <h3>Date : {info.date}</h3>
                <h3>Time : {info.time}</h3>
                <h3>Day : {info.dayOfWeek}</h3>
              </div>
              <textarea
                className="form-control"
                name="data"
                id="data"
                cols="85"
                rows="10"
                value={info.data}
                readOnly
              />
              {info.comments && (
                <div>
                  <div className="col-md-12 mt-3">
                    <span>Feedback:</span>
                    <p>
                      <span>Comments: </span>
                      {info.comments}
                    </p>
                    <p>
                      <span>Marks: </span>
                      {info.marks}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default HandleDiary;
