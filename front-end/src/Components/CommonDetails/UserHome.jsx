import { useState } from "react";
import { GrProjects } from "react-icons/gr";
import { GoProjectSymlink } from "react-icons/go";
import { IoCreateOutline } from "react-icons/io5";
import { TbArrowsJoin2 } from "react-icons/tb";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import { FaHome, FaFolderPlus } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { BiMenu } from "react-icons/bi";
import { IoIosCreate } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { useNavigate, NavLink } from "react-router-dom";
import CreateProject from "../CommonDetails/createProject";
import JoinProject from "./joinProject";
import FetchCreatedProjects from "./FetchCreatedProjects";
import FetchJoinedProjects from "./FetchJoinedProjects";

function UserHome() {
  const [Options, setOptions] = useState(false);
  const [profile, setProfile] = useState(false);
  const [isExpanded, setExpand] = useState(true);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [OpenJoinModal, setJoinModal] = useState(false);
  const [fetchCreated, setCreated] = useState(true);
  const [fetchJoined, setJoined] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setExpand((prevState) => !prevState);
  };

  const openCreateModal = () => {
    setCreateModalIsOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalIsOpen(false);
    resetForm();
  };

  const openJoinModal = () => {
    setJoinModal(true);
  };

  const closeJoinModal = () => {
    setJoinModal(false);
    resetForm();
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleProfile = () => {
    navigate("/userprofile");
  };

  const handleYourProjects = () => {
    setCreated(true);
    setJoined(false);
  };
  const handleEnrolled = () => {
    setCreated(false);
    setJoined(true);
  };

  return (
    <>
      <div
        className={`sidebar w-auto bg-dark ${
          isExpanded ? "sidebar-open" : "sidebar-closed"
        } p-4`}
      >
        <ul className="sidebar-nav list-unstyled mt-5 pt-3">
          <li className="pb-3 fs-5">
            <NavLink className="text-white text-decoration-none" to="#">
              <FaHome className="me-2" size={20} /> Home
            </NavLink>
          </li>
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={() => handleYourProjects()}
            >
              <GrProjects className="me-2" size={20} /> Your Projects
            </NavLink>
          </li>
          <li className="pb-3 fs-5">
            <NavLink
              className="text-white text-decoration-none"
              onClick={() => handleEnrolled()}
            >
              <GoProjectSymlink className="me-2" size={20} />
              Enrolled Projects
            </NavLink>
          </li>
          <li className="pb-3 fs-5  d-lg-none">
            <NavLink
              className="text-white text-decoration-none"
              onClick={openCreateModal}
            >
              <IoCreateOutline className="me-2" size={20} />
              Create
            </NavLink>
          </li>
          <li className="pb-3 fs-5  d-lg-none">
            <NavLink
              className="text-white text-decoration-none"
              onClick={openJoinModal}
            >
              <TbArrowsJoin2 className="me-2" size={20} />
              Join
            </NavLink>
          </li>

          <li className="pb-3 fs-5 mt-5">
            <a
              className="text-white text-decoration-none"
              onClick={handleLogout}
              href=""
            >
              <TbLogout2 className="me-2" size={20} /> Logout
            </a>
          </li>
        </ul>
      </div>
      <nav className="navbar navbar-expand-lg bg-primary position-fixed top-0 w-100">
        <div className="container-fluid ">
          <button
            className="navbar-toggler-lg bg-info text-white fs-5 border-0 ms-2"
            onClick={toggleSidebar}
          >
            <BiMenu size={40} className="bg-primary " />
          </button>
          <NavLink className="navbar-brand text-light  mx-auto ms-5  fs-2 fw-bold">
            ClassSync
          </NavLink>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto  me-5 mb-2 mb-lg-0 ">
              <li className="nav-item">
                <a
                  className="nav-link active text-light"
                  aria-current="page"
                  href="#"
                  onMouseEnter={() => setOptions(true)}
                  onMouseLeave={() => setOptions(false)}
                >
                  <FaPlus
                    className="me-5"
                    size={35}
                    onMouseEnter={() => setOptions(true)}
                  />
                  {Options && (
                    <ul className="bg-light text-dark position-absolute rounded p-3">
                      <li>
                        <a onClick={openJoinModal}>
                          <FaFolderPlus className="icons me-2  " />
                          <strong>Join</strong>
                        </a>
                      </li>
                      <li className="mt-2">
                        <a onClick={openCreateModal}>
                          <IoIosCreate className="icons me-2  " />
                          <strong>Create</strong>
                        </a>
                      </li>
                    </ul>
                  )}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onMouseEnter={() => setProfile(true)}
                  onMouseLeave={() => setProfile(false)}
                >
                  <AiOutlineUser
                    className="icons me-5 text-light fw-bold"
                    size={35}
                    onMouseEnter={() => setProfile(true)}
                  />
                  {profile && (
                    <ul className="bg-light text-dark position-absolute rounded p-3">
                      <li>
                        <a onClick={handleProfile}>
                          <AiOutlineUser className="icons me-2 fs-5" />{" "}
                          <strong>Profile</strong>
                        </a>
                      </li>
                      <li className="mt-2">
                        <a
                          href=""
                          className="text-decoration-none text-dark"
                          onClick={handleLogout}
                        >
                          <AiOutlineLogout className="icons me-2 fs-5 " />{" "}
                          <strong>Logout</strong>
                        </a>
                      </li>
                    </ul>
                  )}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <CreateProject Open={createModalIsOpen} close={closeCreateModal} />
      <JoinProject OpenJoin={OpenJoinModal} closeJoin={closeJoinModal} />
      {fetchCreated && <FetchCreatedProjects />}
      {fetchJoined && <FetchJoinedProjects />}
    </>
  );
}

export default UserHome;
