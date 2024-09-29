import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";
import TaskResponses from "../Teacher/StudentResponses";

const AssignedTasks = () => {
  const { baseURL, token, userRole } = useAuth();
  const { toast } = useToast();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("tasks");
  const [solution, setSolution] = useState(""); // Added state for solution
  const [showDetails, setShowDetails] = useState(false); // Added state for showing details

  const notifySuccess = () => {
    toast.success("Task deleted successfully");
  };

  const notifyError = (message) => {
    toast.error(message || "Failed to perform the operation.");
  };

  const projectCode = sessionStorage.getItem("projectCode");

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/assignedDetails?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAssigned(data);
          setStatus(true);
        } else {
          notifyError("Failed to fetch tasks.");
        }
      } catch (error) {
        notifyError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    if (!status) {
      fetchAssigned();
    }
  }, [status, baseURL, token, projectCode]);

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure to delete the task?")) {
      try {
        const response = await fetch(`${baseURL}/api/auth/deletetask`, {
          method: "DELETE",
          body: JSON.stringify({ taskId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setAssigned((prevAssigned) =>
            prevAssigned.filter((task) => task.taskId !== taskId)
          );
          notifySuccess();
        } else {
          notifyError("Failed to delete task.");
        }
      } catch (error) {
        notifyError("An error occurred while deleting the task.");
      }
    }
  };

  const handleViewResponses = (taskId) => {
    setSelectedTask(taskId);
    setView("responses");
  };

  const handleBackToTasks = () => {
    setView("tasks");
  };

  const handleViewFile = async (filename) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/file/${filename}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      } else {
        console.error("Failed to retrieve file");
      }
    } catch (error) {
      console.error("Error viewing file:", error);
    }
  };

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setSolution(""); // Clear previous solution
    setShowDetails(false);
    const modal = new window.bootstrap.Modal(
      document.getElementById("submitTaskModal")
    );
    modal.show();
  };

  const handleCloseModal = () => {
    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("submitTaskModal")
    );
    if (modal) {
      modal.hide();
    }
    setSelectedTask(null);
    setShowDetails(false);
  };

  const handleSubmitSolution = async (taskId) => {
    if (!solution) {
      notifyError("Please enter your solution.");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/api/auth/taskResponse?projectCode=${projectCode}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId, solution }),
        }
      );
      if (response.ok) {
        toast.success("Your response has been submitted successfully.");
        handleCloseModal();
      } else {
        notifyError("Failed to submit your solution.");
      }
    } catch (err) {
      notifyError("Server error. Please try again later.");
      console.log(err);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {loading ? (
            <Loader />
          ) : view === "tasks" ? (
            assigned.length ? (
              assigned.map((task, index) => (
                <div key={index} className="mb-4">
                  <div className="card p-3 bg-secondary text-white">
                    <div className="card-body">
                      <p className="card-text">
                        <strong className="text-warning">Task Name : </strong>
                        {task.taskName}
                      </p>
                      <p className="card-text">
                        <strong className="text-warning">Task Theme : </strong>
                        {task.theme}
                      </p>
                      <p className="card-text">
                        <strong className="text-warning">Description : </strong>
                        {task.description}
                      </p>
                      <p className="card-text">
                        <strong className="text-warning">Last Date : </strong>
                        {task.deadline}
                      </p>
                      {task.filename && (
                        <div className="mb-3">
                          <strong className="text-warning">
                            Attached File :{" "}
                          </strong>
                          <a
                            href="#"
                            onClick={() => handleViewFile(task.filename)}
                            className="text-light"
                          >
                            {task.fileOriginal}
                          </a>
                        </div>
                      )}
                      {userRole === "Teacher" ? (
                        <div className="d-flex justify-content-between mt-5">
                          <button
                            className="btn btn-light fs-5 pe-3"
                            onClick={() => handleViewResponses(task.taskId)}
                          >
                            Student Responses
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(task.taskId)}
                          >
                            Delete Task
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <button
                            className="btn btn-outline-info"
                            onClick={() => handleOpenModal(task)}
                          >
                            Submit Response
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-danger text-center">No tasks ..</div>
            )
          ) : (
            <>
              <button
                className="btn btn-secondary mb-4"
                onClick={handleBackToTasks}
              >
                Back to Tasks
              </button>
              <TaskResponses taskId={selectedTask} flag={status} />
            </>
          )}
        </div>
      </div>

      {/* Modal for submitting task response */}
      <div
        className="modal fade"
        id="submitTaskModal"
        tabIndex="-1"
        aria-labelledby="submitTaskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="submitTaskModalLabel">
                <strong className="text-emphasis">Submit Task: </strong>
                <strong className="text-info">
                  {selectedTask ? selectedTask.taskName : ""}
                </strong>
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="dropdown mt-3 mb-3">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  aria-expanded={showDetails}
                >
                  {showDetails ? "Hide Task Details" : "View Task Details"}
                </button>
                {showDetails && selectedTask && (
                  <div className="mt-2">
                    <p>
                      <strong style={{ color: "purple" }}>Task Name: </strong>
                      {selectedTask.taskName}
                    </p>
                    <p>
                      <strong style={{ color: "purple" }}>Task Theme: </strong>
                      {selectedTask.theme}
                    </p>
                    <p>
                      <strong style={{ color: "purple" }}>Description: </strong>
                      {selectedTask.description}
                    </p>
                    <p>
                      <strong style={{ color: "purple" }}>Last Date: </strong>
                      {selectedTask.deadline}
                    </p>
                  </div>
                )}
              </div>

              <textarea
                className="form-control mb-3"
                rows="5"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Enter your solution here..."
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSubmitSolution(selectedTask?.taskId)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedTasks;
