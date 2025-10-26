import crypto from "crypto";
import bcrypt from "bcrypt";

class Cryptography {
  method = "aes-256-cbc";
  type: crypto.BinaryToTextEncoding = "hex";
  cod: BufferEncoding = "utf-8";
  saltRounds = 12;

  // Deriva a chave para 32 bytes a partir da string do .env
  getKey(): Buffer {
    const secret = process.env.CRYPTOGRAPHY_SECRET || "default_secret_key";
    // gera hash SHA-256 e usa apenas os 32 bytes
    return crypto.createHash("sha256").update(secret).digest();
  }

  // Gera IV novo a cada criptografia
  generateIV(): Buffer {
    return crypto.randomBytes(16);
  }

  encrypt(texto: string): string {
    const iv = this.generateIV();
    const key = this.getKey();

    const cipher = crypto.createCipheriv(this.method, key, iv);
    let crypted = cipher.update(texto, this.cod, this.type);
    crypted += cipher.final(this.type);

    // Retorna IV + texto criptografado (hex concatenado)
    return iv.toString(this.type) + ":" + crypted;
  }

  decrypt(payload: string): string {
    const [ivHex, encryptedText] = payload.split(":");
    const iv = Buffer.from(ivHex, this.type);
    const key = this.getKey();

    const decipher = crypto.createDecipheriv(this.method, key, iv);
    let decrypted = decipher.update(encryptedText, this.type, this.cod);
    decrypted += decipher.final(this.cod);

    return decrypted;
  }

  async hash(texto: string) {
    return await bcrypt.hash(texto, this.saltRounds);
  }

  async compare(texto: string, hash: string) {
    return await bcrypt.compare(texto, hash);
  }
}

export default new Cryptography();
