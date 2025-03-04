import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUserCircle,
  FaArrowLeft,
  FaLock,
  FaSave,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuth } from "../store/auth";
import { useToast } from "../store/ToastContext";

export default function UserProfile() {
  const { baseURL } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    oldpassword: false,
    newpassword: false,
  });
  const [editPassword, setEditPassword] = useState(false);

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const notifySuccess = () => toast.success("Password Updated Successfully!");
  const notify500 = () => toast.error("Server Error.");
  const notify401 = () => toast.error("Incorrect Password.");
  const notifyError = () => toast.error("Password Update Failed.");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/auth/userinfo?token=${token}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          toast.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching user data.");
      }
    };
    fetchUser();
  }, [baseURL, token, toast]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${baseURL}/api/auth/updatePassword?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );
      if (response.ok) {
        notifySuccess();
        setEditPassword(false);
        setOldPassword("");
        setNewPassword("");
      } else if (response.status === 401) {
        notify401();
      } else if (response.status === 500) {
        notify500();
      } else {
        notifyError();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password. Please try again.");
    }
  };

  const togglePassword = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <section className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center">
            <FaUserCircle className="mr-3 text-indigo-500" size={32} /> Profile
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture Section - Fixed Height */}
          <div
            className={`bg-white rounded-2xl shadow-md p-6 flex flex-col items-center w-full md:w-1/3 transition-height duration-300 ${
              editPassword ? "h-fit" : "h-fit"
            }`}
          >
            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <FaUserCircle size={64} className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user.name || "N/A"}
            </h2>
            <p className="text-gray-500">{user.email || "N/A"}</p>
          </div>

          {/* Account Details Section - Expandable */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col w-full md:w-2/3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaLock className="mr-2 text-indigo-500" /> Account Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Name:</span>
                <span className="text-gray-800">{user.name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{user.email || "N/A"}</span>
              </div>
            </div>

            {/* Password Section */}
            <div className="mt-6">
              {!editPassword ? (
                <button
                  onClick={() => setEditPassword(true)}
                  className="w-full bg-indigo-500 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Change Password
                </button>
              ) : (
                <form
                  onSubmit={handlePasswordUpdate}
                  className="space-y-4 mt-4 animate-fade-in"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword.oldpassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("oldpassword")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.oldpassword ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword.newpassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("newpassword")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.newpassword ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-500 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <FaSave className="mr-2" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditPassword(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                      <FaTimesCircle className="mr-2" /> Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
