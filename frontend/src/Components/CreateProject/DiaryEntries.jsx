import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Loader from "../Loader";
import {
  FaComment,
  FaCheck,
  FaCalendarAlt,
  FaClock,
  FaUser,
} from "react-icons/fa";

export default function StudentStatus() {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [feed, setFeed] = useState(-1);
  const [diaryData, setDiaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");
  const [marks, setMarks] = useState("");

  const notifySuccess = () => toast.success("Feedback submitted successfully!");
  const notifyError = () => toast.error("Failed to submit feedback.");

  const handleFeed = (index) => {
    setFeed(index);
    setComments("");
    setMarks("");
  };

  const handleFeedbackSubmit = async (diaryId) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/submitFeedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ diaryId, comments, marks }),
      });
      if (response.ok) {
        notifySuccess();
        setFeed(-1);
      } else {
        notifyError();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      notifyError();
    }
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const projectCode = sessionStorage.getItem("projectCode");
        const response = await fetch(
          `${baseURL}/api/auth/studentdiaryrepo?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setDiaryData(data);
        } else {
          toast.error("Failed to fetch diary entries.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to fetch diary entries.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [baseURL, token, toast]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Student Diary Entries
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : diaryData.length ? (
          <div className="space-y-6">
            {diaryData.map((info, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="flex items-center text-lg font-semibold text-gray-700">
                      <FaUser className="mr-2 text-indigo-500" />{" "}
                      {info.user.email}
                    </h5>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-gray-600 flex items-center justify-end">
                      <FaCalendarAlt className="mr-1 text-indigo-500" />{" "}
                      {new Date(info.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 flex items-center justify-end">
                      <FaClock className="mr-1 text-indigo-500" /> {info.time}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow duration-200"
                    rows="6"
                    value={info.data}
                    readOnly
                  />
                </div>
                {feed === index ? (
                  <div className="mt-4">
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Comments:
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow duration-200"
                        rows="2"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Marks:
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow duration-200"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                      />
                    </div>
                    <div className="text-right">
                      <button
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 flex items-center justify-center"
                        onClick={() => handleFeedbackSubmit(info._id)}
                        disabled={!comments || !marks}
                      >
                        <FaCheck className="mr-2" /> Submit Feedback
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-right mt-3">
                    <button
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 flex items-center justify-center"
                      onClick={() => handleFeed(index)}
                    >
                      <FaComment className="mr-2" /> Give Feedback
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No diary entries available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
