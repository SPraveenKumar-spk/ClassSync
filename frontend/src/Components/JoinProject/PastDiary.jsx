import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";
import { FaCalendarAlt, FaClock, FaCommentDots, FaSun } from "react-icons/fa";

const PastDiaryEntries = () => {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const projectCode = sessionStorage.getItem("projectCode");

  useEffect(() => {
    const fetchPastEntries = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/diaryrepo?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAllData(data);
        } else {
          toast.error("Failed to fetch past diary entries.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to fetch your past entries right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPastEntries();
  }, [baseURL, projectCode, token, toast]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-4 sm:mb-6">
          Past Diary Entries
        </h2>
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : allData.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {" "}
            {allData.map((info, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200" // Adjust rounded and padding
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4">
                  {" "}
                  <div className="text-gray-600 flex items-center mb-1 sm:mb-0">
                    {" "}
                    <FaCalendarAlt className="mr-2 text-indigo-500" />
                    {info.date}
                  </div>
                  <div className="text-gray-600 flex items-center mb-1 sm:mb-0">
                    <FaClock className="mr-2 text-indigo-500" />
                    {info.time}
                  </div>
                  <div className="text-gray-600 flex items-center">
                    <FaSun className="mr-2 text-indigo-500" />
                    {info.dayOfWeek}
                  </div>
                </div>

                <div className="mb-2 sm:mb-4">
                  <textarea
                    className="w-full p-2 sm:p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md sm:rounded-lg shadow-sm resize-none" // Adjust padding and rounded
                    rows="4"
                    value={info.data}
                    readOnly
                  />
                </div>

                {info.comments && (
                  <div className="mt-2 sm:mt-4 p-3 sm:p-4 bg-gray-50 border border-gray-300 rounded-md sm:rounded-lg">
                    {" "}
                    <h3 className="font-semibold text-gray-700 flex items-center">
                      <FaCommentDots className="mr-2 text-indigo-500" />{" "}
                      Feedback
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-semibold">Comments:</span>{" "}
                      {info.comments}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Marks:</span> {info.marks}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-6">
            <p>No diary entries available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastDiaryEntries;
