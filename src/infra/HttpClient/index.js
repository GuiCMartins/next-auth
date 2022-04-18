import { useTokenService } from "../../services/auth/useTokenService";
import nookies from "nookies";

export const HttpClient = async (fetchUrl, fetchOption = {}) => {
  const tokenService = useTokenService();
  const defaultHeaders = fetchOption.headers || {};
  const options = {
    ...fetchOption,
    headers: {
      ...defaultHeaders,
      "Content-Type": "application/json",
    },
    body: fetchOption.body ? JSON.stringify(fetchOption.body) : null,
  };

  return fetch(fetchUrl, options)
    .then(async (respostaServidor) => {
      return {
        ok: respostaServidor.ok,
        status: respostaServidor.status,
        body: await respostaServidor.json(),
      };
    })
    .then(async (response) => {
      if (!fetchOption.refresh) return response;
      if (response.status !== 401) return response;

      const isServer = Boolean(fetchOption?.ctx);
      const currentRefreshToken =
        fetchOption?.ctx?.req?.cookies["REFRESH_TOKEN"];

      try {
        const refreshResponse = await HttpClient(
          "http://localhost:3000/api/refresh",
          {
            method: isServer ? "PUT" : "GET",
            body: isServer ? { refresh_token: currentRefreshToken } : undefined,
          }
        );

        console.log(currentRefreshToken);

        const newAccesToken = refreshResponse.body.data.access_token;
        const newRefreshToken = refreshResponse.body.data.refresh_token;

        if (isServer) {
          nookies.set(fetchOption.ctx, "REFRESH_TOKEN", newRefreshToken, {
            httpOnly: true,
            sameSita: "lax",
            path: "/",
          });
        }

        tokenService.save(newAccesToken);

        const retryResponse = await HttpClient(fetchUrl, {
          ...options,
          refresh: false,
          headers: {
            Authorization: `Bearer ${newAccesToken}`,
          },
        });

        return retryResponse;
      } catch (err) {
        console.error(err);
      }
    })
    .catch(() => {
      throw new Error("Ocorreu algum erro com o servidor!");
    });
};
