import { useState } from "react";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";
import { FaBell, FaPaperPlane } from "react-icons/fa";

function Notify() {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [info, setInfo] = useState("");
  const [notificationType, setNotificationType] = useState("general");
  const projectCode = sessionStorage.getItem("projectCode");

  const handleSubmit = async () => {
    if (!info.trim()) {
      toast.error("Notification cannot be empty!");
      return;
    }
    try {
      console.log(token);
      const response = await fetch(
        `${baseURL}/api/auth/createNotifications?projectCode=${projectCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: info,
            type: notificationType,
          }),
        }
      );

      if (response.ok) {
        toast.success("Notification sent successfully!");
        setInfo("");
      } else {
        toast.error("Failed to send notification.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the notification.");
    }
  };

  return (
    <div className="bg-gray-50 py-6">
      <div className="container mx-auto flex justify-center items-start">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
            <FaBell className="mr-2 text-yellow-500" /> Notify Members
          </h2>
          <div className="mb-4">
            <label
              htmlFor="notificationType"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Notification Type:
            </label>
            <select
              id="notificationType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
            >
              <option value="general">General</option>

              <option value="projectUpdate">Project Update</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>

          <textarea
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-border-transparent text-gray-700"
            rows={4}
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="Enter your notification message..."
          />
          <button
            className="mt-6 w-full bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
            onClick={handleSubmit}
          >
            <FaPaperPlane className="mr-2" /> Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notify;
