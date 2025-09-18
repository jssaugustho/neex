import fs from "fs";
import path from "path";

/**
 * Sobrescreve propriedades de um arquivo JSON.
 * @param filePath Caminho do arquivo JSON
 * @param newValues Objeto com as propriedades que serão sobrescritas/adicionadas
 */
export default function overwriteJsonFile(newValues: Record<string, any>) {
  const resolvedPath = path.resolve(
    "../../services/bot/config/account-data.json",
  );

  // lê o JSON existente, ou cria um objeto vazio se não existir
  let jsonContent: Record<string, any> = {};
  if (fs.existsSync(resolvedPath)) {
    const raw = fs.readFileSync(resolvedPath, "utf-8");
    jsonContent = JSON.parse(raw);
  }

  // sobrescreve/add as propriedades
  jsonContent = { ...jsonContent, ...newValues };

  // salva de volta
  fs.writeFileSync(resolvedPath, JSON.stringify(jsonContent, null, 2), "utf-8");
}
