import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { MdTask } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { AiTwotoneNotification } from "react-icons/ai";
import { SlPeople } from "react-icons/sl";
import { GrTasks } from "react-icons/gr";
import ClassDetails from "../CommonDetails/ClassDetails";
import AssignTask from "./AssignTask";
import StudentStatus from "./DiaryEntries";
import { useAuth } from "../../store/auth";
import AdminAssignedTasks from "../CommonDetails/adminAssignedTasks";
import Notify from "./Notify";
import Logo from "../../assets/Logo.png";

const AdminProjectControll = () => {
  const navigate = useNavigate();
  const { LogoutUser } = useAuth();
  const [isExpanded, setExpand] = useState(false);
  const [view, setView] = useState("contributors");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setExpand((prev) => !prev);
  const handleViewChange = (newView) => {
    setView(newView);
    if (isSmallScreen) setExpand(false);
  };
  const handleLogout = () => {
    LogoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md w-64 flex-shrink-0 transition-transform duration-300 ease-in-out fixed top-0 left-0 h-full z-40 ${
          isExpanded || !isSmallScreen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img src={Logo} alt="Logo" className="w-8 h-8" />
            <span className="text-3xl font-semibold text-gray-800">
              ClassSync
            </span>
          </div>
          {isSmallScreen && (
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-800 focus:outline-none flex-shrink-0"
            >
              <RxCross2 size={24} />
            </button>
          )}
        </div>

        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <IoArrowBackCircleSharp size={20} />
                <span>Back</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("notify")}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <AiTwotoneNotification size={20} />
                <span>Notify</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("contributors")}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <SlPeople size={20} />
                <span>Contributors</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("assignedTasks")}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <FaTasks size={20} />
                <span>Assigned Tasks</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("assignTasks")}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <GrTasks size={20} />
                <span>Assign Tasks</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("diaryEntries")}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <MdTask size={20} />
                <span>Diary Entries</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
          >
            <TbLogout2 size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white  p-4 flex items-center justify-between">
          {isSmallScreen && (
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <RxHamburgerMenu size={24} />
            </button>
          )}
          <div className="flex-1 flex justify-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Project: {sessionStorage.getItem("projectName")}
            </h2>
          </div>
          {isSmallScreen && <div className="w-6"></div>}
        </header>
        <main
          className={`flex-1 p-6 bg-gray-100 overflow-y-auto ${
            isSmallScreen ? "mt-16" : "ml-64 mt-16"
          }`}
        >
          {view === "notify" && <Notify />}
          {view === "assignTasks" && <AssignTask />}
          {view === "assignedTasks" && <AdminAssignedTasks />}
          {view === "diaryEntries" && <StudentStatus />}
          {view === "contributors" && <ClassDetails />}
        </main>
      </div>
    </div>
  );
};

export default AdminProjectControll;
