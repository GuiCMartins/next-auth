import { useState } from "react";
import { useRouter } from "next/router";
import { useAuthService } from "../src/services/auth/useAuthService";

export default function HomeScreen() {
  const [values, setValues] = useState({
    usuario: "omariosouto",
    senha: "safepassword",
  });

  const router = useRouter();
  const authService = useAuthService();

  const handleChange = (event) => {
    const fieldValue = event.target.value;
    const fieldName = event.target.name;

    setValues((currentValue) => {
      return { ...currentValue, [fieldName]: fieldValue };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await authService.login({
        username: values.usuario,
        password: values.senha,
      });
      router.push("/auth-page-ssr");
      //router.push("/auth-page-static");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuário"
          name="usuario"
          value={values.usuario}
          onChange={handleChange}
        />
        <input
          placeholder="Senha"
          name="senha"
          type="password"
          onChange={handleChange}
          value={values.senha}
        />
        <div>
          <button>Entrar</button>
        </div>
        <p>
          <a href="/logout">Sair</a>
        </p>
      </form>
    </div>
  );
}
