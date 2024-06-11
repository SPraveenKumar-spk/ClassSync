import { useState, useEffect } from "react";
import styles from "../Styles/CreateTasks.module.css";
import { NavLink } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import StudentStatus from "./StudentStatus";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";
function CreateTasks() {
  const [status, setStatus] = useState(false);
  const [tasks, setTasks] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [student, setStudent] = useState(false);
  const [values, setValues] = useState({
    taskName: "",
    theme: "",
    description: "",
    deadline: "",
    files: null,
  });
  const notifySuccess = () => {
    toast.success("Task assigned successfully");
  };
  const notifySuccess2 = () => {
    toast.success("Task deleted successfully");
  };
  const notifyError = () => {
    toast.error("Failed to delete task");
  };
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const projectCode = localStorage.getItem("projectCode");
      const taskId = uuidv4();
      const response = await fetch(
        `https://classsyncserver.vercel.app/api/auth/assigntasks?projectCode=${projectCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer${token}`,
          },
          body: JSON.stringify({ ...values, taskId }),
        }
      );
      if (response.ok) {
        setValues({
          taskName: " ",
          theme: " ",
          description: " ",
          deadline: " ",
          files: null,
        });
        notifySuccess();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssigned = () => {
    setStatus(true);
    setStudent(false);
    setTasks(false);
  };

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const projectCode = localStorage.getItem("projectCode");
        console.log(projectCode);
        const response = await fetch(
          `https://classsyncserver.vercel.app/api/auth/assignedDetails?projectCode=${projectCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTasks(false);
          setAssigned(data);
          setStatus(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (status) {
      fetchAssigned();
    }
  }, [status]);

  const handleTasks = async () => {
    setStatus(false);
    setStudent(false);
    setTasks((prevState) => !prevState);
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFileInputs = (e) => {
    const file = e.target.files[0];
    setValues({ ...values, files: file });
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://classsyncserver.vercel.app/api/auth/deletetask`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId }),
        }
      );
      console.log(response.json());
      if (response.ok) {
        setAssigned((prevAssigned) =>
          prevAssigned.filter((task) => task.taskId !== taskId)
        );
        notifySuccess2();
      } else {
        notifyError();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const HandleStudent = () => {
    setStudent(true);
    setTasks(false);
    setStatus(false);
  };
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
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h1>ClassSync</h1>
          <ul>
            <NavLink className={styles.links} to="/projectshome">
              Home
            </NavLink>
            <NavLink className={styles.links} onClick={handleAssigned}>
              Assigned Tasks
            </NavLink>
            <NavLink className={styles.links} onClick={handleTasks}>
              Assign Tasks
            </NavLink>
            <NavLink className={styles.links} onClick={HandleStudent}>
              Student Status
            </NavLink>
          </ul>
        </div>
        {tasks && (
          <div className={styles.taskcontainer}>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="taskName">Task Name : </label>
                <input
                  type="text"
                  id="taskName"
                  name="taskName"
                  value={values.taskName}
                  onChange={handleInputs}
                  required
                />
              </div>
              <div>
                <label htmlFor="theme">Theme : </label>
                <input
                  type="text"
                  id="theme"
                  name="theme"
                  value={values.theme}
                  onChange={handleInputs}
                  required
                />
              </div>
              <div>
                <label htmlFor="description">Description : </label>
                <textarea
                  id="description"
                  name="description"
                  rows="10"
                  cols="65"
                  placeholder="Describe about the task"
                  value={values.description}
                  onChange={handleInputs}
                  required
                />
              </div>
              <div>
                <label htmlFor="deadline">Last Date : </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={values.deadline}
                  onChange={handleInputs}
                  required
                />
              </div>
              <div>
                <label htmlFor="files">Any Files : </label>
                <input
                  type="file"
                  name="files"
                  id="files"
                  onChange={handleFileInputs}
                />
              </div>
              <div className={styles.btn}>
                <button>Submit</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        status && (
          <div className={styles.assignedContainer}>
            {assigned.length ? (
              assigned.map((task, index) => (
                <div key={index} className={styles.templates}>
                  <p>
                    <span>Task Id : </span> {task.taskId}
                  </p>
                  <p>
                    <span>Task Name :</span> {task.taskName}
                  </p>
                  <p>
                    <span>Task theme :</span> {task.theme}
                  </p>
                  <p>
                    <span>Task Description :</span> {task.description}
                  </p>
                  <p>
                    <span>Last Submission :</span> {task.deadline}
                  </p>
                  {/* <p>
                  <span>Task files :</span> {task.files}
                </p> */}
                  <div className={styles.editContainer}>
                    <div className={styles.item}>
                      <button onClick={handleEdit}>Edit</button>
                    </div>

                    <div className={styles.item}>
                      <button onClick={() => handleDelete(task.taskId)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1>You haven't created any tasks..</h1>
            )}
          </div>
        )
      )}
      {student && <StudentStatus />}
    </>
  );
}

export default CreateTasks;
