import { BrowserRouter as Router } from "react-router-dom";

const AppWrapper = ({ children }) => {
  return <Router>{children}</Router>;
};

export default AppWrapper;
