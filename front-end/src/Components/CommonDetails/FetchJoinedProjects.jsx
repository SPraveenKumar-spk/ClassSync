import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { useAuth } from "../../store/auth";

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          setProjects(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (projectCode) => {
    const confirmation = window.confirm("Are you sure to delete the project?");
    if (confirmation) {
      try {
        const response = await fetch(
          `${baseURL}/api/auth/deleteCreatedProject?projectCode=${projectCode}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          setProjects((prevProjects) =>
            prevProjects.filter(
              (project) => project.projectCode !== projectCode
            )
          );
          notifySuccess();
        } else {
          notifyError();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCheck = (projectCode, teamName, joinType, projectName) => {
    sessionStorage.setItem("projectCode", projectCode);
    sessionStorage.setItem("projectName", projectName);
    sessionStorage.setItem("teamName", teamName);
    sessionStorage.setItem("joinType", joinType);
    navigate("/submissions");
  };

  return (
    <>
      <div>
        {loading ? (
          <Loader />
        ) : (
          <div className="container d-flex justify-content-center align-items-center flex-wrap mt-5 pt-5">
            {projects.length ? (
              projects.map((project, index) => (
                <div key={index} className="card m-2">
                  <div className="card-body rounded bg-secondary">
                    <h3 className="card-title p-1">
                      <span className="text-info">Project Name: </span>
                      {project.projectName ? project.projectName : "NA"}
                    </h3>
                    {project.projectCode ? (
                      <>
                        <h3 className="card-text">
                          {" "}
                          <span className="text-info">Project ID: </span>
                          {project.projectCode ? project.projectCode : "NA"}
                        </h3>
                        <h3 className="card-text p-1">
                          <span className="text-info">JoinType : </span>{" "}
                          {project.joinType ? project.joinType : "NA"}
                        </h3>

                        {project.joinType === "Team" && (
                          <>
                            <h3 className="card-text p-1">
                              <span className="text-info">TeamName : </span>{" "}
                              {project.teamName ? project.teamName : "NA"}
                            </h3>
                            <h3 className="card-text p-1">
                              <span className="text-info">Role : </span>{" "}
                              {project.role ? project.role : "NA"}
                            </h3>
                          </>
                        )}
                        <div className="d-flex justify-content-between pt-5">
                          <button
                            className="btn btn-warning"
                            onClick={() =>
                              handleCheck(
                                project.projectCode,
                                project.teamName,
                                project.joinType,
                                project.projectName
                              )
                            }
                          >
                            Check In
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(project.projectCode)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <h3 className="card-text">Project ID: Not generated</h3>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div
                className="alert alert-info text-center  text-nowrap"
                role="alert"
                style={{ width: "auto", minWidth: "50%" }}
              >
                you haven't enrolled any projects...
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default FetchJoinedProjects;
