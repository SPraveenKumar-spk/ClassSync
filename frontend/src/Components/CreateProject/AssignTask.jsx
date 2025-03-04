import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImSpinner9 } from "react-icons/im";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";
import { FaFileUpload, FaCheckCircle, FaTimes } from "react-icons/fa";

function AssignTask() {
  const { toast } = useToast();
  const { baseURL, token } = useAuth();
  const [values, setValues] = useState({
    taskName: "",
    theme: "",
    description: "",
    deadline: "",
  });
  const [filename, setFileName] = useState(null);
  const [fileOriginal, setFileOriginal] = useState(null);
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const projectCode = sessionStorage.getItem("projectCode");
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const taskId = uuidv4();
      const updatedValues = { ...values, taskId, filename, fileOriginal };

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
        setValues({ taskName: "", theme: "", description: "", deadline: "" });
        setFile(null);
        setFileUploaded(false);
        toast.success("Task assigned successfully!");
      } else {
        toast.error("Failed to assign task.");
      }
    } catch (error) {
      toast.error("Error assigning task.");
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
    if (
      !values.taskName ||
      !values.theme ||
      !values.description ||
      !values.deadline
    ) {
      toast.error(
        "Please fill out all required fields before uploading a file."
      );
      return;
    }
    if (!file) {
      toast.error("Please choose a file first!");
      return;
    }
    setFileLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${baseURL}/api/auth/files`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const fileData = await response.json();
        setFileName(fileData.fileId.filename);
        setFileOriginal(fileData.fileId.originalname);
        toast.success("File uploaded successfully!");
        setFileUploaded(true);
      } else {
        toast.error("File upload failed.");
      }
    } catch (error) {
      toast.error("File upload failed.");
    } finally {
      setFileLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 py-6 flex justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 w-full max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Assign Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label
              htmlFor="taskName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Task Name
            </label>
            <input
              type="text"
              id="taskName"
              name="taskName"
              value={values.taskName}
              onChange={handleInputs}
              placeholder="Enter task name"
              className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="theme"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Theme
            </label>
            <input
              type="text"
              id="theme"
              name="theme"
              value={values.theme}
              onChange={handleInputs}
              placeholder="Enter theme"
              className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleInputs}
              placeholder="Enter description"
              className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows="3 sm:rows-4"
              required
            />
          </div>
          <div>
            <label
              htmlFor="deadline"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={values.deadline}
              onChange={handleInputs}
              className="shadow appearance-none border rounded w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="space-y-3 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="file"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Attachment
              </label>
              <input
                type="file"
                id="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="button"
              onClick={handleFileUpload}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 mt-6 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto flex justify-center items-center"
              disabled={fileLoading}
            >
              {fileLoading ? (
                <ImSpinner9 className="animate-spin mr-2" size={20} />
              ) : (
                <>
                  <FaFileUpload className="mr-2" />
                  Upload
                </>
              )}
            </button>
          </div>
          {fileUploaded && (
            <div className="flex items-center text-green-600 text-sm">
              <FaCheckCircle className="mr-2" />
              File uploaded successfully!
            </div>
          )}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <ImSpinner9 className="animate-spin mr-2" size={20} />
            ) : (
              <>
                <FaCheckCircle className="mr-2" />
                Submit
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssignTask;
