import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./pages/About";
import Signup from "./pages/auth/Signup";
import SignIn from "./pages/auth/SignIn";
import PasswordReset from "./pages/PasswordReset";
import Logout from "./pages/Logout";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import JoinedProjectControll from "./Components/JoinProject/JoinedProjectControll";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import AdminProjectControll from "./Components/CreateProject/AdminProjectControll";
import UserHome from "./Components/CommonDetails/UserHome";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Contact from "./pages/Contact";

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
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<PasswordReset />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
