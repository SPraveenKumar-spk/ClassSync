import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";
import TaskResponses from "../CreateProject/TaskResponses";
import { FaTrash, FaReply, FaFileAlt, FaEye } from "react-icons/fa";

const AdminAssignedTasks = () => {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("tasks");

  const notifySuccess = () => toast.success("Task deleted successfully");
  const notifyError = (message) =>
    toast.error(message || "Failed to perform the operation.");

  const projectCode = sessionStorage.getItem("projectCode");

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/assignedDetails?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
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

    if (!status) fetchAssigned();
  }, [status, baseURL, token, projectCode, notifyError]);

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
          setAssigned((prev) => prev.filter((task) => task.taskId !== taskId));
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

  const handleBackToTasks = () => setView("tasks");

  const handleViewFile = async (filename) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/file/${filename}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      } else {
        notifyError("Failed to retrieve file");
        console.error("Failed to retrieve file");
      }
    } catch (error) {
      notifyError("Error viewing file");
      console.error("Error viewing file:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Admin Assigned Tasks
        </h1>
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : view === "tasks" ? (
          assigned.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assigned.map((task, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <div className="p-6">
                    <p className="text-gray-600 mb-2">
                      <strong className="text-xl font-semibold text-indigo-500">
                        Title:
                      </strong>{" "}
                      {task.taskName}
                    </p>

                    <p className="text-gray-600 mb-2">
                      <strong className="text-indigo-500">Theme:</strong>{" "}
                      {task.theme}
                    </p>
                    <p className="text-gray-600 mb-3">
                      <strong className="text-indigo-500">Description:</strong>{" "}
                      {task.description}
                    </p>
                    <p className="text-gray-600 mb-3">
                      <strong className="text-indigo-500">Deadline:</strong>{" "}
                      {task.deadline}
                    </p>

                    <p className="text-gray-600 mb-3 flex gap-2">
                      <strong className="text-indigo-500">Attachment:</strong>{" "}
                      {task.filename ? (
                        <button
                          onClick={() => handleViewFile(task.filename)}
                          className="text-blue-500 hover:underline flex  items-center"
                        >
                          <FaFileAlt className="mr-1" />
                          {task.fileOriginal}
                        </button>
                      ) : (
                        "None"
                      )}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex justify-center space-x-4 mt-auto">
                    <button
                      onClick={() => handleViewResponses(task.taskId)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
                    >
                      <FaEye className="mr-2" />
                      Responses
                    </button>
                    <button
                      onClick={() => handleDelete(task.taskId)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No tasks found.</div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mb-4 flex items-center"
              onClick={handleBackToTasks}
            >
              <FaReply className="mr-2" />
              Back to Tasks
            </button>
            <TaskResponses taskId={selectedTask} flag={status} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAssignedTasks;
