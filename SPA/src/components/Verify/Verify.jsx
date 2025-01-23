import XIcon from "./../../assets/XIcon.jsx";
import CheckIcon from "./../../assets/CheckIcon.jsx";

import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import ErrorIcon from "../../assets/ErrorIcon.jsx";

import MiniLoadSpinner from "../../assets/MiniLoadSpinner.jsx";

import useAuth from "../../contexts/auth/auth.hook.jsx";
import EditIcon from "../../assets/EditIcon.jsx";

function Verify() {
  const { signed, api, setUser, user, nextStep, setNextStep } = useAuth();

  const [code, setCode] = useState("");

  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(null);

  const [resendText, setResendText] = useState("Reenviar email");
  const [resendClassName, setResendClassName] = useState("cta-text");
  const [timeLeft, setTimeLeft] = useState(() => {
    return -1;
  });
  const [wait, setWait] = useState(false);

  const [changeEmail, setChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user.email);

  const emailInput = useRef(null);

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
    setWait(true);

    let emailVerificationCode = code;

    api
      .post("/verify", {
        emailVerificationCode,
      })
      .then((r) => {
        if (r.data.status == "Ok") {
          setNextStep("/dashboard");
          setUser({
            ...user,
            emailVerified: true,
          });
        }
      })
      .catch((e) => {
        info(e.response.data.message, "error");
        setWait(false);
      });
  }

  async function handleChangeEmailClick() {
    setChangeEmail(true);
  }

  async function handleChangeEmail(e) {
    e.preventDefault();
    info("Alterando email...", "loading");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (user.email != newEmail) {
      if (emailRegex.test(newEmail)) {
        api
          .put("/user", {
            email: newEmail,
          })
          .then((r) => {
            console.log(r);
            if (r.data.status === "Ok") {
              setUser({ ...user, email: newEmail });
              setChangeEmail(false);
              setMsg(null);
              setError(null);
              handleResendCode("hide");
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
    setNewEmail(user.email);
    setMsg(null);
    setError(null);
  }

  async function handleResendCode(show) {
    if (!wait) {
      setWait(true);
      info("Enviando código...", "loading");
      api
        .get("/resend")
        .then(() => {
          setMsg(null);
          setError(null);
          setResendText("01:00");
          setTimeLeft(60);
          info("Código enviado no seu email.", "ok");
        })
        .catch((e) => {
          if (show != "hide") {
            info(e.response.data.message, "error");
            setMsg(null);
            setWait(false);
          }
          if (show == "hide") {
            setMsg(null);
            setError(null);
          }
          setResendText("01:00");
          setTimeLeft(60);
        });
    }
  }

  function handleInputChange(e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    setCode(value);
  }

  useEffect(() => {
    handleResendCode();
  }, []);

  useEffect(() => {
    if (emailInput.current) emailInput.current.select();
  }, [changeEmail]);

  //timer effect
  useEffect(() => {
    if (timeLeft < 0) {
      setResendText("Reenviar email");
      setResendClassName("cta-text");
      setWait(false);
      return;
    }

    setResendClassName(null);

    const timer = setInterval(() => {
      setTimeLeft((p) => p - 1);
      setResendText(`00:${String(timeLeft - 1).padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!signed) {
    return <Navigate to="/login" />;
  } else {
    if (user.emailVerified) {
      console.log("redirecionando: " + nextStep);
      return <Navigate to={nextStep} />;
    } else {
      return (
        <motion.div
          className="content-box"
          layoutId="Verify"
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
          <div className="content-box mid-gap">
            <form method="post" onSubmit={handleSubmit}>
              <div className="content-box mid-gap">
                <div className="content-box mid-gap">
                  <div className="content-box small-gap">
                    <h1 className="small-headline">Verifique o Seu Email</h1>
                    <div className="content-box mini-gap">
                      {changeEmail ? (
                        <div className="inline-flex-center">
                          <input
                            ref={emailInput}
                            className="mini-text-input"
                            type="email"
                            value={newEmail}
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
                        <p className="paragraph">{user.email}</p>
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
                      <label className="paragraph" htmlFor="email">
                        Código:
                      </label>
                      <input
                        className="text-input"
                        type="text"
                        placeholder="Código de 6 digitos"
                        name="code"
                        id="code"
                        value={code}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="inline-flex-center micro-gap">
                      <p className="paragraph">Não recebeu o código?</p>
                      <div
                        onClick={handleResendCode}
                        className={`paragraph ${resendClassName}`}
                      >
                        {resendText}
                      </div>
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
        </motion.div>
      );
    }
  }
}

export default Verify;
