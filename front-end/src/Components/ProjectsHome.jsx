import { MdCancelPresentation } from "react-icons/md";
import { useState } from "react";
import styles from "../Styles/ProjectsHome.module.css";
const ProjectsHome = () => {
  const [useModal, setModal] = useState(false);
  const closeModal = () => setModal(false);

  const [projects, setProjects] = useState({
    projectname: "",
    classroom: "",
  });

  const handleInput = (e) => {
    let name = e.target.name;
    console.log(name);
    let val = e.target.value;
    console.log(val);
    setProjects({ ...projects, val });
  };
  console.log(projects);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`http://localhost:5000/projects`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: token,
  //       },
  //       body: JSON.stringify(projects),
  //     });
  //     if (response.ok) {
  //       setProjects({
  //         projectname: "",
  //         classroom: "",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const MyModal = () => {
    return (
      <>
        <div className={styles.wrapper}></div>
        <div className={styles.modalcontainer}>
          <div className={styles.details}>
            <h1>Create Project</h1>
            <div className={styles.cancel} onClick={closeModal}>
              <MdCancelPresentation />
            </div>
            <form className={styles.info}>
              <div>
                <label htmlFor="projectname">Project Name</label>
                <input
                  type="text"
                  name="projectname"
                  id="projectname"
                  value={projects.projectname}
                  onChange={handleInput}
                  placeholder="Enter the project name"
                />
              </div>
              <div>
                <label htmlFor="classroom">Class Room</label>
                <input
                  type="text"
                  name="classroom"
                  id="classroom"
                  value={projects.classroom}
                  onChange={handleInput}
                  placeholder="Enter classroom number"
                />
              </div>
              <div className={styles.submit}>
                <button>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.btn}>
          <button onClick={() => setModal(true)}>Create Projects</button>
          {useModal && <MyModal />}
        </div>
        <div className={styles.container}></div>
      </div>
    </>
  );
};

export default ProjectsHome;
