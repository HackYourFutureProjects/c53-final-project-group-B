import { createRoot } from "react-dom/client";
import "./styles/variables.css";
import "./styles/global.css";
import App from "./App.jsx";
import AppWrapper from "./AppWrapper";

createRoot(document.getElementById("root")).render(
  <AppWrapper>
    <App />
  </AppWrapper>,
);
