import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useToast } from "../../store/ToastContext";
import { useAuth } from "../../store/auth";

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

    if (
      joinedProjects
        .map((code) => code.toLowerCase())
        .includes(joinProjects.projectCode.toLowerCase())
    ) {
      toast.error("You have already joined this project.");
      return;
    }

    const newProject = {
      projectName: joinProjects.projectName,
      projectCode: joinProjects.projectCode,
      joinType: joinProjects.joinType,
      role: joinProjects.joinType === "Team" ? team.role : undefined,
      teamName: joinProjects.joinType === "Team" ? team.teamName : undefined,
    };

    try {
      const response = await fetch(
        `${baseURL}/api/auth/studentprojects?token=${token}`,
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
      } else if (response.status == 400) {
        toast.error("Already, you have joined the project.");
      } else if (response.status === 401) {
        toast.error("Invalid Project Code");
      }
    } catch (error) {
      console.log(error);
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
      contentLabel="Join Project Modal"
      className="modal-dialog"
    >
      <div className="container p-5 mt-5 position-fixed top-50 start-50 translate-middle">
        <div className="p-4 modal-content border bg-light rounded-4">
          <div className="modal-header position-relative">
            <h1 className="modal-title">Join Project</h1>
            <button
              type="button"
              className="btn-close fs-5 text-danger position-absolute top-0 end-0"
              onClick={closeJoin}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3 mt-3">
                <label htmlFor="projectName" className="form-label">
                  Project Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="projectName"
                  value={joinProjects.projectName}
                  onChange={handleProjectInputs}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="projectCode" className="form-label">
                  Project Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="projectCode"
                  value={joinProjects.projectCode}
                  onChange={handleProjectInputs}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Join as</label>
                <div>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="team"
                      name="joinType"
                      value="Team"
                      checked={joinProjects.joinType === "Team"}
                      onChange={handleProjectInputs}
                      className="form-check-input"
                      required
                    />
                    <label htmlFor="team" className="form-check-label">
                      Team
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="individual"
                      name="joinType"
                      value="Individual"
                      checked={joinProjects.joinType === "Individual"}
                      onChange={handleProjectInputs}
                      className="form-check-input"
                      required
                    />
                    <label htmlFor="individual" className="form-check-label">
                      Individual
                    </label>
                  </div>
                </div>
              </div>

              {joinProjects.joinType === "Team" && (
                <>
                  <div className="mb-3">
                    <label htmlFor="teamName" className="form-label">
                      Team Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="teamName"
                      value={team.teamName}
                      onChange={handleTeamInputs}
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <div>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="projectLead"
                          name="role"
                          value="Project Lead"
                          checked={team.role === "Project Lead"}
                          onChange={handleTeamInputs}
                          className="form-check-input"
                        />
                        <label
                          htmlFor="projectLead"
                          className="form-check-label"
                        >
                          Project Lead
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="projectMember"
                          name="role"
                          value="Project Member"
                          checked={team.role === "Project Member"}
                          onChange={handleTeamInputs}
                          className="form-check-input"
                        />
                        <label
                          htmlFor="projectMember"
                          className="form-check-label"
                        >
                          Project Member
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-success mb-3 pe-5 ps-5 fs-4 text-center"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default JoinProject;
