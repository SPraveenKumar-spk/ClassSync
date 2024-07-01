import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from '../assets/user.png';

export default function UserProfile() {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/userinfo`, {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.log('Failed to fetch user data');
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const handlePassowrd = () => {
    setPassword(prev => !prev);
  };

  const handleRoute = () => {
    navigate(-1); 
  };
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <section style={{ backgroundColor: '#eee' }}>
        <div className="container py-5">
          <div className="row">
            <div className="col">
              <nav aria-label="breadcrumb" className="bg-light rounded-3 p-3 mb-4">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item text-primary" onClick={handleRoute} style={{cursor:"pointer"}}><a>Home</a></li>
                  <li className="breadcrumb-item active" aria-current="page">User Profile</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <img src={Image} alt="avatar" className="rounded-circle img-fluid" style={{ width: '150px' }} />
                  <h5 className="my-3">{user.name}</h5>
                  <p className="text-muted mb-1"><span className='text-dark'>Designation : </span>{user.role}</p>
                  {/* <p className="text-muted mb-4">{user.location}</p>
                    <div className="d-flex justify-content-center mb-2">
                      <button type="button" className="btn btn-primary">Follow</button>
                      <button type="button" className="btn btn-outline-primary ms-1">Message</button>
                    </div> */}
                  </div>
              </div>
              {/* <div className="card">
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush rounded-3">
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fas fa-globe fa-lg text-warning"></i>
                      <p className="mb-0">{user.website}</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-github fa-lg text-body"></i>
                      <p className="mb-0">{user.github}</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-twitter fa-lg" style={{ color: '#55acee' }}></i>
                      <p className="mb-0">@{user.twitter}</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-instagram fa-lg" style={{ color: '#ac2bac' }}></i>
                      <p className="mb-0">{user.instagram}</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      <i className="fab fa-facebook-f fa-lg" style={{ color: '#3b5998' }}></i>
                      <p className="mb-0">{user.facebook}</p>
                    </li>
                  </ul>
                </div>
              </div> */}
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
                  {password && 
                  <div>
                    <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Current Password</p>
                    </div>
                    <div className="col-sm-9">
                    <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-control form-control-sm"
                    placeholder="Password"
                
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
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">New Password</p>
                    </div>
                    <div className="col-sm-9">
                    <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newpassword"
                    name="newpassword"
                    className="form-control form-control-sm"
                    placeholder="Password"
                
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
                  </div>
                  <hr/>
                  </div>
                  }
               
                  <div className="d-flex justify-content-start mb-2">
                      <button type="button" className="btn btn-primary" onClick={handlePassowrd}>Change Password</button>
                      <button type="button" className="btn btn-outline-primary ms-1">Update Profile</button>
                    </div>  
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="card mb-4">
                    <div className="card-body">
                      <p className="mb-4"><span className="text-primary font-italic me-1">assignment</span> Project Status</p>
                      <p className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</p>
                      <div className="progress rounded" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</p>
                      <div className="progress rounded" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '72%' }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</p>
                      <div className="progress rounded" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '89%' }} aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</p>
                      <div className="progress rounded" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '55%' }} aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</p>
                      <div className="progress rounded mb-2" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '66%' }} aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card mb-4">
                    <div className="card-body">
                      <p className="mb-4"><span className="text-primary font-italic me-1">assignment</span> Project Status</p>
                      <p className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</p>
                      <div className="progress rounded" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</p>
                      <div className="progress rounded" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '72%' }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</p>
                      <div className="progress rounded" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '89%' }} aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</p>
                      <div className="progress rounded" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '55%' }} aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</p>
                      <div className="progress rounded mb-2" style={{ height: '5px' }}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: '66%' }} aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
