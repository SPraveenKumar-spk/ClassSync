import Home from "./Components/Home";
import Signup from "./Components/Signup";
import SignIn from "./Components/SignIn";
import Logout from "./Components/Logout";
import ProjectsHome from "./Components/ProjectsHome";
import StudentHome from "./Components/StudentHome";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProtectedRoute from "./Components/ProtectedRoute"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/projectshome"
            element={<ProtectedRoute component={<ProjectsHome />} />}
          />
          <Route
            path="/studentshome"
            element={<ProtectedRoute component={<StudentHome />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
