import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login/Login";
import ClientDashboard from "./pages/ClientDashboard/ClientDashboard";
import CourierDashboard from "./pages/CourierDashboard/CourierDashboard";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import Forbidden from "./pages/Forbidden/Forbidden";
import HeroSection from "./components/HeroSection";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import Register from "./pages/Register/Register.jsx";
import { UserProvider } from "./context/UserProvider.jsx";

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
        <Route path="/register" element={<Register />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
