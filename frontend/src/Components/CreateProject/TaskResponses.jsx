import { useState, useEffect } from "react";
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
    if (!taskId) return;
    const fetchTaskResponses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/getTaskResponses?taskId=${taskId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          setTaskResponses(await response.json());
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

  useEffect(() => {
    const handleFetchTasks = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/auth/fetchtasks?taskId=${taskId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          setTasks(await response.json());
        }
      } catch (err) {
        console.log(err);
      }
    };
    handleFetchTasks();
  }, [taskId]);

  return (
    <div className="container mx-auto mt-10 p-5">
      <div className="flex justify-center gap-6 border-b-2 border-blue-500 pb-2">
        <button
          className={`text-lg font-semibold ${
            activeTab === "details" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Task Details
        </button>
        <button
          className={`text-lg font-semibold ${
            activeTab === "responses" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("responses")}
        >
          Responses
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : activeTab === "responses" ? (
        taskResponses.length > 0 ? (
          taskResponses.map((response, index) => (
            <div
              key={index}
              className="bg-gray-100 p-5 rounded-lg shadow-md mt-5"
            >
              <p className="text-lg font-medium">
                Student Email: {response.user.email}
              </p>
              <p className="text-lg font-medium">
                Student Name: {response.user.name}
              </p>
              <textarea
                className="w-full mt-3 p-3 bg-white rounded border-gray-300"
                rows="6"
                value={response.solution}
                readOnly
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-5">
            No responses available.
          </p>
        )
      ) : (
        <div className="mt-5">
          {taskDetails.length > 0 ? (
            taskDetails.map((taskObj, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-lg shadow-md mt-5"
              >
                <h3 className="text-xl font-bold text-blue-600 text-center">
                  {taskObj.taskName}
                </h3>
                <p>
                  <strong>Theme:</strong> {taskObj.theme}
                </p>
                <p>
                  <strong>Description:</strong> {taskObj.description}
                </p>
                <p>
                  <strong>Deadline:</strong> {taskObj.deadline}
                </p>
                {taskObj.filename && (
                  <p>
                    <strong>Files:</strong> {taskObj.fileOriginal}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No details found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskResponses;
