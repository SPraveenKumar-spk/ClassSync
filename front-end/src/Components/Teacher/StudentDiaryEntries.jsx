import { useState, useEffect } from "react";
import Loader from "../Loader";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";

export default function StudentStatus() {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [feed, setFeed] = useState(-1);
  const [diaryData, setDiaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");
  const [marks, setMarks] = useState("");

  const notifySuccess = () => toast.success("Feedback submitted successfully");
  const notifyError = () => toast.error("Failed to submit feedback");

  const handleFeed = (index) => {
    setFeed(index);
    setComments("");
    setMarks("");
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
      } else {
        notifyError();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setComments("");
      setMarks("");
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

    fetchDiaries();
  }, [baseURL, token]);

  return (
    <div className="container pt-5 mt-5">
      {loading ? (
        <Loader />
      ) : (
        <div className="d-flex justify-content-center">
          <div className="col-md-8">
            {diaryData.length ? (
              diaryData.map((info, index) => (
                <div
                  key={index}
                  className="mb-4 border border-secondary border-2 rounded p-4 bg-light"
                >
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h5>Email: {info.user.email}</h5>
                    </div>
                    <div className="col-md-6 text-end">
                      <h5>Date: {new Date(info.date).toLocaleDateString()}</h5>
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
                          disabled={!comments || !marks}
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
      )}
    </div>
  );
}
