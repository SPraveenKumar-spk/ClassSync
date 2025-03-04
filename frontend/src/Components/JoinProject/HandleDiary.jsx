import { useState } from "react";
import Loader from "../Loader";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";

function HandleDiary() {
  const { toast } = useToast();
  const { baseURL } = useAuth();
  const [entry, setEntry] = useState(false);
  const [past, setPast] = useState(false);
  const [textData, setTextData] = useState("");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleEntry = () => {
    setEntry(true);
    setPast(false);
  };

  const handlePast = async () => {
    setEntry(false);
    setPast(true);
    setLoading(true);
    try {
      const projectCode = sessionStorage.getItem("projectCode");
      const response = await fetch(
        `${baseURL}/api/auth/diaryrepo?projectCode=${projectCode}`,
        { method: "GET" }
      );
      if (response.ok) {
        const data = await response.json();
        setAllData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const projectCode = sessionStorage.getItem("projectCode");
      const currentDate = new Date();
      const dateOnly = currentDate.toISOString().split("T")[0];
      const time = currentDate.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        timeStyle: "medium",
      });
      const dayOfWeek = currentDate.toLocaleDateString("en-IN", {
        weekday: "long",
      });

      const response = await fetch(
        `${baseURL}/api/auth/diaryentry?projectCode=${projectCode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: textData,
            date: dateOnly,
            time,
            dayOfWeek,
          }),
        }
      );

      response.ok
        ? toast.success("Your Entry is successful")
        : toast.error("Failed to make the entry");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={handleEntry}
          >
            New Entry
          </button>
          <button
            className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            onClick={handlePast}
          >
            Past Entries
          </button>
        </div>

        {entry && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              rows="6"
              value={textData}
              onChange={(e) => setTextData(e.target.value)}
              placeholder="Enter your diary entry..."
            />
            <div className="text-center">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Submit
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <Loader />
        ) : (
          past &&
          allData.length > 0 && (
            <div className="mt-6 space-y-4">
              {allData.map((info, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-5 rounded-lg border border-gray-300 shadow-sm"
                >
                  <p className="text-gray-700">
                    <span className="font-semibold">Date:</span> {info.date}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Time:</span> {info.time}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Day:</span> {info.dayOfWeek}
                  </p>
                  <textarea
                    className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg mt-3 resize-none"
                    rows="6"
                    value={info.data}
                    readOnly
                  />
                  {info.comments && (
                    <div className="mt-3 p-3 bg-white border border-gray-300 rounded-lg">
                      <h3 className="font-semibold text-gray-700">Feedback</h3>
                      <p className="text-gray-600">
                        <span className="font-semibold">Comments:</span>{" "}
                        {info.comments}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Marks:</span>{" "}
                        {info.marks}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default HandleDiary;
