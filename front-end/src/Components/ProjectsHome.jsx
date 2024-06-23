  import React, { useState,useEffect } from "react";
  import { useNavigate,NavLink } from "react-router-dom";
  import Modal from "react-modal";
  import Image from "../assets/profile.png";
  import { MdCancel } from "react-icons/md"; 
  import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
  import { FaFolderPlus } from "react-icons/fa";
  import Loader from "./Loader";
  import styles from "../Styles/ProjectsHome.module.css";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";

  const ProjectsHome = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projects, setProjects] = useState([]);
    const [classroom, setClassroom] = useState("");
    const [students, setStudents] = useState("");
    const [randomCode, setRandomCode] = useState();
    const [codeGenerated, setCodeGenerated] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const [options, setOptions] = useState(false);
    const [loading, setLoading] = useState(true);

    const notifySuccess = () =>
      toast.success("Your Project has been deleted successfully");

    const notifyError = () =>{
      toast.error("Error in deleting your project");
    }
    const navigate = useNavigate();

    const handleSearch = (e) => {
      setSearchItem(e.target.value);
    };

    const filteredProjects = searchItem
      ? projects.filter((project) =>
          project.projectName.toLowerCase().includes(searchItem.toLowerCase())
        )
      : projects;

    const handleProject = (e) => {
      const { value } = e.target;
      setProjectName(value);
    };

    const handleClassroom = (e) => {
      const { value } = e.target;
      setClassroom(value);
    };

    const handleStudents = (e) => {
      const { value } = e.target;
      setStudents(value);
    };

    const openModal = () => {
      setModalIsOpen(true);
    };

    const closeModal = () => {
      setModalIsOpen(false);
      setCodeGenerated(false);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const newProject = {
        projectName,
        classroom,
        students,
        projectCode: randomCode,
      };

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://classsync-y1qe.onrender.com/api/auth/projects`,
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
          setClassroom("");
          setStudents("");
          setRandomCode("");
          setCodeGenerated(false);
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
            `https://classsync-y1qe.onrender.com/api/auth/userProjects`,
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

    const generateCode = (e) => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }
      setRandomCode(code);
      setCodeGenerated(true);
    };


    const handleLogout = () => {
      navigate("/logout");
    };

    const handleCheck = (projectCode) => {
      localStorage.setItem("projectCode", projectCode);
      navigate("/createtasks");
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
            <button onClick={openModal}>Create Project</button>
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
                  <FaFolderPlus className={styles.icon} /> Create 
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
                <div key={index} className={styles.projecttemplates}>
                  <h3>Project Name: {project.projectName}</h3>
                  <h3>Classroom: {project.classroom}</h3>
                  <h3>No of Students: {project.students}</h3>
                  {project.projectCode ? (
                    <>
                      <h3>Project ID: {project.projectCode}</h3>
                      <div className={styles.temp}>
                        <div className={styles.check}>
                          <button onClick={() => handleCheck(project.projectCode)}>
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
                    </>
                  ) : (
                    <h3>Project ID: Not generated</h3>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.text}>
                <h2>You don't have any projects. Create one.</h2>
              </div>
            )}
          </div>
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Create Project Modal"
          className={styles.modalcustom}
        >
          <div className={styles.container}>
            <div className={styles.header}>
              <h1>Create Project</h1>
            </div>
            <div className={styles.cancel} onClick={closeModal}>
              <MdCancel />
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.details}>
                <div className={styles.info}>
                  <label htmlFor="projectname">Project Name</label>
                  <input
                    type="text"
                    name="projectname"
                    id="projectname"
                    value={projectName}
                    onChange={handleProject}
                    placeholder="Enter the project name"
                  />
                </div>
                <div className={styles.info}>
                  <label htmlFor="classroom">Class Room</label>
                  <input
                    type="text"
                    name="classroom"
                    id="classroom"
                    value={classroom}
                    onChange={handleClassroom}
                    placeholder="Enter classroom number"
                  />
                </div>
                <div className={styles.info}>
                  <label htmlFor="students">No of Students</label>
                  <input
                    type="text"
                    name="students"
                    id="students"
                    value={students}
                    onChange={handleStudents}
                    placeholder="Enter classroom number"
                  />
                </div>
                <div className={styles.btn}>
                  <button type="submit" onClick={generateCode}>
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      </>
    );
  };

  export default ProjectsHome;
