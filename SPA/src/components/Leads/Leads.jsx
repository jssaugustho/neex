import "./Leads.css";

import { useState } from "react";

import { NavLink } from "react-router";

import objectParser from "../../utils/objectParser/objectParser";

import useAuth from "../../contexts/auth/auth.hook";

import { motion } from "framer-motion";
import ContentWarning from "../ContentWarning/ContentWarning";

function Leads() {
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
    <motion.div
      className="content-box content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="content-box header">
        <ContentWarning>
          A nossa interface é incompatível com o seu dispositivo, entre pelo
          desktop para obter uma melhor experiência.
        </ContentWarning>
        <h1 className="small-headline align-left">Leads</h1>
        <div className="inline-flex-center mini-gap">
          <NavLink className="paragraph nav-link-a" to="/dashboard">
            Dashboard
          </NavLink>
          <p className="paragraph">{">"}</p>
          <p className="paragraph">Leads</p>
        </div>
      </header>

      <section className="section">
        <div className="flex-row-center controls"></div>
        <div className="table-box">
          <table className="table">
            <tr className="table-headers">
              <th className="table-header">Nome</th>
              <th className="table-header">Celular</th>
              <th className="table-header">Problema</th>
              <th className="table-header">Antecedente</th>
              <th className="table-header">Teste</th>
              <th className="table-header">Concorda</th>
            </tr>
            <tr className="table-row">
              <td className="table-data">Concorda</td>
              <td className="table-data">Concorda</td>
              <td className="table-data">Concorda</td>
              <td className="table-data">Concorda</td>
              <td className="table-data">Concorda</td>
              <td className="table-data">Concorda</td>
            </tr>
          </table>
        </div>
      </section>
    </motion.div>
  );
}

export default Leads;
