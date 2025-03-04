import { useState } from "react";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";
import Modal from "react-modal";
import { FaTimes, FaPlusCircle } from "react-icons/fa";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "500px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
};

Modal.setAppElement("#root");

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
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const generateCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters[Math.floor(Math.random() * characters.length)];
    }
    setProject((prev) => ({ ...prev, projectCode: code }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    generateCode();

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
          projectCode: "",
          section: "",
          classroom: "",
        });
        toast.success("Your project has been created successfully!");
        close();
      } else {
        toast.error("Failed to create project.  Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the project.");
    }
  };

  return (
    <Modal
      isOpen={Open}
      onRequestClose={close}
      style={customStyles}
      contentLabel="Create Project Modal"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaPlusCircle className="mr-2 text-indigo-500" /> Create Project
          </h2>
          <button
            onClick={close}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex-grow">
          <div className="mb-4">
            <label
              htmlFor="projectName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={project.projectName}
              onChange={handleInputs}
              required
              placeholder="Enter project name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="classroom"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Classroom
            </label>
            <input
              type="text"
              id="classroom"
              name="classroom"
              value={project.classroom}
              onChange={handleInputs}
              required
              placeholder="Enter classroom"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="section"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Section
            </label>
            <input
              type="text"
              id="section"
              name="section"
              value={project.section}
              onChange={handleInputs}
              required
              placeholder="Enter section"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Create Project
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default CreateProject;
