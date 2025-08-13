//external libs
import crypto from "crypto";
import bcrypt from "bcrypt";

class Cryptography {
  private method: string = "aes-256-cbc";
  private secret: string = process.env.CRYPTOGRAPHY_SECRET;
  private type: crypto.BinaryToTextEncoding = "hex";
  private cod: BufferEncoding = "utf-8";
  private iv: string = process.env.CRYPTOGRAPHY_IV;

  encrypt(texto: string) {
    let cipher = crypto.createCipheriv(this.method, this.secret, this.iv);
    let crypted = cipher.update(texto, this.cod, this.type);
    crypted += cipher.final(this.type);

    return crypted;
  }
  decrypt(texto: string) {
    let decipher = crypto.createDecipheriv(this.method, this.secret, this.iv);
    let decrypted = decipher.update(texto, this.type, this.cod);
    decrypted += decipher.final(this.cod);

    return decrypted;
  }

  private saltRounds: number = 12;

  async hash(texto: string) {
    return await bcrypt.hash(texto, this.saltRounds);
  }
  async compare(texto: string, hash: string) {
    return await bcrypt.compare(texto, hash);
  }
}

export default new Cryptography();
