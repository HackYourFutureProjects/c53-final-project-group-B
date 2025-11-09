import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login/Login";
import ClientHome from "./pages/Client/ClientHome";
import CourierHome from "./pages/Courier/CourierHome";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import Forbidden from "./pages/Forbidden/Forbidden";
import HeroSection from "./components/HeroSection";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import { UserProvider } from "./context/UserProvider.jsx";
import RequestResetPassword from "./pages/ResetPassword/RequestResetPassword";
import ResetPasswordForm from "./pages/ResetPassword/ResetPasswordForm";
import ClientTasks from "./pages/Client/ClientTasks";

const App = () => {
  return (
    <UserProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/client"
          element={
            <RequireAuth>
              <RequireRole allowed={["client"]}>
                <ClientHome />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/client/tasks"
          element={
            <RequireAuth>
              <RequireRole allowed={["client"]}>
                <ClientTasks />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/courier-dashboard"
          element={
            <RequireAuth>
              <RequireRole allowed={["courier"]}>
                <CourierHome />
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
