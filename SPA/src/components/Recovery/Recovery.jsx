import "./Recovery.css";

import XIcon from "./../../assets/XIcon.jsx";
import CheckIcon from "./../../assets/CheckIcon.jsx";

import { Navigate, NavLink } from "react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import ErrorIcon from "../../assets/ErrorIcon.jsx";

import MiniLoadSpinner from "../../assets/MiniLoadSpinner.jsx";

import useAuth from "../../hooks/useAuth/useAuth.jsx";

import EditIcon from "../../assets/EditIcon.jsx";
import BackIcon from "../../assets/BackIcon.jsx";
import useRecoverySendCode from "../../hooks/useRecoverySendCode/useRecoverySendCode.jsx";
import useRecovery from "../../hooks/useRecovery/useRecovery.jsx";

function Recovery() {
  const { api, signed, setSigned, setUser, nextStep, setNextStep } = useAuth();

  //email da conta que vai ser verificada
  const [email, setEmail] = useState("");

  //valor do input do código
  const [code, setCode] = useState("");

  //temporizador
  const [resendText, setResendText] = useState("01:00");
  const [resendClassName, setResendClassName] = useState(null);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [startTimer, setStartTimer] = useState(false);

  const {
    mutateAsync: recovery,
    isLoading: isRecoveryLoading,
    isError: isRecoveryError,
    error: recoveryError,
    reset: recoveryReset,
  } = useRecovery();

  const {
    mutateAsync: sendCode,
    isLoading: isSendCodeLoading,
    isError: isSendCodeError,
    error: sendCodeError,
    reset: sendCodeReset,
  } = useRecoverySendCode();

  const [okMsg, setOkMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  let isError = null;

  if (isSendCodeError) isError = sendCodeError.response.data.message;
  if (isRecoveryError) isError = recoveryError.response.data.message;

  let isLoading = null;

  if (isSendCodeLoading) isLoading = "Enviando código...";
  if (isRecoveryLoading) isLoading = "Verificando código...";

  const wait = useRef(false);

  //toggle change email input
  const [changeEmail, setChangeEmail] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  //change email input value
  const [newEmail, setNewEmail] = useState(email);

  //change email input ref
  const emailInput = useRef();

  async function reset() {
    isError = null;
    isLoading = null;
    setOkMsg(null);
    setErrorMsg(null);
    recoveryReset();
    sendCodeReset();
    return;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    wait.current = true;

    reset().then(() => {
      recovery({
        email,
        passwdRecoveryCode: code,
      })
        .then((r) => {
          setOkMsg("Email verificado com sucesso.");
        })
        .catch(() => {
          wait.current = false;
        });
    });
  }

  async function handleChangeEmailClick() {
    setChangeEmail((p) => !p);
  }

  async function handleChangeEmail(e) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    wait.current = true;
    await reset();

    if (email != newEmail) {
      if (emailRegex.test(newEmail)) {
        sendCode({
          email: newEmail,
        })
          .then(() => {
            sessionStorage.setItem("recovery-email", newEmail);
            setOkMsg("Código enviado.");
            setEmail(newEmail);
            setChangeEmail(false);
            setResendText("01:00");
            setResendClassName(null);
            setTimeLeft(60);
            setStartTimer(true);
          })
          .catch(() => {
            wait.current = false;
          });
      } else {
        setErrorMsg("Email inválido.");
        wait.current = false;
      }
    } else {
      wait.current = false;
      setOkMsg(null);
      setErrorMsg(null);
      setChangeEmail(false);
    }
  }

  async function handleClearEmail() {
    setChangeEmail(false);
    setNewEmail(email);
  }

  async function handleResendCode() {
    if (!wait.current) {
      wait.current = true;
      setResendText("Enviando...");
      await reset();
      sendCode({
        email,
      })
        .then(() => {
          setOkMsg("Código enviado no seu email.");
        })
        .finally(() => {
          setResendText("01:00");
          setResendClassName(null);
          setTimeLeft(60);
          setStartTimer(true);
        });
    }
  }

  async function handleSetEmail(e) {
    e.preventDefault();

    await reset();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!wait.current) {
      if (emailRegex.test(recoveryEmail)) {
        wait.current = true;
        sendCode({
          email: recoveryEmail,
        })
          .then(() => {
            sessionStorage.setItem("recovery-email", recoveryEmail);
            setEmail(recoveryEmail);
            setNewEmail(recoveryEmail);
            setOkMsg("Código enviado no seu email.");
            setResendText("01:00");
            setResendClassName("cta-text");
            setTimeLeft(60);
            setStartTimer(true);
          })
          .catch(() => {
            wait.current = false;
          });
      } else {
        setErrorMsg("Email inválido", "error");
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

  function handleChangeEmailEnter(e) {
    if (e.keyCode === 13) {
      setChangeEmail((p) => !p);
    }
  }

  function handleResendEnter(e) {
    if (e.keyCode === 13) {
      if (!wait.current) handleResendCode();
    }
  }

  //select alterar email
  useEffect(() => {
    if (emailInput.current) emailInput.current.select();
  }, [changeEmail]);

  //timer effect
  useEffect(() => {
    if (startTimer) {
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
    }
  }, [timeLeft, startTimer]);

  //load storage
  useEffect(() => {
    const loadedEmail = sessionStorage.getItem("recovery-email");

    if (loadedEmail && !wait.current) {
      wait.current = true;
      setEmail(loadedEmail);
      setNewEmail(loadedEmail);

      reset().then(() => {
        sendCode({
          email: loadedEmail,
        })
          .then(() => {
            setOkMsg("Código enviado.");
            setResendText("01:00");
            setResendClassName(null);
            setTimeLeft(60);
            setStartTimer(true);
          })
          .catch(() => {
            setResendText("01:00");
            setResendClassName(null);
            setTimeLeft(60);
            setStartTimer(true);
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    role="button"
                    tabIndex={0}
                    className="paragraph cta-text"
                    onKeyDown={handleChangeEmailEnter}
                    onClick={handleChangeEmailClick}
                  >
                    Alterar email
                  </div>
                </div>
              </div>
            </div>
            {isLoading && (
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
                <p className="paragraph">{isLoading}</p>
              </motion.div>
            )}
            {isError && (
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
                <p className="paragraph">{isError}</p>
              </motion.div>
            )}
            {errorMsg && (
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
                <p className="paragraph">{errorMsg}</p>
              </motion.div>
            )}
            {okMsg && (
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
                <p className="paragraph">{okMsg}</p>
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
                  role="button"
                  tabIndex={0}
                  onClick={handleResendCode}
                  onKeyDown={handleResendEnter}
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
            {isLoading && (
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
                <p className="paragraph">{isLoading}</p>
              </motion.div>
            )}
            {isError && (
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
                <p className="paragraph">{isError}</p>
              </motion.div>
            )}
            {errorMsg && (
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
                <p className="paragraph">{errorMsg}</p>
              </motion.div>
            )}
            {okMsg && (
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
                <p className="paragraph">{okMsg}</p>
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
