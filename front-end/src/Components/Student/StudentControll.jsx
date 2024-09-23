import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { FaHome, FaTasks, FaRocketchat } from "react-icons/fa";
import { GrTasks } from "react-icons/gr";
import { RiAddCircleFill, RiHistoryFill } from "react-icons/ri";
import { SlPeople } from "react-icons/sl";
import NewDiaryEntry from "../Student/StudentNewDiary";
import TeamDetails from "../CommonDetails/TeamDetails";
import AssignedTasks from "../CommonDetails/AssignedTasks";
import PastDiaryEntries from "../Student/StudentPastDiary";
import { useAuth } from "../../store/auth";
import ChatApp from "./Chat/ChatApp";


const VISIBILITY_STATES = {
  NONE: "NONE",
  NEW_DIARY: "NEW_DIARY",
  ASSIGNED_TASKS: "ASSIGNED_TASKS",
  PAST_ENTRIES: "PAST_ENTRIES",
  CONTRIBUTORS: "CONTRIBUTORS",
  CHAT_APP: "CHAT_APP",
};

const StudentControll = () => {
  const navigate = useNavigate();
  const { LogoutUser } = useAuth();
  const [isExpanded, setExpand] = useState(true);
  const [currentView, setCurrentView] = useState(
    VISIBILITY_STATES.CONTRIBUTORS
  );
  const [isDiaryDropdownOpen, setIsDiaryDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setExpand((prevState) => !prevState);
  };

  const handleAssigned = () => {
    setCurrentView(VISIBILITY_STATES.ASSIGNED_TASKS);
    setIsDiaryDropdownOpen(false);
  };

  const handleDiaryToggle = () => {
    setIsDiaryDropdownOpen((prevState) => !prevState);
    if (!isDiaryDropdownOpen) {
      setCurrentView(VISIBILITY_STATES.NONE);
    }
  };

  const handleNewEntry = () => {
    setCurrentView(VISIBILITY_STATES.NEW_DIARY);
    setIsDiaryDropdownOpen(true);
  };

  const handlePastEntry = () => {
    setCurrentView(VISIBILITY_STATES.PAST_ENTRIES);
    setIsDiaryDropdownOpen(true);
  };

  const handleContributors = () => {
    setCurrentView(VISIBILITY_STATES.CONTRIBUTORS);
    setIsDiaryDropdownOpen(false);
  };

  const handleChatApp = () => {
    setCurrentView(VISIBILITY_STATES.CHAT_APP);
    setIsDiaryDropdownOpen(false);
  };

  const handleLogout = () => {
    LogoutUser();
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column h-100">
      <div
        className="position-fixed w-100 navbar navbar-expand-lg navbar-dark bg-info"
        style={{ height: "4rem" }}
      >
        <div className="container d-flex justify-content-start">
          <button
            className="navbar-toggler-lg bg-info text-white fs-5 border-0"
            onClick={toggleSidebar}
          >
            <IoMenuSharp size={40} />
          </button>
          <a className="navbar-brand ms-5">
            <h1 className="fs-1 ms-3 p-2">ClassSync</h1>
          </a>
        </div>
      </div>
      <div
        className={`sidebar w-auto bg-dark ${
          isExpanded ? "sidebar-open" : "sidebar-closed"
        } p-4`}
      >
        <ul className="sidebar-nav list-unstyled">
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              to="/studentshome"
            >
              <FaHome className="me-2" size={20} /> Home
            </NavLink>
          </li>
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={handleContributors}
            >
              <SlPeople className="me-2" size={20} /> Contributors
            </NavLink>
          </li>
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={handleAssigned}
            >
              <FaTasks className="me-2" size={20} /> Task Details
            </NavLink>
          </li>
          <li className="pb-3 fs-5">
            <button
              className="text-white text-decoration-none"
              onClick={handleDiaryToggle}
              style={{ background: "transparent", border: "none" }}
            >
              <GrTasks className="me-2" size={20} /> Diary Entry
            </button>
            {isDiaryDropdownOpen && (
              <ul className="list-unstyled ms-4">
                <li className="pb-2 fs-6">
                  <button
                    className="btn text-white text-decoration-none w-100 text-start"
                    onClick={handleNewEntry}
                  >
                    <RiAddCircleFill className="me-2" size={18} /> New Entry
                  </button>
                </li>
                <li className="pb-2 fs-6">
                  <button
                    className="btn text-white text-decoration-none w-100 text-start"
                    onClick={handlePastEntry}
                  >
                    <RiHistoryFill className="me-2" size={18} /> Past Entry
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={handleChatApp}
            >
              <FaRocketchat className="me-2" size={20} /> Collaborate
            </NavLink>
          </li>
        </ul>
        <div>
          <button
            className="btn text-light fs-5"
            style={{ position: "absolute", bottom: "2rem" }}
            onClick={handleLogout}
          >
            <TbLogout2 className="me-2" size={20} /> Logout
          </button>
        </div>
      </div>
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        {currentView === VISIBILITY_STATES.NEW_DIARY && <NewDiaryEntry />}
        {currentView === VISIBILITY_STATES.ASSIGNED_TASKS && <AssignedTasks />}
        {currentView === VISIBILITY_STATES.PAST_ENTRIES && <PastDiaryEntries />}
        {currentView === VISIBILITY_STATES.CHAT_APP && <ChatApp />}
        {currentView === VISIBILITY_STATES.CONTRIBUTORS && <TeamDetails />}
      </div>
    </div>
  );
};

export default StudentControll;
