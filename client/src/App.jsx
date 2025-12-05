import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Forbidden from "./pages/Forbidden/Forbidden";
import HomePage from "./pages/Home/HomePage";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import { UserProvider } from "./context/UserProvider.jsx";
import RequestResetPassword from "./pages/ResetPassword/RequestResetPassword";
import ResetPasswordForm from "./pages/ResetPassword/ResetPasswordForm";
import UserDashboardLayout from "./pages/UserDashboard/userDashboard.jsx";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/user-dashboard";
  return (
    <UserProvider>
      <div className="mobile-landscape-message">
        Please rotate your device to portrait mode for the best experience.
      </div>
      {!hideNavbar && <Nav />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboardLayout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/reset-password" element={<RequestResetPassword />} />
        <Route
          path="/reset-password/:userId/:token"
          element={<ResetPasswordForm />}
        />
      </Routes>
    </UserProvider>
  );
};

export default App;
