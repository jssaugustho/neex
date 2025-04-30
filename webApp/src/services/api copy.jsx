import axios from "axios";
import loadStorage from "../utils/loadStorage/loadStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;
// Variavel para informar se está acontecendo uma requisição de refresh token
let isRefreshing = false;
// Variavel para armazenar a fila de requisições que falharam por token expirado
let failedRequestQueue = [];

function initApi(signOut) {
  const api = axios.create({
    baseURL,
    headers: {
      Authorization: loadStorage().token,
    },
  });

  // Cria um interceptor para interceptar todas as requisições que forem feitas
  api.interceptors.response.use(
    (response) => {
      // Se a requisição der sucesso, retorna a resposta
      return response;
    },
    (error) => {
      // Se o erro for de autenticação, verifica se o erro foi de token expirado
      if (error.status === 401) {
        console.log(error);

        let originalConfig = [];

        if (error.response.data.status === "TokenError") {
          // Recupera o refresh token do localStorage

          let remember = false;
          let refreshToken = "";

          if (localStorage.getItem("@Auth:refresh-token")) {
            remember = true;
            refreshToken = localStorage.getItem("@Auth:refresh-token");
          }

          if (sessionStorage.getItem("@Auth:refresh-token")) {
            remember = false;
            refreshToken = sessionStorage.getItem("@Auth:refresh-token");
          }

          // Recupera toda a requisição que estava sendo feita e deu erro para ser refeita após o refresh token
          originalConfig = error.config;

          // Verifica se já existe uma request de refreshToken acontecendo
          if (!isRefreshing) {
            // Se não existir, inicia a requisição de refreshToken
            isRefreshing = true;

            // Faz uma requisição de refreshToken
            api
              .post("/refresh", {
                refreshToken,
              })
              .then((response) => {
                // Recupera os dados do response e cria o newRefreshToken por que já está sendo utilizado a variável refreshToken
                console.log("Atualizando token");
                const {
                  token,
                  refreshToken: newRefreshToken,
                  data,
                } = response.data;

                if (remember) {
                  console.log("Setando localstorage");
                  // Salva o token no localStorage
                  localStorage.setItem("@Auth:token", token);
                  // Salva o refreshToken no localStorage
                  localStorage.setItem("@Auth:refresh-token", newRefreshToken);
                  //Salva o usuário
                  localStorage.setItem("@Auth:user", JSON.stringify(data));
                } else {
                  console.log("Setando sessionstorage");
                  // Salva o token no localStorage
                  sessionStorage.setItem("@Auth:token", token);
                  // Salva o refreshToken no localStorage
                  sessionStorage.setItem(
                    "@Auth:refresh-token",
                    newRefreshToken
                  );
                  //Salva o usuário
                  sessionStorage.setItem("@Auth:user", JSON.stringify(data));
                }

                // Define novamente o header de autorização nas requisições
                api.defaults.headers.common["Authorization"] = token;

                // Faz todas as requisições que estavam na fila e falharam
                failedRequestQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                // Limpa a fila de requisições que falharam
                failedRequestQueue = [];
              })
              .catch((err) => {
                // Retorna os erros que estão salvos na fila de requisições que falharam
                failedRequestQueue.forEach((request) => request.onFailure(err));
                // Limpa a fila de requisições que falharam
                failedRequestQueue = [];

                // Caso der erro desloga o usuário

                signOut();
              })
              .finally(() => {
                // Indica que a requisição de refreshToken acabou
                isRefreshing = false;
              });
          }

          // Usando a Promise no lugar do async await, para que a requisição seja feita após o refresh token
          return new Promise((resolve, reject) => {
            // Adiciona a requisição na fila de requisições que falharam com as informações necessárias para refazer a requisição novamente
            failedRequestQueue.push({
              // Se a requisição der sucesso, chama o onSuccess
              onSuccess: (token) => {
                // Adiciona o novo token gerado no refresh token no header de autorização
                originalConfig.headers["Authorization"] = token;

                // Faz a requisição novamente passando as informações originais da requisição que falhou
                resolve(api(originalConfig));
              },
              // Se a requisição der erro, chama o onFailure
              onFailure: (err) => {
                // Se não for possivel refazer a requisição, retorna o erro
                reject(err);
              },
            });
          });
        }

        // Se não cair em nenhum if retorna um error padrão
        return Promise.reject(error);
      }
    }
  );

  return api;
}

export default initApi;
