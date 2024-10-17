import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";

const PastDiaryEntries = () => {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const projectCode = sessionStorage.getItem("projectCode");
  const notifyFetchPastError = () => {
    toast.error("Unable to fetch your past entries right now.");
  };

  useEffect(() => {
    const fetchPastEntries = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/diaryrepo?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAllData(data);
        }
      } catch (error) {
        console.log(error);
        notifyFetchPastError();
      } finally {
        setLoading(false);
      }
    };

    fetchPastEntries();
  }, [baseURL, projectCode, toast]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : allData.length > 0 ? (
          allData.map((info, index) => (
            <div key={index} className="col-md-8 mb-4">
              <div className="border border-secondary border-2 rounded p-3 bg-light">
                <div className="mb-3">
                  <h5>Date: {info.date}</h5>
                  <h5>Time: {info.time}</h5>
                  <h5>Day: {info.dayOfWeek}</h5>
                </div>
                <textarea
                  className="form-control mb-3"
                  name="data"
                  id="data"
                  rows="8"
                  value={info.data}
                  readOnly
                  style={{ resize: "none" }}
                />
                {info.comments && (
                  <div className="mt-3">
                    <h6>Feedback:</h6>
                    <p>
                      <strong>Comments: </strong>
                      {info.comments}
                    </p>
                    <p>
                      <strong>Marks: </strong>
                      {info.marks}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="container mt-5 fs-4 text-center w-75 ">
            <p className="alert alert-info">No diary entries available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastDiaryEntries;
