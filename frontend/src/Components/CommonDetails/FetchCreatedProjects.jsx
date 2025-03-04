import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { useAuth } from "../../store/auth";
import {
  FaTrash,
  FaIdCard,
  FaCheckCircle,
  FaBook,
  FaBuilding,
} from "react-icons/fa";

function FetchProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, baseURL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/auth/fetchCreatedProjects`,
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

  const handleDelete = async (projectCode) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(
          `${baseURL}/api/auth/deleteCreatedProject?projectCode=${projectCode}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          setProjects((prev) =>
            prev.filter((project) => project.projectCode !== projectCode)
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCheck = (projectCode, projectName) => {
    sessionStorage.setItem("projectCode", projectCode);
    sessionStorage.setItem("projectName", projectName);
    navigate("/createtasks");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Created Projects
        </h1>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader />
          </div>
        ) : projects.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Make the grid responsive */}
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {project.projectName || "NA"}
                  </h2>
                  <div className="mb-3">
                    <p className="text-gray-600  flex items-center">
                      <FaBook className="mr-2 text-gray-400" />
                      Classroom:{" "}
                      <span className="font-medium ml-1">
                        {project.classroom || "NA"}
                      </span>
                    </p>
                    <p className="text-gray-600 pt-2 flex items-center">
                      <FaBuilding className="mr-2 text-gray-400" />
                      Section:{" "}
                      <span className="font-medium ml-1">
                        {project.section || "NA"}
                      </span>
                    </p>
                  </div>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <FaIdCard className="mr-2 text-gray-400" />
                    Project ID:{" "}
                    <span className="font-medium ml-1 text-purple-500">
                      {project.projectCode || "Not generated"}
                    </span>
                  </p>

                  {project.projectCode && (
                    <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                        onClick={() =>
                          handleCheck(project.projectCode, project.projectName)
                        }
                      >
                        <FaCheckCircle className="mr-2" />
                        Check In
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                        onClick={() => handleDelete(project.projectCode)}
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            You haven't created any projects yet...
          </div>
        )}
      </div>
    </div>
  );
}

export default FetchProjects;
