import "./Login.css";

import { Navigate, NavLink } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";

import Google from "../../assets/google.png";
import RegisterIcon from "../../assets/RegisterIcon.jsx";
import ErrorIcon from "../../assets/ErrorIcon.jsx";

import MiniSwitch from "../ui.components/MiniSwitch/MiniSwitch.jsx";
import PasswdInput from "../ui.components/PasswdInput/PasswdInput.jsx";
import MiniLoadSpinner from "../../assets/MiniLoadSpinner.jsx";

import useAuth from "../../contexts/auth/auth.hook.jsx";

export default function Login() {
  const showGoogleOAuth = false;

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

  function handleGoogleClick(e) {
    e.preventDefault();
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
        className="login-motion-div"
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
        <div className="login">
          <form method="post" onSubmit={handleSubmit}>
            <div className="labels">
              <div className="inputs">
                <div className="headline">
                  <h2>
                    Faça login no <span className="accent-text">CRM.</span>
                  </h2>
                  <div className="register">
                    <p className="register-text">
                      Não tem uma conta?{" "}
                      <NavLink className="register-cta" to="/register">
                        Cadastre-se
                      </NavLink>
                    </p>
                  </div>
                  <div className="infobox">
                    {msg && (
                      <motion.div
                        className="msg-box"
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
                        <p className="msg-text">{msg}</p>
                      </motion.div>
                    )}
                    {error && (
                      <motion.div
                        className="error-box"
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
                        <p className="error-text">{error}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
                {showGoogleOAuth ? (
                  <>
                    <div className="bg-button">
                      <button className="google" onClick={handleGoogleClick}>
                        <img src={Google} alt="" />
                        Continuar com o Google
                      </button>
                    </div>
                    <div className="divider">
                      <hr />
                      <span className="text">OU UTILIZE SEU EMAIL</span>
                      <hr />
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div className="label">
                  <label htmlFor="email">Email:</label>
                  <input
                    className="text-input"
                    type="email"
                    placeholder="seunome@exemplo.com"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => update({ email: e.target.value })}
                  />
                </div>
                <div className="label">
                  <label htmlFor="passwd">Senha:</label>
                  <PasswdInput
                    className="text-input"
                    name="passwd"
                    onChange={(e) => update({ passwd: e.target.value })}
                    value={passwd}
                  />
                </div>
                <div className="recovery">
                  <div className="remember">
                    <MiniSwitch
                      name="remember"
                      onChange={(e) => {
                        update({ remember: e.target.checked });
                      }}
                    />
                    <p className="remember-text">Lembrar</p>
                  </div>
                  <div className="recovery-passwd">
                    <NavLink to="/recovery" rel="Esqueci minha senha">
                      Esqueceu sua senha?
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="bg-button">
                <button className="cta-button" type="submit">
                  Fazer Login
                </button>
              </div>
              <div className="register" style={{ display: "none" }}>
                <div className="register-icon">
                  <RegisterIcon />
                </div>
                <p className="register-text">
                  Não tem uma conta?{" "}
                  <NavLink className="register-cta" to="/register">
                    Cadastre-se
                  </NavLink>
                </p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }
}
