import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";

const TaskResponses = ({ flag }) => {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [taskResponses, setTaskResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const projectCode = sessionStorage.getItem("projectCode");
  useEffect(() => {
    const fetchTaskResponses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/getTaskResponses?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("responses", data);
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
  }, [flag]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : taskResponses.length > 0 ? (
          taskResponses.map((response, index) => (
            <div key={index} className="col-md-8 mb-4">
              <div className="border border-secondary border-2 rounded p-3 bg-light">
                <div className="mb-3">
                  <ul>
                    <li>
                      <strong>Student email : </strong>
                      {response.user.email}
                    </li>
                    <li>
                      <strong>Student name :</strong> {response.user.name}
                    </li>
                  </ul>
                </div>
                <textarea
                  className="form-control mb-3"
                  name="solution"
                  id="solution"
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
        )}
      </div>
    </div>
  );
};

export default TaskResponses;
