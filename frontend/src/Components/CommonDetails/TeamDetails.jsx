import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import Loader from "../Loader";
import { FaSortAlphaDown, FaSortNumericDown, FaUsers } from "react-icons/fa";

const TeamDetails = () => {
  const { baseURL } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("none");

  const joinType = sessionStorage.getItem("joinType");

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
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [baseURL]);

  const handleSortChange = (event) => {
    const criteria = event.target.value;
    setSortCriteria(criteria);

    let sortedData = [...data];
    switch (criteria) {
      case "name":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "regNo":
        sortedData.sort(
          (a, b) =>
            (a.registrationNumber || "").localeCompare(
              b.registrationNumber || ""
            ) // Handles potentially missing regNo
        );
        break;
      default:
        break; // No sorting
    }
    setData(sortedData);
  };

  const getSortIcon = (criteria) => {
    if (sortCriteria === criteria) {
      return criteria === "name" ? <FaSortAlphaDown /> : <FaSortNumericDown />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Contributors
        </h1>

        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">
              Failed to fetch team details.
            </span>
          </div>
        ) : data.length === 0 ? (
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            {joinType === "Individual" ? (
              <p className="text-center">You have joined as an individual.</p>
            ) : (
              <p className="text-center">
                No students are currently in your team.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <div className="relative inline-block text-left">
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={sortCriteria}
                  onChange={handleSortChange}
                >
                  <option value="none">Sort By</option>
                  <option value="name">Name {getSortIcon("name")}</option>
                  <option value="regNo">Reg No. {getSortIcon("regNo")}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reg No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={item._id || index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.registrationNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.role || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.teamName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.email || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
