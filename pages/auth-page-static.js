import { withSessionHOC } from "../src/services/auth/session";

export default withSessionHOC(function AuthPageStatic(props) {
  return (
    <div>
      <h1>Auth Page Static</h1>
      <p>
        <a href="/logout">Sair</a>
      </p>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
});
