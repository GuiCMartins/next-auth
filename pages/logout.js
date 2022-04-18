import { useRouter } from "next/router";
import { useEffect } from "react";
import { HttpClient } from "../src/infra/HttpClient";
import { useTokenService } from "../src/services/auth/useTokenService";

export default function Logout() {
  const tokenService = useTokenService();
  const router = useRouter();

  useEffect(async () => {
    try {
      await HttpClient("/api/refresh", {
        method: "DELETE",
      });
      tokenService.remove();
      router.push("/");
    } catch (e) {
      alert(e);
    }
  }, []);

  return <div>Logout</div>;
}
