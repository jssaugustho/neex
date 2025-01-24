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
  const [resendText, setResendText] = useState("Reenviar código");
  const [resendClassName, setResendClassName] = useState("cta-text");
  const [timeLeft, setTimeLeft] = useState(-1);

  const wait = useRef(false);

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

    wait.current = true;

    info("Verificando código...", "loading");

    api
      .post("/verify-recovery-code", {
        email,
        passwdRecoveryCode: code,
      })
      .then((r) => {
        if (r.data.status == "Ok") {
          info("Email verificado com sucesso.", "ok");
          setInterval(() => {
            sessionStorage.setItem("@Auth:token", r.data.token);
            sessionStorage.setItem("@Auth:refresh-token", r.data.refreshToken);
            sessionStorage.setItem("@Auth:user", JSON.stringify(r.data.data));
            sessionStorage.setItem("@Auth:next-step", "/dashboard");
            api.defaults.headers.common["Authorization"] = r.data.token;
            setNextStep("/dashboard");
            setUser({
              ...r.data.data,
              emailVerified: true,
            });
            setSigned(true);
          }, 1000);
        }
      })
      .catch((e) => {
        e.response.data.message && info(e.response.data.message, "error");
        wait.current = false;
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
  }

  async function handleResendCode(show = true) {
    if (!wait.current) {
      wait.current = true;
      show && info("Enviando código...", "loading");
      api
        .post("/recovery", {
          email,
        })
        .then(() => {
          show && info("Código enviado no seu email.", "ok");
          setResendText("01:00");
          setTimeLeft(60);
        })
        .catch((e) => {
          show && info(e.response.data.message, "error");
          wait.current = false;
        });
    }
  }

  async function handleSetEmail(e) {
    e.preventDefault();

    info("Enviando código...", "loading");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!wait.current) {
      if (emailRegex.test(recoveryEmail)) {
        wait.current = true;
        api
          .post("/recovery", {
            email: recoveryEmail,
          })
          .then(() => {
            localStorage.setItem("recovery-email", recoveryEmail);
            setEmail(recoveryEmail);
            info("Código enviado no seu email.", "ok");
            setTimeLeft(60);
          })
          .catch((e) => {
            info(e.response.data.message, "error");
            wait.current = false;
          });
      } else {
        info("Email inválido", "error");
      }
    }
  }

  function handleExit(e) {
    if (e.keyCode == 27) {
      handleClearEmail();
    }
  }

  function handleInputChange(e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    setCode(value);
  }

  //select alterar email
  useEffect(() => {
    if (emailInput.current) emailInput.current.select();
  }, [changeEmail]);

  //timer effect
  useEffect(() => {
    if (timeLeft < 0) {
      setResendText("Reenviar email");
      setResendClassName("cta-text");
      wait.current = false;
      return;
    }

    setResendClassName(null);

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
    <div className="content-box">
      <form method="post" onSubmit={handleSubmit}>
        <div className="content-box mid-gap">
          <div className="content-box mid-gap">
            <div className="content-box small-gap">
              <h1 className="small-headline">Verifique o seu email</h1>
              <div className="content-box mini-gap">
                {changeEmail ? (
                  <div className="inline-flex-center">
                    <input
                      ref={emailInput}
                      className="mini-text-input"
                      type="email"
                      value={newEmail}
                      onKeyDown={handleExit}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <div className="fit-width-inline">
                      <button
                        className="invisible-btn"
                        onClick={handleChangeEmail}
                      >
                        <CheckIcon className="icon" />
                      </button>
                      <button
                        className="invisible-btn"
                        onClick={handleClearEmail}
                      >
                        <XIcon className="icon" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="paragraph">{email}</p>
                )}
                <div className="inline-flex-center mini-gap">
                  <div className="box">
                    <EditIcon />
                  </div>
                  <div
                    className="paragraph cta-text"
                    onClick={handleChangeEmailClick}
                  >
                    Alterar email
                  </div>
                </div>
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
                exit={{
                  opacity: 0,
                }}
                transition={{ duration: 0.4 }}
              >
                <MiniLoadSpinner className="msg-mini-spinner mini-gap" />
                <p className="paragraph">{msg}</p>
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
                exit={{
                  opacity: 0,
                }}
                transition={{ duration: 0.4 }}
              >
                <ErrorIcon className="error-icon" />
                <p className="paragraph">{error}</p>
              </motion.div>
            )}
            {ok && (
              <motion.div
                className="inline-flex-center mini-gap"
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
                <p className="paragraph">{ok}</p>
              </motion.div>
            )}
            <div className="content-box small-gap">
              <div className="content-box mini-gap">
                <label className="paragraph" htmlFor="content-box">
                  Insira o código enviado no seu email:
                </label>
                <input
                  className="text-input"
                  type="text"
                  maxLength={6}
                  placeholder="Código de 6 digitos"
                  name="code"
                  id="code"
                  value={code}
                  onChange={handleInputChange}
                />
              </div>
              <div className="inline-flex-center micro-gap">
                <p className="paragraph">Não recebeu o código? </p>
                <div
                  onClick={handleResendCode}
                  className={`paragraph ${resendClassName}`}
                >
                  {resendText}
                </div>
              </div>
            </div>
          </div>
          <div className="button-bg">
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
    <div className="content-box mid-gap">
      <NavLink to="/login">
        <div className="inline-flex-center mini-gap">
          <BackIcon />
          <p className="paragraph cta-text">Voltar</p>
        </div>
      </NavLink>
      <form method="post" onSubmit={handleSetEmail}>
        <div className="content-box small-gap">
          <div className="content-box mid-gap">
            <div className="content-box small-gap">
              <h1 className="small-headline">Esqueceu sua senha?</h1>
              <p className="paragraph align-left">
                Envie um código de recuperação de senha no seu email.
              </p>
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
                exit={{
                  opacity: 0,
                }}
                transition={{ duration: 0.4 }}
              >
                <MiniLoadSpinner className="msg-mini-spinner mini-gap" />
                <p className="paragraph">{msg}</p>
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
                exit={{
                  opacity: 0,
                }}
                transition={{ duration: 0.4 }}
              >
                <ErrorIcon className="error-icon" />
                <p className="paragraph">{error}</p>
              </motion.div>
            )}
            {ok && (
              <motion.div
                className="inline-flex-center mini-gap"
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
                <p className="paragraph">{ok}</p>
              </motion.div>
            )}
            <div className="content-box mini-gap">
              <label className="paragraph" htmlFor="email">
                Email:
              </label>
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
            <div className="button-bg">
              <button className="cta-button" type="submit">
                Enviar Código
              </button>
            </div>
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
