import "./Recovery.css";

import XIcon from "./../../assets/XIcon.jsx";
import CheckIcon from "./../../assets/CheckIcon.jsx";

import { Navigate, NavLink } from "react-router";
import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import ErrorIcon from "../../assets/ErrorIcon.jsx";

import MiniLoadSpinner from "../../assets/MiniLoadSpinner.jsx";

import useAuth from "../../contexts/auth/auth.hook.jsx";
import EditIcon from "../../assets/EditIcon.jsx";
import BackIcon from "../../assets/BackIcon.jsx";

function Recovery() {
  const { api, signed, setSigned, setUser, nextStep, setNextStep } = useAuth();

  //email da conta que vai ser verificada
  const [email, setEmail] = useState();

  //valor do input do código
  const [code, setCode] = useState("");

  //mensagens de erro
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(null);

  //temporizador
  const [resendText, setResendText] = useState("Reenviar email");
  const [resendClassName, setResendClassName] = useState("register-cta");
  const [timeLeft, setTimeLeft] = useState(() => {
    return -1;
  });

  //toggle change email input
  const [changeEmail, setChangeEmail] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState();

  //change email input value
  const [newEmail, setNewEmail] = useState(email);

  //change email input ref
  const emailInput = useRef();

  function info(info, type) {
    if (type == "error") {
      setMsg(null);
      setOk(null);
      setError(info);
    }
    if (type == "loading") {
      setError(null);
      setOk(null);
      setMsg(info);
    }
    if (type == "ok") {
      setError(null);
      setMsg(null);
      setOk(info);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    info("Verificando código...", "loading");
    api
      .post("/verify-recovery-code", {
        email,
        passwdRecoveryCode: code,
      })
      .then((r) => {
        if (r.data.status == "Ok") {
          sessionStorage.setItem("@Auth:token", r.data.token);
          sessionStorage.setItem("@Auth:refresh-token", r.data.refreshToken);
          sessionStorage.setItem("@Auth:user", JSON.stringify(r.data.data));
          sessionStorage.setItem("@Auth:next-step", "/dashboard");
          api.defaults.headers.common["Authorization"] = r.data.token;
          setNextStep("/dashboard");
          setUser(r.data.data);
          setSigned(true);
        }
      })
      .catch((e) => {
        e.response.data.message && info(e.response.data.message, "error");
      });
  }

  async function handleChangeEmailClick() {
    setChangeEmail(true);
  }

  async function handleChangeEmail(e) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email != newEmail) {
      if (emailRegex.test(newEmail)) {
        info("Alterando email...", "loading");
        api
          .post("/recovery", {
            email: newEmail,
          })
          .then((r) => {
            if (r.data.status === "Ok") {
              localStorage.setItem("recovery-email", newEmail);
              info("Código enviado.", "ok");
              setEmail(newEmail);
              setChangeEmail(false);
              setResendText("01:00");
              setTimeLeft(60);
            }
          })
          .catch((e) => {
            info(e.response.data.message, "error");
          });
      } else {
        info("Email inválido", "error");
      }
    } else {
      setMsg(null);
      setError(null);
      setChangeEmail(false);
    }
  }

  async function handleClearEmail() {
    setChangeEmail(false);
    setNewEmail(email);
    setMsg(null);
    setError(null);
    setOk(null);
  }

  async function handleResendCode(show) {
    info("Enviando código...", "loading");
    api
      .post("/recovery", {
        email,
      })
      .then(() => {
        info("Código enviado.", "ok");
        setResendText("01:00");
        setTimeLeft(60);
      })
      .catch((e) => {
        info(e.response.data.message, "error");
      });
  }

  async function handleSetEmail(e) {
    e.preventDefault();

    info("Verificando email...", "loading");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(recoveryEmail)) {
      api
        .post("/recovery", {
          email: recoveryEmail,
        })
        .then((r) => {
          localStorage.setItem("recovery-email", recoveryEmail);
          setEmail(recoveryEmail);
          info("Código enviado.", "ok");
          setTimeLeft(60);
        })
        .catch((e) => {
          info(e.response.data.message, "error");
        });
    } else {
      info("Email inválido", "error");
    }
  }

  //select alterar email
  useEffect(() => {
    if (emailInput.current) emailInput.current.select();
  }, [changeEmail]);

  //timer effect
  useEffect(() => {
    if (timeLeft < 0) {
      setResendText("Reenviar email");
      setResendClassName("register-cta");
      return;
    }

    setResendClassName("register-text");

    const timer = setInterval(() => {
      setTimeLeft((p) => p - 1);
      setResendText(`00:${String(timeLeft - 1).padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  //load storage
  useLayoutEffect(() => {
    const loadedEmail = localStorage.getItem("recovery-email");

    if (loadedEmail) {
      setEmail(loadedEmail);
      setNewEmail(loadedEmail);
    }
  }, []);

  const insertCode = (
    //inserir código
    <div className="login">
      <form method="post" onSubmit={handleSubmit}>
        <div className="labels">
          <div className="inputs">
            <div className="headline">
              <h2>Código enviado no seu email</h2>
              <div className="emailChange">
                {changeEmail ? (
                  <div className="register changeEmailBox">
                    <input
                      ref={emailInput}
                      className="newEmailInput"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <div className="changeBtns">
                      <button
                        className="checkIcon changeBtn"
                        onClick={handleChangeEmail}
                      >
                        <CheckIcon className="icon" />
                      </button>
                      <button
                        className="XIcon changeBtn"
                        onClick={handleClearEmail}
                      >
                        <XIcon className="icon" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="sendedEmail">{email}</p>
                )}
                <div className="changeEmailCta">
                  <div className="icon">
                    <EditIcon />
                  </div>
                  <div className="change-a" onClick={handleChangeEmailClick}>
                    Não é Seu email?
                  </div>
                </div>
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
                    exit={{
                      opacity: 0,
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
                    exit={{
                      opacity: 0,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <ErrorIcon className="error-icon" />
                    <p className="error-text">{error}</p>
                  </motion.div>
                )}
                {ok && (
                  <motion.div
                    className="msg-box"
                    layoutId="ok-box"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <CheckIcon height={10} className="check-icon" />
                    <p className="msg-text">{ok}</p>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="label">
              <label htmlFor="email">
                Insira o código enviado no seu email:
              </label>
              <input
                className="text-input"
                type="text"
                placeholder="Código de 6 digitos"
                name="code"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="register">
              <p className="register-text">Não recebeu o código?</p>
              <div onClick={handleResendCode} className={`${resendClassName}`}>
                {resendText}
              </div>
            </div>
          </div>
          <div className="bg-button">
            <button className="cta-button" type="submit">
              Verificar Código
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const insertEmail = (
    //inserir email
    <div className="login">
      <form method="post" onSubmit={handleSetEmail}>
        <div className="labels">
          <NavLink to="/login" className="register-cta">
            <div className="back-icon">
              <BackIcon />
              Voltar
            </div>
          </NavLink>
          <div className="inputs">
            <div className="headline">
              <h2>Esqueceu sua senha?</h2>
              <p className="register-text">
                Envie um código de recuperação no seu email.
              </p>
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
                    exit={{
                      opacity: 0,
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
                    exit={{
                      opacity: 0,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <ErrorIcon className="error-icon" />
                    <p className="error-text">{error}</p>
                  </motion.div>
                )}
                {ok && (
                  <motion.div
                    className="msg-box"
                    layoutId="ok-box"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <CheckIcon height={11} className="check-icon" />
                    <p className="msg-text">{ok}</p>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="label">
              <label htmlFor="email">Email:</label>
              <input
                className="text-input"
                type="email"
                placeholder="Insira seu email"
                name="code"
                id="code"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-button">
            <button className="cta-button" type="submit">
              Enviar Código
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  if (signed) {
    return <Navigate to={nextStep} />;
  } else {
    return (
      <motion.div
        className="login-motion-div"
        layoutId="Recovery"
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
        {email ? insertCode : insertEmail}
      </motion.div>
    );
  }
}

export default Recovery;
