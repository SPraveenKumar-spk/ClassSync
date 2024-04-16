import Home from "./Components/Home";
import Signup from "./Components/Signup";
import SignIn from "./Components/SignIn";
import ProjectsHome from "./Components/ProjectsHome";
import StudentHome from "./Components/StudentHome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/projectshome" element={<ProjectsHome />} />
          <Route path="/studenthome" element = {<StudentHome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
