import React, { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import Loader from "./Loader";

const ClassDetails = () => {
  const { baseURL } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchClassDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const projectCode = sessionStorage.getItem("projectCode");
      const response = await fetch(
        `${baseURL}/api/auth/classdetails?projectCode=${projectCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch class details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, []);

  const handleSortChange = (event) => {
    const field = event.target.value;
    setSortField(field);
    const sortedData = [...data].sort((a, b) => {
      if (field === "regNo") {
        const numA = parseFloat(a[field]) || 0;
        const numB = parseFloat(b[field]) || 0;
        return sortOrder === "asc" ? numA - numB : numB - numA;
      } else {
        const strA = a[field] || "";
        const strB = b[field] || "";
        return sortOrder === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      }
    });

    setData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4 text-center text-primary">Class Details</h2>
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-end">
          <select
            value={sortField}
            onChange={handleSortChange}
            className="form-select w-auto"
            aria-label="Sort by"
            style={{ maxWidth: "200px" }}
          >
            <option value="name">Sort by Name</option>
            <option value="regNo">Sort by Reg No.</option>
            <option value="role">Sort by Role</option>
          </select>
        </div>
      </div>
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
              <p className="alert alert-info text-center">
                No students have joined the class yet.
              </p>
            </div>
          ) : (
            <table className="table table-striped table-responsive custom-table">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Reg No.</th>
                  <th scope="col">Team Name</th>
                  <th scope="col">Role</th>
                  <th scope="col">Email Address</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{index + 1}</td>
                    <td>{item.name || "N/A"}</td>
                    <td>{item.regNo || "N/A"}</td>
                    <td>{item.teamName || "N/A"}</td>
                    <td>{item.role || "N/A"}</td>
                    <td>{item.email || "N/A"}</td>
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

export default ClassDetails;
