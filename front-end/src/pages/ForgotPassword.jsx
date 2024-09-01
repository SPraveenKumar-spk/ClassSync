import { useState } from "react";
import { useAuth } from "../store/auth";
import { useToast } from "../store/ToastContext";

const ForgotPassword = () => {
  const { baseURL } = useAuth();
    const { toast } = useToast();
  const[email,setEmail] = useState('');

  const handleEmail = async(e) =>{
    e.preventDefault();
    try{
      const response = await fetch(`${baseURL}/api/auth/forgotpassword`,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({email}),
      })
      if(response.ok){
        setEmail("")
        toast.success("password reset link has been sent successfully");
      }
    }catch(error){
      toast.error("!oops. server error , try again later");
    }
  }

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" >
        <div className="modal-content text-center">
          <div className="modal-header h5 text-white bg-primary justify-content-center">
            Password Reset
          </div>
          <div className="modal-body px-5">
            <p className="py-2">
              Enter your email address and we'll send you an email with instructions to reset your password.
            </p>
            <form onSubmit={handleEmail}>
            <div className="mb-3">
              <label htmlFor="typeEmail" className="form-label" >Email input</label>
              <input type="email" id="typeEmail" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" >Reset password</button>
            </form>
            <div className="d-flex justify-content-between mt-4">
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
