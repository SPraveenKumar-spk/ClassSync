import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImSpinner9 } from "react-icons/im";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";

function AssignTask({ baseURL }) {
  const { toast } = useToast();
  const { token } = useAuth();
  const [values, setValues] = useState({
    taskName: "",
    theme: "",
    description: "",
    deadline: "",
  });
  const [filename, setFileName] = useState(null);
  const [fileOriginal, setfileOriginal] = useState(null);
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  const projectCode = sessionStorage.getItem("projectCode");
  const notifySuccess = () => {
    toast.success("Task assigned successfully");
  };

  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const taskId = uuidv4();
      const updatedValues = { ...values, taskId, filename, fileOriginal };
      console.log(updatedValues);
      const response = await fetch(
        `${baseURL}/api/auth/assigntasks?projectCode=${projectCode}`,
        {
          method: "POST",
          body: JSON.stringify(updatedValues),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setValues({
          taskName: "",
          theme: "",
          description: "",
          deadline: "",
        });
        setFile(null);
        setFileUploaded(false);
        notifySuccess();
      } else {
        console.error("Failed to assign task");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const { taskName, theme, description, deadline } = values;
    if (!taskName || !theme || !description || !deadline) {
      toast.error(
        "Please fill out all required fields before uploading a file."
      );
      return;
    }
    if (!file) {
      toast.error("Please choose a file first");
      return;
    }
    setFileLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      const response = await fetch(`${baseURL}/api/auth/files`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const fileData = await response.json();

        setFileName(fileData.fileId.filename);
        setfileOriginal(fileData.fileId.originalname);
        toast.success("File uploaded successfully");
        setFileUploaded(true);
      }
    } catch (error) {
      console.error("File upload failed", error);
      toast.error("File upload failed");
    } finally {
      setFileLoading(false);
    }
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
                  Deadline :
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
              <div className="mb-3 ">
                <label htmlFor="file" className="form-label">
                  Any Files :
                </label>
                <div className="d-flex align-items-center">
                  <input
                    type="file"
                    className="form-control mx-2"
                    id="file"
                    name="file"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                  <button
                    className="btn btn-outline-light"
                    onClick={handleFileUpload}
                    disabled={fileLoading}
                  >
                    {fileLoading ? (
                      <ImSpinner9 className="spinner m-2" size={20} />
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary fs-5"
                  disabled={loading}
                >
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
