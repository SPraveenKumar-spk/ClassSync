import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import { FaTasks, FaRocketchat } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { GrTasks } from "react-icons/gr";
import { RiAddCircleFill, RiHistoryFill } from "react-icons/ri";
import { SlPeople } from "react-icons/sl";
import NewDiaryEntry from "../JoinProject/NewDiary";
import TeamDetails from "../CommonDetails/TeamDetails";
import AssignedTasks from "../CommonDetails/AssignedTasks";
import PastDiaryEntries from "../JoinProject/PastDiary";
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

const JoinedProjectControll = () => {
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
    <>
      <nav className="navbar navbar-expand-lg bg-primary position-fixed top-0 w-100">
        <div className="container ">
          <button
            className="navbar-toggler-lg bg-info text-white fs-5 border-0"
            onClick={toggleSidebar}
          >
            <BiMenu size={40} className="bg-primary " />
          </button>
          <NavLink className="navbar-brand text-light  mx-auto ms-5  fs-2 fw-bold">
            ClassSync
          </NavLink>
        </div>
        <div className="mx-auto ms-5 me-5">
          <h3 className="text-nowrap text-warning ">
            ProjectName : {sessionStorage.getItem("projectName")}
          </h3>
        </div>
      </nav>
      <div
        className={`sidebar w-auto bg-dark ${
          isExpanded ? "sidebar-open" : "sidebar-closed"
        } p-4`}
      >
        <ul className="sidebar-nav list-unstyled pt-5 mt-5">
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={() => navigate(-1)}
            >
              <IoArrowBackCircleSharp className="me-2" size={30} /> Back
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
          <li className="pb-3 fs-5 mt-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={handleLogout}
            >
              <TbLogout2 className="me-2" size={20} /> Logout
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        {currentView === VISIBILITY_STATES.NEW_DIARY && <NewDiaryEntry />}
        {currentView === VISIBILITY_STATES.ASSIGNED_TASKS && <AssignedTasks />}
        {currentView === VISIBILITY_STATES.PAST_ENTRIES && <PastDiaryEntries />}
        {currentView === VISIBILITY_STATES.CHAT_APP && <ChatApp />}
        {currentView === VISIBILITY_STATES.CONTRIBUTORS && <TeamDetails />}
      </div>
    </>
  );
};

export default JoinedProjectControll;
