import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { FaHome, FaTasks, FaUserGraduate } from "react-icons/fa";
import { GrTasks } from "react-icons/gr";
import AssignTask from "./AssignTask";
import StudentStatus from "./StudentStatus";

import AssignedTasks from "./AssignedTasks";
import { useAuth } from "../store/auth";

const TeacherControll = () => {
  const navigate = useNavigate();
  const { LogoutUser } = useAuth();
  const [isExpanded, setExpand] = useState(true);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [showStudentStatus, setShowStudentStatus] = useState(false);
  const [showAssignedTasks, setShowAssignedTasks] = useState(false);

  const toggleSidebar = () => {
    setExpand((prevState) => !prevState);
  };

  const handleHomeRoute = () => {
    navigate("/teachershome");
  };

  const handleAssigned = () => {
    setShowAssignedTasks(true);
    setShowAssignTask(false);
    setShowStudentStatus(false);
  };

  const handleTasks = () => {
    setShowAssignTask(true);
    setShowStudentStatus(false);
    setShowAssignedTasks(false);
  };

  const handleStudentStatus = () => {
    setShowStudentStatus(true);
    setShowAssignTask(false);
    setShowAssignedTasks(false);
  };

  const handleLogout = () => {
    LogoutUser();
    navigate("/login");
  };

  return (
    <>
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
              onClick={handleHomeRoute}
            >
              <FaHome className="me-2" size={20} /> Home
            </NavLink>
          </li>
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={handleAssigned}
            >
              <FaTasks className="me-2" size={20} /> Assigned Tasks
            </NavLink>
          </li>
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={handleTasks}
            >
              <GrTasks className="me-2" size={20} /> Assign Tasks
            </NavLink>
          </li>
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={handleStudentStatus}
            >
              <FaUserGraduate className="me-2" size={20} /> Student Status
            </NavLink>
          </li>
        </ul>
        <div
          className="sidebar-footer text-light mt-auto"
          onClick={handleLogout}
        >
          <TbLogout2 /> Logout
        </div>
      </div>

      {showAssignTask && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <AssignTask
            baseURL="http://localhost:5000"
            setTasks={setShowAssignTask}
          />
        </div>
      )}

      {showAssignedTasks && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <AssignedTasks />
        </div>
      )}

      {showStudentStatus && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <StudentStatus />
        </div>
      )}
    </>
  );
};

export default TeacherControll;