import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";

const AssignedTasks = () => {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [solution, setSolution] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const projectCode = sessionStorage.getItem("projectCode");

  useEffect(() => {
    const fetchAssigned = async () => {
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

        if (!response.ok) {
          throw new Error("Failed to fetch tasks.");
        }

        const data = await response.json();
        setAssigned(data);
      } catch (error) {
        toast.error(error.message || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssigned();
  }, [baseURL, token, projectCode, toast]);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setSolution("");
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

  const handleSubmitSolution = async () => {
    if (!solution) {
      toast.error("Please enter your solution.");
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
          body: JSON.stringify({ taskId: selectedTask.taskId, solution }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit your solution.");
      }

      toast.success("Your response has been submitted successfully.");
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || "Server error. Please try again later.");
    }
  };

  const handleViewFile = async (filename) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/file/${filename}`);
      if (!response.ok) {
        throw new Error("Failed to retrieve file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error(error.message || "Error viewing file.");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {loading ? (
            <Loader />
          ) : assigned.length ? (
            assigned.map((task) => (
              <div key={task.taskId} className="mb-4">
                <div className="card p-3 bg-secondary text-white">
                  <div className="card-body">
                    <p className="card-text">
                      <strong className="text-warning">Task Name: </strong>
                      {task.taskName}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Task Theme: </strong>
                      {task.theme}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Description: </strong>
                      {task.description}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Last Date: </strong>
                      {task.deadline}
                    </p>
                    {task.filename && (
                      <div className="mb-3">
                        <strong className="text-warning">
                          Attached File:{" "}
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
                    <div className="text-center">
                      <button
                        className="btn btn-outline-info"
                        onClick={() => handleOpenModal(task)}
                      >
                        Submit Response
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-danger text-center">
              No tasks available.
            </div>
          )}
        </div>
      </div>

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
                  onClick={() => setShowDetails((prev) => !prev)}
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
                onClick={handleSubmitSolution}
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
