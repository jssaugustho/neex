import XIcon from "./../../assets/XIcon.jsx";
import CheckIcon from "./../../assets/CheckIcon.jsx";

import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import ErrorIcon from "../../assets/ErrorIcon.jsx";
import EditIcon from "../../assets/EditIcon.jsx";
import MiniLoadSpinner from "../../assets/MiniLoadSpinner.jsx";

import useAuth from "../../hooks/useAuth/useAuth.jsx";

import useUser from "../../hooks/useUser/useUser.jsx";
import useVerifyEmail from "../../hooks/useVerifyEmail/useVerifyEmail.jsx";
import useUpdateUser from "../../hooks/useUpdateUser/useUpdateUser.jsx";
import useResend from "../../hooks/useResend/useResend.jsx";
import AuthLoader from "../AuthLoader/AuthLoader.jsx";

function Verify() {
  const { signed, nextStep, firstTime, setFirstTime } = useAuth();

  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useUser();

  const [code, setCode] = useState("");

  const [resendText, setResendText] = useState("01:00");
  const [resendClassName, setResendClassName] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const [startTimer, setStartTimer] = useState(false);

  const wait = useRef(false);

  const [changeEmail, setChangeEmail] = useState(false);

  const [newEmail, setNewEmail] = useState(null);

  const emailInput = useRef(null);

  const {
    mutateAsync: verify,
    isError: isVerifyError,
    error: verifyError,
    isLoading: isVerifyLoading,
    reset: resetVerify,
  } = useVerifyEmail();

  const {
    mutateAsync: updateUser,
    isError: isUpdateUserError,
    error: updateUserError,
    isLoading: isUpdateUserLoading,
    reset: resetUpdateUser,
  } = useUpdateUser();

  const {
    mutateAsync: resend,
    isError: isResendError,
    error: resendError,
    isLoading: isResendLoading,
    reset: resetResend,
  } = useResend();

  const [isValidationError, setIsValidationError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  let isLoading = null;

  if (isResendLoading) isLoading = "Enviando código...";
  if (isUpdateUserLoading) isLoading = "Alterando email...";
  if (isVerifyLoading) isLoading = "Verificando email...";
  if (okMsg) isLoading = null;

  let isError = null;

  if (isResendError) isError = resendError.response.data.message;
  else if (isUpdateUserError) isError = updateUserError.response.data.message;
  else if (isVerifyError) isError = verifyError.response.data.message;
  else if (isValidationError) isError = isValidationError;

  async function reset() {
    resetResend();
    resetVerify();
    resetUpdateUser();
    setIsValidationError(null);
    setOkMsg(null);
    isError = null;
    isLoading = null;
    return;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await reset();

    let emailVerificationCode = code;

    wait.current = true;
    verify({ emailVerificationCode })
      .then(() => {
        setOkMsg("Email verificado com sucesso.");
      })
      .catch(() => {
        wait.current = false;
      });
  }

  async function handleChangeEmailClick() {
    setNewEmail(user.email);
    setChangeEmail((p) => !p);
  }

  async function handleChangeEmail(e) {
    e.preventDefault();
    wait.current = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (user.email != newEmail) {
      await reset();
      if (emailRegex.test(newEmail)) {
        setChangeEmail(false);
        updateUser({ email: newEmail }).then(() => {
          wait.current = false;
          setStartTimer(false);
          handleResendCode();
        });
      } else {
        wait.current = false;
        setIsValidationError("Email inválido.");
      }
    } else {
      handleClearEmail();
    }
  }

  async function handleClearEmail() {
    setChangeEmail(false);
    setNewEmail(user.email);
  }

  async function handleResendCode() {
    if (!wait.current) {
      wait.current = true;
      await reset();
      setTimeLeft(60);
      setResendText("Enviando...");
      setResendClassName(null);
      resend()
        .then(() => {
          setOkMsg("Código enviado no seu email.");
          setResendText("01:00");
          setStartTimer(true);
        })
        .catch(() => {
          setStartTimer(true);
        });
    }
  }

  function handleInputChange(e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico

    if (value.length <= 6) setCode(value);
  }

  function handleExit(e) {
    if (e.keyCode == 27) {
      handleClearEmail();
    }
  }

  function handleChangeEmailEnter(e) {
    if (e.key === "Enter") {
      handleChangeEmailClick();
    }
  }

  function handleResendEnter(e) {
    if (e.key === "Enter") {
      handleResendCode();
    }
  }

  //send email
  useEffect(() => {
    if (firstTime) {
      setOkMsg("Código enviado no seu email");
      setTimeLeft(60);
      setResendText("01:00");
      setStartTimer(true);
      setFirstTime(false);
      return;
    }

    if (!wait.current) {
      reset().then(() => {
        wait.current = true;
        setTimeLeft(60);
        setResendText("Enviando...");
        setResendClassName(null);
        resend()
          .then(() => {
            setOkMsg("Código enviado no seu email.");
          })
          .finally(() => {
            setResendText("01:00");
            setStartTimer(true);
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (emailInput.current) emailInput.current.select();
  }, [changeEmail]);

  //timer effect
  useEffect(() => {
    if (!startTimer) return;

    if (timeLeft < 0) {
      wait.current = false;
      setResendText("Reenviar email");
      setResendClassName("cta-text");
      setStartTimer(false);
      setTimeLeft(60);
      return;
    }

    setResendClassName(null);

    const timer = setInterval(() => {
      setTimeLeft((p) => p - 1);
      setResendText(`00:${String(timeLeft - 1).padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, startTimer]);

  if (!signed) return <Navigate to="/login" />;

  if (userIsLoading) return <AuthLoader />;

  if (userIsError) return <AuthLoader />;

  if (user.emailVerified) return <Navigate to={nextStep} />;

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
                        onKeyDown={handleExit}
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
                    role="button"
                    tabIndex={1}
                    onKeyDown={handleResendEnter}
                    onClick={handleResendCode}
                    className={`paragraph resend ${resendClassName}`}
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
    </motion.div>
  );
}

export default Verify;
