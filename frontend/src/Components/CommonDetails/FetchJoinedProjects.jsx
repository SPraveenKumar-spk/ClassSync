import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { useAuth } from "../../store/auth";
import {
  FaCheckCircle,
  FaUsers,
  FaIdCard,
  FaCode,
  FaProjectDiagram,
  FaUserTie,
} from "react-icons/fa";
import { GiTeamIdea } from "react-icons/gi";

function FetchJoinedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, baseURL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/fetchJoinedProjects`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [baseURL, token]);

  const handleCheck = (project) => {
    sessionStorage.setItem("projectCode", project.projectCode);
    sessionStorage.setItem("projectName", project.projectName);
    sessionStorage.setItem("teamName", project.teamName);
    sessionStorage.setItem("joinType", project.joinType);
    navigate("/submissions");
  };

  const getIcon = (fieldName) => {
    switch (fieldName) {
      case "Project ID":
        return <FaCode className="mr-2 text-gray-400" />;
      case "Join Type":
        return <FaProjectDiagram className="mr-2 text-gray-400" />;
      case "Team Name":
        return <GiTeamIdea className="mr-2 text-gray-400" />;
      case "Role":
        return <FaUserTie className="mr-2 text-gray-400" />;
      default:
        return <FaIdCard className="mr-2 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Enrolled Projects
        </h1>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length ? (
              projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {project.projectName || "NA"}
                    </h2>
                    <p className="text-gray-600 mb-3 flex items-center">
                      {getIcon("Project ID")}
                      Project ID:{" "}
                      <span className="font-medium ml-1">
                        {project.projectCode || "NA"}
                      </span>
                    </p>
                    <p className="text-gray-600 mb-3 flex items-center">
                      {getIcon("Join Type")}
                      Join Type:{" "}
                      <span className="font-medium ml-1">
                        {project.joinType || "NA"}
                      </span>
                    </p>

                    {project.joinType === "Team" && (
                      <>
                        <p className="text-gray-600 mb-3 flex items-center">
                          {getIcon("Team Name")}
                          Team Name:{" "}
                          <span className="font-medium ml-1">
                            {project.teamName || "NA"}
                          </span>
                        </p>
                        <p className="text-gray-600 mb-3 flex items-center">
                          {getIcon("Role")}
                          Role:{" "}
                          <span className="font-medium ml-1">
                            {project.role || "NA"}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                  {/* Button at the Bottom */}
                  <div className="p-6 border-t border-gray-200">
                    {" "}
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 w-full flex items-center justify-center" // w-full to take full width
                      onClick={() => handleCheck(project)}
                    >
                      <FaCheckCircle className="mr-2" />
                      Check In
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 col-span-full">
                You haven't enrolled in any projects yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FetchJoinedProjects;
