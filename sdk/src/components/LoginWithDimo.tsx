// src/components/LoginWithDimo.tsx
import React from "react";

import { popupAuth } from "../auth/popupAuth";
import { embedAuth } from "../auth/embedAuth";
import { redirectAuth } from "../auth/redirectAuth";

interface LoginWithDimoProps {
  mode: "popup" | "embed" | "redirect"; // The mode of login
  onSuccess: (authData: { token: string }) => void; // Success callback
  onError: (error: Error) => void; // Error callback
  clientId?: string; // Placeholder for future auth support
  redirectUri?: string; // Placeholder for future redirect support
  apiKey?: string; // Placeholder for future API key support
}

const LoginWithDimo: React.FC<LoginWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  clientId,
  redirectUri,
  apiKey,
}) => {
  const handleButtonClick = () => {
    switch (mode) {
      case "popup":
        popupAuth(onSuccess, onError, clientId, redirectUri, apiKey);
        break;
      case "redirect":
        redirectAuth(onSuccess, onError);
        break;
      default:
        console.error("Unsupported mode for button click");
    }
  };

  // Trigger embedAuth only once the iframe has fully loaded
  const handleIframeLoad = () => {
    if (mode === "embed") {
      embedAuth(onSuccess, onError, clientId, redirectUri, apiKey);
    }
  };

  // Renders iframe for embed mode
  const renderEmbedIframe = () => (
    <iframe
      id="dimo-iframe"
      src="https://ab1a735dff55.ngrok.app/" // Pull Dimo Login URL from ENV
      allow="publickey-credentials-create; publickey-credentials-get" //Note: This is used to allow passkey creation and retrieval
      width="100%"
      height="250px" //Allow this to be customized by developer
      title="Dimo Login"
      style={{ border: "4px solid white" }}
      frameBorder="0"
      onLoad={handleIframeLoad} // Trigger embedAuth when the iframe loads
    />
  );

  return (
    <div>
      {mode === "embed" ? (
        renderEmbedIframe()
      ) : (
        <button onClick={handleButtonClick}>Login with Dimo</button>
      )}
    </div>
  );
};

export default LoginWithDimo;
