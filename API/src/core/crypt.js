import crypto from "crypto";

class Crypt {
  constructor(props) {
    this.algoritmo = props.algoritmo;
    this.senha = props.senha;
    this.tipo = props.tipo;
    this.cod = props.cod;
    this.iv = props.iv;
  }
  criptografar(texto) {
    let cipher = crypto.createCipheriv(this.algoritmo, this.senha, this.iv);
    let crypted = cipher.update(texto, this.cod, this.tipo);
    crypted += cipher.final(this.tipo);

    return crypted;
  }
  descriptografar(texto) {
    let decipher = crypto.createDecipheriv(this.algoritmo, this.senha, this.iv);
    let decrypted = decipher.update(texto, this.tipo, this.cod);
    decrypted += decipher.final(this.cod);

    return decrypted;
  }
}

export default new Crypt({
  algoritmo: "aes-256-cbc",
  senha: process.env.SENHA,
  tipo: "hex",
  cod: "utf-8",
  iv: "1234567890123456",
});
