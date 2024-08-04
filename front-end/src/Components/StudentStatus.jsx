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

  const notifyError = () => toast.error("Failed to submit feedback");
  const notifySubmissionError = () => toast.error("There is no task submissions till now.. ")
  const taskSubmissions = () => {
    setTaskbtn(true);
    setDiarybtn(false);
    notifySubmissionError();
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
        "https://class-sync-geht.vercel.app/api/auth/submitFeedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ diaryId, comments, marks }),
          credentials: 'include',
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
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const projectCode = sessionStorage.getItem("projectCode");
        const response = await fetch(
          `https://class-sync-geht.vercel.app/api/auth/studentdiaryrepo?projectCode=${projectCode}`,
          {
            method: "GET",
            credentials: 'include',
          },
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
      fetchDiaries();
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
      <div className="container py-3 " style={{width:"70%"}}>
        <div className="d-flex justify-content-around mb-3 flex-wrap gap-5">
          <div>
            <button className="btn btn-primary fs-5" onClick={taskSubmissions}>Task Submissions</button>
          </div>
          <div >
            <button className="btn btn-primary fs-5" onClick={diaryEntries}>Diary Entries</button>
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
                  <div key={index} className="mb-3 border border-secondary border-3 rounded p-3">
                    <div className="row">
                      <div className="col-md-6">
                        <h3>Email: {info.user.email}</h3>
                      </div>
                      <div className="col-md-6">
                        <h3>Date: {new Date(info.date).toLocaleDateString()}</h3>
                        <h3>Time: {info.time}</h3>
                        <h3>Day: {info.dayOfWeek}</h3>
                      </div>
                    </div>
                    <textarea
                      style={{borderWidth:"5px"}}
                      name="data"
                      id="data"
                      className="form-control mt-3"
                      rows="8"
                      value={info.data}
                      readOnly
                    />
                    <div className="mt-3">
                      <button className="btn btn-success" onClick={() => handleFeed(index)}>Give Feedback</button>
                      {feed === index && (
                        <div className="mt-3">
                          <div className="form-group">
                            <label>Comments:</label>
                            <textarea
                              className="form-control"
                              rows="2"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                            />
                          </div>
                          <div className="mt-3 form-group">
                            <label>Marks:</label>
                            <input
                              type="text"
                              className="form-control"
                              value={marks}
                              onChange={(e) => setMarks(e.target.value)}
                            />
                          </div>
                          <button className=" mt-4 btn btn-primary" onClick={() => handleFeedbackSubmit(info._id)}>
                            Submit Feedback
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="container mt-5  text-center " style={{width:"auto"}}>
                  <p className="alert alert-danger">No diary entries</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}
