import { Route, Routes } from "react-router";

import Home from "./pages/Home.jsx";

import AuthLayout from "./pages/AuthLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import "./App.css";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route index element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
