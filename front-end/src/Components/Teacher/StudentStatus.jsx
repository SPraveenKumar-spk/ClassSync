import { useState, useEffect } from "react";
import Loader from "../Loader";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";
import TaskResponses from "./TaskResponses";

export default function StudentStatus() {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [diarybtn, setDiarybtn] = useState(false);
  const [feed, setFeed] = useState(-1);
  const [diaryData, setDiaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");
  const [marks, setMarks] = useState("");

  const [submissionFlag, setSubmissions] = useState(false);

  const notifySuccess = () => toast.success("Feedback submitted successfully");
  const notifyError = () => toast.error("Failed to submit feedback");

  const taskSubmissions = () => {
    setDiarybtn(false);
    setSubmissions(true);
  };

  const diaryEntries = () => {
    setDiarybtn(true);
    setSubmissions(false);
  };

  const handleFeed = (index) => {
    setFeed(index);
  };

  const handleFeedbackSubmit = async (diaryId) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/submitFeedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ diaryId, comments, marks }),
      });
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
          `${baseURL}/api/auth/studentdiaryrepo?projectCode=${projectCode}`,
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
      fetchDiaries();
    }
  }, [diarybtn]);

  return (
    <div className="container pt-5 mt-5">
      <div className="d-flex justify-content-around mb-3 flex-wrap gap-5">
        <div>
          <button className="btn btn-primary fs-5" onClick={taskSubmissions}>
            Task Submissions
          </button>
        </div>
        <div>
          <button className="btn btn-primary fs-5" onClick={diaryEntries}>
            Diary Entries
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        diarybtn && (
          <div className="d-flex justify-content-center">
            <div className="col-md-8">
              {diaryData.length ? (
                diaryData.map((info, index) => (
                  <div
                    key={index}
                    className="mb-4 border border-secondary border-2 rounded p-4 bg-light"
                  >
                    {" "}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h5>Email: {info.user.email}</h5>
                      </div>
                      <div className="col-md-6 text-end">
                        <h5>
                          Date: {new Date(info.date).toLocaleDateString()}
                        </h5>
                        <h5>Time: {info.time}</h5>
                        <h5>Day: {info.dayOfWeek}</h5>
                      </div>
                    </div>
                    <textarea
                      className="form-control mb-3"
                      rows="8"
                      value={info.data}
                      readOnly
                      style={{ resize: "none" }}
                    />
                    <div className="text-end">
                      <button
                        className="btn btn-success"
                        onClick={() => handleFeed(index)}
                      >
                        Give Feedback
                      </button>
                    </div>
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
                        <div className="text-end">
                          <button
                            className="mt-3 btn btn-primary"
                            onClick={() => handleFeedbackSubmit(info._id)}
                          >
                            Submit Feedback
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="mx-auto w-75 mt-5">
                  <p className="alert alert-danger text-center">
                    No diary entries
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      )}
      {submissionFlag && <TaskResponses flag={submissionFlag} />}
    </div>
  );
}
