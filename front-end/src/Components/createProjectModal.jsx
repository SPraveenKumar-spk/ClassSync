// CreateProjectModal.js

import React, { useState } from "react";
import Modal from "react-modal";
import { MdCancel } from "react-icons/md";
import styles from "../Styles/ProjectsHome.module.css";

const CreateProjectModal = ({ isOpen, closeModal, handleSubmit, generateCode, projectName, handleProject, classroom, handleClassroom, students, handleStudents }) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  const handleCloseModal = () => {
    setModalIsOpen(false);
    closeModal();
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Create Project Modal"
      className={styles.modalcustom}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Create Project</h1>
        </div>
        <div className={styles.cancel} onClick={handleCloseModal}>
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
  );
};

export default CreateProjectModal;
