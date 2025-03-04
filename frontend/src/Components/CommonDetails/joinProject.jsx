import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";
import { FaTimes, FaUserPlus, FaUsers } from "react-icons/fa";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    width: "90%",
    maxWidth: "500px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

Modal.setAppElement("#root");

const JoinProject = ({ OpenJoin, closeJoin }) => {
  const { toast } = useToast();
  const { token, baseURL } = useAuth();

  const [joinProjects, setJoinProjects] = useState({
    projectName: "",
    projectCode: "",
    joinType: "Individual",
  });

  const [team, setTeam] = useState({
    role: "Project Member",
    teamName: "",
  });

  const [joinedProjects, setJoinedProjects] = useState([]);

  useEffect(() => {
    const fetchJoinedProjects = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/auth/myProjects?token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setJoinedProjects(data.map((project) => project.projectCode));
        }
      } catch (error) {
        toast.error("Failed to fetch joined projects.");
      }
    };

    fetchJoinedProjects();
  }, [baseURL, token, toast]);

  const handleProjectInputs = (e) => {
    const { name, value } = e.target;
    setJoinProjects((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleTeamInputs = (e) => {
    const { name, value } = e.target;
    setTeam((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = {
      projectName: joinProjects.projectName,
      projectCode: joinProjects.projectCode,
      joinType: joinProjects.joinType,
      role: joinProjects.joinType === "Team" ? team.role : undefined,
      teamName: joinProjects.joinType === "Team" ? team.teamName : undefined,
    };

    try {
      const response = await fetch(
        `${baseURL}/api/auth/joinprojects?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProject),
        }
      );

      if (response.ok) {
        toast.success("Project joined successfully!");
        resetForm();
        closeJoin();
        setJoinedProjects((prev) => [...prev, joinProjects.projectCode]);
      } else if (response.status === 400) {
        toast.error("Already, you have joined the project.");
      } else if (response.status === 401) {
        toast.error("Invalid Project Code");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while joining the project.");
    }
  };

  const resetForm = () => {
    setJoinProjects({
      projectName: "",
      projectCode: "",
      joinType: "Individual",
    });
    setTeam({
      role: "Project Member",
      teamName: "",
    });
  };

  return (
    <Modal
      isOpen={OpenJoin}
      onRequestClose={closeJoin}
      style={customStyles}
      contentLabel="Join Project Modal"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaUserPlus className="mr-2" /> Join Project
          </h2>
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={closeJoin}
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
              value={joinProjects.projectName}
              onChange={handleProjectInputs}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="projectCode"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Project Code
            </label>
            <input
              type="text"
              id="projectCode"
              name="projectCode"
              value={joinProjects.projectCode}
              onChange={handleProjectInputs}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter project code"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Join As:
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-indigo-600"
                  name="joinType"
                  value="Team"
                  checked={joinProjects.joinType === "Team"}
                  onChange={handleProjectInputs}
                />
                <span className="ml-2 text-gray-700">
                  <FaUsers className="inline-block mr-1" /> Team
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-indigo-600"
                  name="joinType"
                  value="Individual"
                  checked={joinProjects.joinType === "Individual"}
                  onChange={handleProjectInputs}
                />
                <span className="ml-2 text-gray-700">
                  <FaUserPlus className="inline-block mr-1" /> Individual
                </span>
              </label>
            </div>
          </div>
          {joinProjects.joinType === "Team" && (
            <div className="mb-4">
              <label
                htmlFor="teamName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={team.teamName}
                onChange={handleTeamInputs}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter team name"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Join Project
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default JoinProject;
