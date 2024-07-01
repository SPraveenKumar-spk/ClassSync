import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMenuSharp } from "react-icons/io5";

function StudentSubmissions() {
  const projectCode = sessionStorage.getItem("projectCode");
  const [assigned, setAssigned] = useState([]);
  const [diary, setDiary] = useState(false);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState(false);
  const [past, setPast] = useState(false);
  const [textData, setTextData] = useState("");
  const [allData, setAllData] = useState([]);
  const notifySuccess = () => {
    toast.success("Your diary entry has been saved successfully.");
  };

  const fetchError = () => {
    toast.error("Unable to fetch your tasks right now.");
  };
  const notifyFetchPastError = () => {
    toast.error("Unable to fetch your past entries right now.");
  };

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/assignedDetails?projectCode=${projectCode}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        setLoading(false);
        if (response.ok) {
          const data = await response.json();
          setAssigned(data);
          setStatus(true);
          setDiary(false);
        } else {
          fetchError();
        }
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    };

    fetchAssignedTasks();
  }, []);

  const handleTasks = async () => {
    setDiary(false);
    setEntry(false);
    setLoading(true);
    setStatus(true);
    setPast(false);
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/assignedDetails?projectCode=${projectCode}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      setLoading(false);
      if (response.ok) {
        const data = await response.json();
        setAssigned(data);
      } else {
        console.log("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error handling tasks:", error);
    }
  };

  const handleDiaryToggle = () => {
    setDiary((prevState) => !prevState);
  };

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const handleEntry = () => {
    setEntry(true);
    setPast(false);
    setLoading(false);
  };

  const handlePast = async () => {
    setEntry(false);
    setPast(true);
    setStatus(false);
    setAllData([]);
    setLoading(true);
    try {
      const projectCode = sessionStorage.getItem("projectCode");
      const response = await fetch(
        `http://localhost:5000/api/auth/diaryrepo?projectCode=${projectCode}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      
      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        setAllData(data);
      } else {
        notifyFetchPastError();
      }
    } catch (error) {
      console.log(error);
    }

    console.log(allData);
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
        `http://localhost:5000/api/auth/diaryentry?projectCode=${projectCode}`,
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
        setTextData("");
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
      <div className="navbar navbar-expand-lg navbar-dark bg-info" style={{ height: "4rem" }}>
        <div className="container d-flex justify-content-start">
          <button className="navbar-toggler-lg bg-info text-white fs-5 border-0" onClick={toggleDropdown}>
            <IoMenuSharp className="navbar-toggler-icon" />
          </button>
          <a className="navbar-brand ms-5" href="/">
            <h1 className="fs-1 ms-3 p-2">ClassSync</h1>
          </a>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-3 col-lg-2">
            <div className="position-fixed start-0 bg-dark min-vh-100 p-4 sidebar">
              <ul className="list-unstyled">
                <li className="pb-3 fs-5">
                  <NavLink className="text-white text-decoration-none" to="/studentshome">
                    Home
                  </NavLink>
                </li>
                <li className="pb-3 fs-5">
                  <NavLink className="text-white text-decoration-none" onClick={handleTasks}>
                    Task details
                  </NavLink>
                </li>
                <li className="pb-3 fs-5">
                  <NavLink className="text-white text-decoration-none" onClick={handleDiaryToggle}>
                    Diary Entry
                  </NavLink>
                </li>
                {diary && (
                  <div>
                    <li className="pb-3 fs-5">
                      <NavLink className="text-white text-decoration-none" onClick={handleEntry}>New Entry</NavLink>
                    </li>
                    <li className="pb-3 fs-5">
                      <NavLink className="text-white text-decoration-none" onClick={handlePast}>Past Entries</NavLink>
                    </li>
                  </div>
                )}
              </ul>
            </div>
          </div>

          <div className="col-md-9 col-lg-10">
            {loading ? (
              <Loader />
            ) : status && !entry && !past ? (
              <div className="assignedContainer d-flex flex-wrap justify-content-around">
                {assigned.length ? (
                  assigned.map((task, index) => (
                    <div key={index} className="mt-5 card m-2 p-3 w-auto bg-gradient bg-secondary fs-5">
                      <p>
                        <span className="text-dark">Task Name :</span>{" "}
                        <span className="text-white">{task.taskName}</span>
                      </p>
                      <p>
                        <span className="text-dark">Task theme :</span>{" "}
                        <span className="text-white">{task.theme}</span>
                      </p>
                      <p>
                        <span className="text-dark">Task Description :</span>{" "}
                        <span className="text-white">{task.description}</span>
                      </p>
                      <p>
                        <span className="text-dark">Last Submission :</span>{" "}
                        <span className="text-white" style={{ width: "100%" }}>{task.deadline}</span>
                      </p>
                      <div className="d-flex justify-content-center mt-3">
                        <div className="me-2">
                          <button className="btn btn-warning">Complete task</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="error text-center w-100">
                    <h1>No tasks are assigned..</h1>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {entry && (
          <div className="row  " style={{position:"absolute",top:"50%", left : "55%", transform : "translate(-50%,-50%)"}}>
            <textarea
              className="form-control border-3 border-secondary rounded-4"
              name="data"
              id="data"
              cols="85"
              rows="15"
              value={textData}
              onChange={(e) => setTextData(e.target.value)}
              placeholder="Your diary entry.."
            />
            <div className="text-center mt-3">
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
        )}
      </form>

      {past && (
        <div className="container mt-5">
          {allData.length > 0 ? (
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
          ) : (
            <div className="container mt-5 fs-4 text-center w-50">
                  <p className="alert alert-info">There is no past diary entries are available</p>
                </div>
           
          )}
        </div>
      )}
    </>
  );
}

export default StudentSubmissions;
