import Home from "./Components/Home";
import Signup from "./Components/Signup";
import ProjectsHome from "./Components/ProjectsHome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signup />} />
          <Route path="/projectshome" element={<ProjectsHome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
