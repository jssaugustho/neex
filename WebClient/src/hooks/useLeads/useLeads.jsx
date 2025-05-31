import { useMutation } from "react-query";
import useAuth from "../useAuth/useAuth";

function useLeads() {
  const { api, signed } = useAuth();

  return useMutation({
    mutationFn: ({ quiz, userId }) => {
      let query = `${userId}/${quiz}`;

      if (quiz.length <= 0) {
        query = "";
      }

      return api.get(`/leads/${query}`).then((response) => {
        console.log(response);
        return response;
      });
    },
    enabled: signed,
  });
}

export default useLeads;
