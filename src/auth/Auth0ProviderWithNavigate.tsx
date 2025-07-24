import { Auth0Provider } from "@auth0/auth0-react";
import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Auth0ProviderWithNavigateProps {
  children: ReactNode;
}

const Auth0ProviderWithNavigate = ({
  children,
}: Auth0ProviderWithNavigateProps) => {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  if (!domain || !ClientId || !redirectUri || !audience) {
    throw new Error(
      "Auth0 environment variables are not set. Please check your .env file."
    );
  }
  const onRedirectCallBack = () => {
    navigate("/auth-callback");
  };
  return (
    <Auth0Provider
      domain={domain}
      clientId={ClientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience, 
      }}
      onRedirectCallback={onRedirectCallBack}
   
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
