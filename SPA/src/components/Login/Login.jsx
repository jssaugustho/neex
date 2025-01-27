import "./Login.css";

import { Navigate, NavLink } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";

import RegisterIcon from "../../assets/RegisterIcon.jsx";
import ErrorIcon from "../../assets/ErrorIcon.jsx";

import MiniSwitch from "../ui.components/MiniSwitch/MiniSwitch.jsx";
import PasswdInput from "../ui.components/PasswdInput/PasswdInput.jsx";
import MiniLoadSpinner from "../../assets/MiniLoadSpinner.jsx";

import useAuth from "../../contexts/auth/auth.hook.jsx";

export default function Login() {
  const { signed, nextStep, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  function info(info, type) {
    if (type == "error") {
      setMsg(null);
      setError(info);
    }
    if (type == "loading") {
      setError(null);
      setMsg("Fazendo login...");
    }
  }

  function update(params) {
    if (params.email != null) setEmail(params.email);
    if (params.passwd != null) setPasswd(params.passwd);
    if (params.remember) setRemember(params.remember);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    info("Fazendo login...", "loading");
    await signIn(email, passwd, remember, info);
  }

  if (signed) {
    return <Navigate to={nextStep} />;
  } else {
    return (
      <motion.div
        className="content-box"
        layoutId="Login"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.4,
        }}
      >
        <div className="content-box">
          <form method="post" onSubmit={handleSubmit}>
            <div className="content-box mid-gap">
              <div className="content-box small-gap">
                <h1 className="small-headline">
                  Faça login no <span className="accent-text">CRM.</span>
                </h1>
                <div className="inline-flex-center mini-gap">
                  <div className="box">
                    <RegisterIcon />
                  </div>
                  <p className="paragraph align-left">
                    Não tem uma conta?{" "}
                    <NavLink className="cta-text" to="/register">
                      Cadastre-se
                    </NavLink>
                  </p>
                </div>
              </div>
              {msg && (
                <motion.div
                  className="inline-flex-center mini-gap"
                  layoutId="msg-box"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <MiniLoadSpinner className="msg-mini-spinner" />
                  <p className="paragraph info-text">{msg}</p>
                </motion.div>
              )}
              {error && (
                <motion.div
                  className="inline-flex-center mini-gap"
                  layoutId="error-box"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <ErrorIcon className="error-icon" />
                  <p className="paragraph error-text">{error}</p>
                </motion.div>
              )}
              <div className="content-box mid-gap">
                <div className="content-box small-gap">
                  <div className="content-box mini-gap align-left">
                    <label className="paragraph" htmlFor="email">
                      Email:
                    </label>
                    <input
                      className="text-input input-inset-shadow"
                      type="email"
                      placeholder="seunome@exemplo.com"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => update({ email: e.target.value })}
                    />
                  </div>
                  <div className="content-box mini-gap align-left">
                    <label className="paragraph align-left" htmlFor="passwd">
                      Senha:
                    </label>
                    <PasswdInput
                      className="box-shadow"
                      name="password"
                      onChange={(e) => update({ passwd: e.target.value })}
                      value={passwd}
                    />
                  </div>
                </div>
                <div className="inline-flex-top mid-gap space-between mobile-column">
                  <div className="fit-width-inline mini-gap">
                    <MiniSwitch
                      name="remember"
                      onChange={(e) => {
                        update({ remember: e.target.checked });
                      }}
                    />
                    <p className="paragraph">Lembrar</p>
                  </div>
                  <div className="content-box align-end mobile-column">
                    <NavLink
                      className="paragraph cta-text mobile-column"
                      to="/recovery"
                      rel="Esqueci minha senha"
                    >
                      Esqueceu sua senha?
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="content-box button-bg">
                <button className="cta-button" type="submit">
                  Fazer Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }
}
