import "./Dashboard.css";

import { useState } from "react";
import useAuth from "../../contexts/auth/auth.hook.jsx";
import objectParser from "../../utils/objectParser/objectParser.jsx";

const Dashboard = () => {
  const { user, setUser, api, signOut } = useAuth();
  const [msg, setMsg] = useState(objectParser(user));

  function handleUserUpdate(e) {
    e.preventDefault();

    setMsg("Carregando...");

    api
      .get("/user")
      .then((r) => {
        setUser(r.data.data[0]);
        setMsg(objectParser(r.data.data[0]));
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleUserLogout(e) {
    e.preventDefault();
    signOut();
  }

  return (
    <>
      <div className="dashboard">
        <h1 className="title">Dashboard</h1>
        <div className="list">{msg}</div>
        <div className="buttons">
          <button className="btn" onClick={handleUserUpdate}>
            Atualizar
          </button>
          <button className="btn" onClick={handleUserLogout}>
            Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
