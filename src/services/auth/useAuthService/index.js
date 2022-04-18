import { HttpClient } from "../../../infra/HttpClient";
import { useTokenService } from "../useTokenService";

export const useAuthService = () => {
  const tokenService = useTokenService();

  const login = async ({ username, password }) => {
    const response = await HttpClient(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
      {
        method: "POST",
        body: {
          username,
          password,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Usuário ou senha inválidos");
    }

    tokenService.save(response.body.data.access_token);

    const refreshApiResponse = await HttpClient("/api/refresh", {
      method: "POST",
      body: {
        refresh_token: response.body.data.refresh_token,
      },
    });
  };

  const getSession = async (ctx = null) => {
    const token = tokenService.get(ctx);

    const response = await HttpClient(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ctx,
        refresh: true,
      }
    );
    if (!response.ok) {
      throw new Error("Não autorizado");
    }
    return await response.body.data;
  };

  return { login, getSession };
};
