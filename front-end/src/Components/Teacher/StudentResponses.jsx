import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";

const TaskResponses = ({ taskId, flag }) => {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [taskDetails, setTasks] = useState([]);
  const [taskResponses, setTaskResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("responses");

  useEffect(() => {
    if (!taskId) {
      return;
    }
    const fetchTaskResponses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/getTaskResponses?taskId=${taskId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTaskResponses(data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Unable to fetch task responses right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskResponses();
  }, [taskId, flag, baseURL, token, toast]);

  const handleFetchTasks = async () => {
    try {
      const response = await fetch(
        `${baseURL}/api/auth/fetchtasks?taskId=${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        console.log("fetched", data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleFetchTasks();
  }, [taskId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mt-5">
        <div>
          <ul className="d-flex justify-content-between ">
            <li>
              <NavLink
                className="text-decoration-none fs-3 pe-2"
                onClick={() => handleTabChange("details")}
              >
                Task Details
              </NavLink>
            </li>
            <li>
              <NavLink
                className="text-decoration-none fs-3"
                onClick={() => handleTabChange("responses")}
              >
                Responses
              </NavLink>
            </li>
          </ul>
        </div>
        <hr style={{ borderTop: "2px solid #007bff", opacity: "0.5" }} />

        {loading ? (
          <Loader />
        ) : activeTab === "responses" ? (
          taskResponses.length > 0 ? (
            taskResponses.map((response, index) => (
              <div key={index} className="col-md-12 mb-4">
                <div className="border border-secondary border-2 rounded p-3 bg-light">
                  <div className="mb-3">
                    <ul>
                      <li>
                        <strong>Student email:</strong> {response.user.email}
                      </li>
                      <li>
                        <strong>Student name:</strong> {response.user.name}
                      </li>
                    </ul>
                  </div>
                  <textarea
                    className="form-control mb-3"
                    rows="6"
                    value={response.solution}
                    readOnly
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="container mt-5 fs-4 text-center w-50">
              <p className="alert alert-info">
                There are no task responses available
              </p>
            </div>
          )
        ) : (
          <div className="container mt-5">
            {taskDetails.length > 0 ? (
              taskDetails.map((taskObj, index) => (
                <div key={index} className="col-md-12 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-info fw-bold text-center mb-3">
                        {taskObj.taskName}
                      </h5>
                      <p className="card-text">
                        <strong>Theme:</strong> {taskObj.theme}
                      </p>
                      <p className="card-text">
                        <strong>Description:</strong> {taskObj.description}
                      </p>
                      <p className="card-text">
                        <strong>Deadline : </strong> {taskObj.deadline}
                      </p>

                      {taskObj.filename && (
                        <p className="card-text">
                          <strong>Files:</strong> {taskObj.fileOriginal}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No details found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskResponses;
