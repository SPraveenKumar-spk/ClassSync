import Home from "./Components/Home";
import About from "./pages/About";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import PasswordReset from "./pages/PasswordReset";
import Logout from "./pages/Logout";
import UserProfile from "./pages/UserProfile";
import ErrorPage from "./pages/ErrorPage";
import TeachersHome from "./Components/Teacher/TeachersHome";
import StudentHome from "./Components/Student/StudentHome";
import StudentControll from "./Components/Student/StudentControll";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import TeacherControll from "./Components/Teacher/TeacherControl";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/teachershome" element={<TeachersHome />} />
            <Route path="/studentshome" element={<StudentHome />} />
            <Route path="/submissions" element={<StudentControll />} />
            <Route path="/createtasks" element={<TeacherControll />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/resetpassword" element={<PasswordReset />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
