import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";
import {
  FaFileAlt,
  FaLink,
  FaTimes,
  FaCheckCircle,
  FaEye,
} from "react-icons/fa";
const AssignedTasks = () => {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [solution, setSolution] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        if (!response.ok) throw new Error("Failed to fetch tasks.");
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      if (!response.ok) throw new Error("Failed to submit your solution.");
      toast.success("Your response has been submitted successfully.");
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || "Server error. Please try again later.");
    }
  };

  const handleViewFile = async (filename) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/file/${filename}`);
      if (!response.ok) throw new Error("Failed to retrieve file.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error(error.message || "Error viewing file.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Assigned Tasks
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : assigned.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assigned.map((task) => (
              <div
                key={task.taskId}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="p-6">
                  <p className="text-gray-600 mb-3 flex items-center">
                    <strong className="text-indigo-500 mr-2">Task Name:</strong>{" "}
                    {task.taskName}
                  </p>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <strong className="text-indigo-500 mr-2">
                      Task Theme:
                    </strong>{" "}
                    {task.theme}
                  </p>
                  <p className="text-gray-600 mb-3">
                    <strong className="text-indigo-500 mr-2">
                      Description:
                    </strong>{" "}
                    {task.description}
                  </p>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <strong className="text-indigo-500 mr-2">Last Date:</strong>{" "}
                    {task.deadline}
                  </p>
                  {task.filename && (
                    <div className="mb-4 flex items-center">
                      <strong className="text-indigo-500 mr-2">
                        Attachment:
                      </strong>
                      <button
                        onClick={() => handleViewFile(task.filename)}
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        <FaFileAlt className="mr-1" /> {task.fileOriginal}
                      </button>
                    </div>
                  )}
                </div>
                <div className="bg-gray-100 p-4 border-t border-gray-200 text-center mt-auto">
                  {" "}
                  <button
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center mx-auto"
                    onClick={() => handleOpenModal(task)}
                  >
                    <FaCheckCircle className="mr-2" /> Submit Response
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
            No tasks available.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-200 transform transition-all duration-300 flex flex-col">
            {" "}
            <div className="flex justify-between items-center mb-5">
              <h5 className="text-xl font-semibold text-gray-800">
                Submit Task:{" "}
                <span className="text-indigo-500">
                  {selectedTask?.taskName || ""}
                </span>
              </h5>
              <button
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors duration-200"
                onClick={handleCloseModal}
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-grow">
              {" "}
              <button
                className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors duration-200 mb-4 flex items-center justify-center"
                onClick={() => setShowDetails((prev) => !prev)}
              >
                <FaEye className="mr-2" />{" "}
                {showDetails ? "Hide Task Details" : "View Task Details"}
              </button>
              {showDetails && selectedTask && (
                <div className="mb-5 p-4 bg-gray-50 rounded-lg text-gray-700">
                  <p className="mb-2 flex items-center">
                    <strong className="text-indigo-500 mr-2">Task Name:</strong>{" "}
                    {selectedTask.taskName}
                  </p>
                  <p className="mb-2 flex items-center">
                    <strong className="text-indigo-500 mr-2">
                      Task Theme:
                    </strong>{" "}
                    {selectedTask.theme}
                  </p>
                  <p className="mb-2">
                    <strong className="text-indigo-500 mr-2">
                      Description:
                    </strong>{" "}
                    {selectedTask.description}
                  </p>
                  <p className="flex items-center">
                    <strong className="text-indigo-500 mr-2">Last Date:</strong>{" "}
                    {selectedTask.deadline}
                  </p>
                  {selectedTask.filename && (
                    <div className="mt-3 flex items-center">
                      <strong className="text-indigo-500 mr-2">
                        Attachment:
                      </strong>
                      <button
                        onClick={() => handleViewFile(selectedTask.filename)}
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        <FaLink className="mr-1" /> View Attachment
                      </button>
                    </div>
                  )}
                </div>
              )}
              <textarea
                className="w-full p-3 border border-gray-300 rounded-xl mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                rows="5"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Enter your solution here..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                onClick={handleSubmitSolution}
              >
                <FaCheckCircle className="mr-2" /> Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;
