import "./Dashboard.css";

import { useState } from "react";

import useAuth from "../../contexts/auth/auth.hook.jsx";

import objectParser from "../../utils/objectParser/objectParser.jsx";

import { NavLink, Outlet } from "react-router";

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
    <div className="dashboard">
      <nav className="sidebar ">
        <div className="close-button gradient-bg"></div>
        <div className="small-horizontal-padding profile-box">
          <div className="inline-flex-center small-gap profile">
            <div className="box">
              <div className="mid-profile-image"></div>
            </div>
            <div className=" content-box profile-data micro-gap">
              <div className="paragraph ellipsis-text profile-name">
                {user.name}
              </div>
              <div className="paragraph ellipsis-text profile-email">
                {user.email}
              </div>
            </div>
          </div>
        </div>
        <ul className="y-nav-section nav-items nav-box">
          <li className="nav-item accent-nav-item">
            <div className="content-box gradient-bg nav-cta-bg">
              <button className="nav-link accent-link" to="#">
                <p className="nav-link-text">Começar Agora</p>
              </button>
            </div>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="#">
              <p className="nav-link-text">Visão Geral</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="#">
              <p className="nav-link-text">Leads</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="#">
              <p className="nav-link-text">Financeiro</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="#">
              <p className="nav-link-text">Campanhas</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="#">
              <p className="nav-link-text">Páginas</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="#">
              <p className="nav-link-text">Formulários</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="#">
              <p className="nav-link-text">Configurações</p>
            </NavLink>
          </li>
        </ul>
        <div className="content-box logout-box">
          <div
            role="button"
            tabIndex={0}
            onClick={handleUserLogout}
            className="flex-row-center small-gap logout-button"
          >
            <div className="box mid-icon-box gradient-bg"></div>
            <div className="flex-row-center" role="button" tabIndex={0}>
              Sair
            </div>
          </div>
        </div>
      </nav>
      <main className="y-scroll-section content-box main-content mid-gap">
        <header className="content-box dashboard-title">
          <h1 className="dashboard-title">Bem vindo {user.name}.</h1>
        </header>
        <section>
          <div className="content-box align-left mid-gap">
            <h1 className="small-headline align-left">Visão Geral</h1>
            <div className="content-box align-left">{msg}</div>
            <ul className="flex-row-center button-ul">
              <li className="button-ul-li">
                <button className="btn" onClick={handleUserUpdate}>
                  Atualizar
                </button>
              </li>
              <li className="vertical-separator"></li>
              <li className="button-ul-li">
                <button className="btn" onClick={handleUserLogout}>
                  Sair
                </button>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
