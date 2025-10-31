import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import ClientHome from "./pages/Client/ClientHome";
import ClientTasks from "./pages/Client/ClientTasks";

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/client" element={<ClientHome />} />
        <Route path="/client/tasks" element={<ClientTasks />} />
      </Routes>
    </>
  );
};

export default App;
