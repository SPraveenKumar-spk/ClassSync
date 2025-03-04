import React, { useState, useEffect } from "react";
import { GrProjects } from "react-icons/gr";
import { GoProjectSymlink } from "react-icons/go";
import { IoCreateOutline } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { TbArrowsJoin2, TbLogout2 } from "react-icons/tb";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import { FaHome, FaPlus } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import CreateProject from "../CommonDetails/createProject";
import JoinProject from "./joinProject";
import FetchCreatedProjects from "./FetchCreatedProjects";
import FetchJoinedProjects from "./FetchJoinedProjects";
import Logo from "../../assets/Logo.png";

const UserHome = () => {
  const [isExpanded, setExpand] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [OpenJoinModal, setJoinModal] = useState(false);
  const [fetchCreated, setCreated] = useState(true);
  const [fetchJoined, setJoined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setExpand((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside
        className={`bg-white shadow-md w-64 flex-shrink-0 transition-transform duration-300 ease-in-out fixed top-0 left-0 h-full z-40 ${
          isExpanded || !isMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img src={Logo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
              ClassSync
            </span>
          </div>
          {isMobile && (
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
                onClick={() => navigate("/")}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <FaHome size={20} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCreated(true);
                  setJoined(false);
                }}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <GrProjects size={20} />
                <span>Your Projects</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCreated(false);
                  setJoined(true);
                }}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <GoProjectSymlink size={20} />
                <span>Enrolled Projects</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCreateModalIsOpen(true)}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <IoCreateOutline size={20} />
                <span>Create</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setJoinModal(true)}
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
              >
                <TbArrowsJoin2 size={20} />
                <span>Join</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mx-auto p-4">
          <button
            onClick={() => navigate("/logout")}
            className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md w-full"
          >
            <TbLogout2 size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="fixed top-0 w-full bg-white shadow-md p-4 flex items-center justify-between">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <RxHamburgerMenu size={24} />
            </button>
          )}
          <div className="flex-1 flex justify-center">
            <h2 className="text-lg font-semibold text-gray-800">User Home</h2>
          </div>
          {isMobile && (
            <div className="flex items-center gap-6 md:gap-10">
              <div className="relative group hidden md:block">
                <button className="cursor-pointer p-2 hover:bg-gray-100 rounded">
                  <FaPlus size={20} />
                </button>
                <div
                  className="absolute right-0  bg-white shadow-lg p-3 rounded-md 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none 
              group-hover:pointer-events-auto w-40"
                >
                  <button
                    onClick={() => setJoinModal(true)}
                    className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <MdOutlineCreateNewFolder size={20} /> Join
                  </button>
                  <button
                    onClick={() => setCreateModalIsOpen(true)}
                    className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <IoIosCreate size={20} /> Create
                  </button>
                </div>
              </div>

              <div className="relative group">
                <button className="cursor-pointer p-2 hover:bg-gray-100 rounded">
                  <AiOutlineUser size={30} />
                </button>
                <div
                  className="absolute right-0  bg-white shadow-lg p-3 rounded-md 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none 
              group-hover:pointer-events-auto w-40"
                >
                  <button
                    onClick={() => navigate("/userprofile")}
                    className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <CgProfile size={20} /> Profile
                  </button>
                  <button
                    onClick={() => navigate("/logout")}
                    className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <AiOutlineLogout size={20} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center gap-6 md:gap-10">
              <div className="relative group">
                <button className="cursor-pointer p-2 hover:bg-gray-100 rounded">
                  <FaPlus size={20} />
                </button>
                <div
                  className="absolute right-0  bg-white shadow-lg p-3 rounded-md 
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none 
                group-hover:pointer-events-auto w-40"
                >
                  <button
                    onClick={() => setJoinModal(true)}
                    className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <MdOutlineCreateNewFolder size={20} /> Join
                  </button>
                  <button
                    onClick={() => setCreateModalIsOpen(true)}
                    className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <IoIosCreate size={20} /> Create
                  </button>
                </div>
              </div>

              <div className="relative group">
                <button className="cursor-pointer p-2 hover:bg-gray-100 rounded">
                  <AiOutlineUser size={30} />
                </button>
                <div
                  className="absolute right-0  bg-white shadow-lg p-3 rounded-md 
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none 
                group-hover:pointer-events-auto w-40"
                >
                  <button
                    onClick={() => navigate("/userprofile")}
                    className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <CgProfile size={20} /> Profile
                  </button>
                  <button
                    onClick={() => navigate("/logout")}
                    className="flex gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <AiOutlineLogout size={20} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        <main
          className={`flex-1 p-6 bg-gray-100 overflow-y-auto ${
            isMobile ? "mt-16" : "ml-64 mt-16"
          }`}
        >
          {fetchCreated && <FetchCreatedProjects />}
          {fetchJoined && <FetchJoinedProjects />}
        </main>
      </div>

      <CreateProject
        Open={createModalIsOpen}
        close={() => setCreateModalIsOpen(false)}
      />
      <JoinProject
        OpenJoin={OpenJoinModal}
        closeJoin={() => setJoinModal(false)}
      />
    </div>
  );
};

export default UserHome;
