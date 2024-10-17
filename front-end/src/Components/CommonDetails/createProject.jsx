import { useState } from "react";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";
import Modal from "react-modal";

function CreateProject({ Open, close }) {
  const { token, baseURL } = useAuth();
  const { toast } = useToast();

  const [project, setProject] = useState({
    projectName: "",
    projectCode: "",
    section: "",
    classroom: "",
  });

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setProject((prevState) => ({ ...prevState, [name]: value }));
  };

  const generateCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    setProject((prevState) => ({ ...prevState, projectCode: code }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseURL}/api/auth/createprojects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
      });
      if (response.ok) {
        sessionStorage.setItem("flag", true);
        setProject({
          projectName: "",
          randomCode: "",
          section: "",
          classroom: "",
        });
        toast.success("Your Project has been created successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={Open}
      onRequestClose={close}
      contentLabel="Create Project Modal"
      className="modal-dialog"
    >
      <div className="container p-5 mt-5 position-fixed top-50 start-50 translate-middle">
        <div className="p-4 modal-content border border bg-light rounded-4">
          <div className="modal-header position-relative">
            <div>
              <h1 className="modal-title p-1">Create Project</h1>
            </div>
            <div className="position-absolute top-0 end-0">
              <button
                type="button"
                className="btn-close fs-5"
                onClick={close}
              ></button>
            </div>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3 mt-3">
                <label htmlFor="projectname" className="form-label">
                  Project Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="projectname"
                  name="projectName"
                  value={project.projectName}
                  onChange={handleInputs}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="classroom" className="form-label">
                  Classroom
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="classroom"
                  name="classroom"
                  value={project.classroom}
                  onChange={handleInputs}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="section" className="form-label">
                  Section
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="section"
                  name="section"
                  value={project.section}
                  onChange={handleInputs}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="d-flex justify-content-center align-items-center">
                <button
                  type="submit"
                  className="btn btn-success mb-3 p-2 fs-5"
                  onClick={generateCode}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CreateProject;
