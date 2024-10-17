import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { MdTask } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { SlPeople } from "react-icons/sl";
import { GrTasks } from "react-icons/gr";
import ClassDetails from "../CommonDetails/ClassDetails";
import AssignTask from "./AssignTask";
import StudentStatus from "./DiaryEntries";
import { useAuth } from "../../store/auth";
import AdminAssignedTasks from "../CommonDetails/adminAssignedTasks";

const AdminProjectControll = () => {
  const navigate = useNavigate();
  const { LogoutUser } = useAuth();
  const [isExpanded, setExpand] = useState(true);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [showStudentStatus, setShowStudentStatus] = useState(false);
  const [showAssignedTasks, setShowAssignedTasks] = useState(false);
  const [contributors, setContributors] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setExpand((prevState) => !prevState);
  };

  const handleAssigned = () => {
    setShowAssignedTasks(true);
    if (isSmallScreen) {
      setExpand((prevState) => !prevState);
    }
    setShowAssignTask(false);
    setShowStudentStatus(false);
    setContributors(false);
  };

  const handleTasks = () => {
    setShowAssignTask(true);
    if (isSmallScreen) {
      setExpand((prevState) => !prevState);
    }
    setShowStudentStatus(false);
    setShowAssignedTasks(false);
    setContributors(false);
  };

  const handleStudentStatus = () => {
    setShowStudentStatus(true);
    setShowAssignTask(false);
    if (isSmallScreen) {
      setExpand((prevState) => !prevState);
    }
    setShowAssignedTasks(false);
    setContributors(false);
  };

  const handleContributors = () => {
    setContributors(true);
    setShowStudentStatus(false);
    if (isSmallScreen) {
      setExpand((prevState) => !prevState);
    }
    setShowAssignTask(false);
    setShowAssignedTasks(false);
  };
  const handleLogout = () => {
    LogoutUser();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary position-fixed top-0 w-100 ">
        <div className="container-fluid ">
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
              <MdTask className="me-2" size={20} /> Diary Entries
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
        {showAssignTask && <AssignTask />}
        {showAssignedTasks && <AdminAssignedTasks />}
        {showStudentStatus && <StudentStatus />}
        {contributors && <ClassDetails />}
      </div>
    </>
  );
};

export default AdminProjectControll;
