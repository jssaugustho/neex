import "./Register.css";

import { Navigate, NavLink } from "react-router";

import { motion } from "framer-motion";

import Google from "../../assets/google.png";

import ErrorIcon from "../../assets/ErrorIcon.jsx";

import MiniSwitch from "../ui.components/MiniSwitch/MiniSwitch.jsx";

import { useEffect, useState } from "react";

import PasswdInput from "../ui.components/PasswdInput/PasswdInput.jsx";
import useAuth from "../../contexts/auth/auth.hook.jsx";

import MiniLoadSpinner from "../../assets/MiniLoadSpinner.jsx";
import InternacionalPhoneInput from "../ui.components/InternacionalPhoneInput/InternacionalPhoneInput.jsx";
import PasswdForceLevel from "../ui.components/PasswdForceLevel/PasswdForceLevel.jsx";

export default function Register() {
  const showGoogleOAuth = false;

  const { signed, nextStep, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwd, setPasswd] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState("");

  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  const [passwdForce, setPasswdForce] = useState({
    lost: [],
    level: 0,
  });

  useEffect(() => {
    validatePasswd(passwd);
  }, [passwd]);

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

  function update(params) {
    if (params.email != null) setEmail(params.email);
    if (params.passwd != null) setPasswd(params.passwd);
    if (params.name != null) setName(params.name);
    if (params.lastName != null) setLastName(params.lastName);
    if (params.phone != null) setPhone(params.phone);
    if (params.agree != null) setAgree(params.agree);
  }

  function validatePasswd(passwd) {
    const upperCase = /[A-Z]/;
    const downCase = /[a-z]/;
    const special = /[!@#$%^&*(),.?":{}|<>]/;

    let lost = [];

    if (passwd.length < 8) lost.push("Pelo menos 8 caracteres");
    if (!downCase.test(passwd)) lost.push("Letras minúsculas");
    if (!upperCase.test(passwd)) lost.push("Letras maiúsculas");
    if (!special.test(passwd)) lost.push("Caracteres especiais: $*&@#");

    if (lost.length >= 0)
      return setPasswdForce({ lost: lost, level: lost.length });
  }

  function handleGoogleClick(e) {
    e.preventDefault();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    //msg
    info("Cadastrando...", "loading");

    console.log(passwdForce);

    //validar senha
    if (passwdForce.level > 0)
      return info("Senha fraca, tente com outra.", "error");

    //validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) info("Email inválido", "error");

    //validar phone
    if (phone.length < 8) info("Número de celular inválido", "loading");

    //validar termos e condições
    let concorda = false;
    if (agree == "sim") concorda = true;

    if (!concorda) {
      info("Você deve concordar com os termos.", "error");
      return;
    }

    //criar usuário e logar
    signUp({ email, phone, name, lastName, passwd, agree }, info);
  }

  console.log(signed);

  if (signed) {
    return <Navigate to={nextStep} />;
  } else {
    return (
      <motion.div
        className="login-motion-div"
        layoutId="Register"
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
                    Registre-se no <span className="accent-text">CRM.</span>
                  </h2>
                  <div className="register">
                    <p className="register-text">
                      Já tem uma conta?{" "}
                      <NavLink className="register-cta" to="/login">
                        Faça seu login
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
                  <label htmlFor="name">Nome:</label>
                  <div className="name-inputs">
                    <input
                      value={name}
                      className="text-input"
                      type="nome"
                      placeholder="Nome"
                      required={true}
                      name="nome"
                      id="nome"
                      onChange={(e) => update({ name: e.target.value })}
                    />
                    <input
                      value={lastName}
                      className="text-input"
                      type="text"
                      required={true}
                      placeholder="Sobrenome"
                      name="sobrenome"
                      id="sobrenome"
                      onChange={(e) => update({ lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="label">
                  <label htmlFor="email">Email:</label>
                  <input
                    className="text-input"
                    type="email"
                    placeholder="seunome@exemplo.com"
                    name="email"
                    required={true}
                    id="email"
                    value={email}
                    onChange={(e) => update({ email: e.target.value })}
                  />
                </div>
                <div className="label">
                  <label htmlFor="phone">WhatsApp:</label>
                  <InternacionalPhoneInput
                    className="text-input phone-input"
                    value={phone}
                    defaultCountry="br"
                    required={true}
                    name="phone"
                    onChange={(e) => update({ phone: e })}
                  />
                </div>
                <div className="label">
                  <label htmlFor="passwd">Senha:</label>
                  <PasswdInput
                    className="text-input"
                    name="passwd"
                    required={true}
                    onChange={(e) => update({ passwd: e.target.value })}
                    value={passwd}
                  />
                </div>
                {passwd ? (
                  <div className="label">
                    <PasswdForceLevel
                      level={passwdForce.level}
                      lost={passwdForce.lost}
                    />
                  </div>
                ) : null}
                <div className="recovery">
                  <div className="remember">
                    <MiniSwitch
                      name="remember"
                      value={agree}
                      onChange={(e) => {
                        update({ agree: e.target.checked ? "sim" : "não" });
                      }}
                    />
                    <p className="remember-text">
                      Concordo com os <a href="#">termos e condições.</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-button">
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
