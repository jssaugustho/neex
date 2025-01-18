import "./Recovery.css";

import XIcon from "./../../assets/XIcon.jsx";
import CheckIcon from "./../../assets/CheckIcon.jsx";

import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import ErrorIcon from "../../assets/ErrorIcon.jsx";

import MiniLoadSpinner from "../../assets/MiniLoadSpinner.jsx";

import useAuth from "../../contexts/auth/auth.hook.jsx";
import EditIcon from "../../assets/EditIcon.jsx";

function Recovery() {
  const { signed, api, setUser, user, nextStep, setNextStep } = useAuth();

  const [code, setCode] = useState("");

  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  const [resendText, setResendText] = useState("Reenviar email");
  const [resendClassName, setResendClassName] = useState("register-cta");
  const [timeLeft, setTimeLeft] = useState(() => {
    handleResendCode("hide");
    return -1;
  });

  const [changeEmail, setChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user.email);

  const emailInput = useRef(null);

  function info(info, type) {
    if (type == "error") {
      setMsg(null);
      setError(info);
    }
    if (type == "loading") {
      setError(null);
      setMsg(info);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    info("Verificando código...", "loading");

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
    setMsg(null);
    setError(null);
  }

  async function handleResendCode(show) {
    info("Enviando código...", "loading");
    api
      .get("/resend")
      .then(() => {
        setMsg(null);
        setError(null);
        setResendText("01:00");
        setTimeLeft(60);
      })
      .catch((e) => {
        if (show != "hide") {
          info(e.response.data.message, "error");
          setMsg(null);
        }
        if (show == "hide") {
          setMsg(null);
          setError(null);
        }
        setResendText("01:00");
        setTimeLeft(60);
      });
  }

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

  if (signed) {
    return <Navigate to={nextStep} />;
  } else {
    return (
      <motion.div
        className="login-motion-div"
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
        <div className="login">
          <form method="post" onSubmit={handleSubmit}>
            <div className="labels">
              <div className="inputs">
                <div className="headline">
                  <h2>Verifique o Seu Email</h2>
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
                      <p className="sendedEmail">{user.email}</p>
                    )}
                    <div className="changeEmailCta">
                      <div className="icon">
                        <EditIcon />
                      </div>
                      <div
                        className="change-a"
                        onClick={handleChangeEmailClick}
                      >
                        Alterar email
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
                  <div
                    onClick={handleResendCode}
                    className={`${resendClassName}`}
                  >
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
      </motion.div>
    );
  }
}

export default Recovery;
