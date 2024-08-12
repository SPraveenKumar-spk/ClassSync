
  const [values, setValues] = useState({
    taskName: "",
    theme: "",
    description: "",
    deadline: "",
  });
  const [file, setFile] = useState("");
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
      const formData = new FormData();
      formData.append("taskId", taskId);
      formData.append("taskName", values.taskName);
      formData.append("theme", values.theme);
      formData.append("description", values.description);
      formData.append("deadline", values.deadline);
      formData.append("file", file);
      console.log(file);
      const response = await fetch(
        `${baseURL}/api/auth/assigntasks?projectCode=${projectCode}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      if (response.ok) {
        setValues({
          taskName: "",
          theme: "",
          description: "",
          deadline: "",
          files: "",
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
          `${baseURL}/api/auth/assignedDetails?projectCode=${projectCode}`,
          {
            method: "GET",
            credentials: "include",
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
    toggleSidebar();
  };

  const handleTasks = async () => {
    setStatus(false);
    setStudent(false);
    setTasks((prevState) => !prevState);
    toggleSidebar();
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/deletetask`, {
        method: "DELETE",
        body: JSON.stringify({ taskId }),
        credentials: "include",
      });
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
    toggleSidebar();
  };

  const toggleSidebar = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleRoute = () => {
    navigate(-1);
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
      <div
        className="position-fixed w-100  navbar navbar-expand-lg navbar-dark bg-info"
        style={{ height: "4rem" }}
      >
        <div className="container d-flex justify-content-start">
          <button
            className="navbar-toggler-lg bg-info text-white fs-5 border-0"
            onClick={toggleSidebar}
          >
            <IoMenuSharp size={40} />
          </button>
          <a className="navbar-brand ms-5">
            <h1 className="fs-1 ms-3 p-2">ClassSync</h1>
          </a>
        </div>
      </div>

      <div className="row">
        <aside
          id="sidebar"
          className={`col-md-3 col-lg-2 bg-dark min-vh-100 p-4 ${
            isExpanded ? "expand" : ""
          }`}
        >
          <div className="d-flex">
            <button
              className="toggle-btn"
              type="button"
              onClick={toggleSidebar}
            >
              <IoMenuSharp size={30} />
            </button>
            <div className="sidebar-logo">
              <h2 className="text-light">ClassSync</h2>
            </div>
          </div>
          <ul className="sidebar-nav list-unstyled mt-5">
            <li className="pb-3 fs-5">
              <NavLink
                className="text-white text-decoration-none"
                onClick={handleRoute}
              >
                <FaHome className="me-2" size={20} /> Home
              </NavLink>
            </li>
            <li className="pb-3 fs-5">
              <NavLink
                className="text-white text-decoration-none"
                onClick={handleAssigned}
              >
                <FaTasks className="me-2" size={20} /> Assigned Tasks
              </NavLink>
            </li>
            <li className="pb-3 fs-5">
              <NavLink
                className="text-white text-decoration-none"
                onClick={handleTasks}
              >
                <GrTasks className="me-2" size={20} /> Assign Tasks
              </NavLink>
            </li>
            <li className="pb-3 fs-5">
              <NavLink
                className="text-white text-decoration-none"
                onClick={HandleStudent}
              >
                <FaUserGraduate className="me-2" size={20} /> Student Status
              </NavLink>
            </li>
          </ul>
          <div className="sidebar-footer text-light mt-auto">
            <TbLogout2 /> Logout
          </div>
        </aside>

        <div
          className={`col-md-9 col-lg-10 ${
            isExpanded ? "content-margin" : "content-full"
          }`}
        >
          {tasks && (
            <div className="m-5 border rounded p-4 bg-secondary">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="taskName" className="form-label">
                    Task Name :
                  </label>
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
                  <label htmlFor="theme" className="form-label">
                    Theme :
                  </label>
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
                  <label htmlFor="description" className="form-label">
                    Description :
                  </label>
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
                  <label htmlFor="deadline" className="form-label">
                    Last Date :
                  </label>
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
                  <label htmlFor="files" className="form-label">
                    Any Files :
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="files"
                    name="files"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="d-flex">
            {!loading && !tasks && !student && assigned.length ? (
              assigned.map((task, index) => (
                <div
                  key={index}
                  className=" mt-5 p-2 rounded  bg-secondary fs-5 w-50"
                >
                  <p>
                    <span className="text-dark">Task Name :</span>{" "}
                    <span className="text-white">{task.taskName}</span>
                  </p>
                  <p>
                    <span className="text-dark">Task theme :</span>{" "}
                    <span className="text-white">{task.theme}</span>
                  </p>
                  <p>
                    <span className="text-dark"> Description :</span>{" "}
                    <span className="text-white">{task.description}</span>
                  </p>
                  <p>
                    <span className="text-dark">Last Date :</span>{" "}
                    <span className="text-white">{task.deadline}</span>
                  </p>
                  <div className="d-flex justify-content-around mt-3">
                    <div className="me-2">
                      <button className="btn btn-warning" onClick={handleEdit}>
                        Edit
                      </button>
                    </div>
                    <div>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(task.taskId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="position-absolute d-flex justify-content-end text-center fs-3 w-50">
                <p className="alert alert-danger">
                  You haven't created any tasks..
                </p>
              </div>
            )}
          </div>
          {student && <StudentStatus />}
        </div>
      </div>
    </>
  );
}

export default CreateTasks;
