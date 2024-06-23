import styles from "../Styles/ProjectsHome.module.css";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "../assets/profile.png";
import { MdCancel } from "react-icons/md";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import { FaFolderPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentHome = () => {
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://classsync-y1qe.onrender.com/api/auth/studentprojects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProject),
        }
      );
      setLoading(false);
      if (response.ok) {
        setProjects([...projects, newProject]);
        closeModal();
        setProjectName("");
        setProjectCode("");
      } else if (response.status == 401) {
        alert("Invalid ProjectCode");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://classsync-y1qe.onrender.com/api/auth/studentsrepo`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

    const handleDelete = async (projectCode) => {
      const role = localStorage.getItem("userRole");
      const token = localStorage.getItem("token");
      const confirmation = window.confirm("Are you sure to delete the project?");
      if (confirmation) {
        try {
          const response = await fetch(
            `https://classsync-pr6d.onrender.com/api/auth/deleteproject?projectCode=${projectCode}&role=${role}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization : `Bearer ${token}`,
              },
              
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

  const handlecheck = (projectCode) => {
    localStorage.setItem("projectCode", projectCode);
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
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <h1>ClassSync</h1>
        </div>
        <div className={styles.search}>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search your projects"
            value={searchItem}
            onChange={handleSearch}
          />
        </div>
        <div className={styles.projects}>
          <button onClick={openModal}>Join Project</button>
        </div>
        <div className={styles.profile}   onMouseEnter={() => setOptions(true)}
           onMouseLeave={() => setOptions(false)}  >
          <img
            src={Image}
            alt="profile"
            onMouseEnter={() => setOptions(true)}
            className={styles.profileImage}
           
          />
          {options && (
             <div className={styles.profileOptions}>
             <ul>
               <li>
                 <a onClick={handleProfile}>
                   <AiOutlineUser className={styles.icon} /> Profile
                 </a>
               </li>
               <li>
                <a onClick={openModal}>
                <FaFolderPlus className={styles.icon} /> Join 
                </a>
               </li>
               <li>
                   <a onClick={handleLogout}>
                     <AiOutlineLogout className={styles.icon} /> Logout
                   </a>
               </li>
               
             </ul>
           </div>
          )}
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.store}>
          {filteredProjects.length ? (
            filteredProjects.map((project, index) => (
              <div key={index} className={styles.templates}>
                <h3>Project Name: {project.projectName}</h3>
                <h3>Project Code: {project.projectCode}</h3>
                <div className={styles.temp}>
                  <div className={styles.check}>
                    <button onClick={() => handlecheck(project.projectCode)}>
                      Check In
                    </button>
                  </div>
                  <div
                        className={styles.del}
                        onClick={() => handleDelete(project.projectCode)}
                      >
                        <button>Delete</button>
                      </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.text}>
              <h2>You don't have any projects. Join Now</h2>
            </div>
          )}
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Join Project Modal"
        className={styles.modalcustom}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Join Project</h1>
          </div>
          <div className={styles.cancel} onClick={closeModal}>
            <MdCancel />
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.details}>
              <div className={styles.info}>
                <label htmlFor="projectName">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  id="projectName"
                  value={projectName}
                  onChange={handleProject}
                  placeholder="Enter the project name"
                />
              </div>
              <div className={styles.info}>
                <label htmlFor="projectCode">Project Code</label>
                <input
                  type="text"
                  name="projectCode"
                  id="projectCode"
                  value={projectCode}
                  onChange={handleProjectCode}
                  placeholder="Enter project code"
                />
              </div>
              <div className={styles.btn}>
                <button type="submit">Join</button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default StudentHome;
