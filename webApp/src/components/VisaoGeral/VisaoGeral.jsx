import "./VisaoGeral.css";

import objectParser from "../../utils/objectParser/objectParser";

import useAuth from "../../hooks/useAuth/useAuth.jsx";

import { motion } from "framer-motion";
import useUser from "../../hooks/useUser/useUser";
import { useState } from "react";

function VisaoGeral() {
  const { data, isLoading, isError, refetch, isSuccess } = useUser();

  const { signOut } = useAuth();

  const [user, setUser] = useState(objectParser(data));

  async function handleUserUpdate(e) {
    e.preventDefault();

    setUser("Carregando...");
    await refetch();
    setUser(isError ? "Erro na requisição." : objectParser(data));
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
      <header className="content-box dashboard-title mid-gap padding-content">
        <h2 className="dashboard-title">Bem vindo {data.name}.</h2>
        <h1 className="small-headline align-left">Visão Geral</h1>
      </header>
      <section className="content-box">
        <div className="content-box align-left mid-gap padding-content">
          <div className="content-box align-left">
            {isLoading && "Carregando..."}
            {isSuccess && user}
          </div>
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

export default VisaoGeral;
