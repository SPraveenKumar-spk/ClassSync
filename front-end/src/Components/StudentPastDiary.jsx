import React, { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useToast } from "../store/ToastContext";
import Loader from "./Loader";

const PastDiaryEntries = () => {
  const { baseURL } = useAuth();
  const { toast } = useToast();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectCode, setProjectCode] = useState(
    sessionStorage.getItem("projectCode")
  );
  const [fetchError, setFetchError] = useState(null);

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
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAllData(data);
        } else {
          notifyFetchPastError();
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
    <div className="container ps-5 mt-5">
      {loading ? (
        <Loader />
      ) : allData.length > 0 ? (
        allData.map((info, index) => (
          <div
            key={index}
            className="row mb-3 border border-secondary border-2 rounded p-3"
          >
            <div className="col-md-12 mb-3">
              <h3>Date : {info.date}</h3>
              <h3>Time : {info.time}</h3>
              <h3>Day : {info.dayOfWeek}</h3>
            </div>
            <textarea
              className="form-control"
              name="data"
              id="data"
              cols="85"
              rows="10"
              value={info.data}
              readOnly
            />
            {info.comments && (
              <div>
                <div className="col-md-12 mt-3">
                  <span>Feedback:</span>
                  <p>
                    <span>Comments: </span>
                    {info.comments}
                  </p>
                  <p>
                    <span>Marks: </span>
                    {info.marks}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="container mt-5 fs-4 text-center w-50">
          <p className="alert alert-info">
            There are no past diary entries available
          </p>
        </div>
      )}
    </div>
  );
};

export default PastDiaryEntries;
