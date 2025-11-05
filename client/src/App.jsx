import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login/Login";
import HeroSection from "./components/HeroSection";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
