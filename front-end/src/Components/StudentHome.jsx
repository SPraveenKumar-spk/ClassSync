import styles from "../Styles/StudentHome.module.css";
import React, { useState } from "react";
import Modal from "react-modal";
import Image from "../assets/profile.png";
import { MdCancel } from "react-icons/md";
const StudentHome = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [projectName,setprojectName]  = useState("");
  const [projectcode,setprojectcode] = useState("");
  const [projects, setProjects] = useState([]);
  const handleProject = (e) => {
    const { name, value } = e.target;
    setprojectName(value)
};

const handleclass = (e) => {
  const { name, value } = e.target;
  setprojectcode(value);
}
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = { projectName, projectcode };
    setProjects([...projects, newProject]);
    closeModal();
    setprojectName ("");
    setclassroom ("");
    
  };

  const handledel = (index) => {
    const confirmation = window.confirm("Are you sure  to delete the Project?");
   
    if (confirmation) {
      const updatedProjects = [...projects];
        updatedProjects.splice(index, 1); 
        setProjects(updatedProjects);
      alert("Your Project has been deleted successfully.")
    } 
}

  return (
    <>
     <div className={styles.navbar}>
        <div className={styles.logo}>
          {" "}
          <h1>ClassSync</h1>
        </div>

        <div className={styles.search}>
          <input type="text" id="search" name="search" placeholder="Search your projects" ></input>
        </div>
        <div className={styles.projects}>
          <button onClick={openModal}>Join Project</button>
        </div>
        <div className={styles.profile}>
          <img src = {Image} ></img>
        </div>
      </div>
      <div className={styles.store}>
      {projects.length ? (
            projects.map((project, index) => (
              <div key={index} className={styles.templates}>
                <h3>Project Name: {project.projectName}</h3>
                <h3>Project Code: {project.projectcode}</h3>
                <div className={styles.temp}>
                <div className={styles.check}><button>Check In</button></div>
                <div className={styles.del} onClick = { ()=> handledel(index)}> <button >Delete Project</button></div>
              </div>
              </div>
            ))
          ) : (
            <div className={styles.text}>
            <h2>you dont have any projects Join Now</h2>
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
       <div className={styles.header}><h1>Join Project</h1></div>
        <div className={styles.cancel} onClick={closeModal}><MdCancel /></div>
        
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
            <label htmlFor="projectcode">Project projectcode</label>
            <input
              type="text"
              name="projectcode"
              id="projectcode"
              value={projectcode}
              onChange={handleclass}
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
