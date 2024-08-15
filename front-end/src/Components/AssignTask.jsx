import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImSpinner9 } from "react-icons/im";
import { useToast } from "../store/ToastContext";

function AssignTask({ baseURL }) {
  const { toast } = useToast();
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
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
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <div className="container pt-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 bg-secondary">
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
                <button type="submit" className="btn btn-primary fs-5">
                  {loading && <ImSpinner9 className="spinner m-2" size={20} />}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignTask;
