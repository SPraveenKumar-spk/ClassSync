import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand text-white fs-2 fw-bold" href="/">
            ClassSync
          </a>
          <button
            className="navbar-toggler text-bg-light "
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="offcanvas offcanvas-end w-auto "
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                ClassSync
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body ">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 fs-4 fw-semibold">
                <li className="nav-item">
                  <NavLink className="nav-link text-info" to="/">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-info" to="/about">
                    About
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-info" to="/contact">
                    Contact
                  </NavLink>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto d-flex">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    <button className="btn btn-outline-info bg-light fs-5 fw-semibold">
                      Sign Up
                    </button>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    <button className="btn btn-outline-info bg-light fs-5 fw-semibold">
                      Sign In
                    </button>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
