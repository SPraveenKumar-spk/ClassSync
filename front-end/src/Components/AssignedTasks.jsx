import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useToast } from "../store/ToastContext";
import Loader from "./Loader";

const AssignedTasks = () => {
  const { baseURL, token } = useAuth();
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
    const val = window.confirm("Are you sure to delete the task. ?");
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
                      <strong className="text-warning">Task Name : </strong>{" "}
                      {task.taskName}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Task Theme :</strong>{" "}
                      {task.theme}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Description : </strong>{" "}
                      {task.description}
                    </p>
                    <p className="card-text">
                      <strong className="text-warning">Last Date : </strong>{" "}
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
