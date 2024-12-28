import "./Login.css";

import Logo from "../assets/logo.png";
import Google from "../assets/google.png";

import Switch from "../components/switch.jsx";

export default function Login() {
  function handleGoogleClick(e) {
    e.preventDefault();
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="login">
      <img className="logo" src={Logo} alt="Lux CRM ©" />

      <form method="post" onSubmit={handleSubmit}>
        <div className="labels">
          <div className="inputs">
            <button className="google" onClick={handleGoogleClick}>
              <img src={Google} alt="" />
              Continuar com o Google
            </button>
            <div className="divider">
              <hr />
              <span className="text">OU UTILIZE SEU EMAIL</span>
              <hr />
            </div>
            <div className="label">
              <label htmlFor="email">Email:</label>
              <input
                className="text-input"
                type="email"
                placeholder="seunome@exemplo.com"
                name="email"
                id="email"
              />
            </div>
            <div className="label">
              <label htmlFor="passwd">Senha:</label>
              <input
                className="text-input"
                type="password"
                placeholder="Sua senha."
                name="passwd"
                id="passwd"
              />
            </div>
            <div className="recovery">
              <div className="remember">
                <Switch name="remember" />
                <p className="remember-text">Lembrar</p>
              </div>
              <div className="recovery-passwd">
                <a href="#" rel="Esquevi minha senha">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>
          </div>
          <button className="cta-button" type="submit">
            Fazer Login
          </button>
        </div>
      </form>
    </div>
  );
}
