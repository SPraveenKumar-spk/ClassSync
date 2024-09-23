import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "../assets/user.png";
import { useAuth } from "../store/auth";
import { useToast } from "../store/ToastContext";

export default function UserProfile() {
  const { baseURL, LogoutUser } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [showPassword, setShowPassword] = useState({
    oldpassword: false,
    newpassword: false,
  });
  const [password, setPassword] = useState(false);

  const navigate = useNavigate();

  const notifySuccess = () => toast.success("Password Changed successfully");
  const notify500 = () => toast.error("Internal server error");
  const notify401 = () => toast.error("Invalid password");
  const notifyError = () => toast.error("Failed to change your password");
  const notifyDeleteError = () =>
    toast.error("Something went wrong, please try again later.");
  const notifyDeleteSuccess = () =>
    toast.success("Successfully deleted your account");
  const notifyRegistrationSuccess = () =>
    toast.success("Registration number updated successfully");
  const notifyRegistrationError = () =>
    toast.error("Failed to update registration number");

  const token = sessionStorage.getItem("token");
  sessionStorage.setItem("name", user.name);
useEffect(() => {
  const fetchUser = async () => {
    try {
      console.log(token);
      const response = await fetch(
        `${baseURL}/api/auth/userinfo?token=${token}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setRegistrationNumber(userData.registrationNumber || "");
      } else {
        console.log("Failed to fetch user data");
      }
    } catch (error) {
      console.log(error);
    }
  };
  fetchUser();
}, [baseURL]);

const handlePasswordUpdate = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(
      `${baseURL}/api/auth/updatePassword?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );
    if (response.ok) {
      notifySuccess();
    } else if (response.status === 401) {
      notify401();
    } else if (response.status === 500) {
      notify500();
    } else {
      notifyError();
    }
  } catch (error) {
    console.log(error);
  }
};

const handleRegisterNumber = async (e) => {
  try {
    const response = await fetch(
      `${baseURL}/api/auth/updateregno?token=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ registrationNumber }),
      }
    );
    if (response.ok) {
      notifyRegistrationSuccess();
    } else if (response.status === 403) {
      toast.error(
        "Unauthorized: Only students can update the registration number"
      );
    } else {
      notifyRegistrationError();
    }
  } catch (error) {
    console.log(error);
  }
};

const handlePassowrd = () => {
  setPassword((prev) => !prev);
};

const handleRoute = () => {
  navigate(-1);
};

const togglePassword = (field) => {
  setShowPassword((prevState) => ({
    ...prevState,
    [field]: !prevState[field],
  }));
};

const handleLogout = () => {
  LogoutUser();
};

const handleDelete = async () => {
  const decision = window.confirm("Are you sure to delete account ?");
  if (decision) {
    const role = sessionStorage.getItem("userRole");
    try {
      const response = await fetch(
        `${baseURL}/api/auth/deleteaccount?role=${role}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        notifyDeleteError();
      } else {
        notifyDeleteSuccess();
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

return (
  <>
    <section style={{ backgroundColor: "#eee", height: "100vh" }}>
      <div className="container py-5">
        <div className="row  mt-3">
          <div className="col">
            <nav
              aria-label="breadcrumb"
              className="bg-light rounded-3 p-3 mb-4"
            >
              <ol className="breadcrumb mb-0">
                <li
                  className="breadcrumb-item text-primary"
                  onClick={handleRoute}
                  style={{ cursor: "pointer" }}
                >
                  <a>Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  User Profile
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img
                  src={Image}
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: "150px" }}
                />
                <h5 className="my-3">{user.name}</h5>
                <p className="text-muted mb-1">
                  <span className="text-dark">Designation : </span>
                  {user.role}
                </p>
                <div className="d-flex justify-content-around">
                  <div className="mt-3">
                    <button
                      className="btn btn-outline-primary p-1 border border-secondary fs-5 rounded"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>

                  <div className="mt-3">
                    <button
                      className="btn btn-outline-danger p-1 border border-secondary fs-5 rounded"
                      onClick={handleDelete}
                    >
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0 text-dark">Full Name</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="mb-0 text-info">{user.name}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                  </div>
                  <div className="col-sm-9">
                    <p className=" mb-0 text-info">{user.email}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">College</p>
                  </div>
                  <div className="col-sm-9">
                    <p className=" mb-0 text-info">KLU</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Designation</p>
                  </div>
                  <div className="col-sm-9">
                    <p className=" mb-0 text-info">{user.role}</p>
                  </div>
                </div>
                <hr />
                {user.role === "Student" && (
                  <>
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Register Number</p>
                      </div>
                      <div className="col-sm-9">
                        <div className="input-group">
                          <input
                            id="registrationNumber"
                            name="registrationNumber"
                            className="form-control form-control-sm"
                            placeholder="Update your registration number"
                            value={registrationNumber}
                            onChange={(e) => {
                              setRegistrationNumber(e.target.value);
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                )}

                <form onSubmit={handlePasswordUpdate}>
                  {password && (
                    <div>
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="mb-0">Current Password</p>
                        </div>
                        <div className="col-sm-9">
                          <div className="input-group">
                            <input
                              type={
                                showPassword.oldpassword ? "text" : "password"
                              }
                              id="oldpassword"
                              name="oldpassword"
                              className="form-control form-control-sm"
                              placeholder="Password"
                              value={oldPassword}
                              onChange={(e) => {
                                setOldPassword(e.target.value);
                              }}
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => togglePassword("oldpassword")}
                            >
                              {showPassword.oldpassword ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="mb-0">New Password</p>
                        </div>
                        <div className="col-sm-9">
                          <div className="input-group">
                            <input
                              type={
                                showPassword.newpassword ? "text" : "password"
                              }
                              id="newpassword"
                              name="newpassword"
                              className="form-control form-control-sm"
                              placeholder="Password"
                              value={newPassword}
                              onChange={(e) => {
                                setNewPassword(e.target.value);
                              }}
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => togglePassword("newpassword")}
                            >
                              {showPassword.newpassword ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <hr />
                    </div>
                  )}
                  <div className="d-flex justify-content-start mb-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handlePassowrd}
                    >
                      Change Password
                    </button>

                    <button
                      type="submit"
                      className="btn btn-outline-primary ms-1"
                      onClick={handleRegisterNumber}
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);
}
