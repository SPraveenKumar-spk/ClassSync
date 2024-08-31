import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useToast } from "../store/ToastContext";
import { FaEye } from "react-icons/fa";

const AssignedTasks = () => {
  const { baseURL, token } = useAuth(); // Retrieve baseURL and token
  const { toast } = useToast();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

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
        if (!projectCode) {
          notifyError("Project code is missing.");
          return;
        }

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
        console.log(error);
        notifyError("An error occurred while fetching tasks.");
      } finally {
        setLoading(false);
      }
    };

    if (!status) {
      fetchAssigned();
    }
  }, [status, baseURL, token]);

  const handleDelete = async (taskId) => {
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
  };

  const downloadFile = async (filename) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/file/${filename}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      notifyError("Failed to download file.");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {loading ? (
            <div className="text-center">
              <p>Loading tasks...</p>
            </div>
          ) : assigned.length ? (
            assigned.map((task, index) => (
              <div key={index} className="mb-4">
                <div className="card p-3 bg-secondary text-white">
                  <div className="card-body">
                    <p className="card-text">
                      <strong className="text-warning">Task Name: </strong>{" "}
                      {task.taskName}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Task Theme:</strong>{" "}
                      {task.theme}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Description: </strong>{" "}
                      {task.description}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Last Date: </strong>{" "}
                      {task.deadline}
                    </p>

                    {task.file && (
                      <div className="mb-3">
                        <strong className="text-warning">Attached File:</strong>
                        <a
                          href="#"
                          onClick={() => downloadFile(task.file)}
                          className="d-block text-light"
                        >
                          {task.file}
                        </a>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mt-5">
                      <button className="btn btn-light fs-5 pe-3">Edit</button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(task.taskId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-danger text-center">No tasks ..</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignedTasks;
