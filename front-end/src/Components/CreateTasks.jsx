import { useState, useEffect } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import StudentStatus from "./StudentStatus";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMenuSharp } from "react-icons/io5";

function CreateTasks() {
  const navigate  = useNavigate();
  const [status, setStatus] = useState(false);
  const [tasks, setTasks] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [student, setStudent] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);
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
      const projectCode = sessionStorage.getItem("projectCode");
      const taskId = uuidv4();
      const response = await fetch(
        `http://localhost:5000/api/auth/assigntasks?projectCode=${projectCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, taskId }),
          credentials:'include',
        }
      );
      if (response.ok) {
        setValues({
          taskName: "",
          theme: "",
          description: "",
          deadline: "",
          files: null,
        });
        notifySuccess();
        setTasks(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const projectCode = sessionStorage.getItem("projectCode");
        const response = await fetch(
          `http://localhost:5000/api/auth/assignedDetails?projectCode=${projectCode}`,
          {
            method: "GET",
            credentials:'include',
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAssigned(data);
          setStatus(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!status) {
      fetchAssigned();
    }
  }, [status]);

  const handleAssigned = () => {
    setStatus(true);
    setStudent(false);
    setTasks(false);
  };

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
      const response = await fetch(
        `http://localhost:5000/api/auth/deletetask`,
        {
          method: "DELETE",
          
          body: JSON.stringify({ taskId }),
          credentials:'include',
        }
      );
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

  

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };
  
  const handleRoute =()=>{
    navigate(-1);
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
      <div className="position-fixed top-0 start-0 w-100 navbar navbar-expand-lg navbar-dark bg-info" style={{ height: "4rem", zIndex: 1030 }}>
        <div className="container d-flex justify-content-start">
          <button className="navbar-toggler-lg bg-info text-white fs-5 border-0" onClick={toggleDropdown}>
            <IoMenuSharp className="navbar-toggler-icon" />
          </button>
          <a className="navbar-brand ms-5">
            <h1 className="fs-1 ms-3 p-2">ClassSync</h1>
          </a>
        </div>
      </div>

      <div className="container" style={{ marginTop: "4rem" }}>
        <div className="row">
          <div className={`col-md-3 col-lg-auto position-fixed top-10 start-0 bg-dark min-vh-100 p-4 sidebar ${showDropdown ? 'sidebar-open' : 'sidebar-closed'}`}>
              <div>
                <ul className="list-unstyled ">
                  <li className="pb-3 fs-5">
                    <NavLink className="text-white text-decoration-none" onClick={handleRoute}>
                      Home
                    </NavLink>
                  </li>
                  <li  className="pb-3 fs-5">
                    <NavLink className="text-white text-decoration-none" onClick={handleAssigned}>
                      Assigned Tasks
                    </NavLink>
                  </li>
                  <li  className="pb-3 fs-5">
                    <NavLink className="text-white text-decoration-none" onClick={handleTasks}  >
                      Assign Tasks
                    </NavLink>
                  </li>
                  <li  className="pb-3 fs-5">
                    <NavLink className="text-white text-decoration-none" onClick={HandleStudent}>
                      Student Status
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
              <div className="container-lg" >
                {tasks  &&(
                  <div className="position-absolute top-50 start-50 translate-middle border rounded p-4  bg-secondary" style={{marginTop : "2rem",minWidth: "20rem"}}>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3" >
                        <label htmlFor="taskName" className="form-label">Task Name :</label>
                        <input
                          type="text"
                          className="form-control"
                          id="taskName"
                          name="taskName"
                          
                          value={values.taskName}
                          onChange={handleInputs}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="theme" className="form-label">Theme :</label>
                        <input
                          type="text"
                          className="form-control"
                          id="theme"
                          name="theme"
                          value={values.theme}
                          onChange={handleInputs}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description :</label>
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          rows="5"
                          placeholder="Describe the task"
                          value={values.description}
                          onChange={handleInputs}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="deadline" className="form-label">Last Date :</label>
                        <input
                          type="date"
                          className="form-control"
                          id="deadline"
                          name="deadline"
                          value={values.deadline}
                          onChange={handleInputs}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="files" className="form-label">Any Files :</label>
                        <input
                          type="file"
                          className="form-control"
                          id="files"
                          name="files"
                          onChange={handleFileInputs}
                        />
                      </div>
                      <div className="text-center">
                        <button type="submit" className="btn btn-primary">Submit</button>
                      </div>
                    </form>
                  </div>
                  )}
              </div>
          <div className=" col-md-9 col-lg-10 d-flex justify-content-center flex-wrap ">
            {!loading && !tasks && !student  && (
              <div className="d-flex flex-wrap justify-content-around mt-5">
                {assigned.length ? (
                  assigned.map((task, index) => (
                    <div key={index} className="card m-2 p-3 w-auto bg-gradient bg-secondary fs-5">
                      <p><span className="text-dark">Task Name :</span> <span className="text-white">{task.taskName}</span></p>
                      <p><span className="text-dark">Task theme :</span> <span className="text-white">{task.theme}</span></p>
                      <p><span className="text-dark">Task Description :</span> <span className="text-white">{task.description}</span></p>
                      <p><span className="text-dark">Last Submission :</span> <span className="text-white" style={{ width: "100%" }}>{task.deadline}</span></p>
                      <div className="d-flex justify-content-around mt-3">
                        <div className="me-2">
                          <button className="btn btn-warning" onClick={handleEdit}>Edit</button>
                        </div>
                        <div>
                          <button className="btn btn-danger" onClick={() => handleDelete(task.taskId)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div class="position-absolute top-50 start-50 transform-translate-middle container  text-center fs-3 w-50">
                  <p class="alert alert-danger">You haven't created any tasks..</p>
                </div>
          
                )}
              </div>
            )}
          </div>
        </div>

      {student && <StudentStatus />}
    </>
  );
}

export default CreateTasks;
