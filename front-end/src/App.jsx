import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import About from "./pages/About";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import PasswordReset from "./pages/PasswordReset";
import Logout from "./pages/Logout";
import UserProfile from "./pages/UserProfile";
import ErrorPage from "./pages/ErrorPage";
import JoinedProjectControll from "./Components/JoinProject/JoinedProjectControll";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import AdminProjectControll from "./Components/CreateProject/AdminProjectControll";
import UserHome from "./Components/CommonDetails/UserHome";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/userhome" element={<UserHome />} />
            <Route path="/submissions" element={<JoinedProjectControll />} />
            <Route path="/createtasks" element={<AdminProjectControll />} />
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
