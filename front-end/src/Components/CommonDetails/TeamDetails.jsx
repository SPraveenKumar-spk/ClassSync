import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import Loader from "../Loader";

const TeamDetails = () => {
  const { baseURL } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("none");

  const fetchTeamDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const projectCode = sessionStorage.getItem("projectCode");
      const teamName = sessionStorage.getItem("teamName");
      const response = await fetch(
        `${baseURL}/api/auth/teamDetails?projectCode=${projectCode}&teamName=${teamName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        setData(result);
      } else if (response.status === 404) {
        setError("Students not joined in the project");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, []);

  useEffect(() => {
    if (sortCriteria === "none") return;

    let sortedData = [...data];
    switch (sortCriteria) {
      case "name":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "regNo":
        sortedData.sort((a, b) => a.regNo.localeCompare(b.regNo));
        break;
      default:
        return;
    }
    setData(sortedData);
  }, [sortCriteria, data]);

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  return (
    <div className="container mt-5 pt-5">
      {!error && (
        <>
          <h2 className="mb-4 text-center text-primary">Team Details</h2>
          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-end">
              <select
                className="form-select w-auto"
                value={sortCriteria}
                onChange={handleSortChange}
              >
                <option value="none">Sort by</option>
                <option value="name">Sort by Name</option>
                <option value="regNo">Sort by Reg No</option>
              </select>
            </div>
          </div>
        </>
      )}
      <div className="row justify-content-center">
        <div className="col-12">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="mx-auto w-50 mt-5">
              <p className="alert alert-danger text-center">{error}</p>
            </div>
          ) : data.length === 0 ? (
            <div className="mx-auto w-50 mt-5">
              <p className="alert alert-danger text-center">
                No student in your team.
              </p>
            </div>
          ) : (
            <table className="table table-striped table-responsive custom-table">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Reg No</th>
                  <th scope="col">Role</th>
                  <th scope="col">Team Name</th>
                  <th scope="col">Email Address</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.sno || index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.registrationNumber}</td>
                    <td>{item.role}</td>
                    <td>{item.teamName}</td>
                    <td>{item.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
