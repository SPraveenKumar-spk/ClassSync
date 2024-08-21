import React, { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useToast } from "../store/ToastContext";

const AssignedTasks = () => {
  const { baseURL } = useAuth();
  const { toast } = useToast();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const notifySuccess2 = () => {
    toast.success("Task deleted successfully");
  };

  const notifyError = () => {
    toast.error("Failed to delete task");
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
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAssigned(data);
          setStatus(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!status) {
      fetchAssigned();
    }
  }, [status, baseURL]);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/deletetask`, {
        method: "DELETE",
        body: JSON.stringify({ taskId }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        setAssigned((prevAssigned) =>
          prevAssigned.filter((task) => task.taskId !== taskId)
        );
        notifySuccess2();
      } else {
        notifyError();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = (filename) => {
    const url = `${baseURL}/file/${filename}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {!loading && assigned.length ? (
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
                          onClick={() => handleDownload(task.file)}
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
            <div className="alert alert-danger text-center">
              You haven't created any tasks..
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignedTasks;
