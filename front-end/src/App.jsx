import Home from "./Components/Home";
import Signup from "./Components/Signup";
import SignIn from "./Components/SignIn";
import Logout from "./Components/Logout";
import UserProfile from "./Components/UserProfile";
import TeachersHome from "./Components/TeachersHome";
import StudentHome from "./Components/StudentHome";
import StudentSubmissions from "./Components/StudentSubmissions";
import CreateTasks from "./Components/CreateTasks";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/teachersHome" element={<TeachersHome />} />
          <Route path="/studentshome" element={<StudentHome />} />
          <Route path="/submissions" element={<StudentSubmissions />} />
          <Route path="/createtasks" element={<CreateTasks />} />
          <Route  path="*" element={<Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
