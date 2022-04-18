import { useAuthService } from "../useAuthService";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const authService = useAuthService();

export const withSession = (func) => {
  return async (ctx) => {
    try {
      const session = await authService.getSession(ctx);
      const modifiedCtx = {
        ...ctx,
        req: {
          ...ctx.req,
          session,
        },
      };

      return func(modifiedCtx);
    } catch (e) {
      return {
        redirect: {
          permanent: false,
          destination: "/?error=401",
        },
      };
    }
  };
};

export const useSession = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authService = useAuthService();

  useEffect(async () => {
    try {
      const response = await authService.getSession();
      setSession(response);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data: { session },
    error,
    loading,
  };
};

export const withSessionHOC = (Component) => {
  return (props) => {
    const session = useSession();
    const router = useRouter();

    if (!session.loading && session.error) {
      router.push("/?error=401");
    }

    const modifiedProps = {
      ...props,
      session: session.data.session,
    };
    return <Component {...modifiedProps} />;
  };
};
