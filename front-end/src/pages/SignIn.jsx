import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../store/auth";
import ForgotPassword from "./ForgotPassword";
import { useToast } from "../store/ToastContext";
import { ImSpinner9 } from "react-icons/im";

function SignIn() {
  const { storeValues, baseURL, storeToken } = useAuth();
  const { toast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const notifyLoginError = () => toast.error("Something went wrong. Try again");
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [InvalidUser, setInvalidUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        storeToken(data.token);
        storeValues(user.role);
        setUser({
          email: "",
          password: "",
          role: "",
        });
        if (user.role === "Teacher") {
          navigate("/teachershome");
        } else {
          navigate("/studentshome");
        }
      } else if (response.status === 401) {
        setLoginError(true);
      } else if (response.status === 404) {
        setInvalidUser(true);
      } else {
        notifyLoginError();
      }
    } catch (error) {
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <nav
        className="navbar  navbar-expand-lg navbar-dark bg-primary "
        style={{ height: "4rem" }}
      >
        <div className="container-fluid">
          <NavLink className="text-light text-decoration-none  fs-1 " to="/">
            ClassSync
          </NavLink>
        </div>
      </nav>
      <section className=" mt-5  ">
        <div className="container h-custom">
          <div
            className="card text-black pb-3"
            style={{ borderRadius: "25px" }}
          >
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-md-5 col-lg-6 col-xl-4">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                  className="img-fluid"
                  alt="Sample image"
                />
              </div>
              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 mt-5">
                <h1 className="text-center fw-bold mb-5 mx-1 mx-md-4 mt-4">
                  Sign in
                </h1>
                <form onSubmit={handleSubmit}>
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Email address"
                      value={user.email}
                      onChange={handleInput}
                      required
                    />
                  </div>

                  <div className="form-outline mb-3">
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="form-control form-control-lg"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleInput}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={togglePassword}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-outline mb-3">
                    <select
                      id="role"
                      name="role"
                      className="form-select form-select-lg"
                      value={user.role}
                      onChange={handleInput}
                      required
                    >
                      <option value="">Select your role</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>

                  {loginError && (
                    <div className="alert alert-danger" role="alert">
                      Invalid email or password.
                    </div>
                  )}
                  {InvalidUser && (
                    <div className="alert alert-danger" role="alert">
                      Invalid user.
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                    >
                      {loading && (
                        <ImSpinner9 className="spinner m-2" size={20} />
                      )}
                      Login
                    </button>
                    <NavLink
                      className="text-body"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Forgot password?
                    </NavLink>
                  </div>

                  <div className="text-center text-lg-start mt-4 ">
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Don't have an account?{" "}
                      <NavLink to="/register" className="link-danger">
                        Register
                      </NavLink>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ForgotPassword />
    </>
  );
}

export default SignIn;
