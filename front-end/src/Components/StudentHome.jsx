import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "../assets/profile.png";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import { FaFolderPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../Styles/ProjectsHome.module.css";
import { useAuth } from "../store/auth";

const StudentHome = () => {
  const { baseURL } = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [projects, setProjects] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [options, setOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notifySuccess = () =>
    toast.success("Your Project has been deleted successfully");
  
  const notifyError = () =>{
    toast.error("Error in deleting your project");
  }

  const notifyInvalidCode = ()=>{
    toast.error("Invalid Project Code");
  }
  const handleProject = (e) => {
    const { value } = e.target;
    setProjectName(value);
  };

  const handleProjectCode = (e) => {
    const { value } = e.target;
    setProjectCode(value);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newProject = { projectName, projectCode };

    try {
      const response = await fetch(
        `${baseURL}/api/auth/studentprojects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProject),
          credentials: 'include'
        }
      );
      setLoading(false);
      if (response.ok) {
        setProjects([...projects, newProject]);
        closeModal();
        setProjectName("");
        setProjectCode("");
      } else if (response.status == 401) {
        notifyInvalidCode();
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/studentsrepo`,
          {
            method: "GET",
            credentials: 'include'
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

    const handleDelete = async (projectCode) => {
      const role = sessionStorage.getItem("userRole");
      const confirmation = window.confirm("Are you sure to delete the project?");
      if (confirmation) {
        try {
          const response = await fetch(
            `${baseURL}/api/auth/deleteproject?projectCode=${projectCode}&role=${role}`,
            {
              method: "DELETE",
              credentials: 'include'
              
            }
          
          );
          if (response.ok) {
            setProjects((prevProjects) =>
              prevProjects.filter(
                (project) => project.projectCode !== projectCode
              )
            );
            notifySuccess();
          }else{
            notifyError();
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  };

  const filteredProjects = searchItem
    ? projects.filter((project) =>
        project.projectName.toLowerCase().includes(searchItem.toLowerCase())
      )
    : projects;

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleCheck = (projectCode) => {
    sessionStorage.setItem("projectCode", projectCode);
    navigate("/submissions");
  };
  const handleProfile = () =>{
    navigate("/userprofile");
  }


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="d-fixed navbar navbar-expand-lg navbar-dark bg-primary">
        <div className={`container-fluid d-flex justify-content-evenly align-items-center flex-nowrap ${style.mainItems}`}>
          <div>
          <h1 className={`navbar-brand fs-1 ${style.logo}`}>ClassSync</h1>
          </div>
          <div>
            <input
              type="text"
              className={`form-control ${style.searchInput}`}
              id="search"
              name="search"
              placeholder="Search your projects"
              value={searchItem}
              onChange={handleSearch}
            />
          </div>
          <div>
            <button className="btn btn-primary ms-2 border rounded-sm d-none d-lg-block" onClick={openModal}>
              Join Project
            </button>
          </div>
        
          <div className={`profile d-inline position-relative ${style.mainProfile}`}  onMouseEnter={() => setOptions(true)}
              onMouseLeave={() => setOptions(false)}>
            <img
              src={Image}
              alt="profile"
              className={`profileImage img-fluid ${style.profileImage} `} style={{cursor :"pointer"}}
              onMouseEnter={() => setOptions(true)}
         
            />
            {options && (
              <div className={`profileOptions position-absolute top-100  bg-light border rounded p-3 h-auto ${style.menuItems}`} >
                <ul className="list-unstyled fs-5 " style={{cursor :"pointer"}}>
                  <li>
                    <a
                      className="text-decoration-none d-flex align-items-center text-dark pb-1"
                      onClick={handleProfile}
                    >
                      <AiOutlineUser className="icons me-2 " /> Profile
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-decoration-none d-flex align-items-center  text-dark pb-1"
                      onClick={openModal}
                    >
                      <FaFolderPlus className="icons me-2 " /> Join
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-decoration-none d-flex align-items-center  text-dark"
                      onClick={handleLogout}
                    >
                      <AiOutlineLogout className="icons me-2 " /> Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="container d-flex justify-content-center align-items-center flex-wrap mt-5 ">
          {filteredProjects.length ? (
            filteredProjects.map((project, index) => (
              <div key={index} className="card m-2" style={{minWidth : "20rem"}}>
                <div className="card-body rounded bg-secondary">
                  <h3 className="card-title p-1"><span className="text-info">Project Name: </span>{project.projectName}</h3>
                  
                  {project.projectCode ? (
                    <>
                      <h3 className="card-text"> <span className="text-info">Project ID: </span>{project.projectCode}</h3>
                      <div className="d-flex justify-content-between pt-5">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleCheck(project.projectCode)}
                        >
                          Check In
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(project.projectCode)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <h3 className="card-text">Project ID: Not generated</h3>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info text-center w-100" role="alert">
              You don't have any projects. Join Now
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Project Modal"
        className="modal-dialog"
      >
        <div className="container p-5 position-fixed top-50 start-50 translate-middle">
        <div className=" p-4 modal-content border border  bg-light rounded-4">
          <div className="modal-header position-relative">
            <div > 
              <h1 className="modal-title">Join Project</h1>
            </div>
           <div className="position-absolute top-0 end-0">
              <button type="button" className="btn-close fs-5 text-danger " onClick={closeModal}>
              </button>
            </div>
            
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="projectname" className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="projectname"
                  name="projectname"
                  value={projectName}
                  onChange={handleProject}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="projectcode" className="form-label">ProjectCode</label>
                <input
                  type="text"
                  className="form-control"
                  id="projectCode"
                  name="projectCode"
                  value={projectCode}
                  onChange={handleProjectCode}
                  required
                />
              </div>
              
              <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-success mb-3 pe-5 ps-5 fs-4 text-center">
                    Join
                  </button>
              </div>

            </form>
          </div>
        </div>
        </div>
      </Modal>
    </>
  );
};

export default StudentHome;
