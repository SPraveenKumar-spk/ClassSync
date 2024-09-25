// StudentResponses.js
import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";

const StudentResponses = ({ taskId, onClose }) => {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("taskId", taskId);
  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/getTaskResponses?taskId=${taskId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          setResponses(data);
        } else {
          toast.error("Failed to fetch student responses.");
        }
      } catch (error) {
        toast.error("Error fetching student responses.");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [taskId, baseURL, token, toast]);

  return (
    <div className="modal fade show" id="studentResponsesModal" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Student Responses</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <Loader />
            ) : responses.length ? (
              <div>
                {responses.map((response, index) => (
                  <div key={index} className="mb-4">
                    <div className="card p-3 bg-light">
                      {/* <p>
                          <strong>Student Name:</strong> {response.studentName}
                        </p>
                        <p>
                          <strong>Submitted On:</strong> {response.submissionDate}
                        </p> */}
                      <p>
                        <strong>Solution:</strong> {response.solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-warning text-center">
                No student responses available.
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResponses;
