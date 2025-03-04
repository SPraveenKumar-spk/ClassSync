import { useState } from "react";
import { useToast } from "../../store/ToastContext";
import { ImSpinner9 } from "react-icons/im";
import { useAuth } from "../../store/auth";
import { FaPencilAlt, FaCheckCircle } from "react-icons/fa";

const NewDiaryEntry = () => {
  const { toast } = useToast();
  const { token, baseURL } = useAuth();
  const [textData, setTextData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const projectCode = sessionStorage.getItem("projectCode");
      const currentDate = new Date();
      const dateOnly = currentDate.toISOString().split("T")[0];
      const optionsTime = {
        timeZone: "Asia/Kolkata",
        timeStyle: "medium",
      };
      const time = currentDate.toLocaleTimeString("en-IN", optionsTime);
      const dayOfWeek = currentDate.toLocaleDateString("en-IN", {
        weekday: "long",
      });

      const response = await fetch(
        `${baseURL}/api/auth/diaryentry?projectCode=${projectCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: textData,
            date: dateOnly,
            time: time,
            dayOfWeek: dayOfWeek,
          }),
        }
      );

      if (response.ok) {
        setTextData("");
        toast.success("Your diary entry has been saved successfully!");
      } else {
        toast.error("Error saving diary entry.");
      }
    } catch (error) {
      console.error("Error submitting diary entry:", error);
      toast.error("Failed to save diary entry due to an error."); // more informative error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-indigo-600 py-4 px-6 text-white flex items-center">
            <FaPencilAlt className="mr-3 text-xl" />
            <h2 className="text-2xl font-semibold">New Diary Entry</h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none shadow-sm"
                rows="10"
                value={textData}
                onChange={(e) => setTextData(e.target.value)}
                placeholder="Write your diary entry here..."
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors duration-300 disabled:opacity-50"
                disabled={loading}
              >
                {loading && <ImSpinner9 className="animate-spin" size={20} />}
                <FaCheckCircle className="mr-2" />
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDiaryEntry;
