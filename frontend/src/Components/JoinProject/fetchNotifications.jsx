import { useState, useEffect } from "react";
import { FaBell, FaRegBell, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";

function Notifications() {
  const { baseURL, token } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const projectCode = sessionStorage.getItem("projectCode");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!projectCode) {
        console.warn("Project code not found in sessionStorage.");
        toast.warn("Project code not found. Notifications cannot be loaded.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${baseURL}/api/auth/fetchNotifications?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const info = await response.json();
        const notificationsArray = Array.isArray(info.notifications)
          ? info.notifications
          : [];
        setNotifications(notificationsArray);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error(`Failed to load notifications: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [baseURL, token, projectCode, toast]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const formatType = (type) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Unknown";
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-5 px-6 text-white flex items-center justify-between">
            <div className="flex items-center">
              <FaBell className="mr-3 text-xl" />
              <h2 className="text-2xl font-semibold tracking-tight">
                Notifications
              </h2>
            </div>
            <span className="text-sm text-indigo-200">
              {notifications.length} New
            </span>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <ul className="space-y-4">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FaInfoCircle className="text-indigo-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatType(notification.type)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(
                            notification.createdAt || notification.date
                          )}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {notification.message || "No message available"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <FaRegBell className="mx-auto mb-2 text-2xl" />
                <p className="text-sm">No new notifications...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
