import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import Loader from "./Loader";

const ClassDetails = () => {
  const { baseURL } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      console.log("classdetails", result);
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

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4 text-center text-primary">Class Details</h2>
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
                Students not joined in the class
              </p>
            </div>
          ) : (
            <table className="table table-striped table-responsive custom-table">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Reg No</th>
                  <th scope="col">Team Name</th>
                  <th scope="col">Email Address</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.sno || index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.regNo}</td>
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

export default ClassDetails;
