import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";

const AssignedTasks = () => {
  const { baseURL, token, userRole } = useAuth();
  const { toast } = useToast();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [solution, setSolution] = useState("");
  const [showDetails, setShowDetails] = useState(false); // State to toggle task details

  const notifySuccess2 = () => {
    toast.success("Task deleted successfully");
  };

  const notifyError = (message) => {
    toast.error(message || "Failed to perform the operation.");
  };

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const projectCode = sessionStorage.getItem("projectCode");
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
  }, [status, baseURL, token]);

  const handleDelete = async (taskId) => {
    const val = window.confirm("Are you sure to delete the task?");
    if (val) {
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
          notifySuccess2();
        } else {
          notifyError("Failed to delete task.");
        }
      } catch (error) {
        console.log(error);
        notifyError("An error occurred while deleting the task.");
      }
    }
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
    setSolution(""); // Reset solution
    setShowDetails(false); // Reset details visibility
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
    setShowDetails(false); // Reset details visibility
  };

  const handleSubmitSolution = async (taskId) => {
    if (!solution) {
      notifyError("Please enter your solution.");
      return;
    }
    // Handle the solution submission logic here
    console.log("Task ID:", taskId);
    console.log("Submitted Solution:", solution);
    notifySuccess2();
    handleCloseModal();
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {loading ? (
            <Loader />
          ) : assigned.length ? (
            assigned.map((task, index) => (
              <div key={index} className="mb-4">
                <div className="card p-3 bg-secondary text-white">
                  <div className="card-body">
                    <p className="card-text">
                      <strong className="text-warning">Task Name:</strong>{" "}
                      {task.taskName}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Task Theme:</strong>{" "}
                      {task.theme}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Last Date:</strong>{" "}
                      {task.deadline}
                    </p>
                    {task.filename && (
                      <div className="mb-3">
                        <strong className="text-warning">Attached File:</strong>
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
                        <button className="btn btn-light fs-5 pe-3">
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(task.taskId)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <button
                          className="btn btn-outline-info"
                          onClick={() => handleOpenModal(task)}
                        >
                          Submit Task
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-danger text-center">No tasks ..</div>
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
              <h5 className="modal-title " id="submitTaskModalLabel">
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
                {showDetails && (
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
                      <strong style={{ color: "purple" }}>Deadline: </strong>
                      {selectedTask.deadline}
                    </p>
                    {selectedTask.filename && (
                      <p>
                        <strong style={{ color: "purple" }}>
                          Attached File:{" "}
                        </strong>
                        <a
                          href="#"
                          onClick={() => handleViewFile(selectedTask.filename)}
                        >
                          {selectedTask.fileOriginal}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
              {selectedTask && (
                <textarea
                  className="form-control"
                  rows="5"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Enter your solution here..."
                ></textarea>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => handleSubmitSolution(selectedTask.taskId)}
              >
                Submit
              </button>
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedTasks;
