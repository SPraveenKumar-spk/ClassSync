import styles from "../Styles/ProjectsHome.module.css";
import React, { useState } from "react";
import Modal from "react-modal";
import Image from "../assets/profile.png";
import { MdCancel } from "react-icons/md";

const ProjectsHome = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [classroom, setClassroom] = useState("");
  const [projects, setProjects] = useState([]);
  const [randomCode, setRandomCode] = useState();
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const[options,setOptions] = useState(false)
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

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCodeGenerated(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = { projectName, classroom, projectCode: randomCode };
    setProjects([...projects, newProject]);
    closeModal();
    setProjectName("");
    setClassroom("");
    setRandomCode("");
    setCodeGenerated(false);
  };

  const handleDelete = (index) => {
    const confirmation = window.confirm("Are you sure to delete the project?");
    if (confirmation) {
      const updatedProjects = [...projects];
      updatedProjects.splice(index, 1);
      setProjects(updatedProjects);
      alert("Your project has been deleted successfully.");
    }
  };

  const generateCode = (e) => {
    e.preventDefault();
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    setRandomCode(code);
    setCodeGenerated(true);
  };

  const handleProfile = () =>{
    setOptions(true);
  }

  const handleClick = () =>{
    setOptions(false);
  }

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <h1>ClassSync</h1>
        </div>
        <div className={styles.search}>
          <input type="text" id="search" name="search" placeholder="Search your projects" value={searchItem} onChange={handleSearch} />
        </div>
        <div className={styles.projects}>
          <button onClick={openModal}>Create Project</button>
        </div>
        <div className={styles.profile} >
          <img src={Image} alt="profile" onClick={handleProfile} onDoubleClick={handleClick}/>
          {options &&
          <div className={styles.profileOptions}>
           <button >Profile </button>
           <button>Logout</button> 
          </div>
          }
        </div>
      </div>
      <div className={styles.store}>
        {filteredProjects.length ? (
          filteredProjects.map((project, index) => (
            <div key={index} className={styles.templates}>
              <h3>Project Name: {project.projectName}</h3>
              <h3>Classroom: {project.classroom}</h3>
              <h3>No of Students: {project.classroom}</h3>
              <h3>No.of Team Leaders: {project.classroom}</h3>
              {project.projectCode ? (
                <h3>Project ID: {project.projectCode}</h3>
              ) : (
                <h3>Project ID: Not generated</h3>
              )}
              <div className={styles.temp}>
                <div className={styles.check}>
                  <button>Check In</button>
                </div>
                <div className={styles.del} onClick={() => handleDelete(index)}>
                  <button>Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.text}>
            <h2>You don't have any projects. Create one.</h2>
          </div>
        )}
      </div>
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
              value={classroom}
              onChange={handleClassroom}
              placeholder="Enter classroom number"
            />
          </div>
          <div className={styles.info}>
            <label htmlFor="leaders">Team Leaders</label>
            <input
              type="text"
              name="leaders"
              id="leaders"
              value={classroom}
              onChange={handleClassroom}
              placeholder="Enter classroom number"
            />
          </div>
              <div className={styles.btn}>
                <button onClick={(e) => { e.stopPropagation(); generateCode(e); }}>Generate ID</button>
                <button type="submit">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ProjectsHome;
