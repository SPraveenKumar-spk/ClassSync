import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from '../assets/user.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserProfile() {
  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState({ oldpassword: false, newpassword: false });
  const [password, setPassword] = useState(false);

  const navigate = useNavigate();

  const notifySuccess = () => toast.success("Password Changed successfully");
  const notify500 = () => toast.error("Internal server error");
  const notify401 = () => toast.error("Invalid password");
  const notifyError = () => toast.error("Failed to change your password");

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


  const handlePasswordUpdate = async(e)=>{
    e.preventDefault();
    try{
      const response = await fetch(`http://localhost:5000/api/auth/updatePassword`,{
        method:"POST",
        headers :{
          "Content-Type" : "application/json",
        },
        credentials : "include",
        body : JSON.stringify({oldPassword,newPassword}),
      }
    );
      if(response.ok){
        notifySuccess();
      }else if(response.status === 401){
        notify401();
      }else if(response.status === 500){
        notify500();
      }
      else{
        notifyError();
      }
    }catch(error){
      console.log(error);
    }
  }
  const handlePassowrd = () => {
    setPassword(prev => !prev);
  };
  const handleRoute = () => {
    navigate(-1); 
  };
  const togglePassword = (field) => {
    setShowPassword(prevState =>({
      ...prevState,
      [field] : !prevState[field],
    }));
  };

  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
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
                  <form onSubmit={handlePasswordUpdate}>
                    {password &&
                    <div>
                      <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Current Password</p>
                      </div>
                      <div className="col-sm-9">
                      <div className="input-group">
                    <input
                      type={showPassword.oldpassword ? "text" : "password"}
                      id="oldpassword"
                      name="oldpassword"
                      className="form-control form-control-sm"
                      placeholder="Password"
                      value={oldPassword}
                      onChange={(e)=>{setOldPassword(e.target.value)}}
                      required
                    />
                
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={()=> togglePassword('oldpassword')}
                    >
                      {showPassword.oldpassword ? <FaEyeSlash /> : <FaEye />}
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
                      type={showPassword.newpassword ? "text" : "password"}
                      id="newpassword"
                      name="newpassword"
                      className="form-control form-control-sm"
                      placeholder="Password"
                      value={newPassword}
                      onChange={(e)=>{setNewPassword(e.target.value)}}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={()=>togglePassword('newpassword')}
                    >
                      {showPassword.newpassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  
                 </div>
                 
                    </div>
                    <hr/>
                    </div>
                 }
               
                        <div className="d-flex justify-content-start mb-2">
                            <button type='button'  className="btn btn-primary"  onClick={handlePassowrd}>Change Password</button>
                            <button type="submit" className="btn btn-outline-primary ms-1" >Update Profile</button>
                        </div> 
                  </form>
                  </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="card mb-4">
                    <div className="card-body">
                      <p className="mb-4"><span className="text-primary font-italic fs-4 me-1">Present Projects</span></p>
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
