import "./Configuracoes.css";

import { useState } from "react";

import objectParser from "../../utils/objectParser/objectParser";

import useAuth from "../../contexts/auth/auth.hook";

import { motion } from "framer-motion";

function Configuracoes() {
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
      className="content-box content mid-gap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="content-box dashboard-title mid-gap">
        <h1 className="small-headline align-left">Configurações</h1>
      </header>
      <section>
        <div className="content-box align-left mid-gap">
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
    </motion.div>
  );
}

export default Configuracoes;
