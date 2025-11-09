import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login/Login";
import ClientDashboard from "./pages/ClientDashboard/ClientDashboard";
import CourierDashboard from "./pages/CourierDashboard/CourierDashboard";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import Forbidden from "./pages/Forbidden/Forbidden";
import HomePage from "./pages/Home/HomePage";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import { UserProvider } from "./context/UserProvider.jsx";
import RequestResetPassword from "./pages/ResetPassword/RequestResetPassword";
import ResetPasswordForm from "./pages/ResetPassword/ResetPasswordForm";

const App = () => {
  return (
    <UserProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/client-dashboard"
          element={
            <RequireAuth>
              <RequireRole allowed={["client"]}>
                <ClientDashboard />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/courier-dashboard"
          element={
            <RequireAuth>
              <RequireRole allowed={["courier"]}>
                <CourierDashboard />
              </RequireRole>
            </RequireAuth>
          }
        />
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
